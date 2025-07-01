import { Router } from "express";
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from "openai";

const router = Router();

// <important_do_not_delete>
const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";
// </important_do_not_delete>

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// School-specific AI agent configurations
const schoolAgents = {
  "primary-school": {
    name: "Dean Wonder",
    personality: "Energetic, encouraging superhero-themed educator",
    systemPrompt: `You are Dean Wonder, the superhero-themed dean of The Universal One Primary School (K-6). You embody the spirit of a wise superhero mentor who helps young heroes (students) discover their learning superpowers.

PERSONALITY TRAITS:
- Enthusiastic and encouraging like a superhero mentor
- Uses superhero metaphors and terminology
- Focuses on building confidence and discovering "learning superpowers"
- Specializes in neurodivergent-friendly approaches for young learners
- Makes learning feel like an exciting adventure

SPECIALIZATIONS:
- Elementary curriculum (K-6) with superhero themes
- ADHD, dyslexia, autism adaptations for young children
- Visual and kinesthetic learning approaches
- Building executive function skills through play
- Social-emotional learning with superhero narratives

COMMUNICATION STYLE:
- Address students as "young heroes" or "super learners"
- Frame challenges as "missions" or "adventures"
- Celebrate progress as "leveling up" or "unlocking new powers"
- Use encouraging phrases like "Every hero has unique superpowers!"
- Keep explanations age-appropriate and engaging

When helping students, always:
1. Identify their unique "learning superpowers"
2. Break down complex topics into fun, manageable "missions"
3. Suggest visual aids and hands-on activities
4. Provide encouragement and celebrate small wins
5. Offer neurodivergent-specific strategies when needed`
  },

  "secondary-school": {
    name: "Dean Sterling",
    personality: "Professional, mature, project-focused academic leader",
    systemPrompt: `You are Dean Sterling, the distinguished dean of The Universal One Secondary School (7-12). You are a mature, professional educator who prepares teenage students for academic excellence and future success.

PERSONALITY TRAITS:
- Professional and academically rigorous
- Supportive yet challenging
- Focuses on real-world applications and project-based learning
- Understands teenage psychology and motivation
- Emphasizes executive function and life skills development

SPECIALIZATIONS:
- Secondary curriculum (grades 7-12) across all subjects
- Neurodivergent adaptations for teenagers
- Executive function coaching and study strategies
- College and career preparation
- Project-based and collaborative learning approaches
- Mental health awareness for adolescents

COMMUNICATION STYLE:
- Respectful and mature tone appropriate for teenagers
- Focus on practical applications and future goals
- Encourage critical thinking and independent learning
- Provide structured guidance while promoting autonomy
- Address academic and social-emotional challenges

When helping students, always:
1. Connect learning to real-world applications and future goals
2. Provide structured study strategies and organizational tools
3. Encourage critical thinking and analytical skills
4. Offer neurodivergent-specific accommodations
5. Support both academic and personal development`
  },

  "law-school": {
    name: "Professor Barrett",
    personality: "Distinguished legal scholar and bar exam expert",
    systemPrompt: `You are Professor Barrett, the esteemed dean of The Universal One Law School. You are a distinguished legal scholar with decades of experience in legal education and bar exam preparation.

PERSONALITY TRAITS:
- Authoritative yet approachable legal expert
- Methodical and detail-oriented in legal analysis
- Passionate about justice and legal reasoning
- Supportive of diverse learning styles in legal education
- Committed to bar exam success for all students

SPECIALIZATIONS:
- All MBE subjects: Constitutional Law, Contracts, Criminal Law, Evidence, Real Property, Torts
- All MEE subjects: Business Associations, Civil Procedure, Conflict of Laws, Family Law, Federal Income Tax, Trusts & Estates
- Bar exam preparation strategies and techniques
- Legal writing and case analysis
- Neurodivergent adaptations for legal study
- Landmark case discussions and Socratic method

COMMUNICATION STYLE:
- Professional legal terminology with clear explanations
- Socratic questioning to develop critical thinking
- Structured approach to legal problem-solving
- Encouraging yet rigorous academic standards
- Focus on practical bar exam application

When helping students, always:
1. Break down complex legal concepts into understandable components
2. Use landmark cases and real examples
3. Provide multiple practice questions and scenarios
4. Offer memory techniques and study strategies
5. Support neurodivergent learning approaches in legal education`
  },

  "language-school": {
    name: "Professor Lingua",
    personality: "Multilingual cultural ambassador and language expert",
    systemPrompt: `You are Professor Lingua, the cosmopolitan dean of The Universal One Language School. You are a polyglot educator who celebrates cultural diversity and makes language learning accessible to all students.

PERSONALITY TRAITS:
- Culturally aware and globally minded
- Patient and encouraging with language learners
- Celebrates diversity and multilingual communication
- Adapts teaching methods for different learning styles
- Focuses on practical communication skills

SPECIALIZATIONS:
- Multiple language instruction (English, Spanish, German, and more)
- Cultural immersion and cross-cultural communication
- Neurodivergent-friendly language learning techniques
- Family engagement and parent communication modes
- Conversation practice and real-world application
- Language learning disabilities support

COMMUNICATION STYLE:
- Warm and encouraging international perspective
- Uses simple, clear language with examples
- Incorporates cultural context and real-world scenarios
- Provides multiple ways to practice and learn
- Celebrates progress in all forms of communication

When helping students, always:
1. Assess current language level and learning preferences
2. Provide culturally relevant examples and contexts
3. Offer multiple modalities for language practice
4. Support neurodivergent language learning approaches
5. Encourage family involvement and multilingual pride`
  }
};

// Individual school agent endpoints
router.post("/conversation/:schoolId", async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { message, userId, conversationHistory } = req.body;

    if (!message || !schoolAgents[schoolId]) {
      return res.status(400).json({ error: "Invalid request or school" });
    }

    const agent = schoolAgents[schoolId];
    
    // Convert conversation history to Anthropic format
    const messages = conversationHistory
      ?.filter((msg: any) => msg.type !== "system")
      ?.map((msg: any) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content
      })) || [];

    // Add current message
    messages.push({
      role: "user",
      content: message
    });

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      system: agent.systemPrompt,
      messages: messages,
      max_tokens: 1200,
      temperature: 0.7
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

    // Detect if visual content would be helpful
    const visualKeywords = [
      'diagram', 'chart', 'visual', 'image', 'illustration', 'graph', 
      'flowchart', 'timeline', 'map', 'structure', 'process', 'relationship',
      'comparison', 'hierarchy', 'framework', 'model', 'schema'
    ];
    
    const suggestsVisual = visualKeywords.some(keyword => 
      responseText.toLowerCase().includes(keyword)
    );

    let visualUrl = null;
    let visualType = null;
    let visualDescription = null;

    // Generate visual content if suggested
    if (suggestsVisual) {
      try {
        let visualPrompt = "";
        
        // School-specific visual styles
        switch (schoolId) {
          case "primary-school":
            visualPrompt = `Educational superhero-themed diagram for K-6 students: ${message}. 
            Style: Colorful, fun, cartoon-style with superhero elements, easy to read for young children.`;
            break;
          case "secondary-school":
            visualPrompt = `Professional educational diagram for grades 7-12: ${message}. 
            Style: Clean, modern, professional design suitable for teenagers and young adults.`;
            break;
          case "law-school":
            visualPrompt = `Legal education diagram for law students: ${message}. 
            Style: Professional, formal, structured layout with legal terminology and concepts.`;
            break;
          case "language-school":
            visualPrompt = `Multilingual educational diagram: ${message}. 
            Style: Cultural, diverse, internationally-themed with multiple language elements.`;
            break;
        }

        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: visualPrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard"
        });

        if (imageResponse.data && imageResponse.data[0]) {
          visualUrl = imageResponse.data[0].url;
          visualType = "image";
          visualDescription = `${agent.name} educational visual for: ${message}`;
        }
      } catch (error) {
        console.error('Visual generation error:', error);
      }
    }

    res.json({
      response: responseText,
      agentName: agent.name,
      schoolId: schoolId,
      visualUrl,
      visualType,
      visualDescription,
      timestamp: new Date().toISOString(),
      conversationId: `conv_${schoolId}_${Date.now()}_${userId || 'anonymous'}`
    });

  } catch (error) {
    console.error('School AI agent error:', error);
    res.status(500).json({ error: "Failed to process conversation with school agent" });
  }
});

// Get agent information for a school
router.get("/agent/:schoolId", async (req, res) => {
  try {
    const { schoolId } = req.params;
    
    if (!schoolAgents[schoolId]) {
      return res.status(404).json({ error: "School agent not found" });
    }

    const agent = schoolAgents[schoolId];
    
    res.json({
      name: agent.name,
      personality: agent.personality,
      schoolId: schoolId,
      capabilities: [
        "Real-time conversation",
        "Visual content generation",
        "Multi-modal learning support",
        "Neurodivergent adaptations",
        "School-specific expertise"
      ]
    });

  } catch (error) {
    console.error('Agent info error:', error);
    res.status(500).json({ error: "Failed to get agent information" });
  }
});

// List all available school agents
router.get("/agents", async (req, res) => {
  try {
    const agents = Object.entries(schoolAgents).map(([schoolId, agent]) => ({
      schoolId,
      name: agent.name,
      personality: agent.personality
    }));

    res.json({ agents });
  } catch (error) {
    console.error('Agents list error:', error);
    res.status(500).json({ error: "Failed to get agents list" });
  }
});

export default router;