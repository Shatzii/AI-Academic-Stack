from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class APIService(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    endpoint_url = models.URLField()
    documentation_url = models.URLField(blank=True, null=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class APIIntegration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    service = models.ForeignKey(APIService, on_delete=models.CASCADE)
    api_key = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
