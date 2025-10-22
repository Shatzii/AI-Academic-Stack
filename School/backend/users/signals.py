# Users app signals
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models_student_id import StudentIDCard

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a user profile when a new user is created"""
    if created:
        # Automatically create student ID card for students
        if instance.role == 'student':
            create_student_id_card(instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save user profile when user is saved"""
    # You can add profile saving logic here if needed
    pass

def create_student_id_card(user):
    """
    Automatically create a student ID card when a student user is created.
    This ensures every student has an ID card linked to their online account.
    """
    try:
        # Check if student already has an ID card (shouldn't happen, but safety check)
        if hasattr(user, 'id_card'):
            return

        # Create the student ID card
        id_card = StudentIDCard.objects.create(
            student=user,
            card_type='standard',
            status='active',
            emergency_contact_name='',
            emergency_contact_phone=user.phone_number or '',
            medical_info='',
            created_by=None,  # System-generated
            notes=f'Auto-generated ID card for {user.get_full_name()}'
        )

        print(f"✓ Student ID card created for {user.get_full_name()}: {id_card.card_number}")

    except Exception as e:
        print(f"✗ Failed to create student ID card for {user.get_full_name()}: {str(e)}")
        # Log the error but don't prevent user creation
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to create student ID card for user {user.id}: {str(e)}")
