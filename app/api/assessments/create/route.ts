import { AssessmentCreateParams } from "@/shared/types/assessment";
import { createAssessmentSchema } from "./validation-schema"; // Adjust if needed
import { storage } from "@/server/storage";

export async function POST(req: Request) {
  const body = await req.json();
  const validatedData = createAssessmentSchema.parse(body);

  const assessmentData: AssessmentCreateParams = {
    ...validatedData,
    questions: validatedData.questions || [],
    rubric: validatedData.rubric || {},
    tags: [validatedData.subject, validatedData.gradeLevel],
    isPublished: false
  };

  const assessment = await storage.createAssessment(assessmentData);
  return new Response(JSON.stringify(assessment), { status: 200 });
}
