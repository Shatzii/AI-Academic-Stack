"""
OpenEdTex AI Service - Self-hosted AI models with OpenAI fallback
"""

import os
import asyncio
import logging
from typing import Dict, List, Optional, Any
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File
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

from huggingface_ai import HuggingFaceAI, CV_MODELS, NLP_MODELS
from curriculum_converter import CurriculumConverter
from content_generator import ContentGenerator
from recommendation_engine import RecommendationEngine

# Initialize AI services
hf_ai = HuggingFaceAI()
curriculum_converter = CurriculumConverter()
content_generator = ContentGenerator()
recommendation_engine = RecommendationEngine()

# Initialize AI services
hf_ai = HuggingFaceAI()
curriculum_converter = CurriculumConverter()

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

@app.post("/vision/classify")
async def classify_image(file: UploadFile = File(...), model: str = "google/vit-base-patch16-224"):
    """Classify an uploaded image"""
    try:
        image_data = await file.read()
        result = hf_ai.process_image(image_data, task="image-classification", model_name=model)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"Image classification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/vision/detect")
async def detect_objects(file: UploadFile = File(...), model: str = "facebook/detr-resnet-50"):
    """Detect objects in an uploaded image"""
    try:
        image_data = await file.read()
        result = hf_ai.process_image(image_data, task="object-detection", model_name=model)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"Object detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/vision/ocr")
async def extract_text(file: UploadFile = File(...), model: str = "microsoft/trocr-base-printed"):
    """Extract text from an uploaded image"""
    try:
        image_data = await file.read()
        result = hf_ai.process_image(image_data, task="ocr", model_name=model)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"OCR error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/nlp/sentiment")
async def analyze_sentiment(text: str, model: str = "cardiffnlp/twitter-roberta-base-sentiment-latest"):
    """Analyze sentiment of text"""
    try:
        result = hf_ai.process_text_nlp(text, task="sentiment-analysis", model_name=model)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"Sentiment analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/nlp/sentiment/batch")
async def analyze_sentiment_batch(texts: List[str], model: str = "cardiffnlp/twitter-roberta-base-sentiment-latest"):
    """Analyze sentiment of multiple texts"""
    try:
        results = []
        for text in texts:
            result = hf_ai.process_text_nlp(text, task="sentiment-analysis", model_name=model)
            if "error" not in result:
                results.append(result)
        
        return {"results": results, "total_processed": len(results)}
        
    except Exception as e:
        logger.error(f"Batch sentiment analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/nlp/emotion")
async def analyze_emotion(text: str, model: str = "j-hartmann/emotion-english-distilroberta-base"):
    """Analyze emotions in text"""
    try:
        result = hf_ai.process_text_nlp(text, task="sentiment-analysis", model_name=model)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"Emotion analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/nlp/summarize")
async def summarize_text(text: str, model: str = "facebook/bart-large-cnn"):
    """Summarize text content"""
    try:
        result = hf_ai.process_text_nlp(text, task="summarization", model_name=model)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"Summarization error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/curriculum/convert")
async def convert_curriculum(file: UploadFile = File(...)):
    """Convert uploaded document to curriculum structure"""
    try:
        # Save uploaded file temporarily
        temp_path = f"/tmp/{file.filename}"
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Convert to curriculum
        result = curriculum_converter.convert_to_curriculum(temp_path)
        
        # Clean up temp file
        os.remove(temp_path)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"Curriculum conversion error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/speech/stt")
async def speech_to_text(file: UploadFile = File(...), sample_rate: int = 16000):
    """Convert uploaded speech audio to text"""
    try:
        audio_data = await file.read()
        result = hf_ai.speech_to_text(audio_data, sample_rate)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"Speech-to-text error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/speech/tts")
async def text_to_speech(text: str):
    """Convert text to speech audio"""
    try:
        result = hf_ai.text_to_speech(text)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        # Return audio data as response
        from fastapi.responses import Response
        return Response(
            content=result["audio_data"],
            media_type="audio/wav",
            headers={"Content-Disposition": "attachment; filename=speech.wav"}
        )
        
    except Exception as e:
        logger.error(f"Text-to-speech error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/content/generate-lesson")
async def generate_lesson(
    topic: str,
    grade_level: str,
    learning_objectives: List[str],
    duration: int = 45,
    difficulty: str = "intermediate"
):
    """Generate a complete lesson plan"""
    try:
        result = content_generator.generate_lesson(
            topic=topic,
            grade_level=grade_level,
            learning_objectives=learning_objectives,
            duration=duration,
            difficulty=difficulty
        )
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"Lesson generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/content/generate-quiz")
async def generate_quiz(
    topic: str,
    grade_level: str,
    num_questions: int = 10,
    difficulty: str = "intermediate",
    question_types: Optional[List[str]] = None
):
    """Generate a quiz"""
    try:
        result = content_generator.generate_quiz(
            topic=topic,
            grade_level=grade_level,
            num_questions=num_questions,
            difficulty=difficulty,
            question_types=question_types
        )
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"Quiz generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/content/generate-assignment")
async def generate_assignment(
    topic: str,
    grade_level: str,
    assignment_type: str = "homework",
    duration: int = 60,
    difficulty: str = "intermediate"
):
    """Generate an assignment"""
    try:
        result = content_generator.generate_assignment(
            topic=topic,
            grade_level=grade_level,
            assignment_type=assignment_type,
            duration=duration,
            difficulty=difficulty
        )
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"Assignment generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/content/generate-study-guide")
async def generate_study_guide(
    topic: str,
    grade_level: str,
    key_concepts: List[str],
    study_time: int = 30
):
    """Generate a study guide"""
    try:
        result = content_generator.generate_study_guide(
            topic=topic,
            grade_level=grade_level,
            key_concepts=key_concepts,
            study_time=study_time
        )
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error(f"Study guide generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommendations/courses/{user_id}")
async def get_course_recommendations(user_id: int, limit: int = 5):
    """Get personalized course recommendations"""
    try:
        recommendations = recommendation_engine.get_course_recommendations(user_id, limit)
        return {"recommendations": recommendations}
        
    except Exception as e:
        logger.error(f"Course recommendations error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommendations/materials/{user_id}")
async def get_study_material_recommendations(
    user_id: int,
    topic: Optional[str] = None,
    limit: int = 10
):
    """Get study material recommendations"""
    try:
        recommendations = recommendation_engine.get_study_material_recommendations(
            user_id, topic, limit
        )
        return {"recommendations": recommendations}
        
    except Exception as e:
        logger.error(f"Study material recommendations error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommendations/learning-path/{user_id}")
async def get_learning_path_recommendations(
    user_id: int,
    subject: str,
    current_level: str
):
    """Get learning path recommendations"""
    try:
        learning_path = recommendation_engine.get_learning_path_recommendations(
            user_id, subject, current_level
        )
        return learning_path
        
    except Exception as e:
        logger.error(f"Learning path recommendations error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
