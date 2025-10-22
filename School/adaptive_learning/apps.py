from django.apps import AppConfig


class AdaptiveLearningConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'adaptive_learning'

    def ready(self):
        # Import signals
        from . import signals
