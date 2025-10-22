"""
Hugging Face Transformers Implementation for OpenEdTex
Enhanced with Computer Vision and Advanced NLP capabilities
"""

import os
import torch
import numpy as np
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    pipeline,
    BitsAndBytesConfig,
    AutoImageProcessor,
    AutoModelForImageClassification,
    AutoModelForObjectDetection,
    ViTImageProcessor,
    ViTForImageClassification,
    TrOCRProcessor,
    VisionEncoderDecoderModel,
    AutoModelForSeq2SeqLM,
    AutoTokenizer as SummarizerTokenizer,
    pipeline as Pipeline,
    SpeechT5Processor,
    SpeechT5ForTextToSpeech,
    SpeechT5HifiGan,
    Wav2Vec2Processor,
    Wav2Vec2ForCTC
)
from typing import List, Dict, Optional, Any, Tuple
from PIL import Image
import logging
import io
import soundfile as sf
import librosa

logger = logging.getLogger(__name__)

class HuggingFaceAI:
    """Hugging Face Transformers AI implementation with Computer Vision"""

    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.models = {}
        self.tokenizers = {}
        self.pipelines = {}
        
        # Computer Vision models
        self.cv_models = {}
        self.cv_processors = {}
        
        # NLP models
        self.nlp_models = {}
        self.nlp_tokenizers = {}
        self.nlp_pipelines = {}
        
        # Speech models
        self.speech_models = {}
        self.speech_processors = {}
        self.tts_vocoder = None

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

    def load_cv_model(self, model_name: str, task: str = "image-classification"):
        """Load a computer vision model"""
        try:
            logger.info(f"Loading CV model: {model_name} for task: {task}")
            
            if task == "image-classification":
                processor = AutoImageProcessor.from_pretrained(model_name)
                model = AutoModelForImageClassification.from_pretrained(model_name)
            elif task == "object-detection":
                processor = AutoImageProcessor.from_pretrained(model_name)
                model = AutoModelForObjectDetection.from_pretrained(model_name)
            elif task == "ocr":
                processor = TrOCRProcessor.from_pretrained(model_name)
                model = VisionEncoderDecoderModel.from_pretrained(model_name)
            else:
                raise ValueError(f"Unsupported CV task: {task}")
            
            # Move to device
            if self.device == "cuda":
                model = model.to(self.device)
            
            self.cv_models[f"{model_name}_{task}"] = model
            self.cv_processors[f"{model_name}_{task}"] = processor
            
            logger.info(f"Successfully loaded CV model: {model_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load CV model {model_name}: {e}")
            return False

    def process_image(self, image_data: bytes, task: str = "image-classification", 
                     model_name: str = "google/vit-base-patch16-224") -> Dict[str, Any]:
        """Process image with computer vision models"""
        try:
            model_key = f"{model_name}_{task}"
            
            if model_key not in self.cv_models:
                if not self.load_cv_model(model_name, task):
                    raise ValueError(f"Failed to load CV model: {model_name}")
            
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            
            processor = self.cv_processors[model_key]
            model = self.cv_models[model_key]
            
            if task == "image-classification":
                inputs = processor(images=image, return_tensors="pt")
                if self.device == "cuda":
                    inputs = {k: v.to(self.device) for k, v in inputs.items()}
                
                with torch.no_grad():
                    outputs = model(**inputs)
                    logits = outputs.logits
                    predicted_class_idx = logits.argmax(-1).item()
                    
                predicted_class = model.config.id2label[predicted_class_idx]
                confidence = torch.softmax(logits, dim=-1)[0][predicted_class_idx].item()
                
                return {
                    "task": task,
                    "prediction": predicted_class,
                    "confidence": confidence,
                    "model": model_name
                }
                
            elif task == "object-detection":
                inputs = processor(images=image, return_tensors="pt")
                if self.device == "cuda":
                    inputs = {k: v.to(self.device) for k, v in inputs.items()}
                
                with torch.no_grad():
                    outputs = model(**inputs)
                    
                results = processor.post_process_object_detection(
                    outputs, target_sizes=torch.tensor([image.size[::-1]])
                )[0]
                
                detections = []
                for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
                    if score > 0.5:  # Confidence threshold
                        detections.append({
                            "label": model.config.id2label[label.item()],
                            "confidence": score.item(),
                            "bbox": box.tolist()
                        })
                
                return {
                    "task": task,
                    "detections": detections,
                    "model": model_name
                }
                
            elif task == "ocr":
                pixel_values = processor(image, return_tensors="pt").pixel_values
                if self.device == "cuda":
                    pixel_values = pixel_values.to(self.device)
                
                with torch.no_grad():
                    generated_ids = model.generate(pixel_values, max_length=50)
                    
                generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
                
                return {
                    "task": task,
                    "text": generated_text,
                    "model": model_name
                }
                
        except Exception as e:
            logger.error(f"Image processing error: {e}")
            return {"error": str(e)}

    def load_nlp_model(self, model_name: str, task: str = "text-generation"):
        """Load advanced NLP models"""
        try:
            logger.info(f"Loading NLP model: {model_name} for task: {task}")
            
            if task == "summarization":
                tokenizer = SummarizerTokenizer.from_pretrained(model_name)
                model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
                pipe = Pipeline("summarization", model=model, tokenizer=tokenizer)
            elif task == "sentiment-analysis":
                pipe = Pipeline("sentiment-analysis", model=model_name)
                tokenizer = None
                model = None
            elif task == "text-generation":
                # Use existing text generation loading
                return self.load_model(model_name)
            else:
                pipe = Pipeline(task, model=model_name)
                tokenizer = None
                model = None
            
            self.nlp_pipelines[f"{model_name}_{task}"] = pipe
            if tokenizer:
                self.nlp_tokenizers[f"{model_name}_{task}"] = tokenizer
            if model:
                self.nlp_models[f"{model_name}_{task}"] = model
            
            logger.info(f"Successfully loaded NLP model: {model_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load NLP model {model_name}: {e}")
            return False

    def process_text_nlp(self, text: str, task: str = "sentiment-analysis",
                        model_name: str = "cardiffnlp/twitter-roberta-base-sentiment-latest") -> Dict[str, Any]:
        """Process text with NLP models"""
        try:
            pipeline_key = f"{model_name}_{task}"
            
            if pipeline_key not in self.nlp_pipelines:
                if not self.load_nlp_model(model_name, task):
                    raise ValueError(f"Failed to load NLP model: {model_name}")
            
            pipe = self.nlp_pipelines[pipeline_key]
            
            if task == "sentiment-analysis":
                result = pipe(text)[0]
                return {
                    "task": task,
                    "label": result["label"],
                    "confidence": result["score"],
                    "model": model_name
                }
            elif task == "summarization":
                result = pipe(text, max_length=150, min_length=30, do_sample=False)[0]
                return {
                    "task": task,
                    "summary": result["summary_text"],
                    "model": model_name
                }
            else:
                result = pipe(text)[0]
                return {
                    "task": task,
                    "result": result,
                    "model": model_name
                }
                
        except Exception as e:
            logger.error(f"NLP processing error: {e}")
            return {"error": str(e)}

    def load_speech_model(self, task: str = "text-to-speech"):
        """Load speech processing models"""
        try:
            logger.info(f"Loading speech model for task: {task}")
            
            if task == "text-to-speech":
                # Load TTS models
                processor = SpeechT5Processor.from_pretrained("microsoft/speecht5_tts")
                model = SpeechT5ForTextToSpeech.from_pretrained("microsoft/speecht5_tts")
                vocoder = SpeechT5HifiGan.from_pretrained("microsoft/speecht5_hifigan")
                
                if self.device == "cuda":
                    model = model.to(self.device)
                    vocoder = vocoder.to(self.device)
                
                self.speech_models["tts"] = model
                self.speech_processors["tts"] = processor
                self.tts_vocoder = vocoder
                
            elif task == "speech-to-text":
                # Load STT model
                processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
                model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")
                
                if self.device == "cuda":
                    model = model.to(self.device)
                
                self.speech_models["stt"] = model
                self.speech_processors["stt"] = processor
            
            logger.info(f"Successfully loaded speech model for {task}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load speech model {task}: {e}")
            return False

    def speech_to_text(self, audio_data: bytes, sample_rate: int = 16000) -> Dict[str, Any]:
        """Convert speech audio to text"""
        try:
            if "stt" not in self.speech_models:
                if not self.load_speech_model("speech-to-text"):
                    raise ValueError("Failed to load speech-to-text model")
            
            processor = self.speech_processors["stt"]
            model = self.speech_models["stt"]
            
            # Convert bytes to numpy array
            audio_array, _ = librosa.load(io.BytesIO(audio_data), sr=sample_rate)
            
            # Process audio
            inputs = processor(audio_array, sampling_rate=sample_rate, return_tensors="pt", padding=True)
            if self.device == "cuda":
                inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                logits = model(inputs.input_values).logits
            
            predicted_ids = torch.argmax(logits, dim=-1)
            transcription = processor.batch_decode(predicted_ids)[0]
            
            return {
                "task": "speech-to-text",
                "transcription": transcription,
                "confidence": float(torch.max(torch.softmax(logits, dim=-1)).item()),
                "model": "facebook/wav2vec2-base-960h"
            }
            
        except Exception as e:
            logger.error(f"Speech-to-text error: {e}")
            return {"error": str(e)}

    def text_to_speech(self, text: str, speaker_embeddings: Optional[np.ndarray] = None) -> Dict[str, Any]:
        """Convert text to speech audio"""
        try:
            if "tts" not in self.speech_models:
                if not self.load_speech_model("text-to-speech"):
                    raise ValueError("Failed to load text-to-speech model")
            
            processor = self.speech_processors["tts"]
            model = self.speech_models["tts"]
            vocoder = self.tts_vocoder
            
            # Prepare inputs
            inputs = processor(text=text, return_tensors="pt")
            if self.device == "cuda":
                inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Generate speaker embeddings if not provided (use default)
            if speaker_embeddings is None:
                # Use default speaker embedding (xvector)
                speaker_embeddings = np.random.randn(1, 512).astype(np.float32)
                speaker_embeddings = torch.tensor(speaker_embeddings)
                if self.device == "cuda":
                    speaker_embeddings = speaker_embeddings.to(self.device)
            
            # Generate speech
            with torch.no_grad():
                speech = model.generate_speech(inputs["input_ids"], speaker_embeddings, vocoder=vocoder)
            
            # Convert to numpy array
            speech_np = speech.cpu().numpy()
            
            # Convert to bytes (WAV format)
            buffer = io.BytesIO()
            sf.write(buffer, speech_np, samplerate=16000, format='WAV')
            audio_bytes = buffer.getvalue()
            
            return {
                "task": "text-to-speech",
                "audio_data": audio_bytes,
                "sample_rate": 16000,
                "format": "wav",
                "model": "microsoft/speecht5_tts"
            }
            
        except Exception as e:
            logger.error(f"Text-to-speech error: {e}")
            return {"error": str(e)}

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
        "microsoft/Phi-1.5",  # Better reasoning for educational content
    ],
    "coding": [
        "Salesforce/codegen-350M-multi",  # Code generation
        "microsoft/DialoGPT-medium",  # Code explanations
        "bigcode/starcoderbase-1b",  # Code completion
    ],
    "creative": [
        "microsoft/DialoGPT-large",  # More creative responses
        "facebook/blenderbot-1B-distill",  # Better context understanding
    ]
}

# Computer Vision models
CV_MODELS = {
    "image_classification": [
        "google/vit-base-patch16-224",  # General image classification
        "microsoft/resnet-50",  # Alternative classification model
    ],
    "object_detection": [
        "facebook/detr-resnet-50",  # Object detection
        "microsoft/table-transformer-detection",  # Table detection for documents
    ],
    "ocr": [
        "microsoft/trocr-base-printed",  # OCR for printed text
        "microsoft/trocr-base-handwritten",  # OCR for handwritten text
    ]
}

# NLP models
NLP_MODELS = {
    "sentiment_analysis": [
        "cardiffnlp/twitter-roberta-base-sentiment-latest",  # General sentiment
        "j-hartmann/emotion-english-distilroberta-base",  # Emotion detection
    ],
    "summarization": [
        "facebook/bart-large-cnn",  # Text summarization
        "t5-small",  # T5 summarization model
    ],
    "question_answering": [
        "deepset/roberta-base-squad2",  # Question answering
    ]
}

# Smaller models that run well on CPU
CPU_MODELS = [
    "microsoft/DialoGPT-small",
    "facebook/blenderbot-400M-distill",
    "distilgpt2",
    "microsoft/DialoGPT-medium",
    "cardiffnlp/twitter-roberta-base-sentiment-latest",  # CPU-friendly sentiment
]

# GPU-optimized models (require GPU)
GPU_MODELS = [
    "microsoft/DialoGPT-large",
    "facebook/blenderbot-1B-distill",
    "microsoft/DialoGPT-medium",
    "Salesforce/codegen-350M-multi",
    "google/vit-base-patch16-224",  # Vision models need GPU
    "facebook/bart-large-cnn",  # Summarization needs GPU
]
