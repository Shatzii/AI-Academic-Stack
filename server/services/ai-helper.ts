import Anthropic from '@anthropic-ai/sdk';

/**
 * Extracts text content from various types of Anthropic API responses
 * This helps maintain compatibility with different response formats
 * 
 * @param message The response from Anthropic API
 * @returns The extracted text content
 */
export function getTextFromResponse(message: any): string {
  // Handle different response formats
  try {
    // First check if the response has content property that's an array
    if (Array.isArray(message.content)) {
      // Filter for text blocks and combine them
      const textBlocks = message.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text);
        
      if (textBlocks.length > 0) {
        return textBlocks.join('\n\n');
      }
    }
    
    // If we get here, try to access content directly
    // This supports legacy/different API response formats
    if (typeof message.content === 'string') {
      return message.content;
    }
    
    // New API format (Claude 3)
    if (message.content && message.content[0] && message.content[0].type === 'text') {
      return message.content[0].text || '';
    }
  } catch (error) {
    console.error('Error parsing Anthropic response:', error);
  }
  
  // If all else fails
  return JSON.stringify(message);
}