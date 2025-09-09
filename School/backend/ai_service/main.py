"""
OpenEdTex AI Service - Self-hosted AI models with OpenAI fallback
"""

import os
import asyncio
import logging
from typing import Dict, List, Optional, Any
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import openai
from ollama import Client as OllamaClient

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
AI_MODE = os.getenv("AI_MODE", "hybrid")  # 'ollama', 'openai', or 'hybrid'

# Initialize clients
ollama_client = OllamaClient(host=OLLAMA_BASE_URL)
openai_client = openai.OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# Available models
OLLAMA_MODELS = [
    "llama2:7b",
    "llama2:13b",
    "mistral:7b",
    "codellama:7b",
    "codellama:13b",
    "vicuna:7b",
    "orca-mini:7b"
]

OPENAI_MODELS = [
    "gpt-3.5-turbo",
    "gpt-4",
    "gpt-4-turbo-preview"
]

# Pydantic models
class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    model: Optional[str] = None
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1000
    stream: Optional[bool] = False

class ChatResponse(BaseModel):
    response: str
    model_used: str
    tokens_used: Optional[int] = None
    processing_time: float

class ModelInfo(BaseModel):
    name: str
    provider: str
    context_length: int
    description: str

# FastAPI app
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting OpenEdTex AI Service")
    yield
    # Shutdown
    logger.info("Shutting down OpenEdTex AI Service")

app = FastAPI(
    title="OpenEdTex AI Service",
    description="Self-hosted AI models with OpenAI fallback",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper functions
async def check_ollama_health() -> bool:
    """Check if Ollama service is healthy"""
    try:
        response = await asyncio.get_event_loop().run_in_executor(
            None, ollama_client.list
        )
        return True
    except Exception as e:
        logger.warning(f"Ollama health check failed: {e}")
        return False

def select_model(requested_model: Optional[str] = None) -> tuple[str, str]:
    """Select the best available model based on request and availability"""
    if AI_MODE == "ollama":
        model = requested_model or OLLAMA_MODELS[0]
        return model, "ollama"
    elif AI_MODE == "openai":
        if not openai_client:
            raise HTTPException(status_code=503, detail="OpenAI client not configured")
        model = requested_model or OPENAI_MODELS[0]
        return model, "openai"
    else:  # hybrid mode
        # Try Ollama first, fallback to OpenAI
        if requested_model and requested_model in OLLAMA_MODELS:
            return requested_model, "ollama"
        elif requested_model and requested_model in OPENAI_MODELS:
            if openai_client:
                return requested_model, "openai"
            else:
                raise HTTPException(status_code=503, detail="OpenAI client not configured")

        # Auto-select based on availability
        ollama_healthy = asyncio.run(check_ollama_health())
        if ollama_healthy:
            return OLLAMA_MODELS[0], "ollama"
        elif openai_client:
            return OPENAI_MODELS[0], "openai"
        else:
            raise HTTPException(status_code=503, detail="No AI models available")

# API endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "OpenEdTex AI Service", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    ollama_status = await check_ollama_health()
    openai_status = openai_client is not None

    return {
        "status": "healthy" if ollama_status or openai_status else "unhealthy",
        "ollama": ollama_status,
        "openai": openai_status,
        "mode": AI_MODE
    }

@app.get("/models", response_model=List[ModelInfo])
async def list_models():
    """List available models"""
    models = []

    # Ollama models
    try:
        ollama_list = await asyncio.get_event_loop().run_in_executor(
            None, ollama_client.list
        )
        for model in ollama_list.get('models', []):
            models.append(ModelInfo(
                name=model['name'],
                provider="ollama",
                context_length=4096,  # Default for most Ollama models
                description=f"Ollama-hosted {model['name']}"
            ))
    except Exception as e:
        logger.warning(f"Failed to list Ollama models: {e}")

    # OpenAI models
    if openai_client:
        for model_name in OPENAI_MODELS:
            context_length = 4096 if "gpt-3.5" in model_name else 8192
            models.append(ModelInfo(
                name=model_name,
                provider="openai",
                context_length=context_length,
                description=f"OpenAI {model_name}"
            ))

    return models

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    """Chat with AI models"""
    import time
    start_time = time.time()

    try:
        model, provider = select_model(request.model)

        if provider == "ollama":
            # Use Ollama
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: ollama_client.chat(
                    model=model,
                    messages=request.messages,
                    options={
                        "temperature": request.temperature,
                        "num_predict": request.max_tokens
                    }
                )
            )
            response_text = response['message']['content']
            tokens_used = None  # Ollama doesn't provide token counts

        elif provider == "openai":
            # Use OpenAI
            openai_response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: openai_client.chat.completions.create(
                    model=model,
                    messages=request.messages,
                    temperature=request.temperature,
                    max_tokens=request.max_tokens,
                    stream=False
                )
            )
            response_text = openai_response.choices[0].message.content
            tokens_used = openai_response.usage.total_tokens

        processing_time = time.time() - start_time

        return ChatResponse(
            response=response_text,
            model_used=model,
            tokens_used=tokens_used,
            processing_time=round(processing_time, 2)
        )

    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embeddings")
async def create_embeddings(text: str, model: Optional[str] = None):
    """Create embeddings for text"""
    try:
        if not model:
            model = "text-embedding-ada-002"  # OpenAI default

        if openai_client:
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: openai_client.embeddings.create(
                    input=text,
                    model=model
                )
            )
            return {
                "embeddings": response.data[0].embedding,
                "model": model,
                "tokens_used": response.usage.total_tokens
            }
        else:
            raise HTTPException(status_code=503, detail="Embeddings service not available")

    except Exception as e:
        logger.error(f"Embeddings error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
