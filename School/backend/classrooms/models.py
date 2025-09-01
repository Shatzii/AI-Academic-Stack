from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class Classroom(models.Model):
    """Model for virtual classrooms."""

    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    title = models.CharField(_('title'), max_length=255)
    description = models.TextField(_('description'), blank=True)
    course = models.ForeignKey(
        'courses.Course',
        on_delete=models.CASCADE,
        related_name='classrooms'
    )
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='classrooms_taught'
    )

    # Scheduling
    scheduled_at = models.DateTimeField(_('scheduled at'))
    duration_minutes = models.PositiveIntegerField(_('duration (minutes)'), default=60)
    actual_start_time = models.DateTimeField(_('actual start time'), blank=True, null=True)
    actual_end_time = models.DateTimeField(_('actual end time'), blank=True, null=True)

    # Settings
    status = models.CharField(_('status'), max_length=20, choices=STATUS_CHOICES, default='scheduled')
    is_recording_enabled = models.BooleanField(_('recording enabled'), default=True)
    max_participants = models.PositiveIntegerField(_('max participants'), default=50)
    is_private = models.BooleanField(_('is private'), default=False)

    # Access control
    access_code = models.CharField(_('access code'), max_length=10, blank=True)
    allowed_emails = models.JSONField(_('allowed emails'), default=list, blank=True)

    # Meeting details
    meeting_id = models.CharField(_('meeting ID'), max_length=100, unique=True, blank=True)
    meeting_password = models.CharField(_('meeting password'), max_length=50, blank=True)
    join_url = models.URLField(_('join URL'), blank=True)

    # Recording
    recording_url = models.URLField(_('recording URL'), blank=True)
    recording_duration = models.PositiveIntegerField(_('recording duration'), blank=True, null=True)

    # Statistics
    total_participants = models.PositiveIntegerField(_('total participants'), default=0)
    peak_participants = models.PositiveIntegerField(_('peak participants'), default=0)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('classroom')
        verbose_name_plural = _('classrooms')
        ordering = ['-scheduled_at']

    def __str__(self):
        return f"{self.title} - {self.course.title}"

    @property
    def is_active(self):
        return self.status == 'active'

    @property
    def current_participants(self):
        return self.participants.filter(is_active=True).count()


class ClassroomParticipant(models.Model):
    """Model for classroom participants."""

    ROLE_CHOICES = [
        ('student', 'Student'),
        ('instructor', 'Instructor'),
        ('observer', 'Observer'),
    ]

    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='classroom_participation')
    role = models.CharField(_('role'), max_length=20, choices=ROLE_CHOICES, default='student')

    # Participation tracking
    joined_at = models.DateTimeField(_('joined at'), auto_now_add=True)
    left_at = models.DateTimeField(_('left at'), blank=True, null=True)
    is_active = models.BooleanField(_('is active'), default=True)

    # Engagement metrics
    total_time_minutes = models.PositiveIntegerField(_('total time (minutes)'), default=0)
    messages_sent = models.PositiveIntegerField(_('messages sent'), default=0)
    questions_asked = models.PositiveIntegerField(_('questions asked'), default=0)
    reactions_given = models.PositiveIntegerField(_('reactions given'), default=0)

    # Permissions
    can_speak = models.BooleanField(_('can speak'), default=True)
    can_share_screen = models.BooleanField(_('can share screen'), default=False)
    can_record = models.BooleanField(_('can record'), default=False)

    class Meta:
        verbose_name = _('classroom participant')
        verbose_name_plural = _('classroom participants')
        ordering = ['joined_at']
        unique_together = ['classroom', 'user']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.classroom.title}"


class ChatMessage(models.Model):
    """Model for classroom chat messages."""

    MESSAGE_TYPE_CHOICES = [
        ('text', 'Text'),
        ('system', 'System'),
        ('question', 'Question'),
        ('answer', 'Answer'),
    ]

    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='chat_messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_messages')
    message_type = models.CharField(_('message type'), max_length=20, choices=MESSAGE_TYPE_CHOICES, default='text')
    content = models.TextField(_('content'))

    # Thread support
    parent_message = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='replies'
    )

    # Moderation
    is_approved = models.BooleanField(_('is approved'), default=True)
    moderated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='moderated_messages'
    )

    # Reactions
    reactions = models.JSONField(_('reactions'), default=dict)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('chat message')
        verbose_name_plural = _('chat messages')
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender.get_full_name()}: {self.content[:50]}"


class ClassroomRecording(models.Model):
    """Model for classroom recordings."""

    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='recordings')
    title = models.CharField(_('title'), max_length=255)
    description = models.TextField(_('description'), blank=True)

    # File information
    file = models.FileField(_('recording file'), upload_to='classroom_recordings/')
    file_size = models.PositiveIntegerField(_('file size (bytes)'))
    duration_seconds = models.PositiveIntegerField(_('duration (seconds)'))

    # Metadata
    recording_started_at = models.DateTimeField(_('recording started at'))
    recording_ended_at = models.DateTimeField(_('recording ended at'))

    # Access control
    is_public = models.BooleanField(_('is public'), default=False)
    allowed_users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='accessible_recordings',
        blank=True
    )

    # Statistics
    view_count = models.PositiveIntegerField(_('view count'), default=0)
    download_count = models.PositiveIntegerField(_('download count'), default=0)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('classroom recording')
        verbose_name_plural = _('classroom recordings')
        ordering = ['-created_at']

    def __str__(self):
        return f"Recording: {self.classroom.title} - {self.title}"


class BreakoutRoom(models.Model):
    """Model for breakout rooms within classrooms."""

    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='breakout_rooms')
    name = models.CharField(_('name'), max_length=100)
    description = models.TextField(_('description'), blank=True)

    # Participants
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='breakout_rooms',
        blank=True
    )

    # Settings
    max_participants = models.PositiveIntegerField(_('max participants'), default=10)
    is_active = models.BooleanField(_('is active'), default=True)

    # Meeting details
    meeting_id = models.CharField(_('meeting ID'), max_length=100, blank=True)
    join_url = models.URLField(_('join URL'), blank=True)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('breakout room')
        verbose_name_plural = _('breakout rooms')
        ordering = ['created_at']

    def __str__(self):
        return f"{self.name} - {self.classroom.title}"


class Poll(models.Model):
    """Model for polls during classroom sessions."""

    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='polls')
    question = models.TextField(_('question'))
    options = models.JSONField(_('options'))  # List of option texts
    correct_answer = models.PositiveIntegerField(_('correct answer'), blank=True, null=True)

    # Settings
    is_anonymous = models.BooleanField(_('is anonymous'), default=False)
    allow_multiple_answers = models.BooleanField(_('allow multiple answers'), default=False)
    is_active = models.BooleanField(_('is active'), default=True)

    # Results
    responses = models.JSONField(_('responses'), default=dict)  # {option_index: count}
    total_responses = models.PositiveIntegerField(_('total responses'), default=0)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('poll')
        verbose_name_plural = _('polls')
        ordering = ['-created_at']

    def __str__(self):
        return f"Poll: {self.question[:50]}"


class PollResponse(models.Model):
    """Model for poll responses."""

    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='poll_responses')
    respondent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='poll_responses')
    answers = models.JSONField(_('answers'))  # List of selected option indices

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    class Meta:
        verbose_name = _('poll response')
        verbose_name_plural = _('poll responses')
        ordering = ['created_at']
        unique_together = ['poll', 'respondent']

    def __str__(self):
        return f"{self.respondent.get_full_name()} - {self.poll.question[:30]}"
