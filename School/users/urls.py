from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserRegistrationView, UserLoginView, UserProfileView, UserProfileUpdateView,
    ChangePasswordView, PasswordResetView, PasswordResetConfirmView,
    UserSessionsView, LogoutView, user_stats, bulk_student_enrollment,
    BrandingConfigurationViewSet, BrandingPresetViewSet, branding_config
)

app_name = 'users'

urlpatterns = [
    # Authentication
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Password management
    path('password/change/', ChangePasswordView.as_view(), name='change_password'),
    path('password/reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password/reset/confirm/<str:uidb64>/<str:token>/',
         PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    # Profile management
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile_update'),

    # Sessions and stats
    path('sessions/', UserSessionsView.as_view(), name='sessions'),
    path('bulk-enrollment/', bulk_student_enrollment, name='bulk_student_enrollment'),
    path('stats/', user_stats, name='user_stats'),

    # Student ID System
    path('id/', include('users.urls_student_id')),

    # Branding System
    path('branding/', BrandingConfigurationViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='branding_list'),
    path('branding/active/', branding_config, name='branding_active'),
    path('branding/<int:pk>/', BrandingConfigurationViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='branding_detail'),
    path('branding/<int:pk>/apply-preset/', BrandingConfigurationViewSet.as_view({
        'post': 'apply_preset'
    }), name='branding_apply_preset'),
    path('branding-presets/', BrandingPresetViewSet.as_view({
        'get': 'list'
    }), name='branding_presets'),
    path('branding-presets/<int:pk>/apply/', BrandingPresetViewSet.as_view({
        'post': 'apply'
    }), name='branding_preset_apply'),
]
