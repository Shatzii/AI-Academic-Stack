from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StudentIDCardViewSet, AttendanceRecordViewSet,
    access_control, attendance_stats
)

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'id-cards', StudentIDCardViewSet, basename='id-cards')
router.register(r'attendance', AttendanceRecordViewSet, basename='attendance')

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),

    # Custom API endpoints
    path('access-control/', access_control, name='access-control'),
    path('attendance/stats/', attendance_stats, name='attendance-stats'),
]
