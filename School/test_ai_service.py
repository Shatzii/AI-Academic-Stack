#!/usr/bin/env python3
"""
Test script for OpenEdTex AI Service
"""

import requests
import json
import sys

def test_ai_service():
    """Test the AI service endpoints"""

    base_url = "http://localhost:8001"

    print("🧪 Testing OpenEdTex AI Service")
    print("=" * 50)

    # Test 1: Health check
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        if response.status_code == 200:
            health_data = response.json()
            print("✅ Health check passed")
            print(f"   Status: {health_data.get('status')}")
            print(f"   Ollama: {health_data.get('ollama')}")
            print(f"   OpenAI: {health_data.get('openai')}")
            print(f"   Mode: {health_data.get('mode')}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

    # Test 2: List models
    print("\n2. Testing models endpoint...")
    try:
        response = requests.get(f"{base_url}/models", timeout=10)
        if response.status_code == 200:
            models = response.json()
            print("✅ Models endpoint working")
            print(f"   Found {len(models)} models:")
            for model in models[:3]:  # Show first 3
                print(f"   - {model['name']} ({model['provider']})")
            if len(models) > 3:
                print(f"   ... and {len(models) - 3} more")
        else:
            print(f"❌ Models endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Models endpoint error: {e}")

    # Test 3: Chat endpoint
    print("\n3. Testing chat endpoint...")
    test_messages = [
        {"role": "system", "content": "You are a helpful AI assistant for education."},
        {"role": "user", "content": "Hello! Can you help me understand photosynthesis?"}
    ]

    try:
        response = requests.post(
            f"{base_url}/chat",
            json={
                "messages": test_messages,
                "temperature": 0.7,
                "max_tokens": 200
            },
            timeout=30
        )

        if response.status_code == 200:
            chat_data = response.json()
            print("✅ Chat endpoint working")
            print(f"   Model used: {chat_data.get('model_used')}")
            print(f"   Processing time: {chat_data.get('processing_time')}s")
            print(f"   Response preview: {chat_data.get('response')[:100]}...")
        else:
            print(f"❌ Chat endpoint failed: {response.status_code}")
            print(f"   Error: {response.text}")

    except Exception as e:
        print(f"❌ Chat endpoint error: {e}")

    print("\n" + "=" * 50)
    print("🎉 AI Service testing completed!")
    return True

def test_ollama_direct():
    """Test Ollama directly"""
    print("\n🔍 Testing Ollama directly...")

    try:
        import ollama
        client = ollama.Client()

        # List models
        models = client.list()
        print("✅ Ollama connection successful")
        print(f"   Available models: {len(models.get('models', []))}")

        # Test simple generation
        if models.get('models'):
            model_name = models['models'][0]['name']
            print(f"   Testing model: {model_name}")

            response = client.chat(
                model=model_name,
                messages=[{"role": "user", "content": "Hello!"}]
            )
            print("✅ Model generation working")
            print(f"   Response: {response['message']['content'][:50]}...")

    except ImportError:
        print("❌ Ollama Python client not installed")
        print("   Install with: pip install ollama")
    except Exception as e:
        print(f"❌ Ollama test failed: {e}")

if __name__ == "__main__":
    # Test AI service
    success = test_ai_service()

    # Test Ollama directly
    test_ollama_direct()

    if success:
        print("\n✅ All tests completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Check the service configuration.")
        sys.exit(1)
