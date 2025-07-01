import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { exec } from 'child_process';
import path from 'path';
import { secureRoute } from '../sentinel/middleware';

// Schema for agent creation requests
const createUniversalAgentSchema = z.object({
  subject: z.string().min(1),
  grade: z.string().min(1),
  tone: z.string().min(1),
  neuroType: z.string().min(1),
  outputModes: z.string().min(1)
});

// Schema for law professor creation requests
const createLawProfessorSchema = z.object({
  specialty: z.string().min(1),
  level: z.string().min(1),
  method: z.string().min(1),
  neuroType: z.string().min(1), 
  outputModes: z.string().min(1)
});

// Schema for language professor creation requests
const createLanguageProfessorSchema = z.object({
  language: z.enum(['English', 'Spanish', 'German']),
  proficiencyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  method: z.string().min(1),
  neuroType: z.string().min(1),
  outputModes: z.string().min(1)
});

/**
 * Execute the agent creation Python script with the provided parameters
 * @param scriptPath Path to the Python script
 * @param inputParams Input parameters to pass to the script
 * @returns Promise resolving to the script output
 */
function executeAgentCreationScript(scriptPath: string, inputParams: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    // Join all parameters with newlines to simulate sequential inputs
    const inputString = inputParams.join('\n');
    
    // Execute the Python script with input parameters
    const process = exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`Script stderr: ${stderr}`);
      }
      
      resolve(stdout);
    });
    
    // Write input parameters to the process stdin
    if (process.stdin) {
      process.stdin.write(inputString);
      process.stdin.end();
    }
  });
}

const router = Router();

// Route to create a universal teaching agent
router.post('/create-agent', secureRoute, async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validationResult = createUniversalAgentSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.format()
      });
    }
    
    const { subject, grade, tone, neuroType, outputModes } = validationResult.data;
    
    // Path to the Python script
    const scriptPath = path.join(process.cwd(), 'attached_assets', 'create_gpt_agent_from_template.py');
    
    // Execute the script with parameters
    const output = await executeAgentCreationScript(
      scriptPath,
      [subject, grade, tone, neuroType, outputModes]
    );
    
    // Extract agent name and path from the output
    let agentName = '';
    let agentPath = '';
    
    const agentNameMatch = output.match(/GPT Agent Profile '(.+?)' created successfully/);
    if (agentNameMatch && agentNameMatch[1]) {
      agentName = agentNameMatch[1];
    }
    
    const agentPathMatch = output.match(/Path: (.+?)$/m);
    if (agentPathMatch && agentPathMatch[1]) {
      agentPath = agentPathMatch[1];
    }
    
    return res.json({
      success: true,
      agentName,
      agentPath,
      output
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    return res.status(500).json({ error: 'Failed to create agent' });
  }
});

// Route to create a law professor agent
router.post('/create-law-professor', secureRoute, async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validationResult = createLawProfessorSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.format()
      });
    }
    
    const { specialty, level, method, neuroType, outputModes } = validationResult.data;
    
    // Path to the Python script
    const scriptPath = path.join(process.cwd(), 'attached_assets', 'create_law_professor_agent.py');
    
    // Execute the script with parameters
    const output = await executeAgentCreationScript(
      scriptPath,
      [specialty, level, method, neuroType, outputModes]
    );
    
    // Extract agent name and path from the output
    let agentName = '';
    let agentPath = '';
    
    const agentNameMatch = output.match(/Law Professor Agent '(.+?)' created successfully/);
    if (agentNameMatch && agentNameMatch[1]) {
      agentName = agentNameMatch[1];
    }
    
    const agentPathMatch = output.match(/Path: (.+?)$/m);
    if (agentPathMatch && agentPathMatch[1]) {
      agentPath = agentPathMatch[1];
    }
    
    return res.json({
      success: true,
      agentName,
      agentPath,
      output
    });
  } catch (error) {
    console.error('Error creating law professor agent:', error);
    return res.status(500).json({ error: 'Failed to create law professor agent' });
  }
});

// Route to create a language professor agent
router.post('/create-language-professor', secureRoute, async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validationResult = createLanguageProfessorSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.format()
      });
    }
    
    const { language, proficiencyLevel, method, neuroType, outputModes } = validationResult.data;
    
    // Path to the Python script
    const scriptPath = path.join(process.cwd(), 'attached_assets', 'create_language_professor_agent.py');
    
    // Execute the script with parameters
    const output = await executeAgentCreationScript(
      scriptPath,
      [language, proficiencyLevel, method, neuroType, outputModes]
    );
    
    // Extract agent name and path from the output
    let agentName = '';
    let agentPath = '';
    
    const agentNameMatch = output.match(/Language Professor Agent '(.+?)' created successfully/);
    if (agentNameMatch && agentNameMatch[1]) {
      agentName = agentNameMatch[1];
    }
    
    const agentPathMatch = output.match(/Path: (.+?)$/m);
    if (agentPathMatch && agentPathMatch[1]) {
      agentPath = agentPathMatch[1];
    }
    
    return res.json({
      success: true,
      agentName,
      agentPath,
      output
    });
  } catch (error) {
    console.error('Error creating language professor agent:', error);
    return res.status(500).json({ error: 'Failed to create language professor agent' });
  }
});

export default router;