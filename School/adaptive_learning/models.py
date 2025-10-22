from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import json

User = get_user_model()

class LearningProfile(models.Model):
    """Student's learning profile and preferences"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='learning_profile')
    learning_style = models.CharField(max_length=50, choices=[
        ('visual', 'Visual'),
        ('auditory', 'Auditory'),
        ('kinesthetic', 'Kinesthetic'),
        ('reading', 'Reading/Writing')
    ], default='visual')

    preferred_study_time = models.TimeField(null=True, blank=True)
    study_duration_preference = models.IntegerField(default=60)  # minutes
    difficulty_preference = models.CharField(max_length=20, choices=[
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
        ('adaptive', 'Adaptive')
    ], default='adaptive')

    strengths = models.JSONField(default=list)  # List of subject strengths
    weaknesses = models.JSONField(default=list)  # List of subject weaknesses
    learning_pace = models.FloatField(default=1.0, validators=[MinValueValidator(0.5), MaxValueValidator(2.0)])

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Learning Profile"

class PerformanceMetrics(models.Model):
    """Tracks student performance across different subjects and topics"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='performance_metrics')
    subject = models.CharField(max_length=100)
    topic = models.CharField(max_length=200)

    total_questions = models.IntegerField(default=0)
    correct_answers = models.IntegerField(default=0)
    average_time = models.FloatField(default=0)  # seconds per question
    difficulty_level = models.FloatField(default=1.0)  # 0.1 to 5.0

    mastery_level = models.FloatField(default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    last_practiced = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'subject', 'topic']

    @property
    def accuracy_rate(self):
        return self.correct_answers / self.total_questions if self.total_questions > 0 else 0

    def update_performance(self, correct, time_taken):
        """Update performance metrics after a question"""
        self.total_questions += 1
        if correct:
            self.correct_answers += 1

        # Update average time using exponential moving average
        alpha = 0.1
        self.average_time = alpha * time_taken + (1 - alpha) * self.average_time

        # Update mastery level based on recent performance
        recent_accuracy = self.accuracy_rate
        if recent_accuracy > 0.8:
            self.mastery_level = min(1.0, self.mastery_level + 0.1)
        elif recent_accuracy < 0.6:
            self.mastery_level = max(0.0, self.mastery_level - 0.05)

        self.save()

class AdaptivePath(models.Model):
    """Personalized learning path for each student"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='adaptive_path')
    current_subject = models.CharField(max_length=100, null=True, blank=True)
    current_topic = models.CharField(max_length=200, null=True, blank=True)

    path_data = models.JSONField(default=dict)  # Complete learning path structure
    progress_percentage = models.FloatField(default=0.0)
    estimated_completion_date = models.DateField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_next_recommendation(self):
        """Get the next recommended topic based on current performance"""
        # This will be implemented in the service layer
        pass

class StudySession(models.Model):
    """Tracks individual study sessions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_sessions')
    subject = models.CharField(max_length=100)
    topic = models.CharField(max_length=200)

    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(null=True, blank=True)

    questions_attempted = models.IntegerField(default=0)
    questions_correct = models.IntegerField(default=0)
    focus_score = models.FloatField(default=0.0)  # Based on interaction patterns

    session_type = models.CharField(max_length=50, choices=[
        ('practice', 'Practice'),
        ('review', 'Review'),
        ('assessment', 'Assessment'),
        ('exploration', 'Exploration')
    ], default='practice')

    notes = models.TextField(blank=True)

    @property
    def accuracy_rate(self):
        return self.questions_correct / self.questions_attempted if self.questions_attempted > 0 else 0

class LearningGoal(models.Model):
    """Student's learning goals and targets"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='learning_goals')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    subject = models.CharField(max_length=100)
    target_date = models.DateField()
    target_mastery_level = models.FloatField(default=0.8, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])

    current_progress = models.FloatField(default=0.0)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def check_completion(self):
        """Check if goal is completed based on current performance"""
        # Implementation in service layer
        pass
