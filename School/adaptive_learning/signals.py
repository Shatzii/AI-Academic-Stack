from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import LearningProfile, AdaptivePath

User = get_user_model()

@receiver(post_save, sender=User)
def create_learning_profile(sender, instance, created, **kwargs):
    """Create learning profile and adaptive path for new users"""
    if created:
        LearningProfile.objects.create(user=instance)
        AdaptivePath.objects.create(user=instance)
