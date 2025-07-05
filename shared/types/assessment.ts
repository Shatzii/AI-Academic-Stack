export interface AssessmentCreateParams {
  title: string;
  type: 'quiz' | 'test' | 'project' | 'portfolio' | 'observation';
  subject: string;
  gradeLevel: string;
  curriculumModuleId?: string;
  questions: any[];
  rubric: Record<string, any>;
  accommodationOptions: string[];
  timeLimit?: number;
  passingScore: number;
  maxScore: number;
  difficulty?: string;
  tags: string[];
  creatorId: string;
  isPublished: boolean;
}
