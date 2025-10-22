from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WhiteboardSessionViewSet, WhiteboardActionViewSet

router = DefaultRouter()
router.register(r'sessions', WhiteboardSessionViewSet)
router.register(r'actions', WhiteboardActionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
