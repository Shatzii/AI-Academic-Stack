"""
Hugging Face Transformers Implementation for OpenEdTex
"""

import os
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    pipeline,
    BitsAndBytesConfig
)
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class HuggingFaceAI:
    """Hugging Face Transformers AI implementation"""

    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.models = {}
        self.tokenizers = {}
        self.pipelines = {}

    def load_model(self, model_name: str, use_4bit: bool = True):
        """Load a Hugging Face model"""
        try:
            logger.info(f"Loading model: {model_name}")

            # Quantization config for memory efficiency
            if use_4bit and self.device == "cuda":
                quantization_config = BitsAndBytesConfig(
                    load_in_4bit=True,
                    bnb_4bit_compute_dtype=torch.float16,
                    bnb_4bit_use_double_quant=True,
                    bnb_4bit_quant_type="nf4"
                )
            else:
                quantization_config = None

            # Load tokenizer
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            if tokenizer.pad_token is None:
                tokenizer.pad_token = tokenizer.eos_token

            # Load model
            model = AutoModelForCausalLM.from_pretrained(
                model_name,
                quantization_config=quantization_config,
                device_map="auto" if self.device == "cuda" else None,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                low_cpu_mem_usage=True,
            )

            # Create pipeline
            pipe = pipeline(
                "text-generation",
                model=model,
                tokenizer=tokenizer,
                device=0 if self.device == "cuda" else -1,
                max_new_tokens=512,
                temperature=0.7,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )

            self.models[model_name] = model
            self.tokenizers[model_name] = tokenizer
            self.pipelines[model_name] = pipe

            logger.info(f"Successfully loaded model: {model_name}")
            return True

        except Exception as e:
            logger.error(f"Failed to load model {model_name}: {e}")
            return False

    def generate_response(self, model_name: str, messages: List[Dict[str, str]],
                         max_tokens: int = 512, temperature: float = 0.7) -> str:
        """Generate response using specified model"""
        if model_name not in self.pipelines:
            raise ValueError(f"Model {model_name} not loaded")

        try:
            # Convert messages to prompt format
            prompt = self._format_messages(messages)

            # Generate response
            pipe = self.pipelines[model_name]
            outputs = pipe(
                prompt,
                max_new_tokens=max_tokens,
                temperature=temperature,
                do_sample=True,
                pad_token_id=pipe.tokenizer.eos_token_id,
                num_return_sequences=1
            )

            # Extract generated text
            generated_text = outputs[0]['generated_text']
            response = generated_text[len(prompt):].strip()

            return response

        except Exception as e:
            logger.error(f"Generation error: {e}")
            return f"Error generating response: {str(e)}"

    def _format_messages(self, messages: List[Dict[str, str]]) -> str:
        """Format messages for the model"""
        formatted = ""
        for msg in messages:
            role = msg.get('role', 'user')
            content = msg.get('content', '')

            if role == 'system':
                formatted += f"System: {content}\n\n"
            elif role == 'user':
                formatted += f"Human: {content}\n\n"
            elif role == 'assistant':
                formatted += f"Assistant: {content}\n\n"

        formatted += "Assistant:"
        return formatted

    def get_available_models(self) -> List[str]:
        """Get list of loaded models"""
        return list(self.models.keys())

    def unload_model(self, model_name: str):
        """Unload a model to free memory"""
        if model_name in self.models:
            del self.models[model_name]
            del self.tokenizers[model_name]
            del self.pipelines[model_name]
            logger.info(f"Unloaded model: {model_name}")

# Recommended models for different use cases
RECOMMENDED_MODELS = {
    "general": [
        "microsoft/DialoGPT-medium",
        "facebook/blenderbot-400M-distill",
        "microsoft/DialoGPT-large"
    ],
    "educational": [
        "microsoft/DialoGPT-medium",  # Good for conversational AI
        "facebook/blenderbot-400M-distill",  # Educational conversations
    ],
    "coding": [
        "Salesforce/codegen-350M-multi",  # Code generation
        "microsoft/DialoGPT-medium",  # Code explanations
    ],
    "creative": [
        "microsoft/DialoGPT-large",  # More creative responses
        "facebook/blenderbot-1B-distill",  # Better context understanding
    ]
}

# Smaller models that run well on CPU
CPU_MODELS = [
    "microsoft/DialoGPT-small",
    "facebook/blenderbot-400M-distill",
    "distilgpt2",
    "microsoft/DialoGPT-medium"
]

# GPU-optimized models (require GPU)
GPU_MODELS = [
    "microsoft/DialoGPT-large",
    "facebook/blenderbot-1B-distill",
    "microsoft/DialoGPT-medium",
    "Salesforce/codegen-350M-multi"
]
