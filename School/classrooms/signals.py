# Classrooms app signals
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Classroom, ClassroomParticipant

User = get_user_model()

@receiver(post_save, sender=Classroom)
def update_classroom_on_save(sender, instance, created, **kwargs):
    """Handle classroom save operations"""
    if created:
        # You can add classroom creation logic here
        pass

@receiver(post_save, sender=ClassroomParticipant)
def update_classroom_participants_on_save(sender, instance, created, **kwargs):
    """Handle classroom participant save operations"""
    if created:
        # Update classroom participant count
        classroom = instance.classroom
        classroom.participant_count = classroom.participants.filter(is_active=True).count()
        classroom.save(update_fields=['participant_count'])

@receiver(post_delete, sender=ClassroomParticipant)
def update_classroom_participants_on_delete(sender, instance, **kwargs):
    """Handle classroom participant deletion"""
    # Update classroom participant count
    classroom = instance.classroom
    classroom.participant_count = classroom.participants.filter(is_active=True).count()
    classroom.save(update_fields=['participant_count'])
