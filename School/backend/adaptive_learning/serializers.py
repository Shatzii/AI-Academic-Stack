from rest_framework import serializers
from .models import LearningProfile, PerformanceMetrics, AdaptivePath, StudySession, LearningGoal


class LearningProfileSerializer(serializers.ModelSerializer):
    """Serializer for learning profiles"""
    class Meta:
        model = LearningProfile
        fields = [
            'id', 'learning_style', 'preferred_study_time', 'study_duration_preference',
            'difficulty_preference', 'strengths', 'weaknesses', 'learning_pace',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PerformanceMetricsSerializer(serializers.ModelSerializer):
    """Serializer for performance metrics"""
    accuracy_rate = serializers.SerializerMethodField()

    class Meta:
        model = PerformanceMetrics
        fields = [
            'id', 'subject', 'topic', 'total_questions', 'correct_answers',
            'average_time', 'difficulty_level', 'mastery_level', 'last_practiced',
            'accuracy_rate'
        ]
        read_only_fields = ['id', 'last_practiced', 'accuracy_rate']

    def get_accuracy_rate(self, obj):
        return obj.accuracy_rate


class AdaptivePathSerializer(serializers.ModelSerializer):
    """Serializer for adaptive learning paths"""
    class Meta:
        model = AdaptivePath
        fields = [
            'id', 'current_subject', 'current_topic', 'path_data',
            'progress_percentage', 'estimated_completion_date', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudySessionSerializer(serializers.ModelSerializer):
    """Serializer for study sessions"""
    accuracy_rate = serializers.SerializerMethodField()

    class Meta:
        model = StudySession
        fields = [
            'id', 'subject', 'topic', 'start_time', 'end_time', 'duration_minutes',
            'questions_attempted', 'questions_correct', 'focus_score', 'session_type',
            'notes', 'accuracy_rate'
        ]
        read_only_fields = ['id', 'accuracy_rate']

    def get_accuracy_rate(self, obj):
        return obj.accuracy_rate


class LearningGoalSerializer(serializers.ModelSerializer):
    """Serializer for learning goals"""
    class Meta:
        model = LearningGoal
        fields = [
            'id', 'title', 'description', 'subject', 'target_date',
            'target_mastery_level', 'current_progress', 'is_completed',
            'completed_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'completed_at', 'created_at', 'updated_at']
