/**
 * Type definition for the AI Agent Creator module
 */

export interface AgentCreationResult {
  success: boolean;
  agentName: string;
  agentPath: string;
  output: string;
  error?: string;
}

/**
 * Creates a new AI agent by calling the Python script with staff details
 * @param staffMember - Staff member details from the database
 * @returns Result of the agent creation operation
 */
export function createAIAgent(staffMember: any): Promise<AgentCreationResult>;