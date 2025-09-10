from rest_framework import serializers
from .models import WhiteboardSession, WhiteboardAction

class WhiteboardSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhiteboardSession
        fields = '__all__'

class WhiteboardActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhiteboardAction
        fields = '__all__'
