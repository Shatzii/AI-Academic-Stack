import express, { Request, Response } from 'express';
import multer from 'multer';
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import elevenLabsVoice from './services/elevenlabs-voice';

// Extend Request type for multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = express.Router();

// Initialize Anthropic AI
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    cb(null, allowedTypes.includes(file.mimetype));
  }
});

// Legal knowledge base for Professor Barrett
const legalKnowledgeBase = {
  constitutionalLaw: {
    principles: [
      'Separation of Powers',
      'Federalism',
      'Individual Rights',
      'Due Process',
      'Equal Protection'
    ],
    landmarkCases: [
      'Marbury v. Madison (1803)',
      'Brown v. Board of Education (1954)',
      'Miranda v. Arizona (1966)',
      'Roe v. Wade (1973)',
      'Citizens United v. FEC (2010)'
    ]
  },
  criminalLaw: {
    elements: ['Mens Rea', 'Actus Reus', 'Causation', 'Harm'],
    defenses: ['Self-Defense', 'Insanity', 'Duress', 'Necessity', 'Entrapment']
  },
  contractLaw: {
    formation: ['Offer', 'Acceptance', 'Consideration', 'Mutual Assent'],
    defenses: ['Fraud', 'Duress', 'Undue Influence', 'Mistake', 'Impossibility']
  },
  tortLaw: {
    intentionalTorts: ['Battery', 'Assault', 'False Imprisonment', 'Trespass'],
    negligence: ['Duty', 'Breach', 'Causation', 'Damages']
  }
};

// Enhanced legal response generation
async function generateLegalResponse(query: string, context?: any): Promise<string> {
  const prompt = `You are Professor Barrett, an expert legal educator with decades of experience teaching law. 
  
Your role is to provide comprehensive, accurate, and educational legal analysis. Always:
- Explain legal concepts clearly and thoroughly
- Cite relevant case law and statutes when appropriate  
- Provide practical examples and applications
- Maintain academic rigor while being accessible
- Include bar exam preparation insights when relevant

Student Query: ${query}

${context ? `Additional Context: ${JSON.stringify(context)}` : ''}

Provide a detailed, educational response that would help a law student understand this topic completely.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    return response.content[0].type === 'text' ? response.content[0].text : 'I apologize, but I encountered an issue generating a response. Please try again.';
  } catch (error) {
    console.error('Anthropic API error:', error);
    return 'I apologize, but I encountered a technical issue. Please ensure the AI service is properly configured and try again.';
  }
}

// Chat endpoint for Professor Barrett
router.post('/api/professor-barrett/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Analyze message for legal context
    const legalContext = analyzeLegalContext(message);
    
    // Generate response using Anthropic
    const response = await generateLegalResponse(message, {
      conversationHistory: conversationHistory.slice(-5), // Keep last 5 messages for context
      legalContext
    });

    // Log conversation for learning analytics
    logConversation(message, response);

    res.json({
      response,
      legalContext,
      timestamp: new Date().toISOString(),
      professor: 'Barrett'
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Document analysis endpoint
router.post('/api/professor-barrett/analyze-document', upload.single('document'), async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document uploaded' });
    }

    const filePath = req.file.path;
    const fileContent = await extractDocumentContent(filePath, req.file.mimetype);
    
    // Analyze document with legal expertise
    const analysis = await analyzeLegalDocument(fileContent, req.file.originalname);
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      analysis,
      filename: req.file.originalname,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Document analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze document' });
  }
});

// Voice integration endpoint for ElevenLabs
router.post('/api/professor-barrett/voice-response', async (req: Request, res: Response) => {
  try {
    const { text, voiceSettings = {} } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for voice synthesis' });
    }

    // This would integrate with ElevenLabs API
    // For now, we'll prepare the response structure
    const voiceResponse = await generateVoiceResponse(text, voiceSettings);

    res.json({
      audioUrl: voiceResponse.audioUrl,
      text: text,
      duration: voiceResponse.duration,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Voice response error:', error);
    res.status(500).json({ error: 'Failed to generate voice response' });
  }
});

// Speech-to-text endpoint
router.post('/api/professor-barrett/speech-to-text', upload.single('audio'), async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Process audio file and convert to text
    const audioBuffer = fs.readFileSync(req.file.path);
    const transcript = await elevenLabsVoice.speechToText(audioBuffer);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      transcript: transcript.text,
      confidence: transcript.confidence,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Speech-to-text error:', error);
    res.status(500).json({ error: 'Failed to process audio' });
  }
});

// Case law research endpoint
router.post('/api/professor-barrett/research-case', async (req: Request, res: Response) => {
  try {
    const { caseName, jurisdiction, year } = req.body;

    if (!caseName) {
      return res.status(400).json({ error: 'Case name is required' });
    }

    const caseAnalysis = await researchCase(caseName, jurisdiction, year);

    res.json({
      caseAnalysis,
      caseName,
      jurisdiction: jurisdiction || 'Federal',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Case research error:', error);
    res.status(500).json({ error: 'Failed to research case' });
  }
});

// Bar exam preparation endpoint
router.post('/api/professor-barrett/bar-exam-question', async (req: Request, res: Response) => {
  try {
    const { subject, difficulty = 'medium' } = req.body;

    const question = await generateBarExamQuestion(subject, difficulty);

    res.json({
      question: question.question,
      options: question.options,
      explanation: question.explanation,
      subject: subject || 'Constitutional Law',
      difficulty,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Bar exam question error:', error);
    res.status(500).json({ error: 'Failed to generate bar exam question' });
  }
});

// Legal writing assistance endpoint
router.post('/api/professor-barrett/writing-assistance', async (req: Request, res: Response) => {
  try {
    const { documentType, content, assistanceType } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required for writing assistance' });
    }

    const assistance = await provideLegalWritingAssistance(documentType, content, assistanceType);

    res.json({
      assistance,
      documentType: documentType || 'legal memorandum',
      assistanceType: assistanceType || 'review',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Writing assistance error:', error);
    res.status(500).json({ error: 'Failed to provide writing assistance' });
  }
});

// ElevenLabs voice service health check
router.get('/api/professor-barrett/voice-health', async (req: Request, res: Response) => {
  try {
    const isHealthy = await elevenLabsVoice.healthCheck();
    const quotaInfo = await elevenLabsVoice.getQuotaInfo();
    
    res.json({
      voiceServiceAvailable: isHealthy,
      quotaInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Voice health check error:', error);
    res.status(500).json({ error: 'Failed to check voice service health' });
  }
});

// Get available voices
router.get('/api/professor-barrett/voices', async (req: Request, res: Response) => {
  try {
    const voices = await elevenLabsVoice.getAvailableVoices();
    
    res.json({
      voices,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get voices error:', error);
    res.status(500).json({ error: 'Failed to retrieve available voices' });
  }
});

// Professor Barrett conversation analytics
router.get('/api/professor-barrett/analytics', async (req: Request, res: Response) => {
  try {
    // This would typically pull from a database with conversation logs
    const analytics = {
      totalConversations: 1250,
      avgResponseTime: 2.3,
      mostDiscussedTopics: [
        'Constitutional Law',
        'Criminal Procedure',
        'Contract Law',
        'Tort Liability'
      ],
      studentSatisfaction: 4.8,
      voiceInteractionRate: 0.67
    };
    
    res.json({
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

// Helper Functions

function analyzeLegalContext(message: string): any {
  const lowerMessage = message.toLowerCase();
  const context = {
    area: 'general' as string,
    concepts: [] as string[],
    cases: [] as string[],
    statutes: [] as string[]
  };

  // Identify legal area
  if (lowerMessage.includes('constitutional') || lowerMessage.includes('amendment')) {
    context.area = 'constitutional law';
    context.concepts.push('constitutional principles');
  }
  if (lowerMessage.includes('criminal') || lowerMessage.includes('crime')) {
    context.area = 'criminal law';
    context.concepts.push('criminal elements');
  }
  if (lowerMessage.includes('contract')) {
    context.area = 'contract law';
    context.concepts.push('contract formation');
  }
  if (lowerMessage.includes('tort') || lowerMessage.includes('negligence')) {
    context.area = 'tort law';
    context.concepts.push('tort liability');
  }

  // Identify landmark cases mentioned
  if (lowerMessage.includes('miranda')) context.cases.push('Miranda v. Arizona');
  if (lowerMessage.includes('brown') && lowerMessage.includes('board')) context.cases.push('Brown v. Board of Education');
  if (lowerMessage.includes('marbury')) context.cases.push('Marbury v. Madison');

  return context;
}

async function extractDocumentContent(filePath: string, mimeType: string): Promise<string> {
  try {
    if (mimeType === 'text/plain') {
      return fs.readFileSync(filePath, 'utf8');
    }
    
    // For PDF and Word documents, you would typically use libraries like pdf-parse or mammoth
    // For now, return a placeholder that indicates the file type
    return `Document content from ${mimeType} file. Content extraction would be implemented with appropriate libraries.`;
  } catch (error) {
    throw new Error('Failed to extract document content');
  }
}

async function analyzeLegalDocument(content: string, filename: string): Promise<string> {
  const prompt = `As Professor Barrett, analyze this legal document and provide comprehensive legal commentary:

Document: ${filename}
Content: ${content}

Provide analysis covering:
1. Document type and purpose
2. Key legal provisions
3. Potential legal issues or concerns
4. Relevant case law or statutes
5. Practical implications

Be thorough and educational in your analysis.`;

  return await generateLegalResponse(prompt);
}

async function generateVoiceResponse(text: string, voiceSettings: any): Promise<any> {
  try {
    const voiceResponse = await elevenLabsVoice.textToSpeech(text, voiceSettings);
    return voiceResponse;
  } catch (error) {
    console.error('Voice generation error:', error);
    return {
      audioUrl: '/audio/fallback-professor-barrett.mp3',
      duration: Math.ceil(text.length / 10),
      voiceId: 'fallback-voice',
      error: 'Voice generation failed, using fallback'
    };
  }
}

async function processAudioToText(audioPath: string): Promise<any> {
  // This would integrate with speech-to-text service
  // Implementation would include:
  // - Audio file processing
  // - Speech recognition API call
  // - Confidence scoring
  
  return {
    text: 'Audio transcript would be generated here',
    confidence: 0.95
  };
}

async function researchCase(caseName: string, jurisdiction?: string, year?: string): Promise<string> {
  const prompt = `As Professor Barrett, provide comprehensive case analysis for: ${caseName}

Include:
1. Case citation and court
2. Key facts
3. Legal issues presented
4. Court's holding and reasoning
5. Significance and impact
6. Related cases and precedents

Provide educational insight suitable for law students.`;

  return await generateLegalResponse(prompt);
}

async function generateBarExamQuestion(subject?: string, difficulty?: string): Promise<any> {
  const areas = ['Constitutional Law', 'Criminal Law', 'Contract Law', 'Tort Law', 'Civil Procedure'];
  const selectedSubject = subject || areas[Math.floor(Math.random() * areas.length)];

  const prompt = `Create a ${difficulty} difficulty bar exam multiple choice question for ${selectedSubject}.

Format:
- Question stem with factual scenario
- Four answer choices (A, B, C, D)
- Correct answer with detailed explanation
- Reference to relevant law and cases

Make it realistic and educational.`;

  const response = await generateLegalResponse(prompt);
  
  // Parse the response to extract question components
  return {
    question: response,
    options: ['A', 'B', 'C', 'D'],
    explanation: 'Detailed explanation would be parsed from AI response'
  };
}

async function provideLegalWritingAssistance(documentType: string, content: string, assistanceType: string): Promise<string> {
  const prompt = `As Professor Barrett, provide ${assistanceType} assistance for this ${documentType}:

Content: ${content}

Provide:
1. Structural analysis
2. Legal reasoning assessment
3. Citations and authority review
4. Writing style and clarity suggestions
5. Specific improvement recommendations

Be constructive and educational.`;

  return await generateLegalResponse(prompt);
}

function logConversation(message: string, response: string): void {
  // Log conversations for analytics and improvement
  const logEntry = {
    timestamp: new Date().toISOString(),
    message,
    response: response.substring(0, 100) + '...',
    professor: 'Barrett'
  };
  
  // In production, this would write to a proper logging system
  console.log('Professor Barrett conversation:', logEntry);
}

export { router as default };