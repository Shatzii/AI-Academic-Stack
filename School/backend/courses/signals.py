# Courses app signals
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Course, Enrollment, CourseReview

User = get_user_model()

@receiver(post_save, sender=Course)
def update_course_on_save(sender, instance, created, **kwargs):
    """Handle course save operations"""
    if created:
        # You can add course creation logic here
        pass

@receiver(post_save, sender=Enrollment)
def update_enrollment_on_save(sender, instance, created, **kwargs):
    """Handle enrollment save operations"""
    if created:
        # Update course enrollment count
        course = instance.course
        course.enrollment_count = course.enrollments.filter(is_active=True).count()
        course.save(update_fields=['enrollment_count'])

@receiver(post_delete, sender=Enrollment)
def update_enrollment_on_delete(sender, instance, **kwargs):
    """Handle enrollment deletion"""
    # Update course enrollment count
    course = instance.course
    course.enrollment_count = course.enrollments.filter(is_active=True).count()
    course.save(update_fields=['enrollment_count'])

@receiver(post_save, sender=CourseReview)
def update_course_rating_on_review(sender, instance, created, **kwargs):
    """Update course rating when a review is added/modified"""
    course = instance.course
    reviews = course.reviews.all()
    if reviews:
        avg_rating = sum(review.rating for review in reviews) / len(reviews)
        course.average_rating = round(avg_rating, 1)
        course.review_count = len(reviews)
        course.save(update_fields=['average_rating', 'review_count'])
