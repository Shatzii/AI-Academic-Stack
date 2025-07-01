/**
 * Compliance Storage Fix
 * 
 * This module adds compliance methods to the main MemStorage class
 * for handling educational compliance data, such as IEPs, 504 plans,
 * curriculum standards, and assessment requirements.
 */

import { storage } from './storage';
import { ComplianceMemStorage, IComplianceStorage } from './storage/compliance-storage';

// Variable to track if the methods have been added already
let methodsAdded = false;

// Create an instance of the ComplianceMemStorage
const complianceStorage = new ComplianceMemStorage();

// Function to apply the missing methods to the storage instance
export function applyMissingComplianceMethods() {
  if (methodsAdded) {
    console.log("Compliance methods already added to storage");
    return;
  }

  // Add all the compliance storage methods to the main storage object
  // This allows the compliance module to be accessed through the main storage interface
  
  // Compliance Standards methods
  (storage as any).getComplianceStandards = complianceStorage.getComplianceStandards.bind(complianceStorage);
  (storage as any).getComplianceStandardsByGrade = complianceStorage.getComplianceStandardsByGrade.bind(complianceStorage);
  (storage as any).getComplianceStandardsBySubject = complianceStorage.getComplianceStandardsBySubject.bind(complianceStorage);
  (storage as any).getComplianceStandardsByType = complianceStorage.getComplianceStandardsByType.bind(complianceStorage);
  (storage as any).getComplianceStandard = complianceStorage.getComplianceStandard.bind(complianceStorage);
  (storage as any).createComplianceStandard = complianceStorage.createComplianceStandard.bind(complianceStorage);
  (storage as any).updateComplianceStandard = complianceStorage.updateComplianceStandard.bind(complianceStorage);
  (storage as any).deleteComplianceStandard = complianceStorage.deleteComplianceStandard.bind(complianceStorage);
  
  // Accommodations methods
  (storage as any).getAccommodations = complianceStorage.getAccommodations.bind(complianceStorage);
  (storage as any).getAccommodationsByCategory = complianceStorage.getAccommodationsByCategory.bind(complianceStorage);
  (storage as any).getAccommodationsByGradeLevel = complianceStorage.getAccommodationsByGradeLevel.bind(complianceStorage);
  (storage as any).getAccommodation = complianceStorage.getAccommodation.bind(complianceStorage);
  (storage as any).createAccommodation = complianceStorage.createAccommodation.bind(complianceStorage);
  (storage as any).updateAccommodation = complianceStorage.updateAccommodation.bind(complianceStorage);
  (storage as any).deleteAccommodation = complianceStorage.deleteAccommodation.bind(complianceStorage);
  
  // Assessment Requirements methods
  (storage as any).getAssessmentRequirements = complianceStorage.getAssessmentRequirements.bind(complianceStorage);
  (storage as any).getAssessmentRequirementsByGrade = complianceStorage.getAssessmentRequirementsByGrade.bind(complianceStorage);
  (storage as any).getAssessmentRequirementsBySubject = complianceStorage.getAssessmentRequirementsBySubject.bind(complianceStorage);
  (storage as any).getAssessmentRequirement = complianceStorage.getAssessmentRequirement.bind(complianceStorage);
  (storage as any).createAssessmentRequirement = complianceStorage.createAssessmentRequirement.bind(complianceStorage);
  (storage as any).updateAssessmentRequirement = complianceStorage.updateAssessmentRequirement.bind(complianceStorage);
  (storage as any).deleteAssessmentRequirement = complianceStorage.deleteAssessmentRequirement.bind(complianceStorage);
  
  // Compliance Audits methods
  (storage as any).getComplianceAudits = complianceStorage.getComplianceAudits.bind(complianceStorage);
  (storage as any).getComplianceAuditsByCurriculum = complianceStorage.getComplianceAuditsByCurriculum.bind(complianceStorage);
  (storage as any).getComplianceAudit = complianceStorage.getComplianceAudit.bind(complianceStorage);
  (storage as any).createComplianceAudit = complianceStorage.createComplianceAudit.bind(complianceStorage);
  (storage as any).updateComplianceAudit = complianceStorage.updateComplianceAudit.bind(complianceStorage);
  (storage as any).deleteComplianceAudit = complianceStorage.deleteComplianceAudit.bind(complianceStorage);
  
  // Student Compliance Plans methods
  (storage as any).getStudentCompliancePlans = complianceStorage.getStudentCompliancePlans.bind(complianceStorage);
  (storage as any).getStudentCompliancePlansByStudent = complianceStorage.getStudentCompliancePlansByStudent.bind(complianceStorage);
  (storage as any).getStudentCompliancePlansByType = complianceStorage.getStudentCompliancePlansByType.bind(complianceStorage);
  (storage as any).getStudentCompliancePlan = complianceStorage.getStudentCompliancePlan.bind(complianceStorage);
  (storage as any).createStudentCompliancePlan = complianceStorage.createStudentCompliancePlan.bind(complianceStorage);
  (storage as any).updateStudentCompliancePlan = complianceStorage.updateStudentCompliancePlan.bind(complianceStorage);
  (storage as any).deleteStudentCompliancePlan = complianceStorage.deleteStudentCompliancePlan.bind(complianceStorage);
  
  // Compliance Report Templates methods
  (storage as any).getComplianceReportTemplates = complianceStorage.getComplianceReportTemplates.bind(complianceStorage);
  (storage as any).getComplianceReportTemplatesByType = complianceStorage.getComplianceReportTemplatesByType.bind(complianceStorage);
  (storage as any).getComplianceReportTemplate = complianceStorage.getComplianceReportTemplate.bind(complianceStorage);
  (storage as any).createComplianceReportTemplate = complianceStorage.createComplianceReportTemplate.bind(complianceStorage);
  (storage as any).updateComplianceReportTemplate = complianceStorage.updateComplianceReportTemplate.bind(complianceStorage);
  (storage as any).deleteComplianceReportTemplate = complianceStorage.deleteComplianceReportTemplate.bind(complianceStorage);
  
  // Analysis methods
  (storage as any).analyzeCurriculumCompliance = complianceStorage.analyzeCurriculumCompliance.bind(complianceStorage);
  (storage as any).analyzeStudentPlanCompliance = complianceStorage.analyzeStudentPlanCompliance.bind(complianceStorage);
  (storage as any).analyzeAssessmentCompliance = complianceStorage.analyzeAssessmentCompliance.bind(complianceStorage);
  (storage as any).generateComplianceReport = complianceStorage.generateComplianceReport.bind(complianceStorage);
  
  methodsAdded = true;
  console.log("✅ Applied missing compliance methods to MemStorage");
}