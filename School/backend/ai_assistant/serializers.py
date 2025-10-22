from rest_framework import serializers
from .models import (
    AIConversation, AIMessage, AIPromptTemplate, AIInteractionLog,
    AIStudyPlan, AIQuiz, AIQuizAttempt
)


class AIMessageSerializer(serializers.ModelSerializer):
    """Serializer for AIMessage model."""

    class Meta:
        model = AIMessage
        fields = [
            'id', 'message_type', 'content', 'tokens_used', 'model_used',
            'response_time', 'word_count', 'character_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AIConversationSerializer(serializers.ModelSerializer):
    """Serializer for AIConversation model."""

    messages = AIMessageSerializer(many=True, read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    message_count = serializers.SerializerMethodField()

    class Meta:
        model = AIConversation
        fields = [
            'id', 'title', 'course', 'course_title', 'lesson', 'lesson_title',
            'is_active', 'total_messages', 'last_message_at', 'messages',
            'message_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'total_messages', 'last_message_at', 'created_at', 'updated_at']

    def get_message_count(self, obj):
        return obj.messages.count()


class AIConversationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating AI conversations."""

    class Meta:
        model = AIConversation
        fields = ['title', 'course', 'lesson']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class AIPromptTemplateSerializer(serializers.ModelSerializer):
    """Serializer for AIPromptTemplate model."""

    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = AIPromptTemplate
        fields = [
            'id', 'name', 'template_type', 'subject', 'subject_name',
            'grade_level', 'prompt_template', 'variables', 'is_active',
            'usage_count', 'average_rating', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'usage_count', 'average_rating', 'created_at', 'updated_at']


class AIInteractionLogSerializer(serializers.ModelSerializer):
    """Serializer for AIInteractionLog model."""

    conversation_title = serializers.CharField(source='conversation.title', read_only=True)

    class Meta:
        model = AIInteractionLog
        fields = [
            'id', 'user', 'conversation', 'conversation_title', 'message',
            'user_intent', 'ai_response_quality', 'response_time', 'tokens_used',
            'cost_estimate', 'course_context', 'lesson_context', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AIStudyPlanSerializer(serializers.ModelSerializer):
    """Serializer for AIStudyPlan model."""

    course_title = serializers.CharField(source='course.title', read_only=True)
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = AIStudyPlan
        fields = [
            'id', 'course', 'course_title', 'title', 'description', 'objectives',
            'schedule', 'resources', 'milestones', 'progress_percentage',
            'completed_milestones', 'is_active', 'duration_weeks',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_progress_percentage(self, obj):
        if obj.milestones:
            completed = len(obj.completed_milestones)
            total = len(obj.milestones)
            return round((completed / total) * 100, 2) if total > 0 else 0
        return 0


class AIQuizSerializer(serializers.ModelSerializer):
    """Serializer for AIQuiz model."""

    course_title = serializers.CharField(source='course.title', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)

    class Meta:
        model = AIQuiz
        fields = [
            'id', 'course', 'course_title', 'lesson', 'lesson_title', 'title',
            'description', 'questions', 'difficulty_level', 'time_limit_minutes',
            'passing_score', 'max_attempts', 'is_adaptive', 'total_attempts',
            'average_score', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'total_attempts', 'average_score', 'created_at', 'updated_at']


class AIQuizAttemptSerializer(serializers.ModelSerializer):
    """Serializer for AIQuizAttempt model."""

    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = AIQuizAttempt
        fields = [
            'id', 'quiz', 'quiz_title', 'user', 'user_name', 'attempt_number',
            'answers', 'score', 'is_passed', 'started_at', 'completed_at',
            'time_taken_minutes', 'ai_feedback', 'improvement_suggestions'
        ]
        read_only_fields = ['id', 'started_at', 'completed_at']


class AIQuizAttemptCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating quiz attempts."""

    class Meta:
        model = AIQuizAttempt
        fields = ['quiz', 'answers']

    def create(self, validated_data):
        quiz = validated_data['quiz']
        user = self.context['request'].user

        # Get attempt number
        existing_attempts = AIQuizAttempt.objects.filter(quiz=quiz, user=user).count()
        attempt_number = existing_attempts + 1

        # Check max attempts
        if attempt_number > quiz.max_attempts:
            raise serializers.ValidationError("Maximum attempts exceeded.")

        validated_data['user'] = user
        validated_data['attempt_number'] = attempt_number

        # Calculate score (simplified - in real implementation, this would be more complex)
        answers = validated_data['answers']
        correct_answers = 0
        total_questions = len(quiz.questions)

        for i, answer in enumerate(answers):
            if i < len(quiz.questions):
                question = quiz.questions[i]
                if question.get('correct_answer') == answer:
                    correct_answers += 1

        score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        validated_data['score'] = score
        validated_data['is_passed'] = score >= quiz.passing_score

        return super().create(validated_data)


class AIChatRequestSerializer(serializers.Serializer):
    """Serializer for AI chat requests."""

    message = serializers.CharField(max_length=2000)
    conversation_id = serializers.IntegerField(required=False)
    course_id = serializers.IntegerField(required=False)
    lesson_id = serializers.IntegerField(required=False)
    context = serializers.CharField(max_length=500, required=False)

    def validate_conversation_id(self, value):
        if value:
            try:
                conversation = AIConversation.objects.get(
                    id=value,
                    user=self.context['request'].user
                )
                return value
            except AIConversation.DoesNotExist:
                raise serializers.ValidationError("Conversation not found.")
        return value


class AIStudyPlanRequestSerializer(serializers.Serializer):
    """Serializer for AI study plan generation requests."""

    course_id = serializers.IntegerField()
    duration_weeks = serializers.IntegerField(min_value=1, max_value=12, default=4)
    learning_style = serializers.ChoiceField(
        choices=['visual', 'auditory', 'kinesthetic', 'reading'],
        default='visual'
    )
    prior_knowledge = serializers.CharField(max_length=500, required=False)
    goals = serializers.CharField(max_length=500, required=False)


class AIQuizGenerationRequestSerializer(serializers.Serializer):
    """Serializer for AI quiz generation requests."""

    course_id = serializers.IntegerField()
    lesson_id = serializers.IntegerField(required=False)
    difficulty_level = serializers.ChoiceField(
        choices=['easy', 'medium', 'hard', 'advanced'],
        default='medium'
    )
    question_count = serializers.IntegerField(min_value=5, max_value=50, default=10)
    include_explanations = serializers.BooleanField(default=True)
    time_limit_minutes = serializers.IntegerField(min_value=5, max_value=180, required=False)


class AIResponseSerializer(serializers.Serializer):
    """Serializer for AI responses."""

    response = serializers.CharField()
    conversation_id = serializers.IntegerField()
    message_id = serializers.IntegerField()
    tokens_used = serializers.IntegerField()
    response_time = serializers.DecimalField(max_digits=5, decimal_places=2)
    suggestions = serializers.ListField(child=serializers.CharField(), required=False)
