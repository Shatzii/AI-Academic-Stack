from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import (
    Achievement, UserAchievement, Badge, UserBadge,
    Leaderboard, LeaderboardEntry, GamificationProfile,
    Reward, UserReward
)
from .services import GamificationService
from .serializers import (
    AchievementSerializer, UserAchievementSerializer,
    BadgeSerializer, UserBadgeSerializer,
    LeaderboardSerializer, LeaderboardEntrySerializer,
    GamificationProfileSerializer, RewardSerializer,
    UserRewardSerializer
)


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """View achievements"""
    queryset = Achievement.objects.filter(is_active=True)
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]


class UserAchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """View user's achievements"""
    serializer_class = UserAchievementSerializer
    permission_classes = [IsAuthenticated]
    queryset = UserAchievement.objects.all()

    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user)


class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    """View badges"""
    queryset = Badge.objects.filter(is_active=True)
    serializer_class = BadgeSerializer
    permission_classes = [IsAuthenticated]


class UserBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    """View user's badges"""
    serializer_class = UserBadgeSerializer
    permission_classes = [IsAuthenticated]
    queryset = UserBadge.objects.all()

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user)


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    """View leaderboards"""
    queryset = Leaderboard.objects.filter(is_active=True)
    serializer_class = LeaderboardSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def entries(self, request, pk=None):
        """Get leaderboard entries"""
        leaderboard = get_object_or_404(Leaderboard, pk=pk, is_active=True)
        entries = LeaderboardEntry.objects.filter(
            leaderboard=leaderboard
        ).order_by('rank')[:leaderboard.max_entries]

        serializer = LeaderboardEntrySerializer(entries, many=True)
        return Response(serializer.data)


class GamificationProfileViewSet(viewsets.ModelViewSet):
    """Manage gamification profile"""
    queryset = GamificationProfile.objects.all()
    serializer_class = GamificationProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GamificationProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get comprehensive user statistics"""
        service = GamificationService(request.user)
        stats = service.get_user_stats()
        return Response(stats)

    @action(detail=False, methods=['post'])
    def record_activity(self, request):
        """Record user activity"""
        activity_type = request.data.get('activity_type')
        metadata = request.data.get('metadata', {})

        if not activity_type:
            return Response(
                {'error': 'Activity type is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        service = GamificationService(request.user)
        points_awarded = service.record_activity(activity_type, metadata)

        return Response({
            'points_awarded': points_awarded,
            'total_points': service.profile.total_points,
            'current_level': service.profile.current_level
        })


class RewardViewSet(viewsets.ReadOnlyModelViewSet):
    """View available rewards"""
    queryset = Reward.objects.filter(is_active=True)
    serializer_class = RewardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        service = GamificationService(self.request.user)
        available_rewards = service.get_available_rewards()
        return available_rewards


class UserRewardViewSet(viewsets.ModelViewSet):
    """Manage user's rewards"""
    queryset = UserReward.objects.all()
    serializer_class = UserRewardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserReward.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def redeem(self, request):
        """Redeem a reward"""
        reward_id = request.data.get('reward_id')

        if not reward_id:
            return Response(
                {'error': 'Reward ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        service = GamificationService(request.user)
        success, message = service.redeem_reward(reward_id)

        if success:
            return Response({'message': message})
        else:
            return Response(
                {'error': message},
                status=status.HTTP_400_BAD_REQUEST
            )
