/**
 * Shatzii School of Law API Routes
 * 
 * This module provides API endpoints for the law school functionality,
 * including bar exam preparation, legal education courses, and UAE legal
 * system resources.
 */

import express from 'express';
import { Anthropic } from '@anthropic-ai/sdk';

const router = express.Router();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Get available law courses
router.get('/courses', (req, res) => {
  res.json({
    success: true,
    courses: [
      {
        id: 'uae-101',
        title: 'Introduction to UAE Legal System',
        description: 'Overview of the UAE legal framework and court system',
        level: 'beginner',
        modules: 12,
        duration: '8 weeks',
        featured: true
      },
      {
        id: 'contract-law',
        title: 'UAE Contract Law',
        description: 'Comprehensive study of contract formation and enforcement in the UAE',
        level: 'intermediate',
        modules: 15,
        duration: '10 weeks',
        featured: true
      },
      {
        id: 'commercial-law',
        title: 'UAE Commercial Law',
        description: 'Business and commercial regulations in the United Arab Emirates',
        level: 'intermediate',
        modules: 14,
        duration: '10 weeks',
        featured: false
      },
      {
        id: 'property-law',
        title: 'UAE Property Law',
        description: 'Real estate and property regulations in the UAE',
        level: 'intermediate',
        modules: 10,
        duration: '8 weeks',
        featured: false
      },
      {
        id: 'criminal-law',
        title: 'UAE Criminal Law and Procedure',
        description: 'Criminal codes, procedures and enforcement in the UAE',
        level: 'advanced',
        modules: 16,
        duration: '12 weeks',
        featured: true
      }
    ]
  });
});

// Get available bar exams
router.get('/bar-exams', (req, res) => {
  res.json({
    success: true,
    barExams: [
      {
        id: 'uae-bar-2023',
        title: 'UAE Bar Examination 2023',
        description: 'Official UAE Bar exam practice test with comprehensive coverage',
        questions: 200,
        duration: '3 hours',
        passingScore: 70,
        categories: [
          'Constitutional Law',
          'Civil Code',
          'Commercial Law',
          'Criminal Law',
          'Civil Procedure',
          'Personal Status Law'
        ]
      },
      {
        id: 'uae-bar-practice-1',
        title: 'UAE Bar Practice Exam - Set 1',
        description: 'Practice test focusing on Constitutional and Civil Law',
        questions: 100,
        duration: '90 minutes',
        passingScore: 65,
        categories: [
          'Constitutional Law',
          'Civil Code',
          'Civil Procedure'
        ]
      },
      {
        id: 'uae-bar-practice-2',
        title: 'UAE Bar Practice Exam - Set 2',
        description: 'Practice test focusing on Commercial and Criminal Law',
        questions: 100,
        duration: '90 minutes',
        passingScore: 65,
        categories: [
          'Commercial Law',
          'Criminal Law',
          'Criminal Procedure'
        ]
      }
    ]
  });
});

// Generate legal case analysis
router.post('/generate/case-analysis', async (req, res) => {
  try {
    const { caseDetails, jurisdiction, analysisType } = req.body;
    
    if (!caseDetails || !jurisdiction) {
      return res.status(400).json({
        success: false,
        error: 'Case details and jurisdiction are required'
      });
    }
    
    const type = analysisType || 'comprehensive';
    
    const prompt = `Analyze the following legal case in the ${jurisdiction} jurisdiction:

"${caseDetails}"

Please provide a ${type} legal analysis formatted as a JSON object with these fields:
- title: A descriptive title for this analysis
- summary: A brief summary of the case
- legalIssues: Array of key legal issues identified
- applicableLaws: Array of relevant laws and statutes
- precedents: Array of relevant precedent cases, if any
- analysis: Detailed legal analysis
- conclusion: Legal conclusion or likely outcome
- recommendations: Practical recommendations

Focus on ${jurisdiction} legal principles and procedures. Cite specific UAE legal codes where applicable.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt }
      ],
    });
    
    // Extract JSON from the response
    try {
      const content = response.content[0].text;
      // Find JSON in the content
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) || 
                        [null, content];
      
      const jsonContent = jsonMatch[1];
      const analysis = JSON.parse(jsonContent);
      
      res.json({
        success: true,
        analysis
      });
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      res.status(500).json({
        success: false,
        error: 'Failed to parse AI response as JSON',
        rawResponse: response.content[0].text
      });
    }
  } catch (error) {
    console.error('Case analysis generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate legal document template
router.post('/generate/legal-document', async (req, res) => {
  try {
    const { documentType, jurisdiction, details } = req.body;
    
    if (!documentType || !jurisdiction) {
      return res.status(400).json({
        success: false,
        error: 'Document type and jurisdiction are required'
      });
    }
    
    const prompt = `Create a ${documentType} template for use in ${jurisdiction}, with the following details:

${details || 'Standard template with placeholders for customization'}

Format the response as a JSON object with these fields:
- title: The title of the document
- description: Brief description of this document type and its use
- disclaimer: Appropriate legal disclaimer
- template: The full document template with appropriate sections
- instructions: Usage instructions and important notes
- placeholders: Array of placeholder fields that need to be filled in

Ensure the document complies with ${jurisdiction} legal requirements and follows standard legal formatting.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt }
      ],
    });
    
    // Extract JSON from the response
    try {
      const content = response.content[0].text;
      // Find JSON in the content
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) || 
                        [null, content];
      
      const jsonContent = jsonMatch[1];
      const document = JSON.parse(jsonContent);
      
      res.json({
        success: true,
        document
      });
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      res.status(500).json({
        success: false,
        error: 'Failed to parse AI response as JSON',
        rawResponse: response.content[0].text
      });
    }
  } catch (error) {
    console.error('Legal document generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;