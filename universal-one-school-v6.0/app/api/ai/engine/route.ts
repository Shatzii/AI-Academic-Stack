import { NextRequest, NextResponse } from 'next/server';

// Simple AI Service for testing
const AI_SERVICE = {
  async checkStatus() {
    const useLocal = process.env.USE_LOCAL_AI_ENGINE === 'true';
    
    if (useLocal) {
      try {
        const response = await fetch('http://localhost:8000/health');
        if (response.ok) {
          const data = await response.json();
          return {
            status: 'healthy',
            engine: 'self-hosted',
            models: data.models || [],
            message: 'Academic AI Engine is operational'
          };
        }
      } catch (error) {
        return {
          status: 'error',
          engine: 'self-hosted',
          message: 'Academic AI Engine not responding - please start it on port 8000'
        };
      }
    }
    
    return {
      status: 'healthy',
      engine: 'external',
      message: 'Using external AI APIs'
    };
  },

  async generateChatCompletion(messages: any[], options: any = {}) {
    const useLocal = process.env.USE_LOCAL_AI_ENGINE === 'true';
    
    if (useLocal) {
      try {
        const response = await fetch('http://localhost:8000/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages,
            model: options.model || 'educational-llama-7b',
            max_tokens: options.maxTokens || 1024,
            temperature: options.temperature || 0.7
          })
        });
        
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        throw new Error('Academic AI Engine not available');
      }
    }
    
    throw new Error('External AI APIs not configured');
  }
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'status') {
      const status = await AI_SERVICE.checkStatus();
      return NextResponse.json(status);
    }

    if (action === 'models') {
      return NextResponse.json({
        object: 'list',
        data: [
          { id: 'educational-llama-7b', name: 'Educational Llama 7B' },
          { id: 'neurodivergent-assistant', name: 'Neurodivergent Learning Assistant' },
          { id: 'legal-education-ai', name: 'Legal Education AI' },
          { id: 'language-tutor-ai', name: 'Multilingual Language Tutor' },
          { id: 'cybersecurity-analyzer', name: 'Cybersecurity Content Analyzer' }
        ]
      });
    }

    return NextResponse.json({
      message: 'Self-Hosted Academic AI Engine API',
      endpoints: [
        'GET /api/ai/engine?action=status - Check AI engine status',
        'GET /api/ai/engine?action=models - Get available models',
        'POST /api/ai/engine/chat - Generate chat completion',
        'POST /api/ai/engine/lesson - Generate lesson plan',
        'POST /api/ai/engine/assessment - Generate assessment',
        'POST /api/ai/engine/analyze - Analyze content for safety'
      ],
      engine: process.env.USE_LOCAL_AI_ENGINE === 'true' ? 'self-hosted' : 'external'
    });

  } catch (error) {
    console.error('AI engine API error:', error);
    return NextResponse.json({
      success: false,
      message: 'AI engine API error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'chat': {
        const { messages, model, maxTokens, temperature } = data;
        const response = await aiService.generateChatCompletion(messages, {
          model,
          maxTokens,
          temperature
        });
        return NextResponse.json(response);
      }

      case 'lesson': {
        const { subject, grade, topic, learningStyle, accommodations } = data;
        const lesson = await aiService.generateLesson(
          subject,
          grade,
          topic,
          learningStyle,
          accommodations
        );
        return NextResponse.json(lesson);
      }

      case 'assessment': {
        const { subject, grade, topic, assessmentType, difficulty } = data;
        const assessment = await aiService.generateAssessment(
          subject,
          grade,
          topic,
          assessmentType,
          difficulty
        );
        return NextResponse.json(assessment);
      }

      case 'analyze': {
        const { content, platform, userId } = data;
        const analysis = await aiService.analyzeContent(content, platform, userId);
        return NextResponse.json(analysis);
      }

      case 'dean_wonder': {
        const { prompt, accommodations } = data;
        const response = await aiService.getDeanWonder(prompt, accommodations);
        return NextResponse.json(response);
      }

      case 'dean_sterling': {
        const { prompt, accommodations } = data;
        const response = await aiService.getDeanSterling(prompt, accommodations);
        return NextResponse.json(response);
      }

      case 'professor_barrett': {
        const { prompt, specialization } = data;
        const response = await aiService.getProfessorBarrett(prompt, specialization);
        return NextResponse.json(response);
      }

      case 'professor_lingua': {
        const { prompt, language, level } = data;
        const response = await aiService.getProfessorLingua(prompt, language, level);
        return NextResponse.json(response);
      }

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action specified'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('AI engine POST error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'AI engine processing error'
    }, { status: 500 });
  }
}