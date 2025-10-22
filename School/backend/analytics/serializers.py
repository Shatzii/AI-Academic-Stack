from rest_framework import serializers
from .models import (
    AnalyticsEvent, UserSession, CourseAnalytics, UserAnalytics,
    PlatformAnalytics, Report
)


class AnalyticsEventSerializer(serializers.ModelSerializer):
    """Serializer for analytics events."""

    user_username = serializers.CharField(source='user.username', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    classroom_title = serializers.CharField(source='classroom.title', read_only=True)
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)

    class Meta:
        model = AnalyticsEvent
        fields = [
            'id', 'user', 'user_username', 'event_type', 'timestamp',
            'session_id', 'ip_address', 'user_agent', 'course', 'course_title',
            'lesson', 'lesson_title', 'classroom', 'classroom_title',
            'quiz', 'quiz_title', 'conversation', 'metadata', 'duration'
        ]
        read_only_fields = ['id', 'timestamp']


class UserSessionSerializer(serializers.ModelSerializer):
    """Serializer for user sessions."""

    user_username = serializers.CharField(source='user.username', read_only=True)
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = UserSession
        ref_name = 'AnalyticsUserSession'
        fields = [
            'id', 'user', 'user_username', 'session_id', 'start_time', 'end_time',
            'duration', 'ip_address', 'user_agent', 'device_type', 'browser', 'os',
            'page_views', 'courses_viewed', 'lessons_viewed', 'quizzes_attempted',
            'ai_interactions', 'is_active'
        ]
        read_only_fields = ['id', 'start_time', 'end_time', 'duration']


class CourseAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for course analytics."""

    course_title = serializers.CharField(source='course.title', read_only=True)
    course_instructor = serializers.CharField(source='course.instructor.username', read_only=True)

    class Meta:
        model = CourseAnalytics
        fields = [
            'id', 'course', 'course_title', 'course_instructor', 'total_views',
            'unique_viewers', 'total_enrollments', 'active_enrollments',
            'completion_rate', 'average_rating', 'total_reviews',
            'average_session_duration', 'total_study_time', 'average_progress',
            'lessons_completed', 'quizzes_attempted', 'average_quiz_score',
            'last_updated', 'created_at'
        ]
        read_only_fields = ['id', 'last_updated', 'created_at']


class UserAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for user analytics."""

    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_role = serializers.CharField(source='user.role', read_only=True)

    class Meta:
        model = UserAnalytics
        fields = [
            'id', 'user', 'user_username', 'user_email', 'user_role',
            'total_sessions', 'total_session_time', 'average_session_duration',
            'courses_enrolled', 'courses_completed', 'lessons_completed',
            'quizzes_attempted', 'average_quiz_score', 'total_page_views',
            'total_ai_interactions', 'total_study_time', 'last_login',
            'last_activity', 'streak_days', 'preferred_subjects',
            'preferred_difficulty', 'learning_style', 'last_updated', 'created_at'
        ]
        read_only_fields = ['id', 'last_updated', 'created_at']


class PlatformAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for platform analytics."""

    class Meta:
        model = PlatformAnalytics
        fields = [
            'id', 'date', 'total_users', 'active_users', 'new_users',
            'total_courses', 'total_lessons', 'total_enrollments',
            'total_sessions', 'total_session_time', 'total_page_views',
            'total_ai_interactions', 'courses_completed', 'lessons_completed',
            'quizzes_attempted', 'average_completion_rate', 'api_requests',
            'error_rate'
        ]
        read_only_fields = ['id']


class ReportSerializer(serializers.ModelSerializer):
    """Serializer for analytics reports."""

    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'title', 'report_type', 'description', 'created_by',
            'created_by_username', 'created_at', 'date_range_start',
            'date_range_end', 'filters', 'data', 'summary', 'is_generated',
            'generated_at'
        ]
        read_only_fields = ['id', 'created_at', 'is_generated', 'generated_at']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class AnalyticsSummarySerializer(serializers.Serializer):
    """Serializer for analytics summary data."""

    total_users = serializers.IntegerField()
    active_users = serializers.IntegerField()
    total_courses = serializers.IntegerField()
    total_enrollments = serializers.IntegerField()
    total_sessions = serializers.IntegerField()
    total_page_views = serializers.IntegerField()
    total_ai_interactions = serializers.IntegerField()
    average_completion_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    top_courses = serializers.ListField(child=serializers.DictField())
    recent_activity = serializers.ListField(child=serializers.DictField())


class UserActivitySerializer(serializers.Serializer):
    """Serializer for user activity data."""

    user_id = serializers.IntegerField()
    username = serializers.CharField()
    total_sessions = serializers.IntegerField()
    total_time = serializers.IntegerField()
    courses_enrolled = serializers.IntegerField()
    courses_completed = serializers.IntegerField()
    average_quiz_score = serializers.DecimalField(max_digits=5, decimal_places=2)
    last_activity = serializers.DateTimeField()


class CoursePerformanceSerializer(serializers.Serializer):
    """Serializer for course performance data."""

    course_id = serializers.IntegerField()
    title = serializers.CharField()
    instructor = serializers.CharField()
    total_enrollments = serializers.IntegerField()
    active_enrollments = serializers.IntegerField()
    completion_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    total_reviews = serializers.IntegerField()
    average_session_duration = serializers.IntegerField()


class EngagementMetricsSerializer(serializers.Serializer):
    """Serializer for engagement metrics."""

    total_sessions = serializers.IntegerField()
    average_session_duration = serializers.IntegerField()
    total_page_views = serializers.IntegerField()
    total_ai_interactions = serializers.IntegerField()
    bounce_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    return_visitor_rate = serializers.DecimalField(max_digits=5, decimal_places=2)


class LearningAnalyticsSerializer(serializers.Serializer):
    """Serializer for learning analytics."""

    total_quiz_attempts = serializers.IntegerField()
    average_quiz_score = serializers.DecimalField(max_digits=5, decimal_places=2)
    pass_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    courses_completed = serializers.IntegerField()
    lessons_completed = serializers.IntegerField()
    average_study_time = serializers.IntegerField()
    learning_streak = serializers.IntegerField()


class EventTrackingSerializer(serializers.Serializer):
    """Serializer for event tracking."""

    event_type = serializers.CharField()
    user_id = serializers.IntegerField()
    timestamp = serializers.DateTimeField()
    session_id = serializers.CharField(required=False)
    metadata = serializers.DictField(required=False)
    course_id = serializers.IntegerField(required=False)
    lesson_id = serializers.IntegerField(required=False)
    classroom_id = serializers.IntegerField(required=False)
    quiz_id = serializers.IntegerField(required=False)
    conversation_id = serializers.IntegerField(required=False)
