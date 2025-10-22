from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import APIServiceViewSet, APIIntegrationViewSet

router = DefaultRouter()
router.register(r'services', APIServiceViewSet)
router.register(r'integrations', APIIntegrationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
