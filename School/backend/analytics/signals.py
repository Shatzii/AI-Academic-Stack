from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import (
    AnalyticsEvent, UserSession, CourseAnalytics, UserAnalytics,
    PlatformAnalytics
)
from courses.models import Enrollment, CourseReview
from ai_assistant.models import AIQuizAttempt, AIConversation, AIMessage

User = get_user_model()


@receiver(post_save, sender=User)
def create_user_analytics(sender, instance, created, **kwargs):
    """Create user analytics when a user is created."""
    if created:
        UserAnalytics.objects.create(user=instance)


@receiver(post_save, sender=Enrollment)
def update_course_analytics_on_enrollment(sender, instance, created, **kwargs):
    """Update course analytics when enrollment changes."""
    course_analytics, _ = CourseAnalytics.objects.get_or_create(course=instance.course)
    course_analytics.update_metrics()


@receiver(post_save, sender=CourseReview)
def update_course_analytics_on_review(sender, instance, created, **kwargs):
    """Update course analytics when a review is added."""
    course_analytics, _ = CourseAnalytics.objects.get_or_create(course=instance.course)
    course_analytics.update_metrics()


@receiver(post_save, sender=AIQuizAttempt)
def update_course_analytics_on_quiz_attempt(sender, instance, created, **kwargs):
    """Update course analytics when a quiz is attempted."""
    if instance.quiz.course:
        course_analytics, _ = CourseAnalytics.objects.get_or_create(course=instance.quiz.course)
        course_analytics.update_metrics()


@receiver(post_save, sender=AnalyticsEvent)
def update_user_analytics_on_event(sender, instance, created, **kwargs):
    """Update user analytics when an event is tracked."""
    if created:
        user_analytics, _ = UserAnalytics.objects.get_or_create(user=instance.user)
        user_analytics.update_metrics()


@receiver(post_save, sender=UserSession)
def update_user_analytics_on_session(sender, instance, created, **kwargs):
    """Update user analytics when a session is created or updated."""
    user_analytics, _ = UserAnalytics.objects.get_or_create(user=instance.user)
    user_analytics.update_metrics()


@receiver(post_save, sender=AIConversation)
def update_user_analytics_on_conversation(sender, instance, created, **kwargs):
    """Update user analytics when a conversation is created."""
    user_analytics, _ = UserAnalytics.objects.get_or_create(user=instance.user)
    user_analytics.update_metrics()


@receiver(post_save, sender=AIMessage)
def update_user_analytics_on_message(sender, instance, created, **kwargs):
    """Update user analytics when a message is sent."""
    user_analytics, _ = UserAnalytics.objects.get_or_create(user=instance.conversation.user)
    user_analytics.update_metrics()


@receiver(post_delete, sender=Enrollment)
def update_course_analytics_on_enrollment_delete(sender, instance, **kwargs):
    """Update course analytics when enrollment is deleted."""
    try:
        course_analytics = CourseAnalytics.objects.get(course=instance.course)
        course_analytics.update_metrics()
    except CourseAnalytics.DoesNotExist:
        pass


@receiver(post_delete, sender=CourseReview)
def update_course_analytics_on_review_delete(sender, instance, **kwargs):
    """Update course analytics when a review is deleted."""
    try:
        course_analytics = CourseAnalytics.objects.get(course=instance.course)
        course_analytics.update_metrics()
    except CourseAnalytics.DoesNotExist:
        pass


# Daily analytics update signal (can be called by a management command or cron job)
def update_daily_platform_analytics():
    """Update daily platform analytics."""
    PlatformAnalytics.update_daily_stats()
