import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { 
  insertComplianceStandardSchema,
  insertAccommodationSchema,
  insertAssessmentRequirementSchema,
  insertComplianceAuditSchema,
  insertStudentCompliancePlanSchema,
  insertComplianceReportTemplateSchema
} from '../../shared/compliance-types';
import { ComplianceMemStorage } from '../storage/compliance-storage';

const router = Router();

// Initialize the compliance storage
const complianceStorage = new ComplianceMemStorage();

// Compliance Standards Routes
router.get('/standards', async (req: Request, res: Response) => {
  try {
    const standards = await complianceStorage.getComplianceStandards();
    res.status(200).json(standards);
  } catch (error) {
    console.error('Error fetching compliance standards:', error);
    res.status(500).json({ error: 'Failed to fetch compliance standards' });
  }
});

router.get('/standards/grade/:gradeLevel', async (req: Request, res: Response) => {
  try {
    const { gradeLevel } = req.params;
    const standards = await complianceStorage.getComplianceStandardsByGrade(gradeLevel);
    res.status(200).json(standards);
  } catch (error) {
    console.error('Error fetching compliance standards by grade:', error);
    res.status(500).json({ error: 'Failed to fetch compliance standards by grade' });
  }
});

router.get('/standards/subject/:subject', async (req: Request, res: Response) => {
  try {
    const { subject } = req.params;
    const standards = await complianceStorage.getComplianceStandardsBySubject(subject);
    res.status(200).json(standards);
  } catch (error) {
    console.error('Error fetching compliance standards by subject:', error);
    res.status(500).json({ error: 'Failed to fetch compliance standards by subject' });
  }
});

router.get('/standards/type/:standardType', async (req: Request, res: Response) => {
  try {
    const { standardType } = req.params;
    const standards = await complianceStorage.getComplianceStandardsByType(standardType);
    res.status(200).json(standards);
  } catch (error) {
    console.error('Error fetching compliance standards by type:', error);
    res.status(500).json({ error: 'Failed to fetch compliance standards by type' });
  }
});

router.get('/standards/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const standard = await complianceStorage.getComplianceStandard(id);
    if (!standard) {
      return res.status(404).json({ error: 'Standard not found' });
    }
    
    res.status(200).json(standard);
  } catch (error) {
    console.error('Error fetching compliance standard:', error);
    res.status(500).json({ error: 'Failed to fetch compliance standard' });
  }
});

router.post('/standards', async (req: Request, res: Response) => {
  try {
    const validatedData = insertComplianceStandardSchema.parse(req.body);
    const standard = await complianceStorage.createComplianceStandard(validatedData);
    res.status(201).json(standard);
  } catch (error) {
    console.error('Error creating compliance standard:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create compliance standard' });
  }
});

router.patch('/standards/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const validatedData = insertComplianceStandardSchema.partial().parse(req.body);
    const standard = await complianceStorage.updateComplianceStandard(id, validatedData);
    
    if (!standard) {
      return res.status(404).json({ error: 'Standard not found' });
    }
    
    res.status(200).json(standard);
  } catch (error) {
    console.error('Error updating compliance standard:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update compliance standard' });
  }
});

router.delete('/standards/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const deleted = await complianceStorage.deleteComplianceStandard(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Standard not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting compliance standard:', error);
    res.status(500).json({ error: 'Failed to delete compliance standard' });
  }
});

// Accommodation Routes
router.get('/accommodations', async (req: Request, res: Response) => {
  try {
    const accommodations = await complianceStorage.getAccommodations();
    res.status(200).json(accommodations);
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    res.status(500).json({ error: 'Failed to fetch accommodations' });
  }
});

router.get('/accommodations/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const accommodations = await complianceStorage.getAccommodationsByCategory(category);
    res.status(200).json(accommodations);
  } catch (error) {
    console.error('Error fetching accommodations by category:', error);
    res.status(500).json({ error: 'Failed to fetch accommodations by category' });
  }
});

router.get('/accommodations/grade/:gradeLevel', async (req: Request, res: Response) => {
  try {
    const { gradeLevel } = req.params;
    const accommodations = await complianceStorage.getAccommodationsByGradeLevel(gradeLevel);
    res.status(200).json(accommodations);
  } catch (error) {
    console.error('Error fetching accommodations by grade level:', error);
    res.status(500).json({ error: 'Failed to fetch accommodations by grade level' });
  }
});

router.get('/accommodations/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const accommodation = await complianceStorage.getAccommodation(id);
    if (!accommodation) {
      return res.status(404).json({ error: 'Accommodation not found' });
    }
    
    res.status(200).json(accommodation);
  } catch (error) {
    console.error('Error fetching accommodation:', error);
    res.status(500).json({ error: 'Failed to fetch accommodation' });
  }
});

router.post('/accommodations', async (req: Request, res: Response) => {
  try {
    const validatedData = insertAccommodationSchema.parse(req.body);
    const accommodation = await complianceStorage.createAccommodation(validatedData);
    res.status(201).json(accommodation);
  } catch (error) {
    console.error('Error creating accommodation:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create accommodation' });
  }
});

router.patch('/accommodations/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const validatedData = insertAccommodationSchema.partial().parse(req.body);
    const accommodation = await complianceStorage.updateAccommodation(id, validatedData);
    
    if (!accommodation) {
      return res.status(404).json({ error: 'Accommodation not found' });
    }
    
    res.status(200).json(accommodation);
  } catch (error) {
    console.error('Error updating accommodation:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update accommodation' });
  }
});

router.delete('/accommodations/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const deleted = await complianceStorage.deleteAccommodation(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Accommodation not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting accommodation:', error);
    res.status(500).json({ error: 'Failed to delete accommodation' });
  }
});

// Assessment Requirements Routes
router.get('/assessments', async (req: Request, res: Response) => {
  try {
    const assessments = await complianceStorage.getAssessmentRequirements();
    res.status(200).json(assessments);
  } catch (error) {
    console.error('Error fetching assessment requirements:', error);
    res.status(500).json({ error: 'Failed to fetch assessment requirements' });
  }
});

router.get('/assessments/grade/:gradeLevel', async (req: Request, res: Response) => {
  try {
    const { gradeLevel } = req.params;
    const assessments = await complianceStorage.getAssessmentRequirementsByGrade(gradeLevel);
    res.status(200).json(assessments);
  } catch (error) {
    console.error('Error fetching assessment requirements by grade:', error);
    res.status(500).json({ error: 'Failed to fetch assessment requirements by grade' });
  }
});

router.get('/assessments/subject/:subject', async (req: Request, res: Response) => {
  try {
    const { subject } = req.params;
    const assessments = await complianceStorage.getAssessmentRequirementsBySubject(subject);
    res.status(200).json(assessments);
  } catch (error) {
    console.error('Error fetching assessment requirements by subject:', error);
    res.status(500).json({ error: 'Failed to fetch assessment requirements by subject' });
  }
});

router.get('/assessments/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const assessment = await complianceStorage.getAssessmentRequirement(id);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment requirement not found' });
    }
    
    res.status(200).json(assessment);
  } catch (error) {
    console.error('Error fetching assessment requirement:', error);
    res.status(500).json({ error: 'Failed to fetch assessment requirement' });
  }
});

router.post('/assessments', async (req: Request, res: Response) => {
  try {
    const validatedData = insertAssessmentRequirementSchema.parse(req.body);
    const assessment = await complianceStorage.createAssessmentRequirement(validatedData);
    res.status(201).json(assessment);
  } catch (error) {
    console.error('Error creating assessment requirement:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create assessment requirement' });
  }
});

router.patch('/assessments/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const validatedData = insertAssessmentRequirementSchema.partial().parse(req.body);
    const assessment = await complianceStorage.updateAssessmentRequirement(id, validatedData);
    
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment requirement not found' });
    }
    
    res.status(200).json(assessment);
  } catch (error) {
    console.error('Error updating assessment requirement:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update assessment requirement' });
  }
});

router.delete('/assessments/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const deleted = await complianceStorage.deleteAssessmentRequirement(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Assessment requirement not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting assessment requirement:', error);
    res.status(500).json({ error: 'Failed to delete assessment requirement' });
  }
});

// Student Compliance Plans Routes
router.get('/student-plans', async (req: Request, res: Response) => {
  try {
    const plans = await complianceStorage.getStudentCompliancePlans();
    res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching student compliance plans:', error);
    res.status(500).json({ error: 'Failed to fetch student compliance plans' });
  }
});

router.get('/student-plans/student/:studentId', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
    
    const plans = await complianceStorage.getStudentCompliancePlansByStudent(studentId);
    res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching student compliance plans by student:', error);
    res.status(500).json({ error: 'Failed to fetch student compliance plans by student' });
  }
});

router.get('/student-plans/type/:planType', async (req: Request, res: Response) => {
  try {
    const { planType } = req.params;
    const plans = await complianceStorage.getStudentCompliancePlansByType(planType);
    res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching student compliance plans by type:', error);
    res.status(500).json({ error: 'Failed to fetch student compliance plans by type' });
  }
});

router.get('/student-plans/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const plan = await complianceStorage.getStudentCompliancePlan(id);
    if (!plan) {
      return res.status(404).json({ error: 'Student compliance plan not found' });
    }
    
    res.status(200).json(plan);
  } catch (error) {
    console.error('Error fetching student compliance plan:', error);
    res.status(500).json({ error: 'Failed to fetch student compliance plan' });
  }
});

router.post('/student-plans', async (req: Request, res: Response) => {
  try {
    const validatedData = insertStudentCompliancePlanSchema.parse(req.body);
    const plan = await complianceStorage.createStudentCompliancePlan(validatedData);
    res.status(201).json(plan);
  } catch (error) {
    console.error('Error creating student compliance plan:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create student compliance plan' });
  }
});

router.patch('/student-plans/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const validatedData = insertStudentCompliancePlanSchema.partial().parse(req.body);
    const plan = await complianceStorage.updateStudentCompliancePlan(id, validatedData);
    
    if (!plan) {
      return res.status(404).json({ error: 'Student compliance plan not found' });
    }
    
    res.status(200).json(plan);
  } catch (error) {
    console.error('Error updating student compliance plan:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update student compliance plan' });
  }
});

router.delete('/student-plans/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const deleted = await complianceStorage.deleteStudentCompliancePlan(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Student compliance plan not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting student compliance plan:', error);
    res.status(500).json({ error: 'Failed to delete student compliance plan' });
  }
});

// Analysis Routes
router.get('/analyze/curriculum/:curriculumId', async (req: Request, res: Response) => {
  try {
    const curriculumId = parseInt(req.params.curriculumId);
    if (isNaN(curriculumId)) {
      return res.status(400).json({ error: 'Invalid curriculum ID' });
    }
    
    const analysis = await complianceStorage.analyzeCurriculumCompliance(curriculumId);
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing curriculum compliance:', error);
    res.status(500).json({ error: 'Failed to analyze curriculum compliance' });
  }
});

router.get('/analyze/student/:studentId/curriculum/:curriculumId', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const curriculumId = parseInt(req.params.curriculumId);
    
    if (isNaN(studentId) || isNaN(curriculumId)) {
      return res.status(400).json({ error: 'Invalid student or curriculum ID' });
    }
    
    const analysis = await complianceStorage.analyzeStudentPlanCompliance(studentId, curriculumId);
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing student plan compliance:', error);
    res.status(500).json({ error: 'Failed to analyze student plan compliance' });
  }
});

router.get('/analyze/assessment/:assessmentId', async (req: Request, res: Response) => {
  try {
    const assessmentId = parseInt(req.params.assessmentId);
    if (isNaN(assessmentId)) {
      return res.status(400).json({ error: 'Invalid assessment ID' });
    }
    
    const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;
    if (req.query.studentId && isNaN(studentId!)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
    
    const analysis = await complianceStorage.analyzeAssessmentCompliance(assessmentId, studentId);
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing assessment compliance:', error);
    res.status(500).json({ error: 'Failed to analyze assessment compliance' });
  }
});

// Report Generation Route
router.post('/reports/generate', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      templateId: z.number(),
      entityId: z.number(),
      entityType: z.string()
    });
    
    const validatedData = schema.parse(req.body);
    const report = await complianceStorage.generateComplianceReport(
      validatedData.templateId,
      validatedData.entityId,
      validatedData.entityType
    );
    
    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating compliance report:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to generate compliance report' });
  }
});

// Report Templates Routes
router.get('/report-templates', async (req: Request, res: Response) => {
  try {
    const templates = await complianceStorage.getComplianceReportTemplates();
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching report templates:', error);
    res.status(500).json({ error: 'Failed to fetch report templates' });
  }
});

router.get('/report-templates/type/:reportType', async (req: Request, res: Response) => {
  try {
    const { reportType } = req.params;
    const templates = await complianceStorage.getComplianceReportTemplatesByType(reportType);
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching report templates by type:', error);
    res.status(500).json({ error: 'Failed to fetch report templates by type' });
  }
});

router.get('/report-templates/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const template = await complianceStorage.getComplianceReportTemplate(id);
    if (!template) {
      return res.status(404).json({ error: 'Report template not found' });
    }
    
    res.status(200).json(template);
  } catch (error) {
    console.error('Error fetching report template:', error);
    res.status(500).json({ error: 'Failed to fetch report template' });
  }
});

router.post('/report-templates', async (req: Request, res: Response) => {
  try {
    const validatedData = insertComplianceReportTemplateSchema.parse(req.body);
    const template = await complianceStorage.createComplianceReportTemplate(validatedData);
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating report template:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create report template' });
  }
});

router.patch('/report-templates/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const validatedData = insertComplianceReportTemplateSchema.partial().parse(req.body);
    const template = await complianceStorage.updateComplianceReportTemplate(id, validatedData);
    
    if (!template) {
      return res.status(404).json({ error: 'Report template not found' });
    }
    
    res.status(200).json(template);
  } catch (error) {
    console.error('Error updating report template:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update report template' });
  }
});

router.delete('/report-templates/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const deleted = await complianceStorage.deleteComplianceReportTemplate(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Report template not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting report template:', error);
    res.status(500).json({ error: 'Failed to delete report template' });
  }
});

// Compliance Audits Routes
router.get('/audits', async (req: Request, res: Response) => {
  try {
    const audits = await complianceStorage.getComplianceAudits();
    res.status(200).json(audits);
  } catch (error) {
    console.error('Error fetching compliance audits:', error);
    res.status(500).json({ error: 'Failed to fetch compliance audits' });
  }
});

router.get('/audits/curriculum/:curriculumId', async (req: Request, res: Response) => {
  try {
    const curriculumId = parseInt(req.params.curriculumId);
    if (isNaN(curriculumId)) {
      return res.status(400).json({ error: 'Invalid curriculum ID' });
    }
    
    const audits = await complianceStorage.getComplianceAuditsByCurriculum(curriculumId);
    res.status(200).json(audits);
  } catch (error) {
    console.error('Error fetching compliance audits by curriculum:', error);
    res.status(500).json({ error: 'Failed to fetch compliance audits by curriculum' });
  }
});

router.get('/audits/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const audit = await complianceStorage.getComplianceAudit(id);
    if (!audit) {
      return res.status(404).json({ error: 'Compliance audit not found' });
    }
    
    res.status(200).json(audit);
  } catch (error) {
    console.error('Error fetching compliance audit:', error);
    res.status(500).json({ error: 'Failed to fetch compliance audit' });
  }
});

router.post('/audits', async (req: Request, res: Response) => {
  try {
    const validatedData = insertComplianceAuditSchema.parse(req.body);
    const audit = await complianceStorage.createComplianceAudit(validatedData);
    res.status(201).json(audit);
  } catch (error) {
    console.error('Error creating compliance audit:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create compliance audit' });
  }
});

router.patch('/audits/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const validatedData = insertComplianceAuditSchema.partial().parse(req.body);
    const audit = await complianceStorage.updateComplianceAudit(id, validatedData);
    
    if (!audit) {
      return res.status(404).json({ error: 'Compliance audit not found' });
    }
    
    res.status(200).json(audit);
  } catch (error) {
    console.error('Error updating compliance audit:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update compliance audit' });
  }
});

router.delete('/audits/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const deleted = await complianceStorage.deleteComplianceAudit(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Compliance audit not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting compliance audit:', error);
    res.status(500).json({ error: 'Failed to delete compliance audit' });
  }
});

export default router;