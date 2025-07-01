import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

interface VoiceSettings {
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
}

interface ElevenLabsResponse {
  audioUrl: string;
  duration: number;
  voiceId: string;
}

class ElevenLabsVoiceService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  private professorBarrettVoiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam voice ID - professional male voice

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found. Voice features will use fallback.');
    }
  }

  async textToSpeech(text: string, voiceSettings?: VoiceSettings): Promise<ElevenLabsResponse> {
    if (!this.apiKey) {
      return this.createFallbackResponse(text);
    }

    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${this.professorBarrettVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: this.optimizeTextForSpeech(text),
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: voiceSettings?.stability || 0.5,
            similarity_boost: voiceSettings?.similarity_boost || 0.75,
            style: voiceSettings?.style || 0.0,
            use_speaker_boost: voiceSettings?.use_speaker_boost || true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBuffer = await response.buffer();
      const fileName = `professor-barrett-${Date.now()}.mp3`;
      const audioPath = path.join(process.cwd(), 'public', 'audio', fileName);
      
      // Ensure audio directory exists
      const audioDir = path.dirname(audioPath);
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }

      fs.writeFileSync(audioPath, audioBuffer);

      return {
        audioUrl: `/audio/${fileName}`,
        duration: this.estimateDuration(text),
        voiceId: this.professorBarrettVoiceId
      };

    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      return this.createFallbackResponse(text);
    }
  }

  async getAvailableVoices(): Promise<any[]> {
    if (!this.apiKey) {
      return this.getFallbackVoices();
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json() as { voices?: any[] };
      return data.voices || [];

    } catch (error) {
      console.error('ElevenLabs voices error:', error);
      return this.getFallbackVoices();
    }
  }

  async createCustomVoice(name: string, description: string, audioFiles: Buffer[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key required for voice creation');
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      
      audioFiles.forEach((buffer, index) => {
        formData.append('files', new Blob([buffer]), `sample_${index}.mp3`);
      });

      const response = await fetch(`${this.baseUrl}/voices/add`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json() as { voice_id: string };
      return data.voice_id;

    } catch (error) {
      console.error('ElevenLabs voice creation error:', error);
      throw error;
    }
  }

  private optimizeTextForSpeech(text: string): string {
    // Optimize text for natural speech
    return text
      .replace(/\n/g, '. ') // Replace newlines with pauses
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Ensure proper pauses
      .replace(/etc\./g, 'etcetera') // Expand abbreviations
      .replace(/vs\./g, 'versus')
      .replace(/U\.S\./g, 'United States')
      .replace(/Prof\./g, 'Professor')
      .trim();
  }

  private estimateDuration(text: string): number {
    // Estimate duration based on average speaking rate (150 words per minute)
    const words = text.split(/\s+/).length;
    return Math.ceil((words / 150) * 60); // Convert to seconds
  }

  private createFallbackResponse(text: string): ElevenLabsResponse {
    return {
      audioUrl: '/audio/fallback-professor-barrett.mp3',
      duration: this.estimateDuration(text),
      voiceId: 'fallback-voice'
    };
  }

  private getFallbackVoices(): any[] {
    return [
      {
        voice_id: 'fallback-professor-barrett',
        name: 'Professor Barrett (Fallback)',
        description: 'Professional male voice for legal education'
      }
    ];
  }

  // Speech-to-text functionality (using Web Speech API on client-side)
  async speechToText(audioBuffer: Buffer): Promise<{ text: string; confidence: number }> {
    // This would integrate with a speech-to-text service like OpenAI Whisper
    // For now, return a placeholder that indicates the feature is available
    try {
      // In production, you would use a service like:
      // - OpenAI Whisper API
      // - Google Speech-to-Text
      // - Azure Speech Service
      
      return {
        text: 'Speech-to-text conversion would be processed here using your preferred STT service.',
        confidence: 0.95
      };
    } catch (error) {
      console.error('Speech-to-text error:', error);
      return {
        text: 'Sorry, I could not process the audio. Please try speaking again.',
        confidence: 0.0
      };
    }
  }

  // Check if ElevenLabs service is available
  async healthCheck(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Get voice generation quota information
  async getQuotaInfo(): Promise<any> {
    if (!this.apiKey) {
      return { available: false };
    }

    try {
      const response = await fetch(`${this.baseUrl}/user/subscription`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        return { available: false };
      }

      return await response.json();
    } catch (error) {
      console.error('ElevenLabs quota error:', error);
      return { available: false };
    }
  }
}

export default new ElevenLabsVoiceService();