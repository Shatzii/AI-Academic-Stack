from django.contrib.auth import get_user_model
from django.db.models import Q, Count, Sum
from django.utils import timezone
from .models import (
    Achievement, UserAchievement, Badge, UserBadge,
    Leaderboard, LeaderboardEntry, GamificationProfile,
    Reward, UserReward
)
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class GamificationService:
    """Core gamification service for managing achievements, points, and rewards"""

    def __init__(self, user):
        self.user = user
        self.profile = self._get_or_create_profile()

    def _get_or_create_profile(self):
        """Get or create gamification profile for user"""
        profile, created = GamificationProfile.objects.get_or_create(
            user=self.user,
            defaults={
                'notifications_enabled': True,
                'leaderboard_visible': True,
                'achievements_visible': True
            }
        )
        return profile

    def record_activity(self, activity_type, metadata=None):
        """Record user activity and award points"""
        points_awarded = self._calculate_points(activity_type, metadata or {})

        if points_awarded > 0:
            self.profile.add_points(points_awarded)
            self._check_achievements(activity_type, metadata)
            self._update_leaderboards(activity_type, metadata)

        # Update streak if it's a learning activity
        if activity_type in ['question_answered', 'lesson_completed', 'study_session']:
            self.profile.update_streak(timezone.now().date())

        return points_awarded

    def _calculate_points(self, activity_type, metadata):
        """Calculate points based on activity type and performance"""
        points_map = {
            'question_answered': 10,
            'question_correct': 15,
            'lesson_completed': 50,
            'course_completed': 200,
            'study_session': 25,
            'achievement_unlocked': 100,
            'streak_milestone': 75,
            'social_share': 20,
            'peer_help': 30
        }

        base_points = points_map.get(activity_type, 0)

        # Apply multipliers based on performance
        if activity_type == 'question_correct':
            accuracy = metadata.get('accuracy', 0.5)
            if accuracy > 0.9:
                base_points *= 2  # Bonus for high accuracy
            elif accuracy > 0.7:
                base_points *= 1.5

        if activity_type == 'study_session':
            duration = metadata.get('duration', 0)
            if duration > 60:  # Long study session
                base_points *= 1.5

        return int(base_points)

    def _check_achievements(self, activity_type, metadata):
        """Check and unlock achievements based on user progress"""
        achievements = Achievement.objects.filter(is_active=True)

        for achievement in achievements:
            if self._check_achievement_criteria(achievement, activity_type, metadata):
                self._unlock_achievement(achievement)

    def _check_achievement_criteria(self, achievement, activity_type, metadata):
        """Check if user meets achievement criteria"""
        criteria = achievement.criteria

        if achievement.achievement_type == 'streak':
            return self.profile.current_streak >= criteria.get('streak_length', 7)

        elif achievement.achievement_type == 'accuracy':
            accuracy_threshold = criteria.get('accuracy_threshold', 0.8)
            return self.profile.accuracy_rate >= accuracy_threshold

        elif achievement.achievement_type == 'speed':
            avg_time = metadata.get('average_time', float('inf'))
            return avg_time <= criteria.get('max_time', 30)

        elif achievement.achievement_type == 'completion':
            completed_items = criteria.get('completed_items', 0)
            return self._count_completed_items() >= completed_items

        elif achievement.achievement_type == 'consistency':
            days_active = criteria.get('days_active', 30)
            return self._check_consistency(days_active)

        return False

    def _unlock_achievement(self, achievement):
        """Unlock an achievement for the user"""
        user_achievement, created = UserAchievement.objects.get_or_create(
            user=self.user,
            achievement=achievement,
            defaults={'progress': 1.0}
        )

        if created:
            # Award bonus points for achievement
            self.profile.add_points(achievement.points_required)

            # Check for related badges
            self._check_badges()

            logger.info(f"Achievement unlocked: {achievement.name} for user {self.user.username}")

    def _check_badges(self):
        """Check and award badges based on achievements"""
        badges = Badge.objects.filter(is_active=True)

        for badge in badges:
            if self._check_badge_requirements(badge):
                self._award_badge(badge)

    def _check_badge_requirements(self, badge):
        """Check if user meets badge requirements"""
        requirements = badge.requirements

        # Check achievement count
        if 'achievement_count' in requirements:
            achievement_count = UserAchievement.objects.filter(
                user=self.user,
                progress=1.0
            ).count()
            if achievement_count < requirements['achievement_count']:
                return False

        # Check points threshold
        if 'points_threshold' in requirements:
            if self.profile.total_points < requirements['points_threshold']:
                return False

        # Check streak length
        if 'streak_threshold' in requirements:
            if self.profile.longest_streak < requirements['streak_threshold']:
                return False

        return True

    def _award_badge(self, badge):
        """Award a badge to the user"""
        user_badge, created = UserBadge.objects.get_or_create(
            user=self.user,
            badge=badge
        )

        if created:
            logger.info(f"Badge awarded: {badge.name} to user {self.user.username}")

    def _update_leaderboards(self, activity_type, metadata):
        """Update leaderboard rankings"""
        # Get active leaderboards
        leaderboards = Leaderboard.objects.filter(
            is_active=True,
            start_date__lte=timezone.now()
        ).filter(
            Q(end_date__isnull=True) | Q(end_date__gte=timezone.now())
        )

        for leaderboard in leaderboards:
            if self._qualifies_for_leaderboard(leaderboard, activity_type, metadata):
                self._update_leaderboard_entry(leaderboard, metadata)

    def _qualifies_for_leaderboard(self, leaderboard, activity_type, metadata):
        """Check if activity qualifies for leaderboard"""
        if leaderboard.leaderboard_type == 'subject':
            return metadata.get('subject') == leaderboard.subject
        elif leaderboard.leaderboard_type == 'course':
            return metadata.get('course') == leaderboard.course

        return True  # All-time and period leaderboards

    def _update_leaderboard_entry(self, leaderboard, metadata):
        """Update or create leaderboard entry"""
        score = self._calculate_leaderboard_score(leaderboard, metadata)

        entry, created = LeaderboardEntry.objects.get_or_create(
            leaderboard=leaderboard,
            user=self.user,
            defaults={'score': score}
        )

        if not created:
            entry.score += score
            entry.save()

        # Update ranks
        self._update_leaderboard_ranks(leaderboard)

    def _calculate_leaderboard_score(self, leaderboard, metadata):
        """Calculate score for leaderboard entry"""
        if leaderboard.leaderboard_type == 'weekly':
            return metadata.get('points_earned', 0)
        elif leaderboard.leaderboard_type == 'monthly':
            return metadata.get('points_earned', 0)
        else:
            return metadata.get('points_earned', 0)

    def _update_leaderboard_ranks(self, leaderboard):
        """Update ranks for all entries in leaderboard"""
        entries = LeaderboardEntry.objects.filter(
            leaderboard=leaderboard
        ).order_by('-score')[:leaderboard.max_entries]

        rank = 1
        for entry in entries:
            entry.rank = rank
            entry.save()
            rank += 1

    def _count_completed_items(self):
        """Count completed courses/lessons"""
        # This would integrate with your course completion system
        return 0  # Placeholder

    def _check_consistency(self, days_required):
        """Check if user has been active for required number of days"""
        # This would check activity logs
        return False  # Placeholder

    def get_user_stats(self):
        """Get comprehensive user statistics"""
        return {
            'total_points': self.profile.total_points,
            'current_level': self.profile.current_level,
            'experience_points': self.profile.experience_points,
            'current_streak': self.profile.current_streak,
            'longest_streak': self.profile.longest_streak,
            'accuracy_rate': self.profile.accuracy_rate,
            'achievements_count': UserAchievement.objects.filter(
                user=self.user, progress=1.0
            ).count(),
            'badges_count': UserBadge.objects.filter(user=self.user).count(),
            'leaderboard_rank': self._get_best_leaderboard_rank()
        }

    def _get_best_leaderboard_rank(self):
        """Get user's best rank across all leaderboards"""
        best_entry = LeaderboardEntry.objects.filter(
            user=self.user
        ).order_by('rank').first()

        return best_entry.rank if best_entry else None

    def get_available_rewards(self):
        """Get rewards available for redemption"""
        # Get rewards user hasn't redeemed yet
        redeemed_reward_ids = UserReward.objects.filter(
            user=self.user,
            redeemed_at__isnull=False
        ).values_list('reward_id', flat=True)

        available_rewards = Reward.objects.filter(
            is_active=True
        ).exclude(id__in=redeemed_reward_ids)

        # Filter by user's points
        affordable_rewards = []
        for reward in available_rewards:
            if reward.reward_type == 'points':
                if self.profile.total_points >= reward.value:
                    affordable_rewards.append(reward)
            else:
                affordable_rewards.append(reward)

        return affordable_rewards

    def redeem_reward(self, reward_id):
        """Redeem a reward"""
        try:
            reward = Reward.objects.get(id=reward_id, is_active=True)

            # Check if user can afford it
            if reward.reward_type == 'points' and self.profile.total_points < reward.value:
                return False, "Insufficient points"

            # Create redemption record
            UserReward.objects.create(
                user=self.user,
                reward=reward
            )

            # Deduct points if it's a points-based reward
            if reward.reward_type == 'points':
                self.profile.total_points -= reward.value
                self.profile.save()

            return True, "Reward redeemed successfully"

        except Reward.DoesNotExist:
            return False, "Reward not found"
