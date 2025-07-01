/**
 * Sentinel 4.5 Security Compliance Framework
 * 
 * This module implements a comprehensive security compliance framework that maps
 * security controls to common standards (GDPR, HIPAA, SOC2, etc.) to assist
 * with regulatory requirements.
 */

import { logSecurityEvent, logAuditEvent } from './audit-log';
import { getSecuritySettings } from './config';

// Compliance standard
export enum ComplianceStandard {
  GDPR = 'gdpr',
  HIPAA = 'hipaa',
  PCI_DSS = 'pci_dss',
  SOC2 = 'soc2',
  ISO_27001 = 'iso_27001',
  NIST_800_53 = 'nist_800_53',
  CCPA = 'ccpa',
  FERPA = 'ferpa'
}

// Compliance control status
export enum ControlStatus {
  IMPLEMENTED = 'implemented',
  PARTIALLY_IMPLEMENTED = 'partially_implemented',
  NOT_IMPLEMENTED = 'not_implemented',
  NOT_APPLICABLE = 'not_applicable',
  PLANNED = 'planned'
}

// Control category
export enum ControlCategory {
  ACCESS_CONTROL = 'access_control',
  IDENTIFICATION_AND_AUTHENTICATION = 'identification_and_authentication',
  AUDIT_AND_ACCOUNTABILITY = 'audit_and_accountability',
  CONFIGURATION_MANAGEMENT = 'configuration_management',
  INCIDENT_RESPONSE = 'incident_response',
  RISK_ASSESSMENT = 'risk_assessment',
  SYSTEM_AND_COMMUNICATIONS_PROTECTION = 'system_and_communications_protection',
  SYSTEM_AND_INFORMATION_INTEGRITY = 'system_and_information_integrity',
  DATA_PROTECTION = 'data_protection',
  SECURITY_ASSESSMENT = 'security_assessment'
}

// Security control
export interface SecurityControl {
  id: string;
  name: string;
  description: string;
  category: ControlCategory;
  status: ControlStatus;
  evidence?: string;
  notes?: string;
  implementedBy?: string;
  implementedAt?: number;
  lastReviewed?: number;
  reviewedBy?: string;
  nextReviewDate?: number;
}

// Compliance mapping
export interface ComplianceMapping {
  standard: ComplianceStandard;
  version: string;
  section: string;
  requirement: string;
  controlIds: string[];
}

// Compliance report
export interface ComplianceReport {
  id: string;
  standard: ComplianceStandard;
  timestamp: number;
  generatedBy: string;
  overallCompliance: number; // Percentage (0-100)
  categorySummary: Record<ControlCategory, {
    total: number;
    implemented: number;
    partiallyImplemented: number;
    notImplemented: number;
    notApplicable: number;
    compliance: number; // Percentage (0-100)
  }>;
  requirementSummary: Record<string, {
    requirement: string;
    status: ControlStatus;
    controlIds: string[];
    notes?: string;
  }>;
  recommendations: Array<{
    section: string;
    requirement: string;
    priority: 'high' | 'medium' | 'low';
    action: string;
  }>;
}

// Store security controls
const securityControls: Map<string, SecurityControl> = new Map();

// Store compliance mappings
const complianceMappings: ComplianceMapping[] = [];

// Store compliance reports
const complianceReports: Map<string, ComplianceReport> = new Map();

// Initialize the compliance framework with default controls and mappings
export function initComplianceFramework(): void {
  // Initialize default security controls
  initializeSecurityControls();
  
  // Initialize compliance mappings
  initializeComplianceMappings();
  
  console.log('Compliance Framework initialized');
}

/**
 * Initialize default security controls
 */
function initializeSecurityControls(): void {
  // Access Control
  addSecurityControl({
    id: 'AC-1',
    name: 'Access Control Policy',
    description: 'Establish and maintain an access control policy',
    category: ControlCategory.ACCESS_CONTROL,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'AC-2',
    name: 'Account Management',
    description: 'Establish account creation, modification, enabling, disabling, and removal procedures',
    category: ControlCategory.ACCESS_CONTROL,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'AC-3',
    name: 'Access Enforcement',
    description: 'Enforce approved authorizations for accessing the system',
    category: ControlCategory.ACCESS_CONTROL,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'AC-4',
    name: 'Information Flow Enforcement',
    description: 'Enforce approved authorizations for controlling information flow',
    category: ControlCategory.ACCESS_CONTROL,
    status: ControlStatus.PARTIALLY_IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'AC-5',
    name: 'Separation of Duties',
    description: 'Separate duties of individuals to prevent malicious activity',
    category: ControlCategory.ACCESS_CONTROL,
    status: ControlStatus.IMPLEMENTED
  });
  
  // Identification and Authentication
  addSecurityControl({
    id: 'IA-1',
    name: 'Identification and Authentication Policy',
    description: 'Establish and maintain an identification and authentication policy',
    category: ControlCategory.IDENTIFICATION_AND_AUTHENTICATION,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'IA-2',
    name: 'User Identification and Authentication',
    description: 'Uniquely identify and authenticate users',
    category: ControlCategory.IDENTIFICATION_AND_AUTHENTICATION,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'IA-3',
    name: 'Multi-Factor Authentication',
    description: 'Implement multi-factor authentication for access to privileged accounts',
    category: ControlCategory.IDENTIFICATION_AND_AUTHENTICATION,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'IA-4',
    name: 'Identifier Management',
    description: 'Manage system identifiers for users and devices',
    category: ControlCategory.IDENTIFICATION_AND_AUTHENTICATION,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'IA-5',
    name: 'Authenticator Management',
    description: 'Manage system authenticators, including passwords',
    category: ControlCategory.IDENTIFICATION_AND_AUTHENTICATION,
    status: ControlStatus.IMPLEMENTED
  });
  
  // Audit and Accountability
  addSecurityControl({
    id: 'AU-1',
    name: 'Audit and Accountability Policy',
    description: 'Establish and maintain an audit and accountability policy',
    category: ControlCategory.AUDIT_AND_ACCOUNTABILITY,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'AU-2',
    name: 'Audit Events',
    description: 'Determine events to be audited and implement audit logging',
    category: ControlCategory.AUDIT_AND_ACCOUNTABILITY,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'AU-3',
    name: 'Content of Audit Records',
    description: 'Ensure audit records contain sufficient information',
    category: ControlCategory.AUDIT_AND_ACCOUNTABILITY,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'AU-4',
    name: 'Audit Storage Capacity',
    description: 'Allocate sufficient audit record storage capacity',
    category: ControlCategory.AUDIT_AND_ACCOUNTABILITY,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'AU-5',
    name: 'Response to Audit Processing Failures',
    description: 'Alert personnel in the event of an audit processing failure',
    category: ControlCategory.AUDIT_AND_ACCOUNTABILITY,
    status: ControlStatus.IMPLEMENTED
  });
  
  // Data Protection
  addSecurityControl({
    id: 'DP-1',
    name: 'Data Protection Policy',
    description: 'Establish and maintain a data protection policy',
    category: ControlCategory.DATA_PROTECTION,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'DP-2',
    name: 'Data Classification',
    description: 'Classify data based on sensitivity and implement appropriate controls',
    category: ControlCategory.DATA_PROTECTION,
    status: ControlStatus.PARTIALLY_IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'DP-3',
    name: 'Data Encryption at Rest',
    description: 'Encrypt sensitive data at rest',
    category: ControlCategory.DATA_PROTECTION,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'DP-4',
    name: 'Data Encryption in Transit',
    description: 'Encrypt sensitive data in transit',
    category: ControlCategory.DATA_PROTECTION,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'DP-5',
    name: 'Data Retention and Disposal',
    description: 'Implement data retention and secure disposal procedures',
    category: ControlCategory.DATA_PROTECTION,
    status: ControlStatus.PARTIALLY_IMPLEMENTED
  });
  
  // Incident Response
  addSecurityControl({
    id: 'IR-1',
    name: 'Incident Response Policy',
    description: 'Establish and maintain an incident response policy',
    category: ControlCategory.INCIDENT_RESPONSE,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'IR-2',
    name: 'Incident Response Training',
    description: 'Provide incident response training to system users',
    category: ControlCategory.INCIDENT_RESPONSE,
    status: ControlStatus.PARTIALLY_IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'IR-3',
    name: 'Incident Response Testing',
    description: 'Test the incident response capability',
    category: ControlCategory.INCIDENT_RESPONSE,
    status: ControlStatus.PLANNED
  });
  
  addSecurityControl({
    id: 'IR-4',
    name: 'Incident Handling',
    description: 'Implement an incident handling capability',
    category: ControlCategory.INCIDENT_RESPONSE,
    status: ControlStatus.IMPLEMENTED
  });
  
  addSecurityControl({
    id: 'IR-5',
    name: 'Incident Monitoring',
    description: 'Track and document information system security incidents',
    category: ControlCategory.INCIDENT_RESPONSE,
    status: ControlStatus.IMPLEMENTED
  });
  
  // Add more controls for other categories...
}

/**
 * Initialize compliance mappings
 */
function initializeComplianceMappings(): void {
  // GDPR Mappings
  complianceMappings.push({
    standard: ComplianceStandard.GDPR,
    version: '2016',
    section: 'Article 5',
    requirement: 'Principles relating to processing of personal data',
    controlIds: ['DP-1', 'DP-2', 'DP-5']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.GDPR,
    version: '2016',
    section: 'Article 25',
    requirement: 'Data protection by design and by default',
    controlIds: ['DP-1', 'DP-2', 'DP-3', 'DP-4']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.GDPR,
    version: '2016',
    section: 'Article 30',
    requirement: 'Records of processing activities',
    controlIds: ['AU-2', 'AU-3', 'AU-4']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.GDPR,
    version: '2016',
    section: 'Article 32',
    requirement: 'Security of processing',
    controlIds: ['AC-1', 'AC-3', 'DP-3', 'DP-4', 'IA-3', 'IA-5']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.GDPR,
    version: '2016',
    section: 'Article 33',
    requirement: 'Notification of a personal data breach',
    controlIds: ['IR-1', 'IR-4', 'IR-5']
  });
  
  // HIPAA Mappings
  complianceMappings.push({
    standard: ComplianceStandard.HIPAA,
    version: '2013',
    section: '164.308(a)(1)',
    requirement: 'Security Management Process',
    controlIds: ['AC-1', 'DP-1', 'IR-1']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.HIPAA,
    version: '2013',
    section: '164.308(a)(3)',
    requirement: 'Workforce Security',
    controlIds: ['AC-2', 'AC-5', 'IA-1']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.HIPAA,
    version: '2013',
    section: '164.308(a)(4)',
    requirement: 'Information Access Management',
    controlIds: ['AC-2', 'AC-3', 'AC-4']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.HIPAA,
    version: '2013',
    section: '164.308(a)(5)',
    requirement: 'Security Awareness and Training',
    controlIds: ['IR-2']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.HIPAA,
    version: '2013',
    section: '164.308(a)(6)',
    requirement: 'Security Incident Procedures',
    controlIds: ['IR-1', 'IR-4', 'IR-5']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.HIPAA,
    version: '2013',
    section: '164.312(a)(1)',
    requirement: 'Access Control',
    controlIds: ['AC-1', 'AC-2', 'AC-3', 'IA-2', 'IA-3']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.HIPAA,
    version: '2013',
    section: '164.312(a)(2)(i)',
    requirement: 'Unique User Identification',
    controlIds: ['IA-2', 'IA-4']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.HIPAA,
    version: '2013',
    section: '164.312(a)(2)(iv)',
    requirement: 'Encryption and Decryption',
    controlIds: ['DP-3', 'DP-4']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.HIPAA,
    version: '2013',
    section: '164.312(b)',
    requirement: 'Audit Controls',
    controlIds: ['AU-1', 'AU-2', 'AU-3', 'AU-4', 'AU-5']
  });
  
  // SOC 2 Mappings
  complianceMappings.push({
    standard: ComplianceStandard.SOC2,
    version: '2017',
    section: 'CC5.1',
    requirement: 'Logical Access Security',
    controlIds: ['AC-1', 'AC-2', 'AC-3', 'IA-1', 'IA-2', 'IA-3', 'IA-4', 'IA-5']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.SOC2,
    version: '2017',
    section: 'CC5.2',
    requirement: 'System Operations',
    controlIds: ['AU-1', 'AU-2', 'AU-3', 'AU-4', 'AU-5']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.SOC2,
    version: '2017',
    section: 'CC6.1',
    requirement: 'System Vulnerability Management',
    controlIds: ['AC-3', 'AC-4', 'DP-3', 'DP-4']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.SOC2,
    version: '2017',
    section: 'CC7.3',
    requirement: 'Incident Identification and Response',
    controlIds: ['IR-1', 'IR-2', 'IR-3', 'IR-4', 'IR-5']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.SOC2,
    version: '2017',
    section: 'CC7.4',
    requirement: 'Data Backup and Recovery',
    controlIds: ['DP-1', 'DP-3', 'DP-5']
  });
  
  // PCI DSS Mappings
  complianceMappings.push({
    standard: ComplianceStandard.PCI_DSS,
    version: '3.2.1',
    section: 'Requirement 3',
    requirement: 'Protect stored cardholder data',
    controlIds: ['DP-1', 'DP-2', 'DP-3', 'DP-5']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.PCI_DSS,
    version: '3.2.1',
    section: 'Requirement 4',
    requirement: 'Encrypt transmission of cardholder data',
    controlIds: ['DP-4']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.PCI_DSS,
    version: '3.2.1',
    section: 'Requirement 7',
    requirement: 'Restrict access to cardholder data',
    controlIds: ['AC-1', 'AC-2', 'AC-3', 'AC-5']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.PCI_DSS,
    version: '3.2.1',
    section: 'Requirement 8',
    requirement: 'Identify and authenticate access to system components',
    controlIds: ['IA-1', 'IA-2', 'IA-3', 'IA-4', 'IA-5']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.PCI_DSS,
    version: '3.2.1',
    section: 'Requirement 10',
    requirement: 'Track and monitor access to network resources and cardholder data',
    controlIds: ['AU-1', 'AU-2', 'AU-3', 'AU-4', 'AU-5']
  });
  
  complianceMappings.push({
    standard: ComplianceStandard.PCI_DSS,
    version: '3.2.1',
    section: 'Requirement 12.10',
    requirement: 'Implement an incident response plan',
    controlIds: ['IR-1', 'IR-2', 'IR-3', 'IR-4', 'IR-5']
  });
}

/**
 * Add a security control
 */
function addSecurityControl(control: SecurityControl): void {
  securityControls.set(control.id, control);
}

/**
 * Get all security controls
 */
export function getAllSecurityControls(
  filter?: {
    category?: ControlCategory;
    status?: ControlStatus;
  }
): SecurityControl[] {
  let controls = Array.from(securityControls.values());
  
  // Apply filters if provided
  if (filter) {
    if (filter.category) {
      controls = controls.filter(c => c.category === filter.category);
    }
    
    if (filter.status) {
      controls = controls.filter(c => c.status === filter.status);
    }
  }
  
  return controls;
}

/**
 * Get a specific security control
 */
export function getSecurityControl(controlId: string): SecurityControl | undefined {
  return securityControls.get(controlId);
}

/**
 * Update security control status
 */
export function updateSecurityControl(
  controlId: string,
  updates: Partial<SecurityControl>,
  updatedBy: string
): boolean {
  const control = securityControls.get(controlId);
  if (!control) return false;
  
  // Update status fields
  if (updates.status) {
    control.status = updates.status;
    
    if (updates.status === ControlStatus.IMPLEMENTED) {
      control.implementedBy = updatedBy;
      control.implementedAt = Date.now();
    }
  }
  
  // Update evidence and notes
  if (updates.evidence) control.evidence = updates.evidence;
  if (updates.notes) control.notes = updates.notes;
  
  // Update review information
  control.lastReviewed = Date.now();
  control.reviewedBy = updatedBy;
  
  // Set next review date (default to 1 year from now)
  control.nextReviewDate = Date.now() + (365 * 24 * 60 * 60 * 1000);
  
  // Save the updated control
  securityControls.set(controlId, control);
  
  // Log the update
  logAuditEvent(
    updatedBy,
    'Security control updated',
    {
      controlId,
      status: control.status,
      category: control.category,
      evidence: control.evidence
    },
    'system'
  );
  
  return true;
}

/**
 * Get compliance mappings for a specific standard
 */
export function getComplianceMappings(standard: ComplianceStandard): ComplianceMapping[] {
  return complianceMappings.filter(mapping => mapping.standard === standard);
}

/**
 * Get compliance status for a specific standard
 */
export function getComplianceStatus(standard: ComplianceStandard): {
  standard: ComplianceStandard;
  version: string;
  overallCompliance: number;
  requirementStatus: Record<string, {
    section: string;
    requirement: string;
    status: ControlStatus;
    compliancePercentage: number;
    controls: Array<{
      id: string;
      name: string;
      status: ControlStatus;
    }>;
  }>;
} {
  // Get mappings for this standard
  const mappings = getComplianceMappings(standard);
  
  // Initialize requirement status
  const requirementStatus: Record<string, {
    section: string;
    requirement: string;
    status: ControlStatus;
    compliancePercentage: number;
    controls: Array<{
      id: string;
      name: string;
      status: ControlStatus;
    }>;
  }> = {};
  
  // Calculate compliance for each requirement
  for (const mapping of mappings) {
    const controls: Array<{
      id: string;
      name: string;
      status: ControlStatus;
    }> = [];
    
    let implementedCount = 0;
    let partialCount = 0;
    let totalCount = 0;
    
    // Check each control in the mapping
    for (const controlId of mapping.controlIds) {
      const control = securityControls.get(controlId);
      
      if (control) {
        controls.push({
          id: control.id,
          name: control.name,
          status: control.status
        });
        
        totalCount++;
        
        if (control.status === ControlStatus.IMPLEMENTED) {
          implementedCount++;
        } else if (control.status === ControlStatus.PARTIALLY_IMPLEMENTED) {
          partialCount++;
        }
      }
    }
    
    // Calculate compliance percentage
    const compliancePercentage = totalCount === 0 ? 0 :
      ((implementedCount + (partialCount * 0.5)) / totalCount) * 100;
    
    // Determine overall status
    let status: ControlStatus;
    if (compliancePercentage === 100) {
      status = ControlStatus.IMPLEMENTED;
    } else if (compliancePercentage >= 50) {
      status = ControlStatus.PARTIALLY_IMPLEMENTED;
    } else if (compliancePercentage > 0) {
      status = ControlStatus.PLANNED;
    } else {
      status = ControlStatus.NOT_IMPLEMENTED;
    }
    
    // Store requirement status
    requirementStatus[mapping.section] = {
      section: mapping.section,
      requirement: mapping.requirement,
      status,
      compliancePercentage,
      controls
    };
  }
  
  // Calculate overall compliance
  let totalPercentage = 0;
  const requirementCount = Object.keys(requirementStatus).length;
  
  for (const key in requirementStatus) {
    totalPercentage += requirementStatus[key].compliancePercentage;
  }
  
  const overallCompliance = requirementCount === 0 ? 0 :
    totalPercentage / requirementCount;
  
  // Get standard version
  const version = mappings.length > 0 ? mappings[0].version : '';
  
  return {
    standard,
    version,
    overallCompliance,
    requirementStatus
  };
}

/**
 * Generate a compliance report
 */
export function generateComplianceReport(
  standard: ComplianceStandard,
  generatedBy: string
): ComplianceReport {
  // Get compliance status
  const complianceStatus = getComplianceStatus(standard);
  
  // Generate report ID
  const reportId = `report-${standard}-${Date.now()}`;
  
  // Initialize category summary
  const categorySummary: Record<ControlCategory, {
    total: number;
    implemented: number;
    partiallyImplemented: number;
    notImplemented: number;
    notApplicable: number;
    compliance: number;
  }> = {} as any;
  
  // Initialize all categories
  for (const category of Object.values(ControlCategory)) {
    categorySummary[category] = {
      total: 0,
      implemented: 0,
      partiallyImplemented: 0,
      notImplemented: 0,
      notApplicable: 0,
      compliance: 0
    };
  }
  
  // Get all controls for this standard
  const standardMappings = getComplianceMappings(standard);
  const controlIds = new Set<string>();
  
  for (const mapping of standardMappings) {
    for (const controlId of mapping.controlIds) {
      controlIds.add(controlId);
    }
  }
  
  // Calculate category summary
  for (const controlId of controlIds) {
    const control = securityControls.get(controlId);
    if (!control) continue;
    
    const categoryStat = categorySummary[control.category];
    categoryStat.total++;
    
    switch (control.status) {
      case ControlStatus.IMPLEMENTED:
        categoryStat.implemented++;
        break;
      case ControlStatus.PARTIALLY_IMPLEMENTED:
        categoryStat.partiallyImplemented++;
        break;
      case ControlStatus.NOT_IMPLEMENTED:
        categoryStat.notImplemented++;
        break;
      case ControlStatus.NOT_APPLICABLE:
        categoryStat.notApplicable++;
        break;
    }
  }
  
  // Calculate compliance for each category
  for (const category in categorySummary) {
    const stats = categorySummary[category as ControlCategory];
    
    if (stats.total === 0) {
      stats.compliance = 0;
    } else {
      stats.compliance = ((stats.implemented + (stats.partiallyImplemented * 0.5)) / stats.total) * 100;
    }
  }
  
  // Generate requirement summary
  const requirementSummary: Record<string, {
    requirement: string;
    status: ControlStatus;
    controlIds: string[];
    notes?: string;
  }> = {};
  
  for (const section in complianceStatus.requirementStatus) {
    const requirement = complianceStatus.requirementStatus[section];
    
    requirementSummary[section] = {
      requirement: requirement.requirement,
      status: requirement.status,
      controlIds: requirement.controls.map(c => c.id)
    };
  }
  
  // Generate recommendations
  const recommendations: Array<{
    section: string;
    requirement: string;
    priority: 'high' | 'medium' | 'low';
    action: string;
  }> = [];
  
  for (const section in complianceStatus.requirementStatus) {
    const requirement = complianceStatus.requirementStatus[section];
    
    if (requirement.status !== ControlStatus.IMPLEMENTED) {
      // Generate recommendation based on status
      const notImplementedControls = requirement.controls.filter(c => c.status !== ControlStatus.IMPLEMENTED);
      
      if (notImplementedControls.length > 0) {
        // Determine priority
        let priority: 'high' | 'medium' | 'low';
        
        if (requirement.status === ControlStatus.NOT_IMPLEMENTED) {
          priority = 'high';
        } else if (requirement.compliancePercentage < 50) {
          priority = 'high';
        } else {
          priority = 'medium';
        }
        
        // Generate recommendation
        recommendations.push({
          section,
          requirement: requirement.requirement,
          priority,
          action: `Implement ${notImplementedControls.map(c => c.name).join(', ')} to fully comply with ${section}`
        });
      }
    }
  }
  
  // Create the report
  const report: ComplianceReport = {
    id: reportId,
    standard,
    timestamp: Date.now(),
    generatedBy,
    overallCompliance: complianceStatus.overallCompliance,
    categorySummary,
    requirementSummary,
    recommendations
  };
  
  // Store the report
  complianceReports.set(reportId, report);
  
  // Log report generation
  logAuditEvent(
    generatedBy,
    'Compliance report generated',
    {
      reportId,
      standard,
      overallCompliance: complianceStatus.overallCompliance.toFixed(2) + '%'
    },
    'system'
  );
  
  return report;
}

/**
 * Get a compliance report
 */
export function getComplianceReport(reportId: string): ComplianceReport | undefined {
  return complianceReports.get(reportId);
}

/**
 * Get all compliance reports
 */
export function getAllComplianceReports(): ComplianceReport[] {
  return Array.from(complianceReports.values());
}

/**
 * Get the most recent compliance report for a standard
 */
export function getLatestComplianceReport(standard: ComplianceStandard): ComplianceReport | undefined {
  const reports = Array.from(complianceReports.values())
    .filter(report => report.standard === standard)
    .sort((a, b) => b.timestamp - a.timestamp);
  
  return reports.length > 0 ? reports[0] : undefined;
}