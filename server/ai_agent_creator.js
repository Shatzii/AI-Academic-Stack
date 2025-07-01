// AI Agent Creator Interface
// This module provides an interface to the Python GPT agent creation script

import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Creates a new AI agent by calling the Python script with staff details
 * @param {Object} staffMember - Staff member details from the database
 * @returns {Promise<Object>} - Result of the agent creation
 */
export async function createAIAgent(staffMember) {
  return new Promise((resolve, reject) => {
    // Determine professor type based on department
    const isLawProfessor = staffMember.department?.toLowerCase().includes('law');
    const isLanguageProfessor = staffMember.department?.toLowerCase().includes('language') || 
                              staffMember.department?.toLowerCase().includes('english') ||
                              staffMember.department?.toLowerCase().includes('spanish') ||
                              staffMember.department?.toLowerCase().includes('german');
    
    let subject, grade, tone, neuroType, outputModes;
    
    if (isLawProfessor) {
      // For law professors, use legal-specific parameters
      subject = staffMember.department || 'Constitutional Law';
      grade = mapToLawEducationLevel(staffMember.gradeLevel);
      tone = mapToLegalTeachingMethod(staffMember.teachingStyle);
      neuroType = staffMember.specialization || 'All';
      outputModes = getLegalOutputModes(staffMember);
      console.log(`Creating Law Professor agent: ${subject}, ${grade}, ${tone}`);
    } else if (isLanguageProfessor) {
      // For language professors, determine the language and level
      let language = 'English'; // Default language
      
      // Extract language from department or specialization
      if (staffMember.department?.toLowerCase().includes('spanish')) {
        language = 'Spanish';
      } else if (staffMember.department?.toLowerCase().includes('german')) {
        language = 'German';
      }
      
      // Map grade level to proficiency level
      let proficiencyLevel = 'Intermediate';
      if (staffMember.gradeLevel?.toLowerCase().includes('beginner') || 
          staffMember.gradeLevel?.toLowerCase().includes('elementary')) {
        proficiencyLevel = 'Beginner';
      } else if (staffMember.gradeLevel?.toLowerCase().includes('advanced') || 
                staffMember.gradeLevel?.toLowerCase().includes('fluent')) {
        proficiencyLevel = 'Advanced';
      }
      
      // Determine teaching method for language
      let method = 'Communicative';
      if (staffMember.teachingStyle?.toLowerCase().includes('immersion')) {
        method = 'Immersion';
      } else if (staffMember.teachingStyle?.toLowerCase().includes('task')) {
        method = 'Task-Based';
      } else if (staffMember.teachingStyle?.toLowerCase().includes('grammar')) {
        method = 'Grammar-Translation';
      }
      
      // Set neurotype support
      neuroType = staffMember.specialization || 'All';
      
      // Determine language output modes
      let languageOutputModes = 'Dialogue, Visual Vocabulary';
      if (staffMember.teachingStyle?.toLowerCase().includes('audio') || 
          staffMember.teachingStyle?.toLowerCase().includes('listening')) {
        languageOutputModes += ', Audio Pronunciation';
      }
      if (staffMember.teachingStyle?.toLowerCase().includes('writing')) {
        languageOutputModes += ', Writing Exercises';
      }
      if (staffMember.teachingStyle?.toLowerCase().includes('reading')) {
        languageOutputModes += ', Reading Comprehension';
      }
      
      // For language professors
      subject = language;
      grade = proficiencyLevel;
      tone = method;
      outputModes = languageOutputModes;
      console.log(`Creating Language Professor agent: ${language}, ${proficiencyLevel}, ${method}`);
    } else {
      // For regular professors, use the original parameter mapping
      subject = staffMember.department || 'General';
      grade = staffMember.gradeLevel || 'K-12';
      tone = getPersonalityTone(staffMember);
      neuroType = staffMember.specialization || 'All';
      outputModes = getOutputModes(staffMember);
      console.log(`Creating Education Professor agent: ${subject}, ${grade}, ${tone}`);
    }
    
    // Use the JavaScript fallback directly instead of trying Python first
    try {
      const safeGrade = grade.replace(/\s+/g, '').replace(/-/g, '').replace(/–/g, '');
      const safeTone = tone.replace(/\s+/g, '');
      const agentName = `${subject}_${safeGrade}_${safeTone}_Bot`;
      const agentPath = `attached_assets/generated_agents/${agentName}.md`;
      
      const content = generateAgentContent(subject, grade, tone, neuroType, outputModes, agentName);
      const outputDir = path.join(process.cwd(), 'attached_assets', 'generated_agents');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(process.cwd(), agentPath), content);
      
      resolve({
        success: true,
        agentName,
        agentPath,
        output: `AI agent created using JavaScript implementation: ${agentName}`
      });
    } catch (error) {
      console.error(`Failed to create agent: ${error.message}`);
      reject(error);
    }
  });
}

/**
 * Generate agent content for fallback case
 */
function generateAgentContent(subject, grade, tone, neuroType, outputModes, agentName) {
  // Determine professor type based on subject name
  const isLawProfessor = subject.toLowerCase().includes('law');
  const isLanguageProfessor = subject.toLowerCase().includes('language') || 
                            subject.toLowerCase().includes('english') ||
                            subject.toLowerCase().includes('spanish') ||
                            subject.toLowerCase().includes('german');
  
  if (isLawProfessor) {
    // Generate Law Professor content
    return `
# GPT Law Professor: ${agentName}

**Legal Specialty:** ${subject}  
**Education Level:** ${grade}  
**Teaching Method:** ${tone}  
**Neurotype Support:** ${neuroType}  
**Output Modes:** ${outputModes}  

**Powered By:** ShotziOS Law Professor Template

## Core Responsibilities:
- Deliver adaptive legal instruction based on ${neuroType} needs
- Use ${tone} teaching approach with ${outputModes} format
- Monitor student response and adjust scaffold level
- Provide IRAC framework guidance and case analysis support
- Prepare students for bar examination success
- Collaborate with other ShotziOS bots as needed

## Linked Modules:
- Law Mission Tracking System
- Bar Exam Preparation Module
- Legal Research Methodology Guide
- Case Briefing Structure Assistant

## Legal Education Focus:
- ${subject} principles and doctrine
- Case law analysis for ${grade} students
- Practical application of legal concepts
- Ethical considerations in legal practice
`;
  } else if (isLanguageProfessor) {
    // Extract language from subject name
    let language = 'English'; // Default language
    if (subject.toLowerCase().includes('spanish')) {
      language = 'Spanish';
    } else if (subject.toLowerCase().includes('german')) {
      language = 'German';
    }
    
    // Map grade to proficiency level
    let proficiencyLevel = grade;
    if (!['Beginner', 'Intermediate', 'Advanced'].includes(proficiencyLevel)) {
      proficiencyLevel = 'Intermediate'; // Default if not explicitly set
    }
    
    // Generate Language Professor content
    return `
# GPT Language Professor: ${agentName}

**Language:** ${language}  
**Proficiency Level:** ${proficiencyLevel}  
**Teaching Method:** ${tone}  
**Neurotype Support:** ${neuroType}  
**Output Modes:** ${outputModes}  

**Powered By:** ShotziOS Language Professor Template

## Core Responsibilities:
- Deliver adaptive ${language} instruction based on ${neuroType} needs
- Use ${tone} teaching approach with ${outputModes} format
- Monitor student response and adjust scaffold level
- Provide pronunciation guidance and vocabulary building
- Support reading comprehension and writing skills
- Collaborate with other ShotziOS bots as needed

## Linked Modules:
- Language Progress Tracking System
- Vocabulary Mastery Module
- Grammar Structure Visualizer
- Cultural Context Library
- Pronunciation Audio Database

## Language Education Focus:
- ${language} vocabulary building and retention
- Conversational practice at ${proficiencyLevel} level
- Reading and listening comprehension
- Cultural context and authentic language use
- Grammar structure explanation and practice
`;
  } else {
    // Generate standard professor content
    return `
# GPT Education Professor: ${agentName}

**Subject:** ${subject}  
**Grade Level:** ${grade}  
**Teaching Style:** ${tone}  
**Neurotype Support:** ${neuroType}  
**Output Modes:** ${outputModes}  

**Powered By:** ShotziOS Education Professor Template

## Core Responsibilities:
- Deliver adaptive ${subject} instruction based on ${neuroType} needs
- Use ${tone} teaching approach with ${outputModes} format
- Monitor student response and adjust scaffold level
- Build superhero-themed activities for ${subject} mastery
- Support executive function and learning strategies
- Collaborate with other ShotziOS bots as needed

## Linked Modules:
- Learning Path Generator
- Knowledge Graph Visualizer
- Engagement Monitoring System
- Superhero Reward Integration
- Multi-modal Content Delivery

## Education Focus:
- ${subject} core concepts for ${grade} level
- Real-world application and project-based learning
- Building confidence and self-efficacy
- Development of metacognitive skills
- Strength-based learning approaches
`;
  }
}

/**
 * Maps staff teaching style and personality traits to a tone for the AI
 * @param {Object} staffMember - Staff member details
 * @returns {string} - Tone suitable for the Python script
 */
function getPersonalityTone(staffMember) {
  // Extract keywords from teaching style and personality traits
  const traits = (staffMember.personalityTraits || '').toLowerCase();
  const style = (staffMember.teachingStyle || '').toLowerCase();
  const combined = traits + ' ' + style;
  
  // Map common terms to the four primary tones expected by the script
  if (combined.includes('calm') || combined.includes('patient')) {
    return 'Calm';
  } else if (combined.includes('curious') || combined.includes('question')) {
    return 'Curious';
  } else if (combined.includes('playful') || combined.includes('fun') || combined.includes('engaging')) {
    return 'Playful';
  } else if (combined.includes('visual') || combined.includes('image')) {
    return 'Visual-First';
  }
  
  // Default tone
  return 'Supportive';
}

/**
 * Determines the output modes based on staff teaching style
 * @param {Object} staffMember - Staff member details
 * @returns {string} - Output modes for the AI
 */
function getOutputModes(staffMember) {
  const style = (staffMember.teachingStyle || '').toLowerCase();
  
  // Map teaching style to output modes
  const modes = [];
  
  if (style.includes('dialogue') || style.includes('conversation')) {
    modes.push('Dialogue');
  }
  
  if (style.includes('checklist') || style.includes('steps') || style.includes('procedure')) {
    modes.push('Checklist');
  }
  
  if (style.includes('visual') || style.includes('image') || style.includes('diagram')) {
    modes.push('Visual');
  }
  
  if (style.includes('example') || style.includes('scenario')) {
    modes.push('Examples');
  }
  
  // Default output modes if none detected
  return modes.length > 0 ? modes.join(', ') : 'Dialogue, Examples';
}

/**
 * Maps grade level to appropriate law education level
 * @param {string} gradeLevel - Original grade level from staff record
 * @returns {string} - Law education level (Pre-Law, 1L, 2L, 3L, Bar Prep)
 */
function mapToLawEducationLevel(gradeLevel) {
  if (!gradeLevel) return 'Pre-Law';
  
  const grade = gradeLevel.toLowerCase();
  
  if (grade.includes('undergraduate') || grade.includes('college')) {
    return 'Pre-Law';
  } else if (grade.includes('1l') || grade.includes('first year') || grade.includes('1st year')) {
    return '1L';
  } else if (grade.includes('2l') || grade.includes('second year') || grade.includes('2nd year')) {
    return '2L';
  } else if (grade.includes('3l') || grade.includes('third year') || grade.includes('3rd year')) {
    return '3L';
  } else if (grade.includes('bar') || grade.includes('exam prep')) {
    return 'Bar Prep';
  } else if (grade.includes('master') || grade.includes('llm')) {
    return 'LLM';
  }
  
  // Default to Pre-Law if no match found
  return 'Pre-Law';
}

/**
 * Maps teaching style to legal teaching method
 * @param {string} teachingStyle - Original teaching style from staff record
 * @returns {string} - Legal teaching method (Socratic, Case Study, Problem-Based, Visual)
 */
function mapToLegalTeachingMethod(teachingStyle) {
  if (!teachingStyle) return 'Socratic';
  
  const style = teachingStyle.toLowerCase();
  
  if (style.includes('socratic') || style.includes('question')) {
    return 'Socratic';
  } else if (style.includes('case') || style.includes('precedent')) {
    return 'Case Study';
  } else if (style.includes('problem') || style.includes('practical')) {
    return 'Problem-Based';
  } else if (style.includes('visual') || style.includes('diagram')) {
    return 'Visual';
  } else if (style.includes('hypothetical') || style.includes('scenario')) {
    return 'Hypothetical';
  }
  
  // Default to Socratic if no match found (traditional law school method)
  return 'Socratic';
}

/**
 * Determines appropriate legal output modes based on staff teaching style
 * @param {Object} staffMember - Staff member details
 * @returns {string} - Legal output modes for the Law Professor
 */
function getLegalOutputModes(staffMember) {
  const style = (staffMember.teachingStyle || '').toLowerCase();
  
  // Map teaching style to legal output modes
  const modes = [];
  
  if (style.includes('case') || style.includes('brief')) {
    modes.push('Case Briefing');
  }
  
  if (style.includes('analysis') || style.includes('irac')) {
    modes.push('Legal Analysis');
  }
  
  if (style.includes('visual') || style.includes('schema') || style.includes('diagram')) {
    modes.push('Visual Schemas');
  }
  
  if (style.includes('practice') || style.includes('question') || style.includes('quiz')) {
    modes.push('Practice Questions');
  }
  
  if (style.includes('moot') || style.includes('mock') || style.includes('trial')) {
    modes.push('Trial Simulation');
  }
  
  // Default output modes for legal education if none detected
  return modes.length > 0 ? modes.join(', ') : 'Case Briefing, Legal Analysis';
}