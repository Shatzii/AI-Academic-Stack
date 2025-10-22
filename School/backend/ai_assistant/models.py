from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class AIConversation(models.Model):
    """Model for AI conversations."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_conversations')
    title = models.CharField(_('title'), max_length=255, blank=True)
    course = models.ForeignKey(
        'courses.Course',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='ai_conversations'
    )
    lesson = models.ForeignKey(
        'courses.Lesson',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='ai_conversations'
    )
    is_active = models.BooleanField(_('is active'), default=True)

    # Metadata
    total_messages = models.PositiveIntegerField(_('total messages'), default=0)
    last_message_at = models.DateTimeField(_('last message at'), auto_now=True)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('AI conversation')
        verbose_name_plural = _('AI conversations')
        ordering = ['-last_message_at']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.title or 'Untitled Conversation'}"


class AIMessage(models.Model):
    """Model for AI conversation messages."""

    MESSAGE_TYPES = [
        ('user', 'User Message'),
        ('assistant', 'AI Assistant'),
        ('system', 'System Message'),
    ]

    conversation = models.ForeignKey(AIConversation, on_delete=models.CASCADE, related_name='messages')
    message_type = models.CharField(_('message type'), max_length=20, choices=MESSAGE_TYPES)
    content = models.TextField(_('content'))

    # AI-specific fields
    tokens_used = models.PositiveIntegerField(_('tokens used'), blank=True, null=True)
    model_used = models.CharField(_('AI model used'), max_length=50, blank=True)
    response_time = models.DecimalField(
        _('response time (seconds)'),
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True
    )

    # Message metadata
    word_count = models.PositiveIntegerField(_('word count'), default=0)
    character_count = models.PositiveIntegerField(_('character count'), default=0)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    class Meta:
        verbose_name = _('AI message')
        verbose_name_plural = _('AI messages')
        ordering = ['created_at']

    def __str__(self):
        return f"{self.message_type}: {self.content[:50]}"


class AIPromptTemplate(models.Model):
    """Model for AI prompt templates."""

    TEMPLATE_TYPES = [
        ('lesson_explanation', 'Lesson Explanation'),
        ('quiz_generation', 'Quiz Generation'),
        ('assignment_help', 'Assignment Help'),
        ('concept_clarification', 'Concept Clarification'),
        ('study_guide', 'Study Guide Creation'),
        ('custom', 'Custom Template'),
    ]

    name = models.CharField(_('name'), max_length=100, unique=True)
    template_type = models.CharField(_('template type'), max_length=30, choices=TEMPLATE_TYPES)
    subject = models.ForeignKey(
        'courses.Subject',
        on_delete=models.CASCADE,
        related_name='ai_templates'
    )
    grade_level = models.CharField(_('grade level'), max_length=2, choices=[
        ('K', 'Kindergarten'),
        ('1', '1st Grade'),
        ('2', '2nd Grade'),
        ('3', '3rd Grade'),
        ('4', '4th Grade'),
        ('5', '5th Grade'),
        ('6', '6th Grade'),
        ('7', '7th Grade'),
        ('8', '8th Grade'),
        ('9', '9th Grade'),
        ('10', '10th Grade'),
        ('11', '11th Grade'),
        ('12', '12th Grade'),
    ])

    prompt_template = models.TextField(_('prompt template'))
    variables = models.JSONField(_('template variables'), default=list)  # List of variable names
    is_active = models.BooleanField(_('is active'), default=True)

    # Usage statistics
    usage_count = models.PositiveIntegerField(_('usage count'), default=0)
    average_rating = models.DecimalField(
        _('average rating'),
        max_digits=3,
        decimal_places=2,
        default=0.00
    )

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('AI prompt template')
        verbose_name_plural = _('AI prompt templates')
        ordering = ['template_type', 'name']

    def __str__(self):
        return f"{self.template_type}: {self.name}"


class AIInteractionLog(models.Model):
    """Model for logging AI interactions for analytics."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_logs')
    conversation = models.ForeignKey(AIConversation, on_delete=models.CASCADE, related_name='logs')
    message = models.ForeignKey(AIMessage, on_delete=models.CASCADE, related_name='logs')

    # Interaction details
    user_intent = models.CharField(_('user intent'), max_length=100, blank=True)
    ai_response_quality = models.CharField(
        _('AI response quality'),
        max_length=20,
        choices=[
            ('excellent', 'Excellent'),
            ('good', 'Good'),
            ('average', 'Average'),
            ('poor', 'Poor'),
            ('irrelevant', 'Irrelevant'),
        ],
        blank=True
    )

    # Performance metrics
    response_time = models.DecimalField(_('response time'), max_digits=5, decimal_places=2)
    tokens_used = models.PositiveIntegerField(_('tokens used'))
    cost_estimate = models.DecimalField(_('cost estimate'), max_digits=8, decimal_places=6, default=0)

    # Context
    course_context = models.CharField(_('course context'), max_length=255, blank=True)
    lesson_context = models.CharField(_('lesson context'), max_length=255, blank=True)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    class Meta:
        verbose_name = _('AI interaction log')
        verbose_name_plural = _('AI interaction logs')
        ordering = ['-created_at']


class AIStudyPlan(models.Model):
    """Model for AI-generated study plans."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='study_plans')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='study_plans')

    title = models.CharField(_('title'), max_length=255)
    description = models.TextField(_('description'))

    # Study plan content
    objectives = models.JSONField(_('learning objectives'), default=list)
    schedule = models.JSONField(_('study schedule'), default=dict)  # Weekly schedule
    resources = models.JSONField(_('recommended resources'), default=list)
    milestones = models.JSONField(_('milestones'), default=list)

    # Progress tracking
    progress_percentage = models.DecimalField(
        _('progress percentage'),
        max_digits=5,
        decimal_places=2,
        default=0.00
    )
    completed_milestones = models.JSONField(_('completed milestones'), default=list)

    # Settings
    is_active = models.BooleanField(_('is active'), default=True)
    duration_weeks = models.PositiveIntegerField(_('duration (weeks)'), default=4)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('AI study plan')
        verbose_name_plural = _('AI study plans')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.title}"


class AIQuiz(models.Model):
    """Model for AI-generated quizzes."""

    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='ai_quizzes')
    lesson = models.ForeignKey(
        'courses.Lesson',
        on_delete=models.CASCADE,
        related_name='ai_quizzes',
        blank=True,
        null=True
    )

    title = models.CharField(_('title'), max_length=255)
    description = models.TextField(_('description'), blank=True)

    # Quiz content
    questions = models.JSONField(_('questions'), default=list)
    difficulty_level = models.CharField(
        _('difficulty level'),
        max_length=20,
        choices=[
            ('easy', 'Easy'),
            ('medium', 'Medium'),
            ('hard', 'Hard'),
            ('advanced', 'Advanced'),
        ],
        default='medium'
    )

    # Settings
    time_limit_minutes = models.PositiveIntegerField(_('time limit (minutes)'), blank=True, null=True)
    passing_score = models.DecimalField(
        _('passing score (%)'),
        max_digits=5,
        decimal_places=2,
        default=70.00
    )
    max_attempts = models.PositiveIntegerField(_('max attempts'), default=3)
    is_adaptive = models.BooleanField(_('is adaptive'), default=False)

    # Statistics
    total_attempts = models.PositiveIntegerField(_('total attempts'), default=0)
    average_score = models.DecimalField(
        _('average score'),
        max_digits=5,
        decimal_places=2,
        default=0.00
    )

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('AI quiz')
        verbose_name_plural = _('AI quizzes')
        ordering = ['-created_at']

    def __str__(self):
        return f"AI Quiz: {self.title}"


class AIQuizAttempt(models.Model):
    """Model for quiz attempts."""

    quiz = models.ForeignKey(AIQuiz, on_delete=models.CASCADE, related_name='attempts')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_attempts')

    # Attempt details
    attempt_number = models.PositiveIntegerField(_('attempt number'), default=1)
    answers = models.JSONField(_('answers'), default=dict)
    score = models.DecimalField(_('score (%)'), max_digits=5, decimal_places=2)
    is_passed = models.BooleanField(_('is passed'), default=False)

    # Timing
    started_at = models.DateTimeField(_('started at'), auto_now_add=True)
    completed_at = models.DateTimeField(_('completed at'), blank=True, null=True)
    time_taken_minutes = models.PositiveIntegerField(_('time taken (minutes)'), blank=True, null=True)

    # Feedback
    ai_feedback = models.TextField(_('AI feedback'), blank=True)
    improvement_suggestions = models.JSONField(_('improvement suggestions'), default=list)

    class Meta:
        verbose_name = _('AI quiz attempt')
        verbose_name_plural = _('AI quiz attempts')
        ordering = ['-started_at']
        unique_together = ['quiz', 'user', 'attempt_number']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.quiz.title} (Attempt {self.attempt_number})"
