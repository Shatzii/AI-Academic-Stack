/**
 * Sentinel 4.5 Threat Intelligence Integration
 * 
 * This module integrates with external threat intelligence sources to enhance
 * security by identifying known malicious actors and emerging threats.
 */

import { logSecurityEvent } from './audit-log';
import { sendAlert, AlertSeverity, AlertType } from './alert-system';
import { blockIP } from './ip-blocker';
import { THREAT_INTEL_API_KEY } from './config';
import fetch from 'node-fetch';

// Threat intelligence data structure
export interface ThreatIndicator {
  id: string;
  type: 'ip' | 'domain' | 'url' | 'file_hash' | 'email';
  value: string;
  confidence: number; // 0-100
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  description: string;
  source: string;
  firstSeen: number;
  lastSeen: number;
  addedAt: number;
  validUntil: number;
}

// Cache of threat intelligence indicators for quick lookup
const knownBadIPs: Map<string, ThreatIndicator> = new Map();
const knownBadDomains: Map<string, ThreatIndicator> = new Map();
const knownBadHashes: Map<string, ThreatIndicator> = new Map();

// Maintain last update time
let lastUpdateTime = 0;

// Configure update frequency
const UPDATE_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours
const UPDATE_THRESHOLD_MS = 24 * 60 * 60 * 1000; // Force update after 24 hours

/**
 * Initialize the threat intelligence module
 */
export function initThreatIntelligence(): void {
  // Load initial data
  updateThreatIntelligence();
  
  // Schedule regular updates
  setInterval(() => {
    updateThreatIntelligence();
  }, UPDATE_INTERVAL_MS);
  
  console.log('Threat Intelligence module initialized');
}

/**
 * Update threat intelligence data from external sources
 */
export async function updateThreatIntelligence(): Promise<void> {
  // Skip update if done recently (unless forced)
  const now = Date.now();
  if (now - lastUpdateTime < UPDATE_INTERVAL_MS && now - lastUpdateTime < UPDATE_THRESHOLD_MS) {
    return;
  }
  
  try {
    let newIndicators: ThreatIndicator[] = [];
    
    // If API key is available, fetch from external source
    if (THREAT_INTEL_API_KEY) {
      newIndicators = await fetchExternalThreatIntelligence();
    }
    
    // If no API key or external fetch failed, use open source datasets
    if (newIndicators.length === 0) {
      newIndicators = await fetchOpenSourceThreatIntelligence();
    }
    
    // Process and store indicators
    processIndicators(newIndicators);
    
    // Update last update time
    lastUpdateTime = now;
    
    // Log success
    logSecurityEvent(
      'system',
      'Threat intelligence updated',
      {
        indicators: newIndicators.length,
        ips: knownBadIPs.size,
        domains: knownBadDomains.size,
        hashes: knownBadHashes.size
      },
      'system'
    );
  } catch (error) {
    console.error('Error updating threat intelligence:', error);
    
    // Log error
    logSecurityEvent(
      'system',
      'Failed to update threat intelligence',
      { error: error.message },
      'system'
    );
    
    // Send alert if the update hasn't happened in a while
    if (Date.now() - lastUpdateTime > UPDATE_THRESHOLD_MS) {
      sendAlert(
        AlertSeverity.MEDIUM,
        AlertType.SYSTEM,
        'Threat intelligence update failure',
        {
          error: error.message,
          lastSuccessfulUpdate: new Date(lastUpdateTime).toISOString()
        }
      );
    }
  }
}

/**
 * Fetch threat intelligence from commercial API
 */
async function fetchExternalThreatIntelligence(): Promise<ThreatIndicator[]> {
  try {
    // This would be replaced with actual API call to a threat intelligence provider
    // like AlienVault OTX, VirusTotal, etc.
    const response = await fetch('https://api.threatintel.example/v1/indicators', {
      headers: {
        'Authorization': `Bearer ${THREAT_INTEL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform to our internal format
    return data.indicators.map((indicator: any) => ({
      id: indicator.id,
      type: mapIndicatorType(indicator.type),
      value: indicator.value,
      confidence: indicator.confidence || 75,
      severity: mapSeverity(indicator.severity),
      tags: indicator.tags || [],
      description: indicator.description || 'No description available',
      source: indicator.source || 'external',
      firstSeen: indicator.first_seen ? new Date(indicator.first_seen).getTime() : Date.now(),
      lastSeen: indicator.last_seen ? new Date(indicator.last_seen).getTime() : Date.now(),
      addedAt: Date.now(),
      validUntil: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
    }));
  } catch (error) {
    console.error('Error fetching external threat intelligence:', error);
    return [];
  }
}

/**
 * Fetch threat intelligence from open source feeds
 */
async function fetchOpenSourceThreatIntelligence(): Promise<ThreatIndicator[]> {
  // List of open-source threat intelligence feeds
  const feeds = [
    // Sample feeds - in a real implementation, these would be actual URLs
    { url: 'https://blocklist.example/malicious-ips.txt', type: 'ip' },
    { url: 'https://blocklist.example/malware-domains.txt', type: 'domain' },
    { url: 'https://blocklist.example/malware-hashes.txt', type: 'file_hash' }
  ];
  
  const indicators: ThreatIndicator[] = [];
  
  // Process each feed
  for (const feed of feeds) {
    try {
      const response = await fetch(feed.url);
      
      if (!response.ok) {
        continue;
      }
      
      const text = await response.text();
      const lines = text.split('\n').filter(line => 
        line.trim().length > 0 && !line.startsWith('#')
      );
      
      // Convert each line to an indicator
      for (const line of lines) {
        const value = line.trim();
        
        indicators.push({
          id: `open-${feed.type}-${Date.now()}-${indicators.length}`,
          type: feed.type as any,
          value,
          confidence: 65, // Lower confidence for open source
          severity: 'medium',
          tags: [`open-source-${feed.type}`],
          description: `Indicator from open source feed: ${feed.url}`,
          source: 'open-source',
          firstSeen: Date.now(),
          lastSeen: Date.now(),
          addedAt: Date.now(),
          validUntil: Date.now() + (14 * 24 * 60 * 60 * 1000) // 14 days
        });
      }
      
    } catch (error) {
      console.error(`Error fetching feed ${feed.url}:`, error);
    }
  }
  
  return indicators;
}

/**
 * Process and store threat indicators
 */
function processIndicators(indicators: ThreatIndicator[]): void {
  let newMaliciousIPs = 0;
  
  // Process each indicator
  for (const indicator of indicators) {
    switch (indicator.type) {
      case 'ip':
        knownBadIPs.set(indicator.value, indicator);
        
        // Automatically block critical IPs with high confidence
        if (indicator.severity === 'critical' && indicator.confidence > 85) {
          blockIP(indicator.value, `Automatically blocked from threat intelligence: ${indicator.description}`);
          newMaliciousIPs++;
        }
        break;
        
      case 'domain':
        knownBadDomains.set(indicator.value, indicator);
        break;
        
      case 'file_hash':
        knownBadHashes.set(indicator.value, indicator);
        break;
        
      // Additional types can be handled here
    }
  }
  
  // Send alert if significant number of new malicious IPs were blocked
  if (newMaliciousIPs > 10) {
    sendAlert(
      AlertSeverity.MEDIUM,
      AlertType.SYSTEM,
      'Multiple malicious IPs automatically blocked',
      {
        count: newMaliciousIPs,
        source: 'threat intelligence feed'
      }
    );
  }
}

/**
 * Check if an IP is known to be malicious
 */
export function checkIP(ip: string): { malicious: boolean; indicator?: ThreatIndicator } {
  const indicator = knownBadIPs.get(ip);
  
  if (indicator && indicator.validUntil > Date.now()) {
    return {
      malicious: true,
      indicator
    };
  }
  
  return { malicious: false };
}

/**
 * Check if a domain is known to be malicious
 */
export function checkDomain(domain: string): { malicious: boolean; indicator?: ThreatIndicator } {
  const indicator = knownBadDomains.get(domain);
  
  if (indicator && indicator.validUntil > Date.now()) {
    return {
      malicious: true,
      indicator
    };
  }
  
  return { malicious: false };
}

/**
 * Check if a file hash is known to be malicious
 */
export function checkFileHash(hash: string): { malicious: boolean; indicator?: ThreatIndicator } {
  const indicator = knownBadHashes.get(hash);
  
  if (indicator && indicator.validUntil > Date.now()) {
    return {
      malicious: true,
      indicator
    };
  }
  
  return { malicious: false };
}

/**
 * Get all known malicious indicators
 */
export function getAllIndicators(): ThreatIndicator[] {
  const allIndicators: ThreatIndicator[] = [];
  
  // Combine all indicators
  for (const indicator of knownBadIPs.values()) {
    if (indicator.validUntil > Date.now()) {
      allIndicators.push(indicator);
    }
  }
  
  for (const indicator of knownBadDomains.values()) {
    if (indicator.validUntil > Date.now()) {
      allIndicators.push(indicator);
    }
  }
  
  for (const indicator of knownBadHashes.values()) {
    if (indicator.validUntil > Date.now()) {
      allIndicators.push(indicator);
    }
  }
  
  return allIndicators;
}

/**
 * Map external indicator types to our internal format
 */
function mapIndicatorType(externalType: string): 'ip' | 'domain' | 'url' | 'file_hash' | 'email' {
  const typeMap: Record<string, 'ip' | 'domain' | 'url' | 'file_hash' | 'email'> = {
    'ipv4': 'ip',
    'ipv6': 'ip',
    'domain': 'domain',
    'hostname': 'domain',
    'fqdn': 'domain',
    'url': 'url',
    'uri': 'url',
    'md5': 'file_hash',
    'sha1': 'file_hash',
    'sha256': 'file_hash',
    'email': 'email',
    'email-addr': 'email'
  };
  
  return typeMap[externalType.toLowerCase()] || 'ip';
}

/**
 * Map external severity to our internal format
 */
function mapSeverity(externalSeverity: string): 'low' | 'medium' | 'high' | 'critical' {
  const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
    'low': 'low',
    'minor': 'low',
    'medium': 'medium',
    'moderate': 'medium',
    'high': 'high',
    'major': 'high',
    'critical': 'critical',
    'severe': 'critical'
  };
  
  return severityMap[externalSeverity.toLowerCase()] || 'medium';
}