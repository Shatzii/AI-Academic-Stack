from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profiles', views.LearningProfileViewSet)
router.register(r'metrics', views.PerformanceMetricsViewSet)
router.register(r'paths', views.AdaptivePathViewSet)
router.register(r'sessions', views.StudySessionViewSet)
router.register(r'goals', views.LearningGoalViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
