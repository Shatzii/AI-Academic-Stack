"""
URL configuration for OpenEdTex project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="OpenEdTex API",
        default_version='v1',
        description="API for OpenEdTex - AI-Powered Educational Technology Platform",
        terms_of_service="https://www.openedtex.org/policies/terms/",
        contact=openapi.Contact(email="contact@openedtex.org"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('', lambda request: redirect('schema-swagger-ui'), name='home'),
    path('admin/', admin.site.urls),

    # API documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # API endpoints
    path('api/auth/', include('users.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/classrooms/', include('classrooms.urls')),
    path('api/ai/', include('ai_assistant.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/adaptive/', include('adaptive_learning.urls')),
    path('api/gamification/', include('gamification.urls')),

    # Health check
    path('health/', include('health_check.urls')),

    # Prometheus metrics
    path('metrics/', include('django_prometheus.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
