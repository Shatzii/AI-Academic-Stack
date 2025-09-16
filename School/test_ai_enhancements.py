#!/usr/bin/env python3
"""
Test script for enhanced AI features
"""

import requests
import json
import sys
import os

# Configuration
AI_SERVICE_URL = "http://localhost:8001"

def test_chat():
    """Test basic chat functionality"""
    print("Testing chat functionality...")
    try:
        response = requests.post(
            f"{AI_SERVICE_URL}/chat",
            json={
                "messages": [
                    {"role": "user", "content": "Hello, can you help me with learning Python?"}
                ],
                "temperature": 0.7,
                "max_tokens": 100
            }
        )
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Chat response: {result['response'][:100]}...")
        else:
            print(f"❌ Chat failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Chat error: {e}")

def test_sentiment_analysis():
    """Test sentiment analysis"""
    print("Testing sentiment analysis...")
    try:
        response = requests.post(
            f"{AI_SERVICE_URL}/nlp/sentiment",
            json="I love learning with this platform! It's amazing."
        )
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Sentiment: {result['label']} (confidence: {result['confidence']:.2f})")
        else:
            print(f"❌ Sentiment analysis failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Sentiment analysis error: {e}")

def test_content_generation():
    """Test content generation"""
    print("Testing content generation...")
    try:
        response = requests.post(
            f"{AI_SERVICE_URL}/content/generate-lesson",
            json={
                "topic": "Introduction to Variables",
                "grade_level": "9th Grade",
                "learning_objectives": [
                    "Understand what variables are",
                    "Learn how to declare variables",
                    "Practice using variables in code"
                ],
                "duration": 45,
                "difficulty": "beginner"
            }
        )
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Generated lesson: {result['title']}")
            print(f"   Quality score: {result.get('quality_score', 'N/A')}")
        else:
            print(f"❌ Content generation failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Content generation error: {e}")

def test_curriculum_conversion():
    """Test curriculum conversion (would need a file)"""
    print("Testing curriculum conversion...")
    print("   (Skipping - requires file upload)")

def test_health():
    """Test service health"""
    print("Testing service health...")
    try:
        response = requests.get(f"{AI_SERVICE_URL}/health")
        if response.status_code == 200:
            health = response.json()
            print(f"✅ Service health: {health['status']}")
            print(f"   Ollama: {health['ollama']}, OpenAI: {health['openai']}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")

def main():
    """Run all tests"""
    print("🚀 Testing Enhanced AI Features")
    print("=" * 50)

    # Test basic functionality
    test_health()
    print()

    test_chat()
    print()

    test_sentiment_analysis()
    print()

    test_content_generation()
    print()

    test_curriculum_conversion()
    print()

    print("✨ AI Enhancement Testing Complete!")

if __name__ == "__main__":
    main()