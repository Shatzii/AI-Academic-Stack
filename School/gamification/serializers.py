from rest_framework import serializers
from .models import (
    Achievement, UserAchievement, Badge, UserBadge,
    Leaderboard, LeaderboardEntry, GamificationProfile,
    Reward, UserReward
)


class AchievementSerializer(serializers.ModelSerializer):
    """Serializer for achievements"""
    class Meta:
        model = Achievement
        fields = [
            'id', 'name', 'description', 'icon', 'achievement_type',
            'points_required', 'criteria', 'rarity', 'is_active'
        ]


class UserAchievementSerializer(serializers.ModelSerializer):
    """Serializer for user achievements"""
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = UserAchievement
        fields = [
            'id', 'achievement', 'earned_at', 'progress', 'is_completed'
        ]
        read_only_fields = ['id', 'earned_at']


class BadgeSerializer(serializers.ModelSerializer):
    """Serializer for badges"""
    class Meta:
        model = Badge
        fields = [
            'id', 'name', 'description', 'icon', 'color',
            'category', 'requirements', 'is_active'
        ]


class UserBadgeSerializer(serializers.ModelSerializer):
    """Serializer for user badges"""
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'earned_at']
        read_only_fields = ['id', 'earned_at']


class LeaderboardSerializer(serializers.ModelSerializer):
    """Serializer for leaderboards"""
    class Meta:
        model = Leaderboard
        fields = [
            'id', 'name', 'leaderboard_type', 'subject', 'course',
            'start_date', 'end_date', 'is_active', 'max_entries'
        ]


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    """Serializer for leaderboard entries"""
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = LeaderboardEntry
        fields = [
            'id', 'user_username', 'score', 'rank', 'metadata', 'last_updated'
        ]
        read_only_fields = ['id', 'last_updated']


class GamificationProfileSerializer(serializers.ModelSerializer):
    """Serializer for gamification profiles"""
    accuracy_rate = serializers.SerializerMethodField()

    class Meta:
        model = GamificationProfile
        fields = [
            'id', 'total_points', 'current_level', 'experience_points',
            'current_streak', 'longest_streak', 'last_activity_date',
            'total_study_time', 'total_questions_answered', 'total_correct_answers',
            'average_accuracy', 'notifications_enabled', 'leaderboard_visible',
            'achievements_visible', 'accuracy_rate'
        ]
        read_only_fields = ['id']

    def get_accuracy_rate(self, obj):
        return obj.accuracy_rate


class RewardSerializer(serializers.ModelSerializer):
    """Serializer for rewards"""
    class Meta:
        model = Reward
        fields = [
            'id', 'name', 'description', 'reward_type', 'value',
            'metadata', 'is_active'
        ]


class UserRewardSerializer(serializers.ModelSerializer):
    """Serializer for user rewards"""
    reward = RewardSerializer(read_only=True)

    class Meta:
        model = UserReward
        fields = [
            'id', 'reward', 'earned_at', 'redeemed_at', 'is_redeemed'
        ]
        read_only_fields = ['id', 'earned_at']
