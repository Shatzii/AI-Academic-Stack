"""
AI Service Client for OpenEdTex
Handles communication with self-hosted AI service with OpenAI fallback
"""

import os
import logging
import requests
from typing import List, Dict, Optional, Tuple
import openai
import time

logger = logging.getLogger(__name__)

class AIServiceClient:
    """Client for communicating with AI services"""

    def __init__(self):
        self.ai_service_url = os.getenv('AI_SERVICE_URL', 'http://localhost:8001')
        self.openai_api_key = os.getenv('OPENAI_API_KEY', '')
        self.ai_mode = os.getenv('AI_MODE', 'hybrid')  # 'ollama', 'openai', 'hybrid'

        # Initialize OpenAI client if available
        self.openai_client = None
        if self.openai_api_key:
            try:
                self.openai_client = openai.OpenAI(api_key=self.openai_api_key)
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI client: {e}")
                self.openai_client = None

    def chat_completion(self, messages: List[Dict[str, str]],
                       model: Optional[str] = None,
                       temperature: float = 0.7,
                       max_tokens: int = 1000) -> Tuple[str, int, float, str]:
        """
        Generate chat completion with fallback logic

        Returns:
            Tuple of (response_text, tokens_used, response_time, service_type)
        """
        start_time = time.time()

        # Try AI service first (if in hybrid or ollama mode)
        if self.ai_mode in ['hybrid', 'ollama']:
            try:
                response = self._call_ai_service(messages, model, temperature, max_tokens)
                if response:
                    response_time = round(time.time() - start_time, 2)
                    return response['response'], response.get('tokens_used', 0), response_time, 'ollama'
            except Exception as e:
                logger.warning(f"AI service failed: {e}")

        # Fallback to OpenAI (if in hybrid or openai mode)
        if self.ai_mode in ['hybrid', 'openai'] and self.openai_client:
            try:
                response = self._call_openai(messages, model, temperature, max_tokens)
                response_time = round(time.time() - start_time, 2)
                return response[0], response[1], response[2], 'openai'
            except Exception as e:
                logger.error(f"OpenAI fallback failed: {e}")

        # Final fallback
        fallback_response = "I'm sorry, I'm having trouble processing your request right now. Please try again later."
        response_time = round(time.time() - start_time, 2)
        return fallback_response, 0, response_time, 'fallback'

    def _call_ai_service(self, messages: List[Dict[str, str]],
                        model: Optional[str],
                        temperature: float,
                        max_tokens: int) -> Optional[Dict]:
        """Call the local AI service"""
        try:
            payload = {
                "messages": messages,
                "model": model,
                "temperature": temperature,
                "max_tokens": max_tokens
            }

            response = requests.post(
                f"{self.ai_service_url}/chat",
                json=payload,
                timeout=30
            )

            if response.status_code == 200:
                return response.json()
            else:
                logger.warning(f"AI service returned status {response.status_code}")
                return None

        except requests.RequestException as e:
            logger.warning(f"AI service request failed: {e}")
            return None

    def _call_openai(self, messages: List[Dict[str, str]],
                    model: Optional[str],
                    temperature: float,
                    max_tokens: int) -> Tuple[str, int, float, str]:
        """Call OpenAI API"""
        if not self.openai_client:
            raise Exception("OpenAI client not initialized")

        model = model or "gpt-3.5-turbo"

        response = self.openai_client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )

        ai_response = response.choices[0].message.content
        tokens_used = response.usage.total_tokens

        return ai_response, tokens_used, 0, 'openai'  # response_time will be calculated in calling function

    def get_available_models(self) -> List[Dict]:
        """Get list of available models from AI service"""
        try:
            response = requests.get(f"{self.ai_service_url}/models", timeout=10)
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            logger.warning(f"Failed to get models: {e}")
            return []

    def health_check(self) -> Dict:
        """Check AI service health"""
        try:
            response = requests.get(f"{self.ai_service_url}/health", timeout=5)
            if response.status_code == 200:
                return response.json()
            return {"status": "unhealthy"}
        except Exception as e:
            return {"status": "unreachable"}

# Global AI client instance
ai_client = AIServiceClient()

def get_ai_response(messages: List[Dict[str, str]],
                   model: Optional[str] = None,
                   temperature: float = 0.7,
                   max_tokens: int = 1000) -> Tuple[str, int, float, str]:
    """
    Convenience function to get AI response

    Returns:
        Tuple of (response_text, tokens_used, response_time, service_type)
    """
    return ai_client.chat_completion(messages, model, temperature, max_tokens)
