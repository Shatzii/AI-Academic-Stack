from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class WhiteboardSession(models.Model):
    classroom = models.ForeignKey('classrooms.Classroom', on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

class WhiteboardAction(models.Model):
    session = models.ForeignKey(WhiteboardSession, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action_type = models.CharField(max_length=32)  # draw, erase, shape, text
    data = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)
