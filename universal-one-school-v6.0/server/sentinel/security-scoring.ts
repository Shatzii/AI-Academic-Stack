/**
 * Sentinel 4.5 Security Scoring System
 * 
 * This module implements a comprehensive security scoring system that evaluates
 * the overall security posture of the application based on various indicators.
 */

import { logSecurityEvent, logAuditEvent } from './audit-log';
import { sendAlert, AlertSeverity, AlertType } from './alert-system';
import { getAllSecurityIncidents, IncidentType } from './incident-response';
import { getUserRiskScores } from './user-behavior';
import { getAllApiKeys, ApiKeyStatus } from './api-key-manager';
import { getSecuritySettings } from './config';

// Weight for each security category
interface SecurityWeights {
  authenticationSecurity: number;
  dataProtection: number;
  networkSecurity: number;
  applicationSecurity: number;
  incidentResponse: number;
  securityAwareness: number;
  complianceStatus: number;
}

// Security score by category
export interface SecurityScore {
  overall: number;
  categories: {
    authenticationSecurity: number;
    dataProtection: number;
    networkSecurity: number;
    applicationSecurity: number;
    incidentResponse: number;
    securityAwareness: number;
    complianceStatus: number;
  };
  lastCalculated: number;
  previousScore?: number;
  scoreChange?: number;
  recommendations: SecurityRecommendation[];
}

// Recommendation for improving security
export interface SecurityRecommendation {
  id: string;
  category: keyof SecurityWeights;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  potentialScoreImprovement: number;
  status: 'pending' | 'in-progress' | 'completed' | 'deferred';
  implementedAt?: number;
}

// Default category weights
const DEFAULT_WEIGHTS: SecurityWeights = {
  authenticationSecurity: 20,
  dataProtection: 20,
  networkSecurity: 15,
  applicationSecurity: 15,
  incidentResponse: 10,
  securityAwareness: 10,
  complianceStatus: 10
};

// Store the most recent security score
let currentSecurityScore: SecurityScore | null = null;

// Store historical security scores
const securityScoreHistory: Array<{
  timestamp: number;
  overall: number;
  categories: {
    [key: string]: number;
  };
}> = [];

// Security checks that contribute to the score
const securityChecks = {
  authenticationSecurity: [
    {
      name: 'passwordPolicy',
      check: () => {
        const settings = getSecuritySettings();
        
        // Check password policy strength
        let score = 0;
        
        if (settings.passwordMinLength >= 12) score += 25;
        else if (settings.passwordMinLength >= 8) score += 15;
        else score += 5;
        
        if (settings.passwordRequiresUppercase) score += 15;
        if (settings.passwordRequiresLowercase) score += 10;
        if (settings.passwordRequiresNumbers) score += 15;
        if (settings.passwordRequiresSymbols) score += 15;
        if (settings.passwordHistoryCount >= 12) score += 10;
        else if (settings.passwordHistoryCount >= 6) score += 5;
        
        return score;
      }
    },
    {
      name: 'mfaAdoption',
      check: () => {
        const settings = getSecuritySettings();
        
        // Calculate MFA adoption rate
        let score = 0;
        
        if (settings.mfaRequiredForAdmins) score += 40;
        if (settings.mfaEnabled) score += 20;
        
        // Add score based on adoption rate
        score += Math.min(40, settings.mfaAdoptionRate ?? 0);
        
        return score;
      }
    },
    {
      name: 'accountLockout',
      check: () => {
        const settings = getSecuritySettings();
        
        // Check account lockout policy
        let score = 0;
        
        if (settings.accountLockoutThreshold <= 5) score += 40;
        else if (settings.accountLockoutThreshold <= 10) score += 25;
        else score += 10;
        
        if (settings.accountLockoutDuration >= 30) score += 30;
        else if (settings.accountLockoutDuration >= 15) score += 20;
        else score += 10;
        
        if (settings.accountLockoutReset >= 15) score += 30;
        else if (settings.accountLockoutReset >= 5) score += 20;
        else score += 10;
        
        return score;
      }
    }
  ],
  
  dataProtection: [
    {
      name: 'dataEncryption',
      check: () => {
        const settings = getSecuritySettings();
        
        // Check data encryption settings
        let score = 0;
        
        if (settings.dataAtRestEncryption) score += 30;
        if (settings.dataInTransitEncryption) score += 30;
        
        if (settings.encryptionKeyRotation) {
          if (settings.encryptionKeyRotationFrequency <= 90) score += 20;
          else if (settings.encryptionKeyRotationFrequency <= 180) score += 15;
          else score += 10;
        }
        
        if (settings.sensitiveDataMasking) score += 20;
        
        return score;
      }
    },
    {
      name: 'apiKeyManagement',
      check: () => {
        // Check API key management
        let score = 0;
        
        const apiKeys = getAllApiKeys();
        
        if (apiKeys.length === 0) return 80; // If no API keys, assume good practice
        
        // Check key status
        const expiredKeys = apiKeys.filter(key => key.status === ApiKeyStatus.EXPIRED).length;
        const activeKeys = apiKeys.filter(key => key.status === ApiKeyStatus.ACTIVE).length;
        
        // Calculate percentage of expired keys
        const expiredPercentage = expiredKeys / apiKeys.length;
        
        if (expiredPercentage <= 0.05) score += 30;
        else if (expiredPercentage <= 0.1) score += 20;
        else score += 10;
        
        // Check for key rotation
        const rotatedKeys = apiKeys.filter(key => key.status === ApiKeyStatus.ROTATED).length;
        const rotationPercentage = rotatedKeys / activeKeys;
        
        if (rotationPercentage >= 0.5) score += 40;
        else if (rotationPercentage >= 0.25) score += 25;
        else score += 10;
        
        // Check for key scopes
        const keysWithScopes = apiKeys.filter(key => key.scopes && key.scopes.length > 0).length;
        const scopePercentage = keysWithScopes / apiKeys.length;
        
        if (scopePercentage >= 0.9) score += 30;
        else if (scopePercentage >= 0.7) score += 20;
        else score += 10;
        
        return score;
      }
    }
  ],
  
  networkSecurity: [
    {
      name: 'firewallRules',
      check: () => {
        const settings = getSecuritySettings();
        
        // Check firewall rules
        let score = 0;
        
        if (settings.firewallEnabled) score += 40;
        
        if (settings.firewallRules) {
          const ruleCount = settings.firewallRules.length;
          
          if (ruleCount >= 10) score += 20;
          else if (ruleCount >= 5) score += 15;
          else score += 10;
          
          const denyRuleCount = settings.firewallRules.filter(rule => rule.action === 'deny').length;
          const denyPercentage = denyRuleCount / ruleCount;
          
          if (denyPercentage >= 0.8) score += 20;
          else if (denyPercentage >= 0.5) score += 15;
          else score += 10;
        }
        
        if (settings.ipBlockingEnabled) score += 20;
        
        return score;
      }
    },
    {
      name: 'tlsConfiguration',
      check: () => {
        const settings = getSecuritySettings();
        
        // Check TLS configuration
        let score = 0;
        
        if (settings.tlsVersion === '1.3') score += 50;
        else if (settings.tlsVersion === '1.2') score += 30;
        else score += 10;
        
        if (settings.hsts) score += 25;
        
        if (settings.securityHeaders && settings.securityHeaders.length >= 5) score += 25;
        else if (settings.securityHeaders && settings.securityHeaders.length >= 3) score += 15;
        else score += 5;
        
        return score;
      }
    }
  ],
  
  applicationSecurity: [
    {
      name: 'inputValidation',
      check: () => {
        const settings = getSecuritySettings();
        
        // Check input validation practices
        let score = 0;
        
        if (settings.inputValidation) score += 30;
        if (settings.sqlPreparedStatements) score += 30;
        if (settings.contentSecurityPolicy) score += 20;
        if (settings.xssProtection) score += 20;
        
        return score;
      }
    },
    {
      name: 'fileUploadSecurity',
      check: () => {
        const settings = getSecuritySettings();
        
        // Check file upload security
        let score = 0;
        
        if (settings.fileUploadValidation) score += 30;
        if (settings.fileUploadScanning) score += 30;
        if (settings.fileUploadSizeLimit) score += 20;
        if (settings.fileUploadTypeRestriction) score += 20;
        
        return score;
      }
    }
  ],
  
  incidentResponse: [
    {
      name: 'incidentDetection',
      check: () => {
        const settings = getSecuritySettings();
        
        // Check incident detection capabilities
        let score = 0;
        
        if (settings.securityMonitoringEnabled) score += 30;
        if (settings.anomalyDetectionEnabled) score += 30;
        if (settings.alertingEnabled) score += 20;
        if (settings.loggingEnabled) score += 20;
        
        return score;
      }
    },
    {
      name: 'incidentResolution',
      check: () => {
        // Calculate incident resolution metrics
        let score = 0;
        
        const incidents = getAllSecurityIncidents();
        
        if (incidents.length === 0) return 80; // If no incidents, assume good practice
        
        // Calculate percentage of resolved incidents
        const resolvedIncidents = incidents.filter(inc => inc.status === 'resolved').length;
        const resolvedPercentage = resolvedIncidents / incidents.length;
        
        if (resolvedPercentage >= 0.9) score += 40;
        else if (resolvedPercentage >= 0.7) score += 25;
        else if (resolvedPercentage >= 0.5) score += 15;
        else score += 5;
        
        // Calculate percentage of mitigated incidents
        const mitigatedIncidents = incidents.filter(inc => inc.status === 'mitigated').length;
        const mitigatedPercentage = mitigatedIncidents / incidents.length;
        
        if (mitigatedPercentage >= 0.8) score += 30;
        else if (mitigatedPercentage >= 0.6) score += 20;
        else if (mitigatedPercentage >= 0.4) score += 10;
        else score += 5;
        
        // Calculate mean time to resolution
        const resolvedIncidentsWithTime = incidents.filter(inc => inc.status === 'resolved' && inc.resolvedAt);
        if (resolvedIncidentsWithTime.length > 0) {
          const totalResolutionTime = resolvedIncidentsWithTime.reduce((total, inc) => {
            return total + ((inc.resolvedAt || 0) - inc.timestamp);
          }, 0);
          
          const averageResolutionTime = totalResolutionTime / resolvedIncidentsWithTime.length;
          const averageResolutionHours = averageResolutionTime / (1000 * 60 * 60);
          
          if (averageResolutionHours <= 4) score += 30;
          else if (averageResolutionHours <= 12) score += 20;
          else if (averageResolutionHours <= 24) score += 10;
          else score += 5;
        }
        
        return score;
      }
    }
  ],
  
  securityAwareness: [
    {
      name: 'trainingCompletion',
      check: () => {
        const settings = getSecuritySettings();
        
        // Calculate security training completion rate
        let score = 0;
        
        if (settings.securityTrainingRequired) score += 30;
        
        if (settings.securityTrainingCompletionRate) {
          const completionRate = settings.securityTrainingCompletionRate;
          
          if (completionRate >= 90) score += 35;
          else if (completionRate >= 75) score += 25;
          else if (completionRate >= 50) score += 15;
          else score += 5;
        }
        
        if (settings.securityTrainingFrequency) {
          if (settings.securityTrainingFrequency <= 90) score += 35; // Quarterly
          else if (settings.securityTrainingFrequency <= 180) score += 25; // Bi-annually
          else score += 15; // Annually
        }
        
        return score;
      }
    },
    {
      name: 'securityIncidentReporting',
      check: () => {
        const settings = getSecuritySettings();
        
        // Calculate security incident reporting metrics
        let score = 0;
        
        if (settings.securityIncidentReportingEnabled) score += 40;
        
        if (settings.securityIncidentReportsCount && settings.securityIncidentReportingRate) {
          if (settings.securityIncidentReportingRate >= 80) score += 40;
          else if (settings.securityIncidentReportingRate >= 60) score += 30;
          else if (settings.securityIncidentReportingRate >= 40) score += 20;
          else score += 10;
        } else {
          score += 20; // Assume average if no data
        }
        
        if (settings.securityAwarenessProgram) score += 20;
        
        return score;
      }
    }
  ],
  
  complianceStatus: [
    {
      name: 'complianceRequirements',
      check: () => {
        const settings = getSecuritySettings();
        
        // Calculate compliance status
        let score = 0;
        
        if (settings.complianceStatus) {
          const complianceData = settings.complianceStatus;
          
          // Check GDPR compliance
          if (complianceData.gdpr) {
            if (complianceData.gdpr.complianceRate >= 90) score += 30;
            else if (complianceData.gdpr.complianceRate >= 75) score += 20;
            else score += 10;
          }
          
          // Check HIPAA compliance
          if (complianceData.hipaa) {
            if (complianceData.hipaa.complianceRate >= 90) score += 25;
            else if (complianceData.hipaa.complianceRate >= 75) score += 15;
            else score += 5;
          }
          
          // Check PCI DSS compliance
          if (complianceData.pciDss) {
            if (complianceData.pciDss.complianceRate >= 90) score += 25;
            else if (complianceData.pciDss.complianceRate >= 75) score += 15;
            else score += 5;
          }
          
          // Check SOC 2 compliance
          if (complianceData.soc2) {
            if (complianceData.soc2.complianceRate >= 90) score += 20;
            else if (complianceData.soc2.complianceRate >= 75) score += 10;
            else score += 5;
          }
        } else {
          score = 50; // Default if no compliance data
        }
        
        return score;
      }
    }
  ]
};

// Initialize the security scoring system
export function initSecurityScoring(): void {
  // Calculate initial security score
  calculateSecurityScore();
  
  // Schedule regular score calculations
  setInterval(() => {
    calculateSecurityScore();
  }, 24 * 60 * 60 * 1000); // Daily recalculation
  
  console.log('Security Scoring module initialized');
}

/**
 * Calculate the overall security score
 */
export function calculateSecurityScore(weights: Partial<SecurityWeights> = {}): SecurityScore {
  // Merge custom weights with defaults
  const activeWeights = {
    ...DEFAULT_WEIGHTS,
    ...weights
  };
  
  // Normalize weights to ensure they sum to 100
  const weightSum = Object.values(activeWeights).reduce((sum, weight) => sum + weight, 0);
  const normalizedWeights = Object.fromEntries(
    Object.entries(activeWeights).map(([key, weight]) => [key, (weight / weightSum) * 100])
  ) as SecurityWeights;
  
  // Store previous score for comparison
  const previousScore = currentSecurityScore?.overall;
  
  // Calculate score for each category
  const categoryScores = {
    authenticationSecurity: calculateCategoryScore('authenticationSecurity'),
    dataProtection: calculateCategoryScore('dataProtection'),
    networkSecurity: calculateCategoryScore('networkSecurity'),
    applicationSecurity: calculateCategoryScore('applicationSecurity'),
    incidentResponse: calculateCategoryScore('incidentResponse'),
    securityAwareness: calculateCategoryScore('securityAwareness'),
    complianceStatus: calculateCategoryScore('complianceStatus')
  };
  
  // Calculate overall score using weighted average
  const overallScore = Object.entries(categoryScores).reduce((score, [category, categoryScore]) => {
    return score + (categoryScore * (normalizedWeights[category as keyof SecurityWeights] / 100));
  }, 0);
  
  // Round to nearest integer
  const roundedOverallScore = Math.round(overallScore);
  
  // Generate recommendations
  const recommendations = generateRecommendations(categoryScores);
  
  // Create the security score object
  const securityScore: SecurityScore = {
    overall: roundedOverallScore,
    categories: categoryScores,
    lastCalculated: Date.now(),
    recommendations
  };
  
  // Calculate score change if there was a previous score
  if (previousScore !== undefined) {
    securityScore.previousScore = previousScore;
    securityScore.scoreChange = roundedOverallScore - previousScore;
  }
  
  // Store current score
  currentSecurityScore = securityScore;
  
  // Add to history
  securityScoreHistory.push({
    timestamp: securityScore.lastCalculated,
    overall: securityScore.overall,
    categories: securityScore.categories
  });
  
  // Trim history if too long
  if (securityScoreHistory.length > 365) { // Keep a year of daily scores
    securityScoreHistory.shift();
  }
  
  // Log the calculation
  logSecurityEvent(
    'system',
    'Security score calculated',
    {
      score: roundedOverallScore,
      change: securityScore.scoreChange,
      categories: categoryScores
    },
    'system'
  );
  
  // Alert on significant score changes
  if (securityScore.scoreChange !== undefined && Math.abs(securityScore.scoreChange) >= 5) {
    const isIncrease = securityScore.scoreChange > 0;
    
    sendAlert(
      isIncrease ? AlertSeverity.LOW : AlertSeverity.MEDIUM,
      AlertType.SYSTEM,
      `Security score ${isIncrease ? 'increased' : 'decreased'} by ${Math.abs(securityScore.scoreChange)} points`,
      {
        oldScore: previousScore,
        newScore: roundedOverallScore,
        change: securityScore.scoreChange,
        categories: Object.entries(categoryScores).map(([category, score]) => ({
          category,
          score
        }))
      }
    );
  }
  
  return securityScore;
}

/**
 * Calculate score for a specific security category
 */
function calculateCategoryScore(category: keyof typeof securityChecks): number {
  const checks = securityChecks[category];
  if (!checks || checks.length === 0) return 0;
  
  // Calculate total score as average of all checks
  const totalScore = checks.reduce((sum, check) => sum + check.check(), 0);
  const averageScore = totalScore / checks.length;
  
  // Return score rounded to nearest integer
  return Math.round(averageScore);
}

/**
 * Generate security recommendations based on category scores
 */
function generateRecommendations(categoryScores: Record<string, number>): SecurityRecommendation[] {
  const recommendations: SecurityRecommendation[] = [];
  
  // Authentication recommendations
  if (categoryScores.authenticationSecurity < 70) {
    if (categoryScores.authenticationSecurity < 50) {
      recommendations.push({
        id: `rec-auth-${Date.now()}-1`,
        category: 'authenticationSecurity',
        title: 'Implement Multi-Factor Authentication',
        description: 'Enable multi-factor authentication for all users, especially administrators.',
        impact: 'high',
        effort: 'medium',
        potentialScoreImprovement: 15,
        status: 'pending'
      });
    }
    
    recommendations.push({
      id: `rec-auth-${Date.now()}-2`,
      category: 'authenticationSecurity',
      title: 'Strengthen Password Policy',
      description: 'Increase minimum password length to 12 characters and require complexity.',
      impact: 'medium',
      effort: 'low',
      potentialScoreImprovement: 10,
      status: 'pending'
    });
  }
  
  // Data protection recommendations
  if (categoryScores.dataProtection < 75) {
    recommendations.push({
      id: `rec-data-${Date.now()}-1`,
      category: 'dataProtection',
      title: 'Implement Data Encryption at Rest',
      description: 'Enable encryption for all sensitive data stored in databases and files.',
      impact: 'high',
      effort: 'high',
      potentialScoreImprovement: 20,
      status: 'pending'
    });
    
    if (categoryScores.dataProtection < 60) {
      recommendations.push({
        id: `rec-data-${Date.now()}-2`,
        category: 'dataProtection',
        title: 'Implement API Key Rotation',
        description: 'Set up automatic rotation for API keys every 90 days.',
        impact: 'medium',
        effort: 'medium',
        potentialScoreImprovement: 15,
        status: 'pending'
      });
    }
  }
  
  // Network security recommendations
  if (categoryScores.networkSecurity < 70) {
    recommendations.push({
      id: `rec-net-${Date.now()}-1`,
      category: 'networkSecurity',
      title: 'Enable HSTS Headers',
      description: 'Configure HTTP Strict Transport Security headers for all web responses.',
      impact: 'medium',
      effort: 'low',
      potentialScoreImprovement: 10,
      status: 'pending'
    });
    
    if (categoryScores.networkSecurity < 50) {
      recommendations.push({
        id: `rec-net-${Date.now()}-2`,
        category: 'networkSecurity',
        title: 'Upgrade to TLS 1.3',
        description: 'Configure servers to use TLS 1.3 and disable older protocols.',
        impact: 'medium',
        effort: 'medium',
        potentialScoreImprovement: 15,
        status: 'pending'
      });
    }
  }
  
  // Application security recommendations
  if (categoryScores.applicationSecurity < 70) {
    recommendations.push({
      id: `rec-app-${Date.now()}-1`,
      category: 'applicationSecurity',
      title: 'Implement Content Security Policy',
      description: 'Configure a Content Security Policy to prevent XSS attacks.',
      impact: 'high',
      effort: 'medium',
      potentialScoreImprovement: 15,
      status: 'pending'
    });
    
    if (categoryScores.applicationSecurity < 60) {
      recommendations.push({
        id: `rec-app-${Date.now()}-2`,
        category: 'applicationSecurity',
        title: 'Enhance File Upload Validation',
        description: 'Implement comprehensive file validation including content type verification and virus scanning.',
        impact: 'high',
        effort: 'high',
        potentialScoreImprovement: 20,
        status: 'pending'
      });
    }
  }
  
  // Incident response recommendations
  if (categoryScores.incidentResponse < 65) {
    recommendations.push({
      id: `rec-inc-${Date.now()}-1`,
      category: 'incidentResponse',
      title: 'Implement Automated Incident Response',
      description: 'Set up automated incident response workflows for common security events.',
      impact: 'high',
      effort: 'high',
      potentialScoreImprovement: 25,
      status: 'pending'
    });
  }
  
  // Security awareness recommendations
  if (categoryScores.securityAwareness < 70) {
    recommendations.push({
      id: `rec-aware-${Date.now()}-1`,
      category: 'securityAwareness',
      title: 'Implement Regular Security Training',
      description: 'Conduct quarterly security awareness training for all staff.',
      impact: 'medium',
      effort: 'medium',
      potentialScoreImprovement: 20,
      status: 'pending'
    });
  }
  
  // Compliance recommendations
  if (categoryScores.complianceStatus < 70) {
    recommendations.push({
      id: `rec-comp-${Date.now()}-1`,
      category: 'complianceStatus',
      title: 'Conduct Compliance Gap Analysis',
      description: 'Perform a comprehensive compliance gap analysis against relevant standards.',
      impact: 'high',
      effort: 'high',
      potentialScoreImprovement: 15,
      status: 'pending'
    });
  }
  
  return recommendations;
}

/**
 * Get the current security score
 */
export function getCurrentSecurityScore(): SecurityScore | null {
  return currentSecurityScore;
}

/**
 * Get historical security scores
 */
export function getSecurityScoreHistory(
  days: number = 30
): Array<{
  timestamp: number;
  overall: number;
  categories: {
    [key: string]: number;
  };
}> {
  // Calculate cutoff date
  const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
  
  // Filter history by date
  return securityScoreHistory.filter(score => score.timestamp >= cutoffTime);
}

/**
 * Update recommendation status
 */
export function updateRecommendationStatus(
  recommendationId: string,
  status: 'pending' | 'in-progress' | 'completed' | 'deferred',
  updatedBy: string
): boolean {
  if (!currentSecurityScore) return false;
  
  // Find recommendation
  const recommendationIndex = currentSecurityScore.recommendations.findIndex(
    rec => rec.id === recommendationId
  );
  
  if (recommendationIndex === -1) return false;
  
  // Update status
  currentSecurityScore.recommendations[recommendationIndex].status = status;
  
  // If completed, set implementation date
  if (status === 'completed') {
    currentSecurityScore.recommendations[recommendationIndex].implementedAt = Date.now();
    
    // Recalculate security score
    calculateSecurityScore();
  }
  
  // Log the update
  logAuditEvent(
    updatedBy,
    `Security recommendation status updated`,
    {
      recommendationId,
      status,
      title: currentSecurityScore.recommendations[recommendationIndex].title
    },
    'system'
  );
  
  return true;
}