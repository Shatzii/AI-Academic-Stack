from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import json

User = get_user_model()

class Achievement(models.Model):
    """Achievement definitions"""
    ACHIEVEMENT_TYPES = [
        ('streak', 'Learning Streak'),
        ('accuracy', 'Accuracy Master'),
        ('speed', 'Speed Demon'),
        ('completion', 'Course Completer'),
        ('social', 'Social Butterfly'),
        ('consistency', 'Consistent Learner'),
        ('milestone', 'Milestone Reacher'),
        ('special', 'Special Achievement')
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='🏆')
    achievement_type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPES)
    points_required = models.IntegerField(default=0)
    criteria = models.JSONField(default=dict)  # Dynamic criteria for unlocking
    rarity = models.CharField(max_length=20, choices=[
        ('common', 'Common'),
        ('uncommon', 'Uncommon'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary')
    ], default='common')

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.icon} {self.name}"

class UserAchievement(models.Model):
    """User's earned achievements"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    progress = models.FloatField(default=0.0)  # Progress towards achievement (0-1)

    class Meta:
        unique_together = ['user', 'achievement']

    @property
    def is_completed(self):
        return self.progress >= 1.0

class Badge(models.Model):
    """Badge system for visual recognition"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='🎖️')
    color = models.CharField(max_length=7, default='#3498db')  # Hex color
    category = models.CharField(max_length=50, default='general')

    requirements = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.icon} {self.name}"

class UserBadge(models.Model):
    """User's earned badges"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'badge']

class Leaderboard(models.Model):
    """Dynamic leaderboards"""
    LEADERBOARD_TYPES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('all_time', 'All Time'),
        ('subject', 'Subject Specific'),
        ('course', 'Course Specific')
    ]

    name = models.CharField(max_length=100)
    leaderboard_type = models.CharField(max_length=20, choices=LEADERBOARD_TYPES)
    subject = models.CharField(max_length=100, null=True, blank=True)
    course = models.CharField(max_length=100, null=True, blank=True)

    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    max_entries = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_leaderboard_type_display()})"

class LeaderboardEntry(models.Model):
    """Leaderboard entries"""
    leaderboard = models.ForeignKey(Leaderboard, on_delete=models.CASCADE, related_name='entries')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    rank = models.IntegerField(null=True, blank=True)
    metadata = models.JSONField(default=dict)  # Additional data like accuracy, time, etc.

    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['leaderboard', 'user']
        ordering = ['rank', '-score']

class GamificationProfile(models.Model):
    """User's gamification profile"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='gamification_profile')

    total_points = models.IntegerField(default=0)
    current_level = models.IntegerField(default=1)
    experience_points = models.IntegerField(default=0)

    # Streaks
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)

    # Statistics
    total_study_time = models.IntegerField(default=0)  # minutes
    total_questions_answered = models.IntegerField(default=0)
    total_correct_answers = models.IntegerField(default=0)
    average_accuracy = models.FloatField(default=0.0)

    # Preferences
    notifications_enabled = models.BooleanField(default=True)
    leaderboard_visible = models.BooleanField(default=True)
    achievements_visible = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def accuracy_rate(self):
        return self.total_correct_answers / self.total_questions_answered if self.total_questions_answered > 0 else 0

    def add_points(self, points):
        """Add points and check for level up"""
        self.total_points += points
        self.experience_points += points

        # Level up logic (every 1000 XP = 1 level)
        new_level = (self.experience_points // 1000) + 1
        if new_level > self.current_level:
            self.current_level = new_level
            # Could trigger level up notifications here

        self.save()

    def update_streak(self, activity_date):
        """Update learning streak"""
        from datetime import date, timedelta

        if self.last_activity_date:
            days_diff = (activity_date - self.last_activity_date).days

            if days_diff == 1:
                # Consecutive day
                self.current_streak += 1
            elif days_diff > 1:
                # Streak broken
                self.longest_streak = max(self.longest_streak, self.current_streak)
                self.current_streak = 1
        else:
            # First activity
            self.current_streak = 1

        self.last_activity_date = activity_date
        self.save()

class Reward(models.Model):
    """Rewards that can be earned"""
    REWARD_TYPES = [
        ('points', 'Points'),
        ('badge', 'Badge'),
        ('certificate', 'Certificate'),
        ('feature', 'Feature Unlock'),
        ('discount', 'Discount'),
        ('custom', 'Custom Reward')
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    reward_type = models.CharField(max_length=20, choices=REWARD_TYPES)
    value = models.IntegerField(default=0)  # Points value or discount percentage
    metadata = models.JSONField(default=dict)  # Additional reward data

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_reward_type_display()})"

class UserReward(models.Model):
    """User's earned rewards"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rewards')
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    redeemed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'reward']

    @property
    def is_redeemed(self):
        return self.redeemed_at is not None
