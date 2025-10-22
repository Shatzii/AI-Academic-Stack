from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import models
from .models import (
    AIConversation, AIMessage, AIPromptTemplate, AIStudyPlan,
    AIQuiz, AIQuizAttempt
)
from .serializers import (
    AIConversationSerializer, AIConversationCreateSerializer, AIMessageSerializer,
    AIPromptTemplateSerializer, AIStudyPlanSerializer, AIQuizSerializer,
    AIQuizAttemptSerializer, AIQuizAttemptCreateSerializer,
    AIChatRequestSerializer, AIStudyPlanRequestSerializer,
    AIQuizGenerationRequestSerializer, AIResponseSerializer
)
from django.conf import settings
import json
from datetime import timedelta
from ai_service_client import get_ai_response
import logging

logger = logging.getLogger(__name__)


class AIConversationListView(generics.ListCreateAPIView):
    """View for listing and creating AI conversations."""

    serializer_class = AIConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AIConversationCreateSerializer
        return AIConversationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return AIConversation.objects.filter(user=user, is_active=True)
        return AIConversation.objects.none()

    def perform_create(self, serializer):
        conversation = serializer.save()
        # Create initial system message
        AIMessage.objects.create(
            conversation=conversation,
            message_type='system',
            content="Hello! I'm your AI learning assistant. How can I help you with your studies today?"
        )


class AIConversationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, and deleting AI conversations."""

    serializer_class = AIConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return AIConversation.objects.filter(user=user)
        return AIConversation.objects.none()


class AIChatView(APIView):
    """View for AI chat interactions."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AIChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_message = serializer.validated_data['message']
        conversation_id = serializer.validated_data.get('conversation_id')
        course_id = serializer.validated_data.get('course_id')
        lesson_id = serializer.validated_data.get('lesson_id')
        context = serializer.validated_data.get('context', '')

        # Get or create conversation
        if conversation_id:
            conversation = get_object_or_404(
                AIConversation,
                id=conversation_id,
                user=request.user
            )
        else:
            conversation = AIConversation.objects.create(
                user=request.user,
                course_id=course_id,
                lesson_id=lesson_id,
                title=user_message[:50] + '...' if len(user_message) > 50 else user_message
            )

        # Save user message
        user_msg = AIMessage.objects.create(
            conversation=conversation,
            message_type='user',
            content=user_message,
            word_count=len(user_message.split()),
            character_count=len(user_message)
        )

        # Generate AI response
        ai_response, tokens_used, response_time, service_type = self.generate_ai_response(
            user_message, conversation, context
        )

        # Save AI message
        ai_msg = AIMessage.objects.create(
            conversation=conversation,
            message_type='assistant',
            content=ai_response,
            tokens_used=tokens_used,
            model_used='gpt-3.5-turbo',
            response_time=response_time,
            word_count=len(ai_response.split()),
            character_count=len(ai_response)
        )

        # Update conversation
        conversation.total_messages += 2
        conversation.save()

        response_data = {
            'response': ai_response,
            'conversation_id': conversation.id,
            'message_id': ai_msg.id,
            'tokens_used': tokens_used,
            'response_time': response_time,
            'service_type': service_type,
            'model': 'gpt-3.5-turbo',  # Default model, could be enhanced to return actual model used
            'suggestions': self.generate_suggestions(ai_response)
        }

        response_serializer = AIResponseSerializer(data=response_data)
        response_serializer.is_valid(raise_exception=True)

        return Response(response_serializer.validated_data)

    def generate_ai_response(self, user_message, conversation, context):
        """Generate AI response using AI service with OpenAI fallback."""
        import time
        start_time = time.time()

        try:
            # Build conversation history
            messages = []
            recent_messages = conversation.messages.order_by('-created_at')[:10]

            # Add system message
            system_prompt = self.build_system_prompt(conversation, context)
            messages.append({"role": "system", "content": system_prompt})

            # Add conversation history (in reverse order)
            for msg in reversed(recent_messages):
                role = "user" if msg.message_type == "user" else "assistant"
                messages.append({"role": role, "content": msg.content})

            # Use our AI service client with fallback
            ai_response, tokens_used, response_time, service_type = get_ai_response(
                messages=messages,
                model="gpt-3.5-turbo",  # Default model, will use local if available
                temperature=0.7,
                max_tokens=1000
            )

            # Adjust response time if it wasn't set by the service
            if response_time == 0:
                response_time = round(time.time() - start_time, 2)

            return ai_response, tokens_used, response_time, service_type

        except Exception as e:
            logger.error(f"AI response generation failed: {e}")
            # Fallback response
            fallback_response = "I'm sorry, I'm having trouble processing your request right now. Please try again later."
            return fallback_response, 0, round(time.time() - start_time, 2), 'fallback'

    def build_system_prompt(self, conversation, context):
        """Build system prompt for AI."""
        base_prompt = """You are an AI learning assistant for OpenEdTex, an educational platform.
        Help students with their learning by providing clear, accurate, and helpful responses.
        Focus on educational content, explanations, and study guidance."""

        if conversation.course:
            base_prompt += f"\n\nCourse Context: {conversation.course.title}"
            if conversation.course.description:
                base_prompt += f"\nDescription: {conversation.course.description[:200]}..."

        if conversation.lesson:
            base_prompt += f"\n\nLesson Context: {conversation.lesson.title}"
            if conversation.lesson.content:
                base_prompt += f"\nContent: {conversation.lesson.content[:300]}..."

        if context:
            base_prompt += f"\n\nAdditional Context: {context}"

        return base_prompt

    def generate_suggestions(self, ai_response):
        """Generate follow-up suggestions."""
        suggestions = []
        response_lower = ai_response.lower()

        if 'explain' in response_lower or 'explanation' in response_lower:
            suggestions.append("Can you provide an example?")
        if 'practice' in response_lower or 'exercise' in response_lower:
            suggestions.append("Show me similar problems")
        if 'study' in response_lower or 'learn' in response_lower:
            suggestions.append("Create a study plan")
        if 'quiz' in response_lower or 'test' in response_lower:
            suggestions.append("Generate a practice quiz")

        return suggestions[:3]  # Limit to 3 suggestions


class AIPromptTemplateListView(generics.ListAPIView):
    """View for listing AI prompt templates."""

    serializer_class = AIPromptTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = AIPromptTemplate.objects.filter(is_active=True)

        # Filter by subject and grade level if provided
        subject_id = self.request.query_params.get('subject')
        grade_level = self.request.query_params.get('grade_level')
        template_type = self.request.query_params.get('type')

        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if grade_level:
            queryset = queryset.filter(grade_level=grade_level)
        if template_type:
            queryset = queryset.filter(template_type=template_type)

        return queryset


class AIStudyPlanListView(generics.ListCreateAPIView):
    """View for listing and creating AI-generated study plans."""

    serializer_class = AIStudyPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AIStudyPlan.objects.filter(user=self.request.user)

    def post(self, request):
        serializer = AIStudyPlanRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        course_id = serializer.validated_data['course_id']
        duration_weeks = serializer.validated_data['duration_weeks']
        learning_style = serializer.validated_data['learning_style']
        prior_knowledge = serializer.validated_data.get('prior_knowledge', '')
        goals = serializer.validated_data.get('goals', '')

        # Generate study plan using AI
        study_plan_data = self.generate_study_plan(
            course_id, duration_weeks, learning_style, prior_knowledge, goals
        )

        # Create study plan
        study_plan = AIStudyPlan.objects.create(
            user=request.user,
            course_id=course_id,
            **study_plan_data
        )

        response_serializer = AIStudyPlanSerializer(study_plan)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def generate_study_plan(self, course_id, duration_weeks, learning_style, prior_knowledge, goals):
        """Generate study plan using AI."""
        from courses.models import Course

        course = get_object_or_404(Course, id=course_id)

        prompt = f"""
        Create a detailed {duration_weeks}-week study plan for the course: {course.title}

        Course Description: {course.description}
        Learning Style: {learning_style}
        Prior Knowledge: {prior_knowledge}
        Goals: {goals}

        Please provide:
        1. Learning objectives
        2. Weekly schedule with specific topics
        3. Recommended resources and activities
        4. Milestones and checkpoints
        5. Assessment methods

        Format as JSON with keys: objectives, schedule, resources, milestones
        """

        try:
            from ai_service_client import get_ai_response
            messages = [{"role": "user", "content": prompt}]
            ai_response, tokens_used, response_time, service_type = get_ai_response(
                messages, max_tokens=1500, temperature=0.7
            )

            # Parse JSON response
            try:
                plan_data = json.loads(ai_response)
            except json.JSONDecodeError:
                # Fallback structure
                plan_data = {
                    'objectives': ['Master course fundamentals', 'Apply concepts practically'],
                    'schedule': {},
                    'resources': ['Course materials', 'Practice exercises'],
                    'milestones': ['Complete week 1', 'Mid-course assessment']
                }

            return {
                'title': f"Study Plan: {course.title}",
                'description': f"AI-generated {duration_weeks}-week study plan for {learning_style} learners",
                'objectives': plan_data.get('objectives', []),
                'schedule': plan_data.get('schedule', {}),
                'resources': plan_data.get('resources', []),
                'milestones': plan_data.get('milestones', []),
                'duration_weeks': duration_weeks
            }

        except Exception as e:
            # Fallback study plan
            return {
                'title': f"Study Plan: {course.title}",
                'description': f"Basic {duration_weeks}-week study plan",
                'objectives': ['Complete course materials', 'Practice key concepts'],
                'schedule': {},
                'resources': ['Course content', 'Additional readings'],
                'milestones': [f'Complete week {i+1}' for i in range(duration_weeks)],
                'duration_weeks': duration_weeks
            }


class AIQuizListView(generics.ListCreateAPIView):
    """View for listing and creating AI-generated quizzes."""

    serializer_class = AIQuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Show quizzes for courses the user is enrolled in or teaches
        user = self.request.user
        if user.is_teacher:
            return AIQuiz.objects.filter(course__instructor=user)
        else:
            enrolled_course_ids = user.enrollments.filter(
                status__in=['active', 'completed']
            ).values_list('course_id', flat=True)
            return AIQuiz.objects.filter(course_id__in=enrolled_course_ids)

    def post(self, request):
        serializer = AIQuizGenerationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        course_id = serializer.validated_data['course_id']
        lesson_id = serializer.validated_data.get('lesson_id')
        difficulty_level = serializer.validated_data['difficulty_level']
        question_count = serializer.validated_data['question_count']
        include_explanations = serializer.validated_data['include_explanations']
        time_limit_minutes = serializer.validated_data.get('time_limit_minutes')

        # Generate quiz using AI
        quiz_data = self.generate_quiz(
            course_id, lesson_id, difficulty_level, question_count, include_explanations
        )

        # Create quiz
        quiz = AIQuiz.objects.create(
            course_id=course_id,
            lesson_id=lesson_id,
            title=quiz_data['title'],
            description=quiz_data['description'],
            questions=quiz_data['questions'],
            difficulty_level=difficulty_level,
            time_limit_minutes=time_limit_minutes
        )

        response_serializer = AIQuizSerializer(quiz)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def generate_quiz(self, course_id, lesson_id, difficulty_level, question_count, include_explanations):
        """Generate quiz using AI."""
        from courses.models import Course, Lesson

        course = get_object_or_404(Course, id=course_id)
        lesson = None
        if lesson_id:
            lesson = get_object_or_404(Lesson, id=lesson_id, course=course)

        context = f"Course: {course.title}"
        if lesson:
            context += f"\nLesson: {lesson.title}\nContent: {lesson.content[:500]}..."

        prompt = f"""
        Generate a {difficulty_level} difficulty quiz with {question_count} questions for:

        {context}

        Create multiple choice questions with 4 options each.
        Include the correct answer and optionally explanations.

        Format as JSON with keys: title, description, questions
        Each question should have: question, options (array), correct_answer (index), explanation (optional)
        """

        try:
            from ai_service_client import get_ai_response
            messages = [{"role": "user", "content": prompt}]
            ai_response, tokens_used, response_time, service_type = get_ai_response(
                messages, max_tokens=2000, temperature=0.7
            )

            # Parse JSON response
            try:
                quiz_data = json.loads(ai_response)
            except json.JSONDecodeError:
                # Fallback quiz structure
                quiz_data = {
                    'title': f"{difficulty_level.title()} Quiz: {course.title}",
                    'description': f"AI-generated {difficulty_level} quiz",
                    'questions': [
                        {
                            'question': 'Sample question?',
                            'options': ['A', 'B', 'C', 'D'],
                            'correct_answer': 0,
                            'explanation': 'Sample explanation' if include_explanations else None
                        }
                    ] * min(question_count, 5)
                }

            return quiz_data

        except Exception as e:
            # Fallback quiz
            return {
                'title': f"Quiz: {course.title}",
                'description': f"Practice quiz for {course.title}",
                'questions': [
                    {
                        'question': 'What is the main topic of this course?',
                        'options': [
                            course.title,
                            'General Education',
                            'Advanced Topics',
                            'Basic Concepts'
                        ],
                        'correct_answer': 0,
                        'explanation': f'This quiz covers {course.title}' if include_explanations else None
                    }
                ]
            }


class AIQuizAttemptListView(generics.ListCreateAPIView):
    """View for listing and creating quiz attempts."""

    serializer_class = AIQuizAttemptSerializer

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AIQuizAttemptCreateSerializer
        return AIQuizAttemptSerializer

    def get_queryset(self):
        return AIQuizAttempt.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        attempt = serializer.save()

        # Update quiz statistics
        quiz = attempt.quiz
        quiz.total_attempts += 1
        quiz.average_score = (
            (quiz.average_score * (quiz.total_attempts - 1)) + attempt.score
        ) / quiz.total_attempts
        quiz.save()


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def ai_stats(request):
    """Get AI usage statistics for the user."""

    user = request.user
    conversations = AIConversation.objects.filter(user=user)
    messages = AIMessage.objects.filter(conversation__user=user)
    study_plans = AIStudyPlan.objects.filter(user=user)
    quiz_attempts = AIQuizAttempt.objects.filter(user=user)

    total_conversations = conversations.count()
    total_messages = messages.count()
    total_tokens = messages.filter(message_type='assistant').aggregate(
        total=models.Sum('tokens_used')
    )['total'] or 0

    return Response({
        'total_conversations': total_conversations,
        'total_messages': total_messages,
        'total_tokens_used': total_tokens,
        'study_plans_created': study_plans.count(),
        'quizzes_attempted': quiz_attempts.count(),
        'average_quiz_score': quiz_attempts.aggregate(
            avg_score=models.Avg('score')
        )['avg_score'] or 0
    })
