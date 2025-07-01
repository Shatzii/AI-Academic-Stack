import { 
  ComplianceStandard, 
  InsertComplianceStandard,
  Accommodation,
  InsertAccommodation,
  AssessmentRequirement,
  InsertAssessmentRequirement,
  ComplianceAudit,
  InsertComplianceAudit,
  StudentCompliancePlan,
  InsertStudentCompliancePlan,
  ComplianceReportTemplate,
  InsertComplianceReportTemplate
} from '../../shared/compliance-types';
import { z } from 'zod';

// Storage interface for compliance module
export interface IComplianceStorage {
  // Compliance Standards
  getComplianceStandards(): Promise<ComplianceStandard[]>;
  getComplianceStandardsByGrade(gradeLevel: string): Promise<ComplianceStandard[]>;
  getComplianceStandardsBySubject(subject: string): Promise<ComplianceStandard[]>;
  getComplianceStandardsByType(standardType: string): Promise<ComplianceStandard[]>;
  getComplianceStandard(id: number): Promise<ComplianceStandard | undefined>;
  createComplianceStandard(standard: InsertComplianceStandard): Promise<ComplianceStandard>;
  updateComplianceStandard(id: number, standard: Partial<InsertComplianceStandard>): Promise<ComplianceStandard | undefined>;
  deleteComplianceStandard(id: number): Promise<boolean>;

  // Accommodations
  getAccommodations(): Promise<Accommodation[]>;
  getAccommodationsByCategory(category: string): Promise<Accommodation[]>;
  getAccommodationsByGradeLevel(gradeLevel: string): Promise<Accommodation[]>;
  getAccommodation(id: number): Promise<Accommodation | undefined>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;
  updateAccommodation(id: number, accommodation: Partial<InsertAccommodation>): Promise<Accommodation | undefined>;
  deleteAccommodation(id: number): Promise<boolean>;

  // Assessment Requirements
  getAssessmentRequirements(): Promise<AssessmentRequirement[]>;
  getAssessmentRequirementsByGrade(gradeLevel: string): Promise<AssessmentRequirement[]>;
  getAssessmentRequirementsBySubject(subject: string): Promise<AssessmentRequirement[]>;
  getAssessmentRequirement(id: number): Promise<AssessmentRequirement | undefined>;
  createAssessmentRequirement(requirement: InsertAssessmentRequirement): Promise<AssessmentRequirement>;
  updateAssessmentRequirement(id: number, requirement: Partial<InsertAssessmentRequirement>): Promise<AssessmentRequirement | undefined>;
  deleteAssessmentRequirement(id: number): Promise<boolean>;

  // Compliance Audits
  getComplianceAudits(): Promise<ComplianceAudit[]>;
  getComplianceAuditsByCurriculum(curriculumPlanId: number): Promise<ComplianceAudit[]>;
  getComplianceAudit(id: number): Promise<ComplianceAudit | undefined>;
  createComplianceAudit(audit: InsertComplianceAudit): Promise<ComplianceAudit>;
  updateComplianceAudit(id: number, audit: Partial<InsertComplianceAudit>): Promise<ComplianceAudit | undefined>;
  deleteComplianceAudit(id: number): Promise<boolean>;

  // Student Compliance Plans
  getStudentCompliancePlans(): Promise<StudentCompliancePlan[]>;
  getStudentCompliancePlansByStudent(studentId: number): Promise<StudentCompliancePlan[]>;
  getStudentCompliancePlansByType(planType: string): Promise<StudentCompliancePlan[]>;
  getStudentCompliancePlan(id: number): Promise<StudentCompliancePlan | undefined>;
  createStudentCompliancePlan(plan: InsertStudentCompliancePlan): Promise<StudentCompliancePlan>;
  updateStudentCompliancePlan(id: number, plan: Partial<InsertStudentCompliancePlan>): Promise<StudentCompliancePlan | undefined>;
  deleteStudentCompliancePlan(id: number): Promise<boolean>;

  // Compliance Report Templates
  getComplianceReportTemplates(): Promise<ComplianceReportTemplate[]>;
  getComplianceReportTemplatesByType(reportType: string): Promise<ComplianceReportTemplate[]>;
  getComplianceReportTemplate(id: number): Promise<ComplianceReportTemplate | undefined>;
  createComplianceReportTemplate(template: InsertComplianceReportTemplate): Promise<ComplianceReportTemplate>;
  updateComplianceReportTemplate(id: number, template: Partial<InsertComplianceReportTemplate>): Promise<ComplianceReportTemplate | undefined>;
  deleteComplianceReportTemplate(id: number): Promise<boolean>;

  // Curriculum Compliance Analysis
  analyzeCurriculumCompliance(curriculumPlanId: number): Promise<{
    score: number;
    findings: any[];
    recommendations: any[];
    missingStandards: ComplianceStandard[];
  }>;

  // Student Plan Compliance Analysis
  analyzeStudentPlanCompliance(studentId: number, curriculumPlanId: number): Promise<{
    compliant: boolean;
    missingAccommodations: Accommodation[];
    recommendations: any[];
  }>;

  // Assessment Compliance Analysis
  analyzeAssessmentCompliance(assessmentId: number, studentId?: number): Promise<{
    compliant: boolean;
    requiredAccommodations: Accommodation[];
    notes: string;
  }>;

  // Generate Compliance Reports
  generateComplianceReport(templateId: number, entityId: number, entityType: string): Promise<{
    reportId: string;
    reportData: any;
    generatedAt: Date;
    compliant: boolean;
  }>;
}

// Implementation of compliance module for in-memory storage
export class ComplianceMemStorage implements IComplianceStorage {
  private complianceStandards: Map<number, ComplianceStandard>;
  private accommodations: Map<number, Accommodation>;
  private assessmentRequirements: Map<number, AssessmentRequirement>;
  private complianceAudits: Map<number, ComplianceAudit>;
  private studentCompliancePlans: Map<number, StudentCompliancePlan>;
  private complianceReportTemplates: Map<number, ComplianceReportTemplate>;

  private standardCurrentId: number;
  private accommodationCurrentId: number;
  private assessmentRequirementCurrentId: number;
  private auditCurrentId: number;
  private planCurrentId: number;
  private templateCurrentId: number;

  constructor() {
    this.complianceStandards = new Map();
    this.accommodations = new Map();
    this.assessmentRequirements = new Map();
    this.complianceAudits = new Map();
    this.studentCompliancePlans = new Map();
    this.complianceReportTemplates = new Map();

    this.standardCurrentId = 1;
    this.accommodationCurrentId = 1;
    this.assessmentRequirementCurrentId = 1;
    this.auditCurrentId = 1;
    this.planCurrentId = 1;
    this.templateCurrentId = 1;

    // Initialize with some sample data
    this.initDefaultComplianceData();
  }

  private async initDefaultComplianceData() {
    // Sample compliance standards for demonstration
    await this.createComplianceStandard({
      standardName: "Common Core Math K-5",
      standardType: "Federal",
      description: "Common Core State Standards for Mathematics, Grades K-5",
      gradeLevel: "K-5",
      subject: "Mathematics",
      requirements: [
        "Number recognition and counting",
        "Basic addition and subtraction",
        "Place value understanding",
        "Measurement concepts",
        "Geometric shape recognition"
      ],
      active: true
    });

    await this.createComplianceStandard({
      standardName: "Next Generation Science Standards",
      standardType: "Federal",
      description: "NGSS standards for K-12 science education",
      gradeLevel: "K-12",
      subject: "Science",
      requirements: [
        "Scientific inquiry skills",
        "Physical sciences fundamentals",
        "Life sciences fundamentals",
        "Earth and space sciences basics",
        "Engineering principles"
      ],
      active: true
    });

    // Sample accommodations
    await this.createAccommodation({
      name: "Extended Time",
      category: "Testing",
      description: "Provide 1.5x or 2x the standard time for tests and assessments",
      applicableGradeLevels: ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      implementationDetails: "Allow student to take 50% or 100% more time than standard time limits for quizzes, tests, and assessments",
      active: true
    });

    await this.createAccommodation({
      name: "Text-to-Speech",
      category: "Reading",
      description: "Provide text-to-speech technology for reading assignments and assessments",
      applicableGradeLevels: ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      implementationDetails: "Use text-to-speech software or devices to read text aloud to student. For digital content, ensure compatibility with screen readers.",
      active: true
    });

    // Sample assessment requirements
    await this.createAssessmentRequirement({
      assessmentName: "Annual Math Proficiency Test",
      gradeLevel: "3-8",
      subject: "Mathematics",
      frequency: "Annual",
      standardsLink: "Common Core Math Standards",
      accommodationsAllowed: true,
      accommodationTypes: ["Extended Time", "Calculator", "Small Group Setting"],
      stateRequired: true,
      federalRequired: true,
      active: true
    });

    // Sample report template
    await this.createComplianceReportTemplate({
      templateName: "IEP Compliance Review",
      description: "Template for reviewing IEP compliance with curriculum",
      reportType: "IEP",
      sections: [
        {
          name: "Student Information",
          fields: ["name", "grade", "teacher", "case_manager"]
        },
        {
          name: "Accommodations",
          fields: ["current_accommodations", "implementation_status"]
        },
        {
          name: "Goal Progress",
          fields: ["goals", "progress_metrics", "achievement_status"]
        }
      ],
      requiredFields: ["name", "grade", "current_accommodations", "goals"],
      active: true
    });
  }

  // Compliance Standards Implementation
  async getComplianceStandards(): Promise<ComplianceStandard[]> {
    return Array.from(this.complianceStandards.values());
  }

  async getComplianceStandardsByGrade(gradeLevel: string): Promise<ComplianceStandard[]> {
    return Array.from(this.complianceStandards.values()).filter(
      standard => {
        // Check if gradeLevel contains the provided grade level (like K-5 containing 3)
        // or is a direct match
        const gradeLevelStr = String(standard.gradeLevel);
        return gradeLevelStr.includes(gradeLevel) || gradeLevelStr === gradeLevel;
      }
    );
  }

  async getComplianceStandardsBySubject(subject: string): Promise<ComplianceStandard[]> {
    return Array.from(this.complianceStandards.values()).filter(
      standard => standard.subject === subject
    );
  }

  async getComplianceStandardsByType(standardType: string): Promise<ComplianceStandard[]> {
    return Array.from(this.complianceStandards.values()).filter(
      standard => standard.standardType === standardType
    );
  }

  async getComplianceStandard(id: number): Promise<ComplianceStandard | undefined> {
    return this.complianceStandards.get(id);
  }

  async createComplianceStandard(standard: InsertComplianceStandard): Promise<ComplianceStandard> {
    const id = this.standardCurrentId++;
    const newStandard: ComplianceStandard = {
      ...standard,
      id,
      active: standard.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.complianceStandards.set(id, newStandard);
    return newStandard;
  }

  async updateComplianceStandard(
    id: number,
    standard: Partial<InsertComplianceStandard>
  ): Promise<ComplianceStandard | undefined> {
    const existingStandard = this.complianceStandards.get(id);
    if (!existingStandard) return undefined;

    const updatedStandard = {
      ...existingStandard,
      ...standard,
      updatedAt: new Date()
    };

    this.complianceStandards.set(id, updatedStandard);
    return updatedStandard;
  }

  async deleteComplianceStandard(id: number): Promise<boolean> {
    return this.complianceStandards.delete(id);
  }

  // Accommodations Implementation
  async getAccommodations(): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values());
  }

  async getAccommodationsByCategory(category: string): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values()).filter(
      accommodation => accommodation.category === category
    );
  }

  async getAccommodationsByGradeLevel(gradeLevel: string): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values()).filter(
      accommodation => {
        // Safely handle the applicableGradeLevels which could be an array or string
        const applicableGradeLevels = accommodation.applicableGradeLevels;
        
        // Check if it's an array (as it should be)
        if (Array.isArray(applicableGradeLevels)) {
          return applicableGradeLevels.includes(gradeLevel);
        }
        
        // Fallback if it's a string
        return String(applicableGradeLevels).includes(gradeLevel);
      }
    );
  }

  async getAccommodation(id: number): Promise<Accommodation | undefined> {
    return this.accommodations.get(id);
  }

  async createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation> {
    const id = this.accommodationCurrentId++;
    const newAccommodation: Accommodation = {
      ...accommodation,
      id,
      active: accommodation.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.accommodations.set(id, newAccommodation);
    return newAccommodation;
  }

  async updateAccommodation(
    id: number,
    accommodation: Partial<InsertAccommodation>
  ): Promise<Accommodation | undefined> {
    const existingAccommodation = this.accommodations.get(id);
    if (!existingAccommodation) return undefined;

    const updatedAccommodation = {
      ...existingAccommodation,
      ...accommodation,
      updatedAt: new Date()
    };

    this.accommodations.set(id, updatedAccommodation);
    return updatedAccommodation;
  }

  async deleteAccommodation(id: number): Promise<boolean> {
    return this.accommodations.delete(id);
  }

  // Assessment Requirements Implementation
  async getAssessmentRequirements(): Promise<AssessmentRequirement[]> {
    return Array.from(this.assessmentRequirements.values());
  }

  async getAssessmentRequirementsByGrade(gradeLevel: string): Promise<AssessmentRequirement[]> {
    return Array.from(this.assessmentRequirements.values()).filter(
      requirement => {
        // Check if gradeLevel contains the provided grade level (like 3-8 containing 5)
        // or is a direct match
        const gradeLevelStr = String(requirement.gradeLevel);
        return gradeLevelStr.includes(gradeLevel) || gradeLevelStr === gradeLevel;
      }
    );
  }

  async getAssessmentRequirementsBySubject(subject: string): Promise<AssessmentRequirement[]> {
    return Array.from(this.assessmentRequirements.values()).filter(
      requirement => requirement.subject === subject
    );
  }

  async getAssessmentRequirement(id: number): Promise<AssessmentRequirement | undefined> {
    return this.assessmentRequirements.get(id);
  }

  async createAssessmentRequirement(requirement: InsertAssessmentRequirement): Promise<AssessmentRequirement> {
    const id = this.assessmentRequirementCurrentId++;
    const newRequirement: AssessmentRequirement = {
      ...requirement,
      id,
      active: requirement.active ?? true,
      accommodationsAllowed: requirement.accommodationsAllowed ?? true,
      accommodationTypes: requirement.accommodationTypes ?? [],
      stateRequired: requirement.stateRequired ?? false,
      federalRequired: requirement.federalRequired ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.assessmentRequirements.set(id, newRequirement);
    return newRequirement;
  }

  async updateAssessmentRequirement(
    id: number,
    requirement: Partial<InsertAssessmentRequirement>
  ): Promise<AssessmentRequirement | undefined> {
    const existingRequirement = this.assessmentRequirements.get(id);
    if (!existingRequirement) return undefined;

    const updatedRequirement = {
      ...existingRequirement,
      ...requirement,
      updatedAt: new Date()
    };

    this.assessmentRequirements.set(id, updatedRequirement);
    return updatedRequirement;
  }

  async deleteAssessmentRequirement(id: number): Promise<boolean> {
    return this.assessmentRequirements.delete(id);
  }

  // Compliance Audits Implementation
  async getComplianceAudits(): Promise<ComplianceAudit[]> {
    return Array.from(this.complianceAudits.values());
  }

  async getComplianceAuditsByCurriculum(curriculumPlanId: number): Promise<ComplianceAudit[]> {
    return Array.from(this.complianceAudits.values()).filter(
      audit => audit.curriculumPlanId === curriculumPlanId
    );
  }

  async getComplianceAudit(id: number): Promise<ComplianceAudit | undefined> {
    return this.complianceAudits.get(id);
  }

  async createComplianceAudit(audit: InsertComplianceAudit): Promise<ComplianceAudit> {
    const id = this.auditCurrentId++;
    const newAudit: ComplianceAudit = {
      ...audit,
      id,
      active: audit.active ?? true,
      auditDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.complianceAudits.set(id, newAudit);
    return newAudit;
  }

  async updateComplianceAudit(
    id: number,
    audit: Partial<InsertComplianceAudit>
  ): Promise<ComplianceAudit | undefined> {
    const existingAudit = this.complianceAudits.get(id);
    if (!existingAudit) return undefined;

    const updatedAudit = {
      ...existingAudit,
      ...audit,
      updatedAt: new Date()
    };

    this.complianceAudits.set(id, updatedAudit);
    return updatedAudit;
  }

  async deleteComplianceAudit(id: number): Promise<boolean> {
    return this.complianceAudits.delete(id);
  }

  // Student Compliance Plans Implementation
  async getStudentCompliancePlans(): Promise<StudentCompliancePlan[]> {
    return Array.from(this.studentCompliancePlans.values());
  }

  async getStudentCompliancePlansByStudent(studentId: number): Promise<StudentCompliancePlan[]> {
    return Array.from(this.studentCompliancePlans.values()).filter(
      plan => plan.studentId === studentId
    );
  }

  async getStudentCompliancePlansByType(planType: string): Promise<StudentCompliancePlan[]> {
    return Array.from(this.studentCompliancePlans.values()).filter(
      plan => plan.planType === planType
    );
  }

  async getStudentCompliancePlan(id: number): Promise<StudentCompliancePlan | undefined> {
    return this.studentCompliancePlans.get(id);
  }

  async createStudentCompliancePlan(plan: InsertStudentCompliancePlan): Promise<StudentCompliancePlan> {
    const id = this.planCurrentId++;
    const newPlan: StudentCompliancePlan = {
      ...plan,
      id,
      active: plan.active ?? true,
      progress: plan.progress ?? [],
      notes: plan.notes ?? null,
      endDate: plan.endDate ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.studentCompliancePlans.set(id, newPlan);
    return newPlan;
  }

  async updateStudentCompliancePlan(
    id: number,
    plan: Partial<InsertStudentCompliancePlan>
  ): Promise<StudentCompliancePlan | undefined> {
    const existingPlan = this.studentCompliancePlans.get(id);
    if (!existingPlan) return undefined;

    const updatedPlan = {
      ...existingPlan,
      ...plan,
      updatedAt: new Date()
    };

    this.studentCompliancePlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteStudentCompliancePlan(id: number): Promise<boolean> {
    return this.studentCompliancePlans.delete(id);
  }

  // Compliance Report Templates Implementation
  async getComplianceReportTemplates(): Promise<ComplianceReportTemplate[]> {
    return Array.from(this.complianceReportTemplates.values());
  }

  async getComplianceReportTemplatesByType(reportType: string): Promise<ComplianceReportTemplate[]> {
    return Array.from(this.complianceReportTemplates.values()).filter(
      template => template.reportType === reportType
    );
  }

  async getComplianceReportTemplate(id: number): Promise<ComplianceReportTemplate | undefined> {
    return this.complianceReportTemplates.get(id);
  }

  async createComplianceReportTemplate(template: InsertComplianceReportTemplate): Promise<ComplianceReportTemplate> {
    const id = this.templateCurrentId++;
    const newTemplate: ComplianceReportTemplate = {
      ...template,
      id,
      active: template.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.complianceReportTemplates.set(id, newTemplate);
    return newTemplate;
  }

  async updateComplianceReportTemplate(
    id: number,
    template: Partial<InsertComplianceReportTemplate>
  ): Promise<ComplianceReportTemplate | undefined> {
    const existingTemplate = this.complianceReportTemplates.get(id);
    if (!existingTemplate) return undefined;

    const updatedTemplate = {
      ...existingTemplate,
      ...template,
      updatedAt: new Date()
    };

    this.complianceReportTemplates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteComplianceReportTemplate(id: number): Promise<boolean> {
    return this.complianceReportTemplates.delete(id);
  }

  // Analysis Methods
  async analyzeCurriculumCompliance(curriculumPlanId: number): Promise<{
    score: number;
    findings: any[];
    recommendations: any[];
    missingStandards: ComplianceStandard[];
  }> {
    // In a real implementation, this would analyze the curriculum against standards
    // For now, we'll return sample data
    return {
      score: 85,
      findings: [
        {
          category: "Mathematics",
          standardId: 1,
          standardName: "Common Core Math K-5",
          status: "Partially Met",
          details: "Missing coverage of fractions and decimals"
        }
      ],
      recommendations: [
        {
          category: "Mathematics",
          description: "Add content on fractions and decimals to meet Common Core requirements",
          priority: "High",
          standardReference: "Common Core Math K-5, Section 3.2"
        }
      ],
      missingStandards: []
    };
  }

  async analyzeStudentPlanCompliance(studentId: number, curriculumPlanId: number): Promise<{
    compliant: boolean;
    missingAccommodations: Accommodation[];
    recommendations: any[];
  }> {
    // In a real implementation, this would analyze the student plan against the curriculum
    // For now, we'll return sample data
    return {
      compliant: true,
      missingAccommodations: [],
      recommendations: [
        {
          category: "Reading",
          description: "Consider adding additional visual supports for reading assignments",
          accommodationReference: "Visual Aids"
        }
      ]
    };
  }

  async analyzeAssessmentCompliance(assessmentId: number, studentId?: number): Promise<{
    compliant: boolean;
    requiredAccommodations: Accommodation[];
    notes: string;
  }> {
    // In a real implementation, this would analyze the assessment for compliance
    // For now, we'll return sample data
    return {
      compliant: true,
      requiredAccommodations: [],
      notes: "All required accommodations are available for this assessment"
    };
  }

  async generateComplianceReport(templateId: number, entityId: number, entityType: string): Promise<{
    reportId: string;
    reportData: any;
    generatedAt: Date;
    compliant: boolean;
  }> {
    // In a real implementation, this would generate a report based on the template
    // For now, we'll return sample data
    return {
      reportId: `${templateId}-${entityId}-${Date.now()}`,
      reportData: {
        title: "Compliance Report",
        entity: {
          id: entityId,
          type: entityType
        },
        sections: [
          {
            name: "Summary",
            content: "This curriculum meets 85% of required standards"
          },
          {
            name: "Findings",
            content: "Some minor adjustments needed in mathematics content"
          }
        ]
      },
      generatedAt: new Date(),
      compliant: true
    };
  }
}