from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    # Analytics Events
    path('events/', views.AnalyticsEventListView.as_view(), name='event-list'),
    path('events/track/', views.track_event, name='track-event'),

    # User Sessions
    path('sessions/', views.UserSessionListView.as_view(), name='session-list'),

    # Course Analytics
    path('courses/', views.CourseAnalyticsListView.as_view(), name='course-analytics-list'),

    # User Analytics
    path('users/', views.UserAnalyticsListView.as_view(), name='user-analytics-list'),
    path('users/<int:user_id>/activity/', views.user_activity_analytics, name='user-activity'),

    # Platform Analytics
    path('platform/', views.PlatformAnalyticsListView.as_view(), name='platform-analytics-list'),
    path('platform/update-daily/', views.update_daily_analytics, name='update-daily-analytics'),

    # Reports
    path('reports/', views.ReportListView.as_view(), name='report-list'),
    path('reports/<int:pk>/', views.ReportDetailView.as_view(), name='report-detail'),

    # Summary Analytics
    path('summary/', views.analytics_summary, name='analytics-summary'),
    path('engagement/', views.engagement_metrics, name='engagement-metrics'),
    path('learning/', views.learning_analytics, name='learning-analytics'),
    path('courses/performance/', views.course_performance_analytics, name='course-performance'),
]
