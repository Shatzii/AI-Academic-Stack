from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Count, Avg, Sum
from django.db.models.functions import TruncDate, TruncWeek, TruncMonth
from datetime import timedelta
from .models import (
    AnalyticsEvent, UserSession, CourseAnalytics, UserAnalytics,
    PlatformAnalytics, Report
)
from .serializers import (
    AnalyticsEventSerializer, UserSessionSerializer, CourseAnalyticsSerializer,
    UserAnalyticsSerializer, PlatformAnalyticsSerializer, ReportSerializer,
    AnalyticsSummarySerializer, UserActivitySerializer, CoursePerformanceSerializer,
    EngagementMetricsSerializer, LearningAnalyticsSerializer, EventTrackingSerializer
)


class AnalyticsEventListView(generics.ListCreateAPIView):
    """View for listing and creating analytics events."""

    serializer_class = AnalyticsEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = AnalyticsEvent.objects.all()

        # Filter by user (only show own events unless admin)
        user = self.request.user
        if user.is_authenticated and not user.is_staff:
            queryset = queryset.filter(user=user)

        # Apply filters
        event_type = self.request.query_params.get('event_type')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        course_id = self.request.query_params.get('course_id')
        user_id = self.request.query_params.get('user_id')

        if event_type:
            queryset = queryset.filter(event_type=event_type)
        if date_from:
            queryset = queryset.filter(timestamp__date__gte=date_from)
        if date_to:
            queryset = queryset.filter(timestamp__date__lte=date_to)
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        if user_id and user.is_authenticated and user.is_staff:
            queryset = queryset.filter(user_id=user_id)

        return queryset.order_by('-timestamp')

    def perform_create(self, serializer):
        # Set user to current user if not specified
        user = self.request.user
        if user.is_authenticated and not serializer.validated_data.get('user'):
            serializer.save(user=user)
        else:
            serializer.save()


class UserSessionListView(generics.ListCreateAPIView):
    """View for listing and creating user sessions."""

    serializer_class = UserSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = UserSession.objects.all()

        # Filter by user (only show own sessions unless admin)
        user = self.request.user
        if user.is_authenticated and not user.is_staff:
            queryset = queryset.filter(user=user)

        # Apply filters
        is_active = self.request.query_params.get('is_active')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')

        if is_active == 'true':
            queryset = queryset.filter(end_time__isnull=True)
        elif is_active == 'false':
            queryset = queryset.filter(end_time__isnull=False)

        if date_from:
            queryset = queryset.filter(start_time__date__gte=date_from)
        if date_to:
            queryset = queryset.filter(start_time__date__lte=date_to)

        return queryset.order_by('-start_time')

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_authenticated:
            serializer.save(user=user)
        else:
            serializer.save()


class CourseAnalyticsListView(generics.ListAPIView):
    """View for listing course analytics."""

    serializer_class = CourseAnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = CourseAnalytics.objects.select_related('course', 'course__instructor')

        # Filter by course instructor or enrolled courses
        user = self.request.user
        if user.is_teacher:
            queryset = queryset.filter(course__instructor=user)
        else:
            enrolled_course_ids = user.enrollments.filter(
                status__in=['active', 'completed']
            ).values_list('course_id', flat=True)
            queryset = queryset.filter(course_id__in=enrolled_course_ids)

        return queryset.order_by('-total_views')


class UserAnalyticsListView(generics.ListAPIView):
    """View for listing user analytics."""

    serializer_class = UserAnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = UserAnalytics.objects.select_related('user')

        # Only staff can see all user analytics
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)

        return queryset.order_by('-total_session_time')


class PlatformAnalyticsListView(generics.ListAPIView):
    """View for listing platform analytics."""

    serializer_class = PlatformAnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only staff can access platform analytics
        if not self.request.user.is_staff:
            return PlatformAnalytics.objects.none()

        queryset = PlatformAnalytics.objects.all()

        # Apply date filters
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')

        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)

        return queryset.order_by('-date')


class ReportListView(generics.ListCreateAPIView):
    """View for listing and creating analytics reports."""

    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Report.objects.all()

        # Filter by creator (only show own reports unless admin)
        if not self.request.user.is_staff:
            queryset = queryset.filter(created_by=self.request.user)

        # Apply filters
        report_type = self.request.query_params.get('report_type')
        is_generated = self.request.query_params.get('is_generated')

        if report_type:
            queryset = queryset.filter(report_type=report_type)
        if is_generated:
            queryset = queryset.filter(is_generated=is_generated.lower() == 'true')

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        report = serializer.save()
        # Generate the report immediately
        report.generate_report()


class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, and deleting analytics reports."""

    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Report.objects.all()

        # Filter by creator (only show own reports unless admin)
        user = self.request.user
        if user.is_authenticated and not user.is_staff:
            queryset = queryset.filter(created_by=user)

        return queryset

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Regenerate report if requested
        if request.data.get('regenerate') and not instance.is_generated:
            instance.generate_report()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)

        return super().update(request, *args, **kwargs)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def analytics_summary(request):
    """Get overall analytics summary."""

    # Date range
    days = int(request.query_params.get('days', 30))
    date_from = timezone.now().date() - timedelta(days=days)

    # Platform metrics
    total_users = UserAnalytics.objects.count()
    active_users = UserAnalytics.objects.filter(
        last_activity__gte=date_from
    ).count()

    from courses.models import Course, Enrollment
    total_courses = Course.objects.count()
    total_enrollments = Enrollment.objects.filter(
        enrolled_at__gte=date_from
    ).count()

    # Session metrics
    sessions = UserSession.objects.filter(start_time__gte=date_from)
    total_sessions = sessions.count()
    total_page_views = AnalyticsEvent.objects.filter(
        timestamp__gte=date_from,
        event_type='page_view'
    ).count()
    total_ai_interactions = AnalyticsEvent.objects.filter(
        timestamp__gte=date_from,
        event_type='ai_chat'
    ).count()

    # Completion rate
    enrollments = Enrollment.objects.all()
    total_enrollments_all = enrollments.count()
    completed_enrollments = enrollments.filter(status='completed').count()
    average_completion_rate = (
        (completed_enrollments / total_enrollments_all * 100)
        if total_enrollments_all > 0 else 0
    )

    # Top courses
    top_courses = CourseAnalytics.objects.select_related('course').order_by(
        '-total_views'
    )[:5].values(
        'course__title', 'total_views', 'total_enrollments', 'completion_rate'
    )

    # Recent activity
    recent_activity = AnalyticsEvent.objects.select_related(
        'user', 'course'
    ).order_by('-timestamp')[:10].values(
        'event_type', 'timestamp', 'user__username', 'course__title'
    )

    data = {
        'total_users': total_users,
        'active_users': active_users,
        'total_courses': total_courses,
        'total_enrollments': total_enrollments,
        'total_sessions': total_sessions,
        'total_page_views': total_page_views,
        'total_ai_interactions': total_ai_interactions,
        'average_completion_rate': round(average_completion_rate, 2),
        'top_courses': list(top_courses),
        'recent_activity': list(recent_activity)
    }

    serializer = AnalyticsSummarySerializer(data=data)
    serializer.is_valid(raise_exception=True)

    return Response(serializer.validated_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_activity_analytics(request, user_id=None):
    """Get user activity analytics."""

    if user_id and not request.user.is_staff and request.user.id != user_id:
        return Response(
            {"error": "You don't have permission to view this user's analytics"},
            status=status.HTTP_403_FORBIDDEN
        )

    target_user_id = user_id or request.user.id
    user_analytics = get_object_or_404(UserAnalytics, user_id=target_user_id)

    # Additional calculations
    sessions_last_30 = UserSession.objects.filter(
        user_id=target_user_id,
        start_time__gte=timezone.now() - timedelta(days=30)
    )

    data = {
        'user_id': target_user_id,
        'username': user_analytics.user.username,
        'total_sessions': user_analytics.total_sessions,
        'total_time': user_analytics.total_session_time,
        'courses_enrolled': user_analytics.courses_enrolled,
        'courses_completed': user_analytics.courses_completed,
        'average_quiz_score': user_analytics.average_quiz_score,
        'last_activity': user_analytics.last_activity,
        'sessions_last_30_days': sessions_last_30.count(),
        'total_time_last_30_days': sessions_last_30.aggregate(
            total=Sum('duration')
        )['total'] or 0
    }

    serializer = UserActivitySerializer(data=data)
    serializer.is_valid(raise_exception=True)

    return Response(serializer.validated_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def course_performance_analytics(request):
    """Get course performance analytics."""

    # Only teachers and staff can access detailed course performance
    if not request.user.is_staff and not request.user.is_teacher:
        return Response(
            {"error": "You don't have permission to view course performance analytics"},
            status=status.HTTP_403_FORBIDDEN
        )

    courses = CourseAnalytics.objects.select_related(
        'course', 'course__instructor'
    ).all()

    if request.user.is_teacher:
        courses = courses.filter(course__instructor=request.user)

    course_data = []
    for course_analytics in courses:
        course_data.append({
            'course_id': course_analytics.course.id,
            'title': course_analytics.course.title,
            'instructor': course_analytics.course.instructor.username,
            'total_enrollments': course_analytics.total_enrollments,
            'active_enrollments': course_analytics.active_enrollments,
            'completion_rate': course_analytics.completion_rate,
            'average_rating': course_analytics.average_rating,
            'total_reviews': course_analytics.total_reviews,
            'average_session_duration': course_analytics.average_session_duration
        })

    serializer = CoursePerformanceSerializer(data=course_data, many=True)
    serializer.is_valid(raise_exception=True)

    return Response(serializer.validated_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def engagement_metrics(request):
    """Get engagement metrics."""

    days = int(request.query_params.get('days', 30))
    date_from = timezone.now() - timedelta(days=days)

    sessions = UserSession.objects.filter(start_time__gte=date_from)
    events = AnalyticsEvent.objects.filter(timestamp__gte=date_from)

    # Calculate metrics
    total_sessions = sessions.count()
    average_session_duration = sessions.aggregate(
        avg_duration=Avg('duration')
    )['avg_duration'] or 0

    total_page_views = events.filter(event_type='page_view').count()
    total_ai_interactions = events.filter(event_type='ai_chat').count()

    # Bounce rate (sessions with only 1 page view)
    bounce_sessions = sessions.filter(page_views=1).count()
    bounce_rate = (bounce_sessions / total_sessions * 100) if total_sessions > 0 else 0

    # Return visitor rate (users with multiple sessions)
    users_with_multiple_sessions = sessions.values('user').annotate(
        session_count=Count('id')
    ).filter(session_count__gt=1).count()

    total_users = sessions.values('user').distinct().count()
    return_visitor_rate = (
        (users_with_multiple_sessions / total_users * 100)
        if total_users > 0 else 0
    )

    data = {
        'total_sessions': total_sessions,
        'average_session_duration': average_session_duration,
        'total_page_views': total_page_views,
        'total_ai_interactions': total_ai_interactions,
        'bounce_rate': round(bounce_rate, 2),
        'return_visitor_rate': round(return_visitor_rate, 2)
    }

    serializer = EngagementMetricsSerializer(data=data)
    serializer.is_valid(raise_exception=True)

    return Response(serializer.validated_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def learning_analytics(request):
    """Get learning analytics."""

    from ai_assistant.models import AIQuizAttempt

    days = int(request.query_params.get('days', 30))
    date_from = timezone.now() - timedelta(days=days)

    quiz_attempts = AIQuizAttempt.objects.filter(created_at__gte=date_from)
    enrollments = Enrollment.objects.filter(enrolled_at__gte=date_from)

    # Quiz metrics
    total_quiz_attempts = quiz_attempts.count()
    average_quiz_score = quiz_attempts.aggregate(
        avg_score=Avg('score')
    )['avg_score'] or 0

    pass_rate = (
        quiz_attempts.filter(score__gte=70).count() / total_quiz_attempts * 100
    ) if total_quiz_attempts > 0 else 0

    # Completion metrics
    courses_completed = enrollments.filter(status='completed').count()
    lessons_completed = AnalyticsEvent.objects.filter(
        timestamp__gte=date_from,
        event_type='lesson_view'
    ).count()

    # Study time
    average_study_time = UserSession.objects.filter(
        start_time__gte=date_from
    ).aggregate(avg_time=Avg('duration'))['avg_time'] or 0

    # Learning streak (consecutive days with activity)
    user = request.user
    streak_days = 0
    check_date = timezone.now().date()

    while True:
        has_activity = AnalyticsEvent.objects.filter(
            user=user,
            timestamp__date=check_date
        ).exists()

        if has_activity:
            streak_days += 1
            check_date -= timedelta(days=1)
        else:
            break

    data = {
        'total_quiz_attempts': total_quiz_attempts,
        'average_quiz_score': round(average_quiz_score, 2),
        'pass_rate': round(pass_rate, 2),
        'courses_completed': courses_completed,
        'lessons_completed': lessons_completed,
        'average_study_time': average_study_time,
        'learning_streak': streak_days
    }

    serializer = LearningAnalyticsSerializer(data=data)
    serializer.is_valid(raise_exception=True)

    return Response(serializer.validated_data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def track_event(request):
    """Track an analytics event."""

    serializer = EventTrackingSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    event_data = serializer.validated_data

    # Create the event
    event = AnalyticsEvent.objects.create(
        user_id=event_data['user_id'],
        event_type=event_data['event_type'],
        timestamp=event_data.get('timestamp', timezone.now()),
        session_id=event_data.get('session_id'),
        metadata=event_data.get('metadata', {}),
        course_id=event_data.get('course_id'),
        lesson_id=event_data.get('lesson_id'),
        classroom_id=event_data.get('classroom_id'),
        quiz_id=event_data.get('quiz_id'),
        conversation_id=event_data.get('conversation_id')
    )

    return Response(
        {'message': 'Event tracked successfully', 'event_id': event.id},
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_daily_analytics(request):
    """Update daily platform analytics."""

    if not request.user.is_staff:
        return Response(
            {"error": "Only staff can update platform analytics"},
            status=status.HTTP_403_FORBIDDEN
        )

    analytics = PlatformAnalytics.update_daily_stats()

    serializer = PlatformAnalyticsSerializer(analytics)
    return Response(serializer.data)
