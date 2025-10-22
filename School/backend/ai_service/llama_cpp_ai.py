"""
Llama.cpp Implementation for OpenEdTex
CPU-based inference for various LLM models
"""

import os
import sys
from typing import List, Dict, Optional, Any
import logging
from pathlib import Path
import subprocess
import json

logger = logging.getLogger(__name__)

class LlamaCppAI:
    """Llama.cpp AI implementation for CPU inference"""

    def __init__(self, model_path: str = "./models"):
        self.model_path = Path(model_path)
        self.model_path.mkdir(exist_ok=True)
        self.loaded_models = {}
        self.processes = {}

    def download_model(self, model_url: str, model_name: str) -> bool:
        """Download a model from Hugging Face or other sources"""
        try:
            model_file = self.model_path / f"{model_name}.gguf"

            if model_file.exists():
                logger.info(f"Model {model_name} already exists")
                return True

            logger.info(f"Downloading model: {model_name}")

            # Use wget or curl to download
            if "wget" in os.environ.get("PATH", ""):
                cmd = ["wget", "-O", str(model_file), model_url]
            else:
                cmd = ["curl", "-L", "-o", str(model_file), model_url]

            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                logger.info(f"Successfully downloaded {model_name}")
                return True
            else:
                logger.error(f"Failed to download {model_name}: {result.stderr}")
                return False

        except Exception as e:
            logger.error(f"Download error: {e}")
            return False

    def load_model(self, model_name: str, model_file: str) -> bool:
        """Load a model using llama.cpp"""
        try:
            model_path = self.model_path / model_file

            if not model_path.exists():
                logger.error(f"Model file not found: {model_path}")
                return False

            # Start llama.cpp server
            cmd = [
                "llama-server",
                "--model", str(model_path),
                "--host", "127.0.0.1",
                "--port", "8080",
                "--ctx-size", "2048",
                "--threads", str(os.cpu_count() or 4),
                "--n-gpu-layers", "0"  # CPU only
            ]

            logger.info(f"Starting llama.cpp server for {model_name}")
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            self.loaded_models[model_name] = {
                "process": process,
                "port": 8080,
                "file": model_file
            }

            # Wait for server to start
            import time
            time.sleep(5)

            return True

        except Exception as e:
            logger.error(f"Failed to load model {model_name}: {e}")
            return False

    def generate_response(self, model_name: str, messages: List[Dict[str, str]],
                         max_tokens: int = 512, temperature: float = 0.7) -> str:
        """Generate response using loaded model"""
        if model_name not in self.loaded_models:
            raise ValueError(f"Model {model_name} not loaded")

        try:
            import requests

            # Format messages for llama.cpp
            prompt = self._format_messages(messages)

            # Make request to llama.cpp server
            response = requests.post(
                "http://127.0.0.1:8080/completion",
                json={
                    "prompt": prompt,
                    "n_predict": max_tokens,
                    "temperature": temperature,
                    "stop": ["Human:", "Assistant:", "\n\n"]
                },
                timeout=60
            )

            if response.status_code == 200:
                result = response.json()
                return result.get("content", "").strip()
            else:
                raise Exception(f"Server error: {response.status_code}")

        except Exception as e:
            logger.error(f"Generation error: {e}")
            return f"Error generating response: {str(e)}"

    def _format_messages(self, messages: List[Dict[str, str]]) -> str:
        """Format messages for llama.cpp"""
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

    def unload_model(self, model_name: str):
        """Unload a model"""
        if model_name in self.loaded_models:
            process = self.loaded_models[model_name]["process"]
            process.terminate()
            process.wait()
            del self.loaded_models[model_name]
            logger.info(f"Unloaded model: {model_name}")

    def get_loaded_models(self) -> List[str]:
        """Get list of loaded models"""
        return list(self.loaded_models.keys())

# Popular GGUF models for different use cases
GGUF_MODELS = {
    "general": [
        {
            "name": "llama-2-7b-chat",
            "file": "llama-2-7b-chat.Q4_K_M.gguf",
            "url": "https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf",
            "size": "4GB"
        },
        {
            "name": "mistral-7b-instruct",
            "file": "mistral-7b-instruct-v0.1.Q4_K_M.gguf",
            "url": "https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf",
            "size": "4.4GB"
        }
    ],
    "coding": [
        {
            "name": "codellama-7b-instruct",
            "file": "codellama-7b-instruct.Q4_K_M.gguf",
            "url": "https://huggingface.co/TheBloke/CodeLlama-7B-Instruct-GGUF/resolve/main/codellama-7b-instruct.Q4_K_M.gguf",
            "size": "4GB"
        },
        {
            "name": "deepseek-coder-6.7b",
            "file": "deepseek-coder-6.7b-base.Q4_K_M.gguf",
            "url": "https://huggingface.co/TheBloke/deepseek-coder-6.7B-base-GGUF/resolve/main/deepseek-coder-6.7b-base.Q4_K_M.gguf",
            "size": "4GB"
        }
    ],
    "educational": [
        {
            "name": "llama-2-13b-chat",
            "file": "llama-2-13b-chat.Q4_K_M.gguf",
            "url": "https://huggingface.co/TheBloke/Llama-2-13B-Chat-GGUF/resolve/main/llama-2-13b-chat.Q4_K_M.gguf",
            "size": "7.4GB"
        }
    ],
    "lightweight": [
        {
            "name": "llama-2-7b-chat-3bit",
            "file": "llama-2-7b-chat.Q3_K_M.gguf",
            "url": "https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q3_K_M.gguf",
            "size": "3.3GB"
        },
        {
            "name": "mistral-7b-instruct-3bit",
            "file": "mistral-7b-instruct-v0.1.Q3_K_M.gguf",
            "url": "https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q3_K_M.gguf",
            "size": "3.5GB"
        }
    ]
}

# Installation requirements
INSTALL_COMMANDS = {
    "ubuntu/debian": [
        "sudo apt update",
        "sudo apt install -y build-essential cmake git",
        "git clone https://github.com/ggerganov/llama.cpp",
        "cd llama.cpp && mkdir build && cd build",
        "cmake .. -DLLAMA_BUILD_SERVER=ON",
        "make -j$(nproc)",
        "sudo cp llama-server /usr/local/bin/"
    ],
    "macos": [
        "brew install cmake",
        "git clone https://github.com/ggerganov/llama.cpp",
        "cd llama.cpp && mkdir build && cd build",
        "cmake .. -DLLAMA_BUILD_SERVER=ON",
        "make -j$(sysctl -n hw.ncpu)",
        "cp llama-server /usr/local/bin/"
    ]
}
