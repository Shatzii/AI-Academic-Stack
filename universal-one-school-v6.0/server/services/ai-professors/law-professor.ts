/**
 * UAE Law School Professor AI Service
 * 
 * This service provides specialized AI professor functionality for the UAE Law School,
 * focusing on UAE-specific legal curriculum, bar exam preparation, and legal case studies.
 */

import { AIModel, AIService } from '../ai-service';

export interface LegalQuestion {
  id: string;
  question: string;
  context?: string;
  topic: string;
  subtopic?: string;
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'bar-exam';
}

export interface LegalQuestionResponse {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  references: string[];
  relatedConcepts: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  facts: string;
  legalIssues: string[];
  relevantLaws: string[];
}

export interface CaseStudyAnalysis {
  id: string;
  title: string;
  summary: string;
  analysis: string;
  keyPrinciples: string[];
  conclusion: string;
  relevantCases: string[];
}

export interface LegalResourceRequest {
  topic: string;
  subtopic?: string;
  resourceType: 'summary' | 'outline' | 'practice-questions' | 'flashcards';
  difficultyLevel: 'basic' | 'intermediate' | 'advanced' | 'bar-exam';
}

export class UAELawProfessor {
  private model: AIModel;
  private aiService: AIService;
  
  constructor(model?: AIModel) {
    // Default to latest Claude model for legal analysis
    this.model = model || { provider: 'anthropic', model: 'claude-3-7-sonnet-20250219' };
    this.aiService = new AIService();
  }
  
  /**
   * Answers a legal question with UAE-specific context
   */
  async answerLegalQuestion(question: LegalQuestion): Promise<LegalQuestionResponse> {
    try {
      const difficultyText = {
        'basic': 'first-year law student',
        'intermediate': 'second or third-year law student',
        'advanced': 'final-year law student or recent graduate',
        'bar-exam': 'UAE Bar Exam candidate'
      }[question.difficulty];
      
      const prompt = `As a UAE Law Professor, answer the following legal question about ${question.topic}${question.subtopic ? ` (specifically ${question.subtopic})` : ''}.
      
Question: ${question.question}

${question.context ? `Additional Context: ${question.context}` : ''}

Provide a comprehensive answer tailored to a ${difficultyText}. Include:
1. A direct answer to the question
2. An explanation of the legal principles involved
3. References to relevant UAE laws, regulations, or cases
4. Related legal concepts that may be useful to understand

Format your response as JSON with the following structure:
{
  "answer": "The direct answer to the question",
  "explanation": "Detailed explanation of the legal principles",
  "references": ["Reference 1", "Reference 2", ...],
  "relatedConcepts": ["Concept 1", "Concept 2", ...]
}`;

      const response = await this.aiService.getCompletion(prompt, this.model);
      
      // Parse the JSON response
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("Failed to extract JSON from response");
        }
        
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return {
          id: question.id,
          question: question.question,
          ...parsedResponse
        };
      } catch (jsonError) {
        // If JSON parsing fails, format response manually
        console.error("Failed to parse JSON response:", jsonError);
        return {
          id: question.id,
          question: question.question,
          answer: response.split('\n\n')[0] || "Unable to generate a structured answer",
          explanation: response.split('\n\n').slice(1).join('\n\n') || "No detailed explanation available",
          references: [],
          relatedConcepts: []
        };
      }
    } catch (error) {
      console.error("Error in answerLegalQuestion:", error);
      throw new Error("Failed to answer legal question");
    }
  }
  
  /**
   * Analyzes a legal case study with UAE legal context
   */
  async analyzeCaseStudy(caseStudy: CaseStudy): Promise<CaseStudyAnalysis> {
    try {
      const prompt = `As a UAE Law Professor, analyze the following legal case study in the context of UAE law:

Title: ${caseStudy.title}

Facts: ${caseStudy.facts}

Legal Issues: 
${caseStudy.legalIssues.map(issue => `- ${issue}`).join('\n')}

Relevant Laws: 
${caseStudy.relevantLaws.map(law => `- ${law}`).join('\n')}

Provide a comprehensive analysis that includes:
1. A concise summary of the case
2. Detailed legal analysis considering UAE law and legal principles
3. Key legal principles demonstrated in this case
4. A conclusion on the legal implications or likely outcome
5. References to relevant UAE cases or precedents, if applicable

Format your response as JSON with the following structure:
{
  "summary": "Concise summary of the case",
  "analysis": "Detailed legal analysis",
  "keyPrinciples": ["Principle 1", "Principle 2", ...],
  "conclusion": "Conclusion about the legal implications",
  "relevantCases": ["Case 1", "Case 2", ...]
}`;

      const response = await this.aiService.getCompletion(prompt, this.model);
      
      // Parse the JSON response
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("Failed to extract JSON from response");
        }
        
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return {
          id: caseStudy.id,
          title: caseStudy.title,
          ...parsedResponse
        };
      } catch (jsonError) {
        // If JSON parsing fails, format response manually
        console.error("Failed to parse JSON response:", jsonError);
        
        // Extract sections using regex
        const summaryMatch = response.match(/summary:?\s*(.*?)(?=\n\n|$)/is);
        const analysisMatch = response.match(/analysis:?\s*([\s\S]*?)(?=\n\n[A-Z]|$)/i);
        const conclusionMatch = response.match(/conclusion:?\s*([\s\S]*?)(?=\n\n[A-Z]|$)/i);
        
        return {
          id: caseStudy.id,
          title: caseStudy.title,
          summary: summaryMatch ? summaryMatch[1].trim() : "Unable to generate a summary",
          analysis: analysisMatch ? analysisMatch[1].trim() : "Unable to generate analysis",
          keyPrinciples: extractListItems(response, /key (?:legal )?principles:?\s*([\s\S]*?)(?=\n\n[A-Z]|$)/i),
          conclusion: conclusionMatch ? conclusionMatch[1].trim() : "Unable to generate conclusion",
          relevantCases: extractListItems(response, /relevant cases:?\s*([\s\S]*?)(?=\n\n[A-Z]|$)/i)
        };
      }
    } catch (error) {
      console.error("Error in analyzeCaseStudy:", error);
      throw new Error("Failed to analyze case study");
    }
  }
  
  /**
   * Generates UAE law school educational resources
   */
  async generateLegalResource(request: LegalResourceRequest): Promise<string> {
    try {
      const resourceTypeInstructions = {
        'summary': "a comprehensive summary covering the key aspects, principles, and applications",
        'outline': "a structured outline with main headings, subheadings, and key points organized hierarchically",
        'practice-questions': "a set of 5-7 practice questions with detailed answer explanations",
        'flashcards': "15-20 flashcard pairs with terms/concepts and their definitions/explanations"
      }[request.resourceType];
      
      const difficultyText = {
        'basic': 'first-year law students with basic understanding',
        'intermediate': 'second or third-year law students with intermediate knowledge',
        'advanced': 'final-year law students or new graduates with advanced understanding',
        'bar-exam': 'students preparing for the UAE Bar Exam'
      }[request.difficultyLevel];
      
      const prompt = `As a UAE Law Professor, create ${resourceTypeInstructions} on the topic of ${request.topic}${request.subtopic ? ` (specifically ${request.subtopic})` : ''}.

The resource should be tailored for ${difficultyText} and must incorporate UAE-specific legal context, including:
- Relevant UAE laws, regulations, and legal codes
- UAE legal principles and jurisprudence
- UAE case examples or applications where appropriate
- Cultural and regional context relevant to UAE legal practice

The resource should be comprehensive, accurate, and pedagogically effective for UAE law students.`;

      return await this.aiService.getCompletion(prompt, this.model);
    } catch (error) {
      console.error("Error in generateLegalResource:", error);
      throw new Error("Failed to generate legal resource");
    }
  }
  
  /**
   * Generates bar exam practice questions for UAE law students
   */
  async generateBarExamQuestions(topic: string, count: number = 5): Promise<LegalQuestion[]> {
    try {
      // Limit count to a reasonable range
      count = Math.min(Math.max(count, 1), 10);
      
      const prompt = `As a UAE Bar Exam expert, generate ${count} challenging bar exam practice questions on the topic of ${topic}.

Each question should:
- Test advanced legal knowledge and application of UAE law
- Require analysis and application of legal principles, not just memorization
- Be similar in style and difficulty to actual UAE Bar Exam questions
- Include sufficient context and detail for the student to provide a reasoned answer

Format your response as JSON with the following structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "Full text of question 1",
      "topic": "${topic}",
      "difficulty": "bar-exam"
    },
    {
      "id": "q2",
      "question": "Full text of question 2",
      "topic": "${topic}",
      "difficulty": "bar-exam"
    },
    ...
  ]
}`;

      const response = await this.aiService.getCompletion(prompt, this.model);
      
      // Parse the JSON response
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("Failed to extract JSON from response");
        }
        
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return parsedResponse.questions || [];
      } catch (jsonError) {
        // If JSON parsing fails, extract questions using regex
        console.error("Failed to parse JSON response:", jsonError);
        
        const questionRegex = /Q(?:uestion)?\s*(\d+)[:\)]\s*([\s\S]*?)(?=Q(?:uestion)?\s*\d+[:\)]|$)/gi;
        const questions: LegalQuestion[] = [];
        
        let match;
        while ((match = questionRegex.exec(response)) !== null) {
          questions.push({
            id: `q${match[1]}`,
            question: match[2].trim(),
            topic: topic,
            difficulty: 'bar-exam'
          });
        }
        
        // If we still couldn't extract questions, create a fallback
        if (questions.length === 0) {
          const paragraphs = response.split('\n\n').filter(p => p.length > 50);
          for (let i = 0; i < Math.min(paragraphs.length, count); i++) {
            questions.push({
              id: `q${i+1}`,
              question: paragraphs[i].trim(),
              topic: topic,
              difficulty: 'bar-exam'
            });
          }
        }
        
        return questions.slice(0, count);
      }
    } catch (error) {
      console.error("Error in generateBarExamQuestions:", error);
      throw new Error("Failed to generate bar exam questions");
    }
  }
  
  /**
   * Gets feedback on a student's answer to a legal question
   */
  async getAnswerFeedback(question: string, studentAnswer: string, topic: string, difficulty: 'basic' | 'intermediate' | 'advanced' | 'bar-exam'): Promise<{
    isCorrect: boolean;
    feedback: string;
    correctAnswer: string;
    score: number;
    improvementAreas: string[];
  }> {
    try {
      const difficultyText = {
        'basic': 'first-year law student',
        'intermediate': 'second or third-year law student',
        'advanced': 'final-year law student',
        'bar-exam': 'UAE Bar Exam candidate'
      }[difficulty];
      
      const prompt = `As a UAE Law Professor, evaluate the following student's answer to a legal question. 

Topic: ${topic}
Question: ${question}
Student's Answer: ${studentAnswer}

The student is a ${difficultyText}. Provide constructive feedback on their answer, including:
1. Whether the answer is correct or mostly correct
2. Specific feedback on the strengths and weaknesses
3. A model correct answer for comparison
4. A numeric score from 0-100
5. Specific areas for improvement

Format your response as JSON with the following structure:
{
  "isCorrect": true/false,
  "feedback": "Detailed feedback on the answer",
  "correctAnswer": "The model correct answer",
  "score": 75,
  "improvementAreas": ["Area 1", "Area 2", ...]
}`;

      const response = await this.aiService.getCompletion(prompt, this.model);
      
      // Parse the JSON response
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("Failed to extract JSON from response");
        }
        
        return JSON.parse(jsonMatch[0]);
      } catch (jsonError) {
        // If JSON parsing fails, return a default response
        console.error("Failed to parse JSON response:", jsonError);
        return {
          isCorrect: response.toLowerCase().includes("correct"),
          feedback: response,
          correctAnswer: "",
          score: 0,
          improvementAreas: []
        };
      }
    } catch (error) {
      console.error("Error in getAnswerFeedback:", error);
      throw new Error("Failed to provide feedback on answer");
    }
  }
}

// Helper function to extract list items from text
function extractListItems(text: string, sectionRegex: RegExp): string[] {
  const sectionMatch = text.match(sectionRegex);
  if (!sectionMatch) return [];
  
  const sectionText = sectionMatch[1];
  const items: string[] = [];
  
  // Try to extract items formatted with bullet points or numbers
  const listItemRegex = /(?:^|\n)(?:[-*•]|\d+\.)\s*(.+)/g;
  let match;
  while ((match = listItemRegex.exec(sectionText)) !== null) {
    items.push(match[1].trim());
  }
  
  // If no items found with bullet points or numbers, split by newlines
  if (items.length === 0) {
    const lines = sectionText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    return lines;
  }
  
  return items;
}