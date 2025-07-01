/**
 * Sentinel 4.5 Security Education System
 * 
 * This module connects security incidents with contextual learning materials for administrators,
 * turning each security event into a learning opportunity.
 */

import { SecurityAlert, AlertSeverity, AlertType } from './alert-system';
import { IncidentType, SecurityIncident } from './incident-response';
import { logAuditEvent } from './audit-log';

// Learning resource types
export enum ResourceType {
  ARTICLE = 'article',
  VIDEO = 'video',
  DOCUMENTATION = 'documentation',
  INTERACTIVE = 'interactive',
  TUTORIAL = 'tutorial'
}

// Learning resource
export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  source: string;
  createdAt: number;
}

// Learning recommendation
export interface LearningRecommendation {
  id: string;
  alertId?: string;
  incidentId?: string;
  resourceId: string;
  relevance: number; // 0-100
  reason: string;
  createdAt: number;
  viewed: boolean;
  viewedAt?: number;
  viewedBy?: string;
  feedback?: 'helpful' | 'not_helpful';
  notes?: string;
}

// Learning resources library
const learningResources: Map<string, LearningResource> = new Map();

// Store recommendations
const recommendations: Map<string, LearningRecommendation> = new Map();

// Initialize with built-in resources
function initializeResources(): void {
  // Authentication resources
  addLearningResource({
    id: 'auth-001',
    title: 'Understanding Authentication Best Practices',
    description: 'Learn how to implement secure authentication systems and protect against common attacks.',
    type: ResourceType.ARTICLE,
    url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
    topics: ['authentication', 'security', 'passwords', 'mfa', 'brute-force'],
    difficulty: 'intermediate',
    estimatedTime: 15,
    source: 'OWASP',
    createdAt: Date.now()
  });
  
  addLearningResource({
    id: 'auth-002',
    title: 'Implementing Two-Factor Authentication',
    description: 'A step-by-step guide to adding two-factor authentication to secure your applications.',
    type: ResourceType.TUTORIAL,
    url: 'https://www.digitalocean.com/community/tutorials/how-to-set-up-multi-factor-authentication-for-ssh-on-ubuntu-20-04',
    topics: ['authentication', 'mfa', '2fa', 'totp'],
    difficulty: 'intermediate',
    estimatedTime: 25,
    source: 'DigitalOcean',
    createdAt: Date.now()
  });
  
  // SQL Injection resources
  addLearningResource({
    id: 'sqli-001',
    title: 'Preventing SQL Injection Attacks',
    description: 'Learn how SQL injection attacks work and how to prevent them in your applications.',
    type: ResourceType.ARTICLE,
    url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html',
    topics: ['sql-injection', 'database', 'security'],
    difficulty: 'intermediate',
    estimatedTime: 20,
    source: 'OWASP',
    createdAt: Date.now()
  });
  
  addLearningResource({
    id: 'sqli-002',
    title: 'Interactive SQL Injection Tutorial',
    description: 'Practice identifying and fixing SQL injection vulnerabilities with this interactive tutorial.',
    type: ResourceType.INTERACTIVE,
    url: 'https://portswigger.net/web-security/sql-injection',
    topics: ['sql-injection', 'database', 'security', 'hands-on'],
    difficulty: 'intermediate',
    estimatedTime: 45,
    source: 'PortSwigger',
    createdAt: Date.now()
  });
  
  // XSS resources
  addLearningResource({
    id: 'xss-001',
    title: 'Cross-Site Scripting Prevention',
    description: 'Understand different types of XSS attacks and how to protect your web applications.',
    type: ResourceType.ARTICLE,
    url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html',
    topics: ['xss', 'injection', 'javascript', 'security'],
    difficulty: 'intermediate',
    estimatedTime: 20,
    source: 'OWASP',
    createdAt: Date.now()
  });
  
  // Rate limiting resources
  addLearningResource({
    id: 'rate-001',
    title: 'API Rate Limiting Strategies',
    description: 'Learn different strategies for implementing rate limiting to protect your APIs.',
    type: ResourceType.ARTICLE,
    url: 'https://nordicapis.com/everything-you-need-to-know-about-api-rate-limiting/',
    topics: ['rate-limiting', 'api', 'security', 'ddos'],
    difficulty: 'intermediate',
    estimatedTime: 15,
    source: 'Nordic APIs',
    createdAt: Date.now()
  });
  
  // File upload security
  addLearningResource({
    id: 'file-001',
    title: 'Secure File Upload Best Practices',
    description: 'Learn how to implement secure file upload functionality and prevent common vulnerabilities.',
    type: ResourceType.ARTICLE,
    url: 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html',
    topics: ['file-upload', 'security', 'validation'],
    difficulty: 'intermediate',
    estimatedTime: 20,
    source: 'OWASP',
    createdAt: Date.now()
  });
  
  // API security
  addLearningResource({
    id: 'api-001',
    title: 'API Security Best Practices',
    description: 'Comprehensive guide to securing your APIs against common attacks and vulnerabilities.',
    type: ResourceType.DOCUMENTATION,
    url: 'https://github.com/shieldfy/API-Security-Checklist',
    topics: ['api', 'security', 'checklist', 'best-practices'],
    difficulty: 'intermediate',
    estimatedTime: 20,
    source: 'GitHub',
    createdAt: Date.now()
  });
  
  // Honeypot resources
  addLearningResource({
    id: 'honeypot-001',
    title: 'Understanding and Implementing Honeypots',
    description: 'Learn how honeypots work and how to use them to detect and analyze security threats.',
    type: ResourceType.ARTICLE,
    url: 'https://www.varonis.com/blog/honeypot-security',
    topics: ['honeypot', 'security', 'threat-detection'],
    difficulty: 'intermediate',
    estimatedTime: 20,
    source: 'Varonis',
    createdAt: Date.now()
  });
  
  // Security monitoring
  addLearningResource({
    id: 'monitor-001',
    title: 'Effective Security Monitoring Strategies',
    description: 'Learn how to set up effective security monitoring and incident response procedures.',
    type: ResourceType.ARTICLE,
    url: 'https://sre.google/sre-book/monitoring-distributed-systems/',
    topics: ['monitoring', 'security', 'incident-response'],
    difficulty: 'advanced',
    estimatedTime: 30,
    source: 'Google SRE Book',
    createdAt: Date.now()
  });
  
  // User behavior analytics
  addLearningResource({
    id: 'ueba-001',
    title: 'Introduction to User and Entity Behavior Analytics',
    description: 'Understanding how to detect security threats using behavioral analytics.',
    type: ResourceType.ARTICLE,
    url: 'https://www.exabeam.com/ueba/what-is-ueba/',
    topics: ['ueba', 'behavior-analytics', 'security', 'anomaly-detection'],
    difficulty: 'intermediate',
    estimatedTime: 15,
    source: 'Exabeam',
    createdAt: Date.now()
  });
  
  // Content Security Policy
  addLearningResource({
    id: 'csp-001',
    title: 'Content Security Policy Implementation Guide',
    description: 'Learn how to effectively implement Content Security Policy to prevent XSS and other attacks.',
    type: ResourceType.ARTICLE,
    url: 'https://content-security-policy.com/',
    topics: ['csp', 'web-security', 'xss-prevention'],
    difficulty: 'intermediate',
    estimatedTime: 25,
    source: 'CSP Guide',
    createdAt: Date.now()
  });
  
  // API key management
  addLearningResource({
    id: 'apikey-001',
    title: 'Best Practices for API Key Management',
    description: 'Learn how to securely generate, distribute, and manage API keys for your applications.',
    type: ResourceType.ARTICLE,
    url: 'https://auth0.com/blog/your-api-authentication-guide/',
    topics: ['api-keys', 'security', 'key-rotation', 'authentication'],
    difficulty: 'intermediate',
    estimatedTime: 20,
    source: 'Auth0',
    createdAt: Date.now()
  });
  
  // Database security
  addLearningResource({
    id: 'db-001',
    title: 'Database Security Best Practices',
    description: 'Comprehensive guide to securing your databases against common threats and vulnerabilities.',
    type: ResourceType.ARTICLE,
    url: 'https://www.cisecurity.org/insights/spotlight/spotlight-on-database-security',
    topics: ['database', 'security', 'encryption', 'access-control'],
    difficulty: 'intermediate',
    estimatedTime: 25,
    source: 'CIS',
    createdAt: Date.now()
  });
  
  // Incident response
  addLearningResource({
    id: 'incident-001',
    title: 'Creating an Effective Incident Response Plan',
    description: 'Learn how to develop and implement an effective incident response plan for your organization.',
    type: ResourceType.ARTICLE,
    url: 'https://www.sans.org/white-papers/incident-handlers-handbook/',
    topics: ['incident-response', 'security', 'planning'],
    difficulty: 'advanced',
    estimatedTime: 30,
    source: 'SANS Institute',
    createdAt: Date.now()
  });
  
  console.log(`Initialized ${learningResources.size} security learning resources`);
}

/**
 * Add a learning resource to the library
 */
export function addLearningResource(resource: LearningResource): void {
  learningResources.set(resource.id, resource);
}

/**
 * Get all learning resources
 */
export function getAllLearningResources(): LearningResource[] {
  return Array.from(learningResources.values());
}

/**
 * Search learning resources by topic
 */
export function searchResourcesByTopic(topic: string): LearningResource[] {
  return Array.from(learningResources.values()).filter(
    resource => resource.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
  );
}

/**
 * Generate learning recommendations for a security alert
 */
export function generateRecommendationsForAlert(alert: SecurityAlert): LearningRecommendation[] {
  const newRecommendations: LearningRecommendation[] = [];
  
  // Determine relevant topics based on alert type
  const relevantTopics = getTopicsForAlertType(alert.type);
  
  // Find relevant resources
  const relevantResources = Array.from(learningResources.values()).filter(
    resource => resource.topics.some(topic => relevantTopics.includes(topic))
  );
  
  // Sort by relevance
  const sortedResources = relevantResources.sort((a, b) => {
    const aRelevance = calculateResourceRelevance(a, relevantTopics);
    const bRelevance = calculateResourceRelevance(b, relevantTopics);
    return bRelevance - aRelevance;
  });
  
  // Generate recommendations (max 3)
  const maxRecommendations = Math.min(3, sortedResources.length);
  for (let i = 0; i < maxRecommendations; i++) {
    const resource = sortedResources[i];
    const relevance = calculateResourceRelevance(resource, relevantTopics);
    
    const recommendation: LearningRecommendation = {
      id: `rec-${Date.now()}-${i}`,
      alertId: alert.id,
      resourceId: resource.id,
      relevance,
      reason: generateRecommendationReason(alert, resource),
      createdAt: Date.now(),
      viewed: false
    };
    
    recommendations.set(recommendation.id, recommendation);
    newRecommendations.push(recommendation);
  }
  
  return newRecommendations;
}

/**
 * Generate learning recommendations for a security incident
 */
export function generateRecommendationsForIncident(incident: SecurityIncident): LearningRecommendation[] {
  const newRecommendations: LearningRecommendation[] = [];
  
  // Determine relevant topics based on incident type
  const relevantTopics = getTopicsForIncidentType(incident.type);
  
  // Find relevant resources
  const relevantResources = Array.from(learningResources.values()).filter(
    resource => resource.topics.some(topic => relevantTopics.includes(topic))
  );
  
  // Sort by relevance
  const sortedResources = relevantResources.sort((a, b) => {
    const aRelevance = calculateResourceRelevance(a, relevantTopics);
    const bRelevance = calculateResourceRelevance(b, relevantTopics);
    return bRelevance - aRelevance;
  });
  
  // Generate recommendations (max 3)
  const maxRecommendations = Math.min(3, sortedResources.length);
  for (let i = 0; i < maxRecommendations; i++) {
    const resource = sortedResources[i];
    const relevance = calculateResourceRelevance(resource, relevantTopics);
    
    const recommendation: LearningRecommendation = {
      id: `rec-${Date.now()}-${i}`,
      incidentId: incident.id,
      resourceId: resource.id,
      relevance,
      reason: generateRecommendationReasonForIncident(incident, resource),
      createdAt: Date.now(),
      viewed: false
    };
    
    recommendations.set(recommendation.id, recommendation);
    newRecommendations.push(recommendation);
  }
  
  return newRecommendations;
}

/**
 * Get recommendations for an alert
 */
export function getRecommendationsForAlert(alertId: string): LearningRecommendation[] {
  return Array.from(recommendations.values()).filter(rec => rec.alertId === alertId);
}

/**
 * Get recommendations for an incident
 */
export function getRecommendationsForIncident(incidentId: string): LearningRecommendation[] {
  return Array.from(recommendations.values()).filter(rec => rec.incidentId === incidentId);
}

/**
 * Get all learning recommendations
 */
export function getAllRecommendations(): LearningRecommendation[] {
  return Array.from(recommendations.values()).sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Mark a recommendation as viewed
 */
export function markRecommendationAsViewed(
  recommendationId: string,
  viewedBy: string
): boolean {
  const recommendation = recommendations.get(recommendationId);
  if (!recommendation) return false;
  
  recommendation.viewed = true;
  recommendation.viewedAt = Date.now();
  recommendation.viewedBy = viewedBy;
  
  recommendations.set(recommendationId, recommendation);
  
  // Log the view
  logAuditEvent(
    viewedBy,
    'Security learning resource viewed',
    {
      recommendationId,
      resourceId: recommendation.resourceId,
      alertId: recommendation.alertId,
      incidentId: recommendation.incidentId
    },
    'system'
  );
  
  return true;
}

/**
 * Add feedback to a recommendation
 */
export function addRecommendationFeedback(
  recommendationId: string,
  feedback: 'helpful' | 'not_helpful',
  notes?: string
): boolean {
  const recommendation = recommendations.get(recommendationId);
  if (!recommendation) return false;
  
  recommendation.feedback = feedback;
  if (notes) recommendation.notes = notes;
  
  recommendations.set(recommendationId, recommendation);
  
  return true;
}

/**
 * Get a specific learning resource
 */
export function getLearningResource(resourceId: string): LearningResource | undefined {
  return learningResources.get(resourceId);
}

/**
 * Calculate the relevance of a resource to a set of topics
 */
function calculateResourceRelevance(resource: LearningResource, topics: string[]): number {
  let relevance = 0;
  
  // Calculate relevance based on topic matches
  for (const topic of topics) {
    if (resource.topics.includes(topic)) {
      relevance += 20; // Exact match
    } else {
      // Partial match
      for (const resourceTopic of resource.topics) {
        if (resourceTopic.includes(topic) || topic.includes(resourceTopic)) {
          relevance += 10;
          break;
        }
      }
    }
  }
  
  // Cap at 100
  return Math.min(100, relevance);
}

/**
 * Generate a reason for a recommendation
 */
function generateRecommendationReason(alert: SecurityAlert, resource: LearningResource): string {
  switch (alert.type) {
    case AlertType.AUTHENTICATION:
      return 'This resource will help you understand authentication security best practices to prevent unauthorized access.';
    
    case AlertType.AUTHORIZATION:
      return 'Learn about proper authorization controls to prevent privilege escalation and unauthorized access.';
    
    case AlertType.RATE_LIMIT:
      return 'This guide explains rate limiting strategies to protect your system from abuse and denial of service.';
    
    case AlertType.INJECTION:
      return 'Understanding injection vulnerabilities is crucial to preventing attacks like this in the future.';
    
    case AlertType.FILE_UPLOAD:
      return 'This resource covers secure file upload handling to prevent malicious file uploads.';
    
    case AlertType.API_ABUSE:
      return 'Learn best practices for securing your APIs and preventing abuse.';
    
    case AlertType.HONEYPOT:
      return 'This guide explains how honeypots work and how to use them effectively for threat detection.';
    
    case AlertType.SYSTEM:
      return 'This resource covers general security best practices that can help improve your system security.';
    
    default:
      return 'This learning resource is relevant to the security alert you received.';
  }
}

/**
 * Generate a reason for an incident recommendation
 */
function generateRecommendationReasonForIncident(incident: SecurityIncident, resource: LearningResource): string {
  switch (incident.type) {
    case IncidentType.BRUTE_FORCE:
      return 'This resource will help you implement protections against brute force attacks and strengthen authentication.';
    
    case IncidentType.ACCOUNT_TAKEOVER:
      return 'Learn about advanced authentication methods and monitoring to prevent account takeovers.';
    
    case IncidentType.DATA_EXFILTRATION:
      return 'This guide covers techniques to detect and prevent unauthorized data access and exfiltration.';
    
    case IncidentType.API_ABUSE:
      return 'Learn best practices for API security, rate limiting, and monitoring to prevent abuse.';
    
    case IncidentType.SUSPICIOUS_ACTIVITY:
      return 'This resource explains how to implement behavior analytics to detect and respond to suspicious activities.';
    
    case IncidentType.FILE_UPLOAD_ABUSE:
      return 'Learn comprehensive techniques for secure file upload handling and validation.';
    
    case IncidentType.XSS_ATTEMPT:
      return 'This guide covers XSS prevention techniques and Content Security Policy implementation.';
    
    case IncidentType.SQL_INJECTION:
      return 'Learn about SQL injection prevention methods and secure database access patterns.';
    
    case IncidentType.HONEYPOT_TRIGGERED:
      return 'This resource explains how to analyze honeypot data and respond to potential threats.';
    
    case IncidentType.SYSTEM_MISCONFIGURATION:
      return 'Learn about security hardening best practices to prevent misconfiguration vulnerabilities.';
    
    default:
      return 'This learning resource is relevant to the security incident you are investigating.';
  }
}

/**
 * Get relevant topics for alert type
 */
function getTopicsForAlertType(alertType: AlertType): string[] {
  switch (alertType) {
    case AlertType.AUTHENTICATION:
      return ['authentication', 'passwords', 'brute-force', 'mfa', '2fa'];
    
    case AlertType.AUTHORIZATION:
      return ['authorization', 'access-control', 'privilege-escalation'];
    
    case AlertType.RATE_LIMIT:
      return ['rate-limiting', 'api', 'ddos', 'throttling'];
    
    case AlertType.INJECTION:
      return ['sql-injection', 'xss', 'injection', 'input-validation'];
    
    case AlertType.FILE_UPLOAD:
      return ['file-upload', 'validation', 'malware'];
    
    case AlertType.API_ABUSE:
      return ['api', 'api-keys', 'rate-limiting'];
    
    case AlertType.HONEYPOT:
      return ['honeypot', 'threat-detection'];
    
    case AlertType.SYSTEM:
      return ['monitoring', 'security', 'configuration'];
    
    default:
      return ['security', 'best-practices'];
  }
}

/**
 * Get relevant topics for incident type
 */
function getTopicsForIncidentType(incidentType: IncidentType): string[] {
  switch (incidentType) {
    case IncidentType.BRUTE_FORCE:
      return ['brute-force', 'authentication', 'passwords', 'rate-limiting'];
    
    case IncidentType.ACCOUNT_TAKEOVER:
      return ['authentication', 'mfa', '2fa', 'account-security'];
    
    case IncidentType.DATA_EXFILTRATION:
      return ['data-loss-prevention', 'monitoring', 'encryption'];
    
    case IncidentType.API_ABUSE:
      return ['api', 'api-keys', 'rate-limiting'];
    
    case IncidentType.SUSPICIOUS_ACTIVITY:
      return ['ueba', 'behavior-analytics', 'anomaly-detection'];
    
    case IncidentType.FILE_UPLOAD_ABUSE:
      return ['file-upload', 'validation', 'malware'];
    
    case IncidentType.XSS_ATTEMPT:
      return ['xss', 'csp', 'web-security'];
    
    case IncidentType.SQL_INJECTION:
      return ['sql-injection', 'database', 'parameterization'];
    
    case IncidentType.HONEYPOT_TRIGGERED:
      return ['honeypot', 'threat-detection', 'attack-analysis'];
    
    case IncidentType.SYSTEM_MISCONFIGURATION:
      return ['configuration', 'hardening', 'security-baseline'];
    
    default:
      return ['security', 'incident-response', 'best-practices'];
  }
}

// Initialize the module
initializeResources();