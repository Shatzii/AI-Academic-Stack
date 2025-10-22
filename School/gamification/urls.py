from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'achievements', views.AchievementViewSet)
router.register(r'user-achievements', views.UserAchievementViewSet)
router.register(r'badges', views.BadgeViewSet)
router.register(r'user-badges', views.UserBadgeViewSet)
router.register(r'leaderboards', views.LeaderboardViewSet)
router.register(r'profiles', views.GamificationProfileViewSet)
router.register(r'rewards', views.RewardViewSet)
router.register(r'user-rewards', views.UserRewardViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
