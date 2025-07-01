/**
 * Anthropic School Integrations Service
 * 
 * This service provides AI-powered content generation for the educational platforms,
 * including Language School, Law School, and Superhero School, using the Anthropic Claude API.
 */

import { AnthropicService } from '../anthropic-service';

/**
 * Generate a vocabulary list for language learning
 * @param language Target language (e.g., English, Spanish, German)
 * @param proficiencyLevel Level of proficiency (Beginner, Intermediate, Advanced, Fluent)
 * @param topic Topic for vocabulary (e.g., Food, Travel, Business)
 * @returns Promise<Object> Generated vocabulary list
 */
export async function generateVocabularyList(
  language: string,
  proficiencyLevel: string,
  topic: string
): Promise<any> {
  try {
    // Create system prompt for vocabulary generation
    const systemPrompt = `You are an expert language educator specializing in ${language} instruction.
    Your task is to create helpful, culturally appropriate vocabulary lists for ${proficiencyLevel} level students
    learning ${language}. Focus on useful, practical vocabulary that students can immediately apply.`;
    
    // Create the main prompt
    const prompt = `Please create a vocabulary list for ${proficiencyLevel} level ${language} learners on the topic of "${topic}".
    
    Include:
    - 15-20 vocabulary words/phrases appropriate for this level
    - The translation in English
    - A natural example sentence showing the word in context
    - Part of speech for each word
    - Any important cultural notes about usage
    
    Format your response as a JSON object with this structure:
    {
      "title": "Vocabulary List Title",
      "language": "${language}",
      "level": "${proficiencyLevel}",
      "topic": "${topic}",
      "description": "Brief description of this vocabulary set",
      "words": [
        {
          "term": "Word in ${language}",
          "partOfSpeech": "noun/verb/adj/etc",
          "translation": "English translation",
          "exampleSentence": "Example sentence in ${language}",
          "pronunciation": "Simple pronunciation guide",
          "culturalNotes": "Optional cultural context"
        }
      ]
    }`;
    
    // Call Anthropic API
    const result = await AnthropicService.generateText(prompt, {
      systemPrompt,
      maxTokens: 2000,
      temperature: 0.7
    });
    
    // Extract JSON from the result
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse vocabulary list from AI response');
    }
    
    const vocabularyList = JSON.parse(jsonMatch[0]);
    return vocabularyList;
  } catch (error) {
    console.error('Error generating vocabulary list:', error);
    throw new Error(`Failed to generate vocabulary list: ${(error as Error).message}`);
  }
}

/**
 * Create a language dialogue for conversation practice
 * @param language Target language
 * @param proficiencyLevel Level of proficiency
 * @param situation The conversational situation/context
 * @param participants Number of participants in the dialogue
 * @returns Promise<Object> Generated dialogue
 */
export async function createLanguageDialogue(
  language: string,
  proficiencyLevel: string,
  situation: string,
  participants: number = 2
): Promise<any> {
  try {
    // Create system prompt for dialogue generation
    const systemPrompt = `You are an expert ${language} language educator creating educational dialogues.
    Your task is to craft natural, culturally authentic dialogues for ${proficiencyLevel} level students.
    Use appropriate vocabulary, grammar, and cultural references for ${language} speakers.`;
    
    // Create the main prompt
    const prompt = `Please create a realistic dialogue in ${language} for ${proficiencyLevel} level learners.
    
    Situation: ${situation}
    Number of participants: ${participants}
    
    Include:
    - Natural conversational flow with appropriate greetings and closings
    - Vocabulary appropriate for ${proficiencyLevel} level
    - Cultural elements authentic to ${language} speakers
    - English translations for each line
    - Brief notes on key phrases, idioms, or cultural references
    
    Format your response as a JSON object with this structure:
    {
      "title": "Descriptive title for the dialogue",
      "situation": "${situation}",
      "language": "${language}",
      "level": "${proficiencyLevel}",
      "participants": ["Character 1", "Character 2"${participants > 2 ? ', "Character 3"' : ''}],
      "dialogue": [
        {
          "speaker": "Character name",
          "original": "Line in ${language}",
          "translation": "English translation",
          "notes": "Optional language or cultural note"
        }
      ],
      "keyPhrases": [
        {
          "phrase": "Important phrase",
          "translation": "Translation",
          "usage": "How and when to use this phrase"
        }
      ]
    }`;
    
    // Call Anthropic API
    const result = await AnthropicService.generateText(prompt, {
      systemPrompt,
      maxTokens: 2500,
      temperature: 0.7
    });
    
    // Extract JSON from the result
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse dialogue from AI response');
    }
    
    const dialogue = JSON.parse(jsonMatch[0]);
    return dialogue;
  } catch (error) {
    console.error('Error creating language dialogue:', error);
    throw new Error(`Failed to create language dialogue: ${(error as Error).message}`);
  }
}

/**
 * Generate grammar exercises for language learning
 * @param language Target language
 * @param proficiencyLevel Level of proficiency
 * @param grammarTopic Specific grammar topic
 * @returns Promise<Object> Generated grammar exercises
 */
export async function generateGrammarExercises(
  language: string,
  proficiencyLevel: string,
  grammarTopic: string
): Promise<any> {
  try {
    // Create system prompt for grammar exercise generation
    const systemPrompt = `You are an expert ${language} language educator specializing in grammar instruction.
    Your task is to create effective, level-appropriate grammar exercises for ${proficiencyLevel} level students
    learning ${language}.`;
    
    // Create the main prompt
    const prompt = `Please create a set of grammar exercises for ${proficiencyLevel} level ${language} learners focusing on "${grammarTopic}".
    
    Include:
    - A brief explanation of the grammar rule in simple terms
    - 3-4 example sentences showing correct usage
    - 10 practice exercises (5 fill-in-the-blank and 5 sentence formation)
    - Answer key with explanations
    
    Format your response as a JSON object with this structure:
    {
      "title": "Grammar Exercise Title",
      "language": "${language}",
      "level": "${proficiencyLevel}",
      "grammarTopic": "${grammarTopic}",
      "explanation": "Clear explanation of the grammar rule",
      "examples": [
        {
          "sentence": "Example sentence in ${language}",
          "translation": "English translation",
          "explanation": "Why this demonstrates the rule"
        }
      ],
      "exercises": {
        "fillInTheBlank": [
          {
            "question": "Sentence with ____ blank",
            "answer": "Correct answer",
            "explanation": "Why this is correct"
          }
        ],
        "sentenceFormation": [
          {
            "words": ["Scrambled", "words", "to", "arrange"],
            "correctSentence": "The correct sentence",
            "translation": "English translation"
          }
        ]
      }
    }`;
    
    // Call Anthropic API
    const result = await AnthropicService.generateText(prompt, {
      systemPrompt,
      maxTokens: 3000,
      temperature: 0.7
    });
    
    // Extract JSON from the result
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse grammar exercises from AI response');
    }
    
    const grammarExercises = JSON.parse(jsonMatch[0]);
    return grammarExercises;
  } catch (error) {
    console.error('Error generating grammar exercises:', error);
    throw new Error(`Failed to generate grammar exercises: ${(error as Error).message}`);
  }
}

/**
 * Generate a cultural lesson for language learning
 * @param language Target language
 * @param proficiencyLevel Level of proficiency
 * @param culturalTopic Cultural topic to explore
 * @returns Promise<Object> Generated cultural lesson
 */
export async function generateCulturalLesson(
  language: string,
  proficiencyLevel: string,
  culturalTopic: string
): Promise<any> {
  try {
    // Determine the culture based on language
    let culture = '';
    switch (language.toLowerCase()) {
      case 'spanish':
        culture = 'Hispanic cultures (Spain, Mexico, Latin America)';
        break;
      case 'german':
        culture = 'German-speaking countries (Germany, Austria, Switzerland)';
        break;
      case 'english':
        culture = 'English-speaking countries (UK, USA, Canada, Australia)';
        break;
      default:
        culture = `${language}-speaking countries`;
    }
    
    // Create system prompt for cultural lesson generation
    const systemPrompt = `You are an expert in ${culture} and the ${language} language.
    Your task is to create engaging, accurate cultural lessons that help language learners understand
    the cultural context behind the ${language} language. Provide authentic insights that go beyond stereotypes.`;
    
    // Create the main prompt
    const prompt = `Please create a cultural lesson about "${culturalTopic}" for ${proficiencyLevel} level ${language} learners.
    
    Include:
    - An engaging introduction to the cultural topic
    - Historical and contemporary context
    - How this cultural element relates to language use
    - 5-8 key vocabulary terms related to this cultural topic
    - 2-3 discussion questions for students
    - A brief authentic text sample (poem, song lyrics, proverb, etc.) related to the topic
    
    Format your response as a JSON object with this structure:
    {
      "title": "Cultural Lesson Title",
      "language": "${language}",
      "culture": "${culture}",
      "level": "${proficiencyLevel}",
      "topic": "${culturalTopic}",
      "introduction": "Engaging introduction to the topic",
      "mainContent": "The core cultural lesson with historical and contemporary context",
      "languageConnections": "How this cultural topic connects to language use",
      "keyVocabulary": [
        {
          "term": "Cultural term in ${language}",
          "translation": "English translation",
          "context": "How and when this term is used"
        }
      ],
      "discussionQuestions": [
        "Question 1?",
        "Question 2?"
      ],
      "authenticMaterial": {
        "type": "song/poem/proverb/etc",
        "content": "The authentic text in ${language}",
        "translation": "English translation",
        "significance": "Cultural significance of this text"
      }
    }`;
    
    // Call Anthropic API
    const result = await AnthropicService.generateText(prompt, {
      systemPrompt,
      maxTokens: 3000,
      temperature: 0.7
    });
    
    // Extract JSON from the result
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse cultural lesson from AI response');
    }
    
    const culturalLesson = JSON.parse(jsonMatch[0]);
    return culturalLesson;
  } catch (error) {
    console.error('Error generating cultural lesson:', error);
    throw new Error(`Failed to generate cultural lesson: ${(error as Error).message}`);
  }
}

/**
 * LAW SCHOOL FUNCTIONS
 */

/**
 * Analyze a legal case and provide structured insights
 * @param caseText The text of the legal case to analyze
 * @param legalArea The area of law (e.g., Contract, Criminal, Constitutional)
 * @param prompt Any specific instructions for the analysis
 * @returns Promise<Object> Structured case analysis
 */
export async function analyzeLegalCase(
  caseText: string,
  legalArea: string,
  prompt: string = ''
): Promise<any> {
  try {
    // Create system prompt for legal case analysis
    const systemPrompt = `You are an expert legal professor specializing in ${legalArea} law.
    Your task is to analyze legal cases and provide clear, structured insights
    for law students. Focus on key legal principles, reasoning, and implications.`;
    
    // Create the main prompt
    const mainPrompt = `Please analyze the following ${legalArea} law case:

${caseText}

${prompt ? `Additional analysis instructions: ${prompt}` : ''}

Provide a comprehensive analysis including:
- Case summary
- Key facts
- Legal issues presented
- Legal reasoning
- Court's holding
- Precedential value
- Implications for future cases

Format your response as a JSON object with this structure:
{
  "title": "Case Name",
  "citation": "Legal citation if identifiable",
  "summary": "Brief summary of the case",
  "facts": {
    "key_facts": ["Fact 1", "Fact 2", "..."],
    "parties": {
      "plaintiff": "Description",
      "defendant": "Description"
    },
    "timeline": ["Event 1", "Event 2", "..."]
  },
  "issues": ["Legal issue 1", "Legal issue 2", "..."],
  "reasoning": "Analysis of the court's legal reasoning",
  "holding": "The court's decision",
  "dissent": "Any dissenting opinions (if applicable)",
  "significance": "The case's importance and precedential value",
  "keyPrinciples": ["Legal principle 1", "Legal principle 2", "..."],
  "implications": "Implications for future cases"
}`;
    
    // Call Anthropic API
    const result = await AnthropicService.generateText(mainPrompt, {
      systemPrompt,
      maxTokens: 3000,
      temperature: 0.3 // Lower temperature for more factual analysis
    });
    
    // Extract JSON from the result
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse legal case analysis from AI response');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error('Error analyzing legal case:', error);
    throw new Error(`Failed to analyze legal case: ${(error as Error).message}`);
  }
}

/**
 * Generate practice UAE bar exam questions
 * @param legalTopic The legal topic to focus questions on
 * @param questionCount Number of questions to generate (default: 3)
 * @param format Question format (multiple-choice or essay)
 * @returns Promise<Object> Generated bar exam questions
 */
export async function generateBarExamQuestions(
  legalTopic: string,
  questionCount: number = 3,
  format: string = 'multiple-choice'
): Promise<any> {
  try {
    // Create system prompt for bar exam question generation
    const systemPrompt = `You are an expert UAE bar exam preparation coach.
    Your task is to create challenging, realistic bar exam questions on ${legalTopic}
    that reflect the actual difficulty and style of the UAE bar examination.`;
    
    // Create the main prompt
    const mainPrompt = `Please generate ${questionCount} ${format} questions on ${legalTopic} for UAE bar exam preparation.

The questions should:
- Be highly relevant to UAE legal practice
- Reflect actual UAE bar exam difficulty
- Test critical thinking and application of legal principles
- Include clear explanations of correct answers
${format === 'multiple-choice' ? '- Have 4 answer choices (A, B, C, D) with only one correct answer' : '- Require comprehensive analysis of complex legal scenarios'}

Format your response as a JSON object with this structure:
{
  "topic": "${legalTopic}",
  "format": "${format}",
  "questions": [
    {
      "questionNumber": 1,
      "questionText": "The question stem",
      ${format === 'multiple-choice' ? `
      "options": {
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      },
      "correctAnswer": "The correct letter (A, B, C, or D)",` 
      : ''}
      "explanation": "Detailed explanation of why the answer is correct and why others are incorrect",
      "relatedPrinciples": ["Legal principle 1", "Legal principle 2"]
    }
  ]
}`;
    
    // Call Anthropic API
    const result = await AnthropicService.generateText(mainPrompt, {
      systemPrompt,
      maxTokens: 3000,
      temperature: 0.4
    });
    
    // Extract JSON from the result
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse bar exam questions from AI response');
    }
    
    const questions = JSON.parse(jsonMatch[0]);
    return questions;
  } catch (error) {
    console.error('Error generating bar exam questions:', error);
    throw new Error(`Failed to generate bar exam questions: ${(error as Error).message}`);
  }
}