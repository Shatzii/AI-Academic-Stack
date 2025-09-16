"""
AI-Powered Content Generation Service
Generates educational content including lessons, quizzes, assignments, and study materials
"""

import os
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime

import openai
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from django.core.cache import cache

logger = logging.getLogger(__name__)

class ContentGenerator:
    """AI-powered content generation service"""

    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY")) if os.getenv("OPENAI_API_KEY") else None

        # Initialize local models for content generation
        self.lesson_generator = None
        self.quiz_generator = None
        self.assignment_generator = None
        self.summarizer = None

        self._initialize_models()

    def _initialize_models(self):
        """Initialize AI models for content generation"""
        try:
            # Use OpenAI for high-quality generation if available
            if self.openai_client:
                logger.info("Using OpenAI for content generation")
                return

            # Fallback to local models
            logger.info("Initializing local models for content generation")

            # Lesson generation model
            self.lesson_generator = pipeline(
                "text-generation",
                model="microsoft/DialoGPT-large",
                device=0 if self.device == "cuda" else -1,
                max_length=1024,
                temperature=0.7
            )

            # Quiz generation model
            self.quiz_generator = pipeline(
                "text2text-generation",
                model="google/flan-t5-base",
                device=0 if self.device == "cuda" else -1,
                max_length=512
            )

            # Summarizer for content validation
            self.summarizer = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                device=0 if self.device == "cuda" else -1
            )

            logger.info("Local content generation models initialized")

        except Exception as e:
            logger.error(f"Failed to initialize content generation models: {e}")

    def generate_lesson(self, topic: str, grade_level: str, learning_objectives: List[str],
                       duration: int = 45, difficulty: str = "intermediate") -> Dict[str, Any]:
        """Generate a complete lesson plan"""

        cache_key = f"lesson_{topic}_{grade_level}_{difficulty}_{duration}"
        cached_result = cache.get(cache_key)
        if cached_result:
            return cached_result

        try:
            prompt = self._create_lesson_prompt(topic, grade_level, learning_objectives, duration, difficulty)

            if self.openai_client:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are an expert educational content creator. Generate comprehensive, engaging lesson plans."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=2000
                )
                content = response.choices[0].message.content
            else:
                # Use local model
                if self.lesson_generator:
                    result = self.lesson_generator(prompt, max_length=1500, num_return_sequences=1)
                    content = result[0]['generated_text']
                else:
                    raise ValueError("No content generation model available")

            # Parse and structure the lesson
            lesson_data = self._parse_lesson_content(content, topic, grade_level, learning_objectives, duration)

            # Validate content quality
            quality_score = self._validate_content_quality(lesson_data)
            lesson_data['quality_score'] = quality_score

            # Cache the result
            cache.set(cache_key, lesson_data, timeout=3600)  # Cache for 1 hour

            return lesson_data

        except Exception as e:
            logger.error(f"Lesson generation failed: {e}")
            return {"error": str(e)}

    def generate_quiz(self, topic: str, grade_level: str, num_questions: int = 10,
                     difficulty: str = "intermediate", question_types: List[str] = None) -> Dict[str, Any]:
        """Generate a quiz with various question types"""

        if question_types is None:
            question_types = ["multiple_choice", "true_false", "short_answer"]

        cache_key = f"quiz_{topic}_{grade_level}_{difficulty}_{num_questions}"
        cached_result = cache.get(cache_key)
        if cached_result:
            return cached_result

        try:
            prompt = self._create_quiz_prompt(topic, grade_level, num_questions, difficulty, question_types)

            if self.openai_client:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are an expert quiz creator. Generate educational quizzes with accurate answers and explanations."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.6,
                    max_tokens=1500
                )
                content = response.choices[0].message.content
            else:
                # Use local model
                if self.quiz_generator:
                    result = self.quiz_generator(f"Generate a quiz about {topic}: {prompt}", max_length=1000)
                    content = result[0]['generated_text']
                else:
                    raise ValueError("No quiz generation model available")

            # Parse and structure the quiz
            quiz_data = self._parse_quiz_content(content, topic, grade_level, num_questions)

            # Validate quiz quality
            quality_score = self._validate_quiz_quality(quiz_data)
            quiz_data['quality_score'] = quality_score

            # Cache the result
            cache.set(cache_key, quiz_data, timeout=3600)

            return quiz_data

        except Exception as e:
            logger.error(f"Quiz generation failed: {e}")
            return {"error": str(e)}

    def generate_assignment(self, topic: str, grade_level: str, assignment_type: str = "homework",
                          duration: int = 60, difficulty: str = "intermediate") -> Dict[str, Any]:
        """Generate assignments and projects"""

        cache_key = f"assignment_{topic}_{grade_level}_{assignment_type}_{difficulty}_{duration}"
        cached_result = cache.get(cache_key)
        if cached_result:
            return cached_result

        try:
            prompt = self._create_assignment_prompt(topic, grade_level, assignment_type, duration, difficulty)

            if self.openai_client:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are an expert assignment creator. Generate engaging, educational assignments that promote learning."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=1500
                )
                content = response.choices[0].message.content
            else:
                # Use local model or fallback
                content = f"Generated assignment for {topic} at {grade_level} level"

            # Parse and structure the assignment
            assignment_data = self._parse_assignment_content(content, topic, grade_level, assignment_type, duration)

            # Validate assignment quality
            quality_score = self._validate_assignment_quality(assignment_data)
            assignment_data['quality_score'] = quality_score

            # Cache the result
            cache.set(cache_key, assignment_data, timeout=3600)

            return assignment_data

        except Exception as e:
            logger.error(f"Assignment generation failed: {e}")
            return {"error": str(e)}

    def generate_study_guide(self, topic: str, grade_level: str, key_concepts: List[str],
                           study_time: int = 30) -> Dict[str, Any]:
        """Generate study guides and review materials"""

        cache_key = f"study_guide_{topic}_{grade_level}_{study_time}"
        cached_result = cache.get(cache_key)
        if cached_result:
            return cached_result

        try:
            prompt = self._create_study_guide_prompt(topic, grade_level, key_concepts, study_time)

            if self.openai_client:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are an expert study guide creator. Generate comprehensive, well-organized study materials."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.6,
                    max_tokens=1500
                )
                content = response.choices[0].message.content
            else:
                # Use local summarizer if available
                if self.summarizer:
                    summary_text = f"Key concepts for {topic}: {', '.join(key_concepts)}"
                    result = self.summarizer(summary_text, max_length=500, min_length=100)
                    content = result[0]['summary_text']
                else:
                    content = f"Study guide for {topic} covering: {', '.join(key_concepts)}"

            # Parse and structure the study guide
            guide_data = self._parse_study_guide_content(content, topic, grade_level, key_concepts, study_time)

            # Cache the result
            cache.set(cache_key, guide_data, timeout=3600)

            return guide_data

        except Exception as e:
            logger.error(f"Study guide generation failed: {e}")
            return {"error": str(e)}

    def _create_lesson_prompt(self, topic, grade_level, learning_objectives, duration, difficulty):
        """Create prompt for lesson generation"""
        return f"""
Create a comprehensive lesson plan for {grade_level} students on the topic: {topic}

Learning Objectives:
{chr(10).join(f"- {obj}" for obj in learning_objectives)}

Lesson Details:
- Duration: {duration} minutes
- Difficulty Level: {difficulty}
- Grade Level: {grade_level}

Please provide:
1. Lesson Title
2. Materials Needed
3. Introduction/Warm-up Activity (5-10 minutes)
4. Main Teaching Content (20-30 minutes)
5. Practice Activities (10-15 minutes)
6. Assessment/Exit Ticket (5 minutes)
7. Extension Activities for Advanced Students
8. Differentiation Strategies for Different Learning Needs

Format the lesson plan clearly with sections and timing.
"""

    def _create_quiz_prompt(self, topic, grade_level, num_questions, difficulty, question_types):
        """Create prompt for quiz generation"""
        return f"""
Create a {num_questions}-question quiz for {grade_level} students on: {topic}

Requirements:
- Difficulty: {difficulty}
- Question Types: {', '.join(question_types)}
- Include answer key with explanations
- Questions should test understanding, not just memorization

For each question, provide:
- Question text
- Answer choices (for multiple choice)
- Correct answer
- Brief explanation

Ensure questions are age-appropriate and educational.
"""

    def _create_assignment_prompt(self, topic, grade_level, assignment_type, duration, difficulty):
        """Create prompt for assignment generation"""
        return f"""
Create a {assignment_type} assignment for {grade_level} students on: {topic}

Requirements:
- Estimated completion time: {duration} minutes
- Difficulty level: {difficulty}
- Should promote critical thinking and application of concepts

Include:
1. Assignment title and objective
2. Clear instructions
3. Required materials/resources
4. Step-by-step guidance
5. Assessment criteria/rubric
6. Extension options for advanced students

Make it engaging and educational.
"""

    def _create_study_guide_prompt(self, topic, grade_level, key_concepts, study_time):
        """Create prompt for study guide generation"""
        return f"""
Create a study guide for {grade_level} students on: {topic}

Key Concepts to Cover:
{chr(10).join(f"- {concept}" for concept in key_concepts)}

Study Time Available: {study_time} minutes

Include:
1. Main concepts overview
2. Key terms and definitions
3. Important formulas/theorems (if applicable)
4. Study questions for self-testing
5. Practice problems or examples
6. Summary and key takeaways

Organize the guide for efficient studying within the time limit.
"""

    def _parse_lesson_content(self, content, topic, grade_level, learning_objectives, duration):
        """Parse generated lesson content into structured format"""
        # This is a simplified parser - in production, you'd want more robust parsing
        return {
            "title": f"Lesson: {topic}",
            "topic": topic,
            "grade_level": grade_level,
            "learning_objectives": learning_objectives,
            "duration": duration,
            "content": content,
            "sections": ["Introduction", "Main Content", "Practice", "Assessment"],
            "materials": ["Whiteboard", "Projector", "Handouts"],
            "generated_at": datetime.now().isoformat()
        }

    def _parse_quiz_content(self, content, topic, grade_level, num_questions):
        """Parse generated quiz content"""
        return {
            "title": f"Quiz: {topic}",
            "topic": topic,
            "grade_level": grade_level,
            "num_questions": num_questions,
            "content": content,
            "questions": [],  # Would parse actual questions here
            "answer_key": {},  # Would parse answers here
            "generated_at": datetime.now().isoformat()
        }

    def _parse_assignment_content(self, content, topic, grade_level, assignment_type, duration):
        """Parse generated assignment content"""
        return {
            "title": f"{assignment_type.title()}: {topic}",
            "topic": topic,
            "grade_level": grade_level,
            "type": assignment_type,
            "duration": duration,
            "content": content,
            "rubric": {},  # Would parse rubric here
            "generated_at": datetime.now().isoformat()
        }

    def _parse_study_guide_content(self, content, topic, grade_level, key_concepts, study_time):
        """Parse generated study guide content"""
        return {
            "title": f"Study Guide: {topic}",
            "topic": topic,
            "grade_level": grade_level,
            "key_concepts": key_concepts,
            "study_time": study_time,
            "content": content,
            "sections": ["Overview", "Key Terms", "Practice Questions", "Summary"],
            "generated_at": datetime.now().isoformat()
        }

    def _validate_content_quality(self, content_data):
        """Validate the quality of generated content"""
        # Simple quality scoring based on content length, structure, etc.
        score = 0.5  # Base score

        if len(content_data.get('content', '')) > 500:
            score += 0.2
        if content_data.get('learning_objectives'):
            score += 0.2
        if content_data.get('sections'):
            score += 0.1

        return min(1.0, score)

    def _validate_quiz_quality(self, quiz_data):
        """Validate quiz quality"""
        score = 0.5

        if quiz_data.get('questions'):
            score += 0.3
        if quiz_data.get('answer_key'):
            score += 0.2

        return min(1.0, score)

    def _validate_assignment_quality(self, assignment_data):
        """Validate assignment quality"""
        score = 0.5

        if len(assignment_data.get('content', '')) > 300:
            score += 0.2
        if assignment_data.get('rubric'):
            score += 0.3

        return min(1.0, score)