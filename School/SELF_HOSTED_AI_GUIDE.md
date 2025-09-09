# OpenEdTex Self-Hosted AI Implementation Guide

## Overview

This guide provides multiple options for implementing self-hosted AI models in your OpenEdTex platform, ranging from simple CPU-based solutions to advanced GPU-accelerated setups.

## 🚀 Quick Start Options

### Option 1: Ollama (Easiest Setup)
```bash
# 1. Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Pull a model
ollama pull llama2:7b

# 3. Start the AI service
docker-compose -f docker-compose.ai.yml up -d

# 4. Test the service
curl http://localhost:8001/health
```

### Option 2: Hugging Face Transformers (Most Flexible)
```bash
# 1. Install dependencies
pip install transformers torch accelerate

# 2. Run the AI service
cd backend/ai_service
python huggingface_ai.py
```

### Option 3: Llama.cpp (Best CPU Performance)
```bash
# 1. Install llama.cpp
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp && mkdir build && cd build
cmake .. -DLLAMA_BUILD_SERVER=ON
make -j$(nproc)

# 2. Download a model
./llama.cpp/build/bin/llama-server --model models/llama-2-7b-chat.Q4_K_M.gguf
```

## 📊 Detailed Comparison

| Feature | Ollama | Hugging Face | Llama.cpp | OpenAI API |
|---------|--------|--------------|-----------|------------|
| **Setup Complexity** | 🟢 Very Easy | 🟡 Medium | 🔴 Complex | 🟢 Very Easy |
| **CPU Performance** | 🟡 Good | 🟡 Good | 🟢 Excellent | N/A |
| **GPU Support** | 🟢 Excellent | 🟢 Excellent | 🟡 Limited | N/A |
| **Model Variety** | 🟡 Good | 🟢 Excellent | 🟡 Good | 🟢 Excellent |
| **Memory Usage** | 🟡 Moderate | 🟡 Moderate | 🟢 Low | N/A |
| **Customization** | 🟡 Limited | 🟢 High | 🟡 Medium | 🔴 None |
| **Production Ready** | 🟢 Yes | 🟢 Yes | 🟡 Requires Setup | 🟢 Yes |

## 🎯 Recommended Models by Use Case

### For Educational AI Assistant
- **Primary**: `llama2:13b` (Ollama) or `microsoft/DialoGPT-large` (Hugging Face)
- **Backup**: `mistral:7b` (Ollama) or `facebook/blenderbot-1B-distill` (Hugging Face)

### For Code Generation/Help
- **Primary**: `codellama:7b` (Ollama) or `Salesforce/codegen-350M-multi` (Hugging Face)
- **Backup**: `deepseek-coder-6.7b` (Llama.cpp)

### For Lightweight/CPU-Only
- **Primary**: `llama-2-7b-chat.Q3_K_M.gguf` (Llama.cpp)
- **Backup**: `mistral-7b-instruct-v0.1.Q3_K_M.gguf` (Llama.cpp)

## 🔧 Advanced Options

### Option 4: vLLM (High-Performance GPU Inference)
```python
# For production-grade GPU inference
pip install vllm
python -m vllm.entrypoints.openai.api_server \
    --model microsoft/DialoGPT-large \
    --host 0.0.0.0 \
    --port 8000
```

### Option 5: Text Generation WebUI (Full UI)
```bash
# Install and run
git clone https://github.com/oobabooga/text-generation-webui
cd text-generation-webui
pip install -r requirements.txt
python server.py --api --listen
```

### Option 6: PrivateGPT (Document Q&A)
```bash
# For document-based AI
pip install private-gpt
private-gpt ingest docs/
private-gpt chat
```

### Option 7: LangChain + Local Models
```python
from langchain.llms import Ollama
from langchain.chains import ConversationChain

llm = Ollama(model="llama2:7b")
chain = ConversationChain(llm=llm)
```

## 🚀 Implementation Steps

### Step 1: Choose Your Approach
1. **Quick Start**: Use Ollama for immediate results
2. **Production**: Use Hugging Face for flexibility
3. **Performance**: Use Llama.cpp for CPU optimization
4. **Enterprise**: Use vLLM for high-throughput

### Step 2: Update Django Settings
```python
# In settings.py
AI_SERVICE_URL = os.getenv('AI_SERVICE_URL', 'http://localhost:8001')
AI_MODE = os.getenv('AI_MODE', 'hybrid')  # 'ollama', 'huggingface', 'llamacpp', 'openai'
```

### Step 3: Update AI Views
```python
# In ai_assistant/views.py
import requests

def get_ai_response(messages, model=None):
    ai_url = settings.AI_SERVICE_URL
    response = requests.post(f"{ai_url}/chat", json={
        "messages": messages,
        "model": model
    })
    return response.json()
```

### Step 4: Add Environment Variables
```bash
# .env
AI_SERVICE_URL=http://localhost:8001
AI_MODE=hybrid
OLLAMA_BASE_URL=http://localhost:11434
```

## 📈 Performance Optimization

### For Ollama
```bash
# Use GPU acceleration
export OLLAMA_GPU_LAYERS=35  # Adjust based on your GPU memory

# Run multiple models
ollama serve &
ollama run llama2:7b &
ollama run codellama:7b &
```

### For Hugging Face
```python
# Use 4-bit quantization
from transformers import BitsAndBytesConfig
quantization_config = BitsAndBytesConfig(load_in_4bit=True)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=quantization_config
)
```

### For Llama.cpp
```bash
# Optimize for your CPU
llama-server \
    --model model.gguf \
    --threads $(nproc) \
    --ctx-size 4096 \
    --n-gpu-layers 0
```

## 🔒 Security Considerations

1. **Network Security**: Run AI services on internal networks only
2. **API Keys**: Never expose API keys in client-side code
3. **Rate Limiting**: Implement rate limiting for AI requests
4. **Input Validation**: Sanitize all inputs to AI models
5. **Monitoring**: Log all AI interactions for security auditing

## 📊 Monitoring & Maintenance

### Health Checks
```python
# Add to your monitoring
def check_ai_service():
    try:
        response = requests.get("http://localhost:8001/health", timeout=5)
        return response.status_code == 200
    except:
        return False
```

### Model Updates
```bash
# Update Ollama models
ollama pull llama2:13b

# Update Hugging Face models
pip install --upgrade transformers
```

## 🎯 Next Steps

1. **Choose your preferred option** based on your requirements
2. **Test locally** with the provided Docker setup
3. **Integrate with Django** using the AI service API
4. **Add monitoring** and health checks
5. **Deploy to production** with proper scaling

Would you like me to implement any specific option or help you get started with a particular approach?
