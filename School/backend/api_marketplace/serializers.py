from rest_framework import serializers
from .models import APIService, APIIntegration

class APIServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIService
        fields = '__all__'

class APIIntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIIntegration
        fields = '__all__'
