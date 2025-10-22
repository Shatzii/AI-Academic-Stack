from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class AnalyticsEvent(models.Model):
    """Model for tracking user events and interactions."""

    EVENT_TYPES = [
        ('login', 'User Login'),
        ('logout', 'User Logout'),
        ('page_view', 'Page View'),
        ('course_view', 'Course View'),
        ('lesson_view', 'Lesson View'),
        ('quiz_start', 'Quiz Start'),
        ('quiz_complete', 'Quiz Complete'),
        ('ai_chat', 'AI Chat Interaction'),
        ('classroom_join', 'Classroom Join'),
        ('classroom_leave', 'Classroom Leave'),
        ('enrollment', 'Course Enrollment'),
        ('completion', 'Course Completion'),
        ('download', 'Resource Download'),
        ('search', 'Search Query'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analytics_events')
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    timestamp = models.DateTimeField(default=timezone.now)
    session_id = models.CharField(max_length=100, blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)

    # Event-specific data
    course = models.ForeignKey('courses.Course', on_delete=models.SET_NULL, null=True, blank=True)
    lesson = models.ForeignKey('courses.Lesson', on_delete=models.SET_NULL, null=True, blank=True)
    classroom = models.ForeignKey('classrooms.Classroom', on_delete=models.SET_NULL, null=True, blank=True)
    quiz = models.ForeignKey('ai_assistant.AIQuiz', on_delete=models.SET_NULL, null=True, blank=True)
    conversation = models.ForeignKey('ai_assistant.AIConversation', on_delete=models.SET_NULL, null=True, blank=True)

    # Additional metadata
    metadata = models.JSONField(default=dict, blank=True)
    duration = models.PositiveIntegerField(blank=True, null=True)  # in seconds

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'event_type']),
            models.Index(fields=['timestamp']),
            models.Index(fields=['event_type', 'timestamp']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.event_type} at {self.timestamp}"


class UserSession(models.Model):
    """Model for tracking user sessions."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_id = models.CharField(max_length=100, unique=True)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(blank=True, null=True)
    duration = models.PositiveIntegerField(blank=True, null=True)  # in seconds
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    device_type = models.CharField(max_length=50, blank=True, null=True)
    browser = models.CharField(max_length=50, blank=True, null=True)
    os = models.CharField(max_length=50, blank=True, null=True)

    # Session statistics
    page_views = models.PositiveIntegerField(default=0)
    courses_viewed = models.PositiveIntegerField(default=0)
    lessons_viewed = models.PositiveIntegerField(default=0)
    quizzes_attempted = models.PositiveIntegerField(default=0)
    ai_interactions = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-start_time']

    def __str__(self):
        return f"{self.user.username} - Session {self.session_id}"

    @property
    def is_active(self):
        """Check if session is currently active."""
        if not self.end_time:
            return True
        # Consider session active if less than 30 minutes since last activity
        return timezone.now() - self.end_time < timedelta(minutes=30)

    def end_session(self):
        """End the session and calculate duration."""
        if not self.end_time:
            self.end_time = timezone.now()
            self.duration = int((self.end_time - self.start_time).total_seconds())
            self.save()


class CourseAnalytics(models.Model):
    """Model for course-specific analytics."""

    course = models.OneToOneField('courses.Course', on_delete=models.CASCADE, related_name='analytics')
    total_views = models.PositiveIntegerField(default=0)
    unique_viewers = models.PositiveIntegerField(default=0)
    total_enrollments = models.PositiveIntegerField(default=0)
    active_enrollments = models.PositiveIntegerField(default=0)
    completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_reviews = models.PositiveIntegerField(default=0)

    # Engagement metrics
    average_session_duration = models.PositiveIntegerField(default=0)  # in seconds
    total_study_time = models.PositiveIntegerField(default=0)  # in seconds
    average_progress = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    # Content metrics
    lessons_completed = models.PositiveIntegerField(default=0)
    quizzes_attempted = models.PositiveIntegerField(default=0)
    average_quiz_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    # Time-based metrics
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-total_views']

    def __str__(self):
        return f"Analytics for {self.course.title}"

    def update_metrics(self):
        """Update all analytics metrics for the course."""
        from courses.models import Enrollment, CourseReview
        from ai_assistant.models import AIQuizAttempt

        # Enrollment metrics
        enrollments = Enrollment.objects.filter(course=self.course)
        self.total_enrollments = enrollments.count()
        self.active_enrollments = enrollments.filter(status='active').count()

        # Completion rate
        completed_enrollments = enrollments.filter(status='completed').count()
        if self.total_enrollments > 0:
            self.completion_rate = (completed_enrollments / self.total_enrollments) * 100

        # Rating metrics
        reviews = CourseReview.objects.filter(course=self.course)
        self.total_reviews = reviews.count()
        if self.total_reviews > 0:
            self.average_rating = reviews.aggregate(
                avg_rating=models.Avg('rating')
            )['avg_rating'] or 0

        # Quiz metrics
        quiz_attempts = AIQuizAttempt.objects.filter(quiz__course=self.course)
        self.quizzes_attempted = quiz_attempts.count()
        if self.quizzes_attempted > 0:
            self.average_quiz_score = quiz_attempts.aggregate(
                avg_score=models.Avg('score')
            )['avg_score'] or 0

        self.save()


class UserAnalytics(models.Model):
    """Model for user-specific analytics."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='analytics')
    total_sessions = models.PositiveIntegerField(default=0)
    total_session_time = models.PositiveIntegerField(default=0)  # in seconds
    average_session_duration = models.PositiveIntegerField(default=0)  # in seconds

    # Learning metrics
    courses_enrolled = models.PositiveIntegerField(default=0)
    courses_completed = models.PositiveIntegerField(default=0)
    lessons_completed = models.PositiveIntegerField(default=0)
    quizzes_attempted = models.PositiveIntegerField(default=0)
    average_quiz_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    # Engagement metrics
    total_page_views = models.PositiveIntegerField(default=0)
    total_ai_interactions = models.PositiveIntegerField(default=0)
    total_study_time = models.PositiveIntegerField(default=0)  # in seconds

    # Activity tracking
    last_login = models.DateTimeField(blank=True, null=True)
    last_activity = models.DateTimeField(blank=True, null=True)
    streak_days = models.PositiveIntegerField(default=0)  # consecutive days active

    # Preferences
    preferred_subjects = models.JSONField(default=list, blank=True)
    preferred_difficulty = models.CharField(max_length=20, default='intermediate')
    learning_style = models.CharField(max_length=50, blank=True, null=True)

    # Time-based metrics
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-total_session_time']

    def __str__(self):
        return f"Analytics for {self.user.username}"

    def update_metrics(self):
        """Update all analytics metrics for the user."""
        from courses.models import Enrollment
        from ai_assistant.models import AIQuizAttempt, AIConversation

        # Session metrics
        sessions = UserSession.objects.filter(user=self.user)
        self.total_sessions = sessions.count()
        self.total_session_time = sessions.aggregate(
            total_time=models.Sum('duration')
        )['total_time'] or 0
        if self.total_sessions > 0:
            self.average_session_duration = self.total_session_time // self.total_sessions

        # Learning metrics
        enrollments = Enrollment.objects.filter(user=self.user)
        self.courses_enrolled = enrollments.count()
        self.courses_completed = enrollments.filter(status='completed').count()

        # Quiz metrics
        quiz_attempts = AIQuizAttempt.objects.filter(user=self.user)
        self.quizzes_attempted = quiz_attempts.count()
        if self.quizzes_attempted > 0:
            self.average_quiz_score = quiz_attempts.aggregate(
                avg_score=models.Avg('score')
            )['avg_score'] or 0

        # AI interactions
        conversations = AIConversation.objects.filter(user=self.user)
        self.total_ai_interactions = conversations.aggregate(
            total_messages=models.Sum('total_messages')
        )['total_messages'] or 0

        # Activity tracking
        last_event = AnalyticsEvent.objects.filter(user=self.user).first()
        if last_event:
            self.last_activity = last_event.timestamp

        self.save()


class PlatformAnalytics(models.Model):
    """Model for overall platform analytics."""

    date = models.DateField(unique=True)
    total_users = models.PositiveIntegerField(default=0)
    active_users = models.PositiveIntegerField(default=0)  # users active in last 30 days
    new_users = models.PositiveIntegerField(default=0)

    # Content metrics
    total_courses = models.PositiveIntegerField(default=0)
    total_lessons = models.PositiveIntegerField(default=0)
    total_enrollments = models.PositiveIntegerField(default=0)

    # Engagement metrics
    total_sessions = models.PositiveIntegerField(default=0)
    total_session_time = models.PositiveIntegerField(default=0)  # in seconds
    total_page_views = models.PositiveIntegerField(default=0)
    total_ai_interactions = models.PositiveIntegerField(default=0)

    # Learning metrics
    courses_completed = models.PositiveIntegerField(default=0)
    lessons_completed = models.PositiveIntegerField(default=0)
    quizzes_attempted = models.PositiveIntegerField(default=0)
    average_completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    # Technical metrics
    api_requests = models.PositiveIntegerField(default=0)
    error_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"Platform Analytics for {self.date}"

    @classmethod
    def update_daily_stats(cls):
        """Update daily platform statistics."""
        today = timezone.now().date()

        # Get or create today's analytics
        analytics, created = cls.objects.get_or_create(date=today)

        # User metrics
        analytics.total_users = User.objects.count()
        thirty_days_ago = today - timedelta(days=30)
        analytics.active_users = User.objects.filter(
            last_login__gte=thirty_days_ago
        ).count()

        # New users today
        analytics.new_users = User.objects.filter(
            date_joined__date=today
        ).count()

        # Content metrics
        from courses.models import Course, Lesson, Enrollment
        analytics.total_courses = Course.objects.count()
        analytics.total_lessons = Lesson.objects.count()
        analytics.total_enrollments = Enrollment.objects.count()

        # Engagement metrics
        sessions_today = UserSession.objects.filter(
            start_time__date=today
        )
        analytics.total_sessions = sessions_today.count()
        analytics.total_session_time = sessions_today.aggregate(
            total_time=models.Sum('duration')
        )['total_time'] or 0

        events_today = AnalyticsEvent.objects.filter(
            timestamp__date=today
        )
        analytics.total_page_views = events_today.filter(
            event_type='page_view'
        ).count()
        analytics.total_ai_interactions = events_today.filter(
            event_type='ai_chat'
        ).count()

        # Learning metrics
        from ai_assistant.models import AIQuizAttempt
        analytics.courses_completed = Enrollment.objects.filter(
            status='completed',
            completed_at__date=today
        ).count()
        analytics.lessons_completed = events_today.filter(
            event_type='lesson_view'
        ).count()
        analytics.quizzes_attempted = AIQuizAttempt.objects.filter(
            created_at__date=today
        ).count()

        # Calculate average completion rate
        total_enrollments = analytics.total_enrollments
        if total_enrollments > 0:
            completed = Enrollment.objects.filter(status='completed').count()
            analytics.average_completion_rate = (completed / total_enrollments) * 100

        analytics.save()
        return analytics


class Report(models.Model):
    """Model for generated analytics reports."""

    REPORT_TYPES = [
        ('user_activity', 'User Activity Report'),
        ('course_performance', 'Course Performance Report'),
        ('platform_overview', 'Platform Overview Report'),
        ('engagement_analysis', 'Engagement Analysis Report'),
        ('learning_outcomes', 'Learning Outcomes Report'),
    ]

    title = models.CharField(max_length=200)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    # Report parameters
    date_range_start = models.DateField()
    date_range_end = models.DateField()
    filters = models.JSONField(default=dict, blank=True)  # Additional filters

    # Report data
    data = models.JSONField(default=dict, blank=True)
    summary = models.TextField(blank=True, null=True)

    # Report status
    is_generated = models.BooleanField(default=False)
    generated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.report_type}"

    def generate_report(self):
        """Generate the analytics report based on type and parameters."""
        from django.db.models import Count, Avg, Sum
        from django.db.models.functions import TruncDate

        if self.report_type == 'user_activity':
            self._generate_user_activity_report()
        elif self.report_type == 'course_performance':
            self._generate_course_performance_report()
        elif self.report_type == 'platform_overview':
            self._generate_platform_overview_report()
        elif self.report_type == 'engagement_analysis':
            self._generate_engagement_analysis_report()
        elif self.report_type == 'learning_outcomes':
            self._generate_learning_outcomes_report()

        self.is_generated = True
        self.generated_at = timezone.now()
        self.save()

    def _generate_user_activity_report(self):
        """Generate user activity report."""
        events = AnalyticsEvent.objects.filter(
            timestamp__date__range=[self.date_range_start, self.date_range_end]
        )

        # Group by user and event type
        user_activity = events.values('user__username', 'event_type').annotate(
            count=Count('id')
        ).order_by('user__username', 'event_type')

        # Daily activity
        daily_activity = events.annotate(
            date=TruncDate('timestamp')
        ).values('date').annotate(
            total_events=Count('id'),
            unique_users=Count('user', distinct=True)
        ).order_by('date')

        self.data = {
            'user_activity': list(user_activity),
            'daily_activity': list(daily_activity),
            'total_events': events.count(),
            'unique_users': events.values('user').distinct().count()
        }
        self.summary = f"User activity report for {self.date_range_start} to {self.date_range_end}"

    def _generate_course_performance_report(self):
        """Generate course performance report."""
        from courses.models import Course, Enrollment

        courses = Course.objects.all()
        course_performance = []

        for course in courses:
            enrollments = Enrollment.objects.filter(course=course)
            completed = enrollments.filter(status='completed').count()
            total = enrollments.count()
            completion_rate = (completed / total * 100) if total > 0 else 0

            course_performance.append({
                'course_id': course.id,
                'course_title': course.title,
                'total_enrollments': total,
                'completed_enrollments': completed,
                'completion_rate': round(completion_rate, 2),
                'average_rating': course.analytics.average_rating if hasattr(course, 'analytics') else 0
            })

        self.data = {
            'course_performance': course_performance,
            'total_courses': courses.count(),
            'average_completion_rate': sum(c['completion_rate'] for c in course_performance) / len(course_performance) if course_performance else 0
        }
        self.summary = f"Course performance report for {self.date_range_start} to {self.date_range_end}"

    def _generate_platform_overview_report(self):
        """Generate platform overview report."""
        # Use existing platform analytics or calculate
        platform_stats = PlatformAnalytics.objects.filter(
            date__range=[self.date_range_start, self.date_range_end]
        ).aggregate(
            total_users=Sum('total_users'),
            total_sessions=Sum('total_sessions'),
            total_page_views=Sum('total_page_views'),
            total_ai_interactions=Sum('total_ai_interactions'),
            avg_completion_rate=Avg('average_completion_rate')
        )

        self.data = dict(platform_stats)
        self.summary = f"Platform overview report for {self.date_range_start} to {self.date_range_end}"

    def _generate_engagement_analysis_report(self):
        """Generate engagement analysis report."""
        sessions = UserSession.objects.filter(
            start_time__date__range=[self.date_range_start, self.date_range_end]
        )

        engagement_data = sessions.aggregate(
            total_sessions=Count('id'),
            avg_duration=Avg('duration'),
            total_page_views=Sum('page_views'),
            total_ai_interactions=Sum('ai_interactions')
        )

        # User engagement levels
        user_engagement = sessions.values('user__username').annotate(
            session_count=Count('id'),
            total_duration=Sum('duration'),
            avg_duration=Avg('duration')
        ).order_by('-total_duration')

        self.data = {
            'engagement_summary': engagement_data,
            'user_engagement': list(user_engagement),
            'high_engagement_users': len([u for u in user_engagement if u['session_count'] > 5]),
            'low_engagement_users': len([u for u in user_engagement if u['session_count'] <= 2])
        }
        self.summary = f"Engagement analysis report for {self.date_range_start} to {self.date_range_end}"

    def _generate_learning_outcomes_report(self):
        """Generate learning outcomes report."""
        from ai_assistant.models import AIQuizAttempt

        quiz_attempts = AIQuizAttempt.objects.filter(
            created_at__date__range=[self.date_range_start, self.date_range_end]
        )

        learning_data = quiz_attempts.aggregate(
            total_attempts=Count('id'),
            avg_score=Avg('score'),
            pass_rate=Count('id', filter=models.Q(score__gte=70)) * 100.0 / Count('id')
        )

        # Performance by course
        course_performance = quiz_attempts.values('quiz__course__title').annotate(
            attempts=Count('id'),
            avg_score=Avg('score'),
            pass_rate=Count('id', filter=models.Q(score__gte=70)) * 100.0 / Count('id')
        ).order_by('-avg_score')

        self.data = {
            'learning_summary': learning_data,
            'course_performance': list(course_performance),
            'total_quiz_attempts': quiz_attempts.count()
        }
        self.summary = f"Learning outcomes report for {self.date_range_start} to {self.date_range_end}"
