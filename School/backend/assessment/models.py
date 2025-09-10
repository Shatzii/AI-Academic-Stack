from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Assessment(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_proctored = models.BooleanField(default=False)

class Question(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    text = models.TextField()
    question_type = models.CharField(max_length=32)  # mcq, essay, code
    choices = models.JSONField(blank=True, null=True)
    answer = models.TextField(blank=True)

class Submission(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    submitted_at = models.DateTimeField(auto_now_add=True)
    answers = models.JSONField()
    score = models.FloatField(null=True, blank=True)
    proctoring_data = models.JSONField(blank=True, null=True)
