import { z } from "zod";

export const createAssessmentSchema = z.object({
  title: z.string(),
  type: z.enum(["quiz", "test", "project", "portfolio", "observation"]),
  subject: z.string(),
  gradeLevel: z.string(),
  curriculumModuleId: z.string().optional(),
  questions: z.array(z.any()).default([]),
  rubric: z.record(z.any()).default({}),
  accommodationOptions: z.array(z.string()),
  timeLimit: z.number().optional(),
  passingScore: z.number(),
  maxScore: z.number(),
  difficulty: z.string().optional(),
  tags: z.array(z.string()).default([]),
  creatorId: z.string()
});
