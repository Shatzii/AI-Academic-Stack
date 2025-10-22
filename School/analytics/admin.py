from django.contrib import admin
from .models import (
    AnalyticsEvent, UserSession, CourseAnalytics, UserAnalytics,
    PlatformAnalytics, Report
)


@admin.register(AnalyticsEvent)
class AnalyticsEventAdmin(admin.ModelAdmin):
    """Admin for analytics events."""

    list_display = [
        'id', 'user', 'event_type', 'timestamp', 'course', 'lesson',
        'classroom', 'quiz', 'conversation', 'duration'
    ]
    list_filter = [
        'event_type', 'timestamp', 'course', 'lesson', 'classroom',
        'quiz', 'conversation'
    ]
    search_fields = ['user__username', 'user__email', 'metadata']
    readonly_fields = ['id', 'timestamp']
    ordering = ['-timestamp']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'user', 'course', 'lesson', 'classroom', 'quiz', 'conversation'
        )


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """Admin for user sessions."""

    list_display = [
        'id', 'user', 'session_id', 'start_time', 'end_time',
        'duration', 'page_views', 'courses_viewed', 'ai_interactions'
    ]
    list_filter = ['start_time', 'end_time', 'device_type', 'browser', 'os']
    search_fields = ['user__username', 'user__email', 'session_id']
    readonly_fields = ['id', 'start_time', 'end_time', 'duration']
    ordering = ['-start_time']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(CourseAnalytics)
class CourseAnalyticsAdmin(admin.ModelAdmin):
    """Admin for course analytics."""

    list_display = [
        'id', 'course', 'total_views', 'total_enrollments',
        'completion_rate', 'average_rating', 'last_updated'
    ]
    list_filter = ['completion_rate', 'average_rating', 'last_updated']
    search_fields = ['course__title', 'course__instructor__username']
    readonly_fields = ['id', 'last_updated', 'created_at']
    ordering = ['-total_views']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'course', 'course__instructor'
        )


@admin.register(UserAnalytics)
class UserAnalyticsAdmin(admin.ModelAdmin):
    """Admin for user analytics."""

    list_display = [
        'id', 'user', 'total_sessions', 'total_session_time',
        'courses_enrolled', 'courses_completed', 'last_activity'
    ]
    list_filter = ['preferred_difficulty', 'learning_style', 'last_activity']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['id', 'last_updated', 'created_at']
    ordering = ['-total_session_time']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(PlatformAnalytics)
class PlatformAnalyticsAdmin(admin.ModelAdmin):
    """Admin for platform analytics."""

    list_display = [
        'id', 'date', 'total_users', 'active_users', 'total_sessions',
        'total_page_views', 'average_completion_rate'
    ]
    list_filter = ['date']
    search_fields = ['date']
    readonly_fields = ['id']
    ordering = ['-date']


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    """Admin for analytics reports."""

    list_display = [
        'id', 'title', 'report_type', 'created_by', 'created_at',
        'is_generated', 'generated_at'
    ]
    list_filter = ['report_type', 'is_generated', 'created_at']
    search_fields = ['title', 'description', 'created_by__username']
    readonly_fields = ['id', 'created_at', 'generated_at', 'data', 'summary']
    ordering = ['-created_at']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('created_by')
