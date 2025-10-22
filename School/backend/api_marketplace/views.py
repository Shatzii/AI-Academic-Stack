from rest_framework import viewsets, permissions
from .models import APIService, APIIntegration
from .serializers import APIServiceSerializer, APIIntegrationSerializer

class APIServiceViewSet(viewsets.ModelViewSet):
    queryset = APIService.objects.all()
    serializer_class = APIServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

class APIIntegrationViewSet(viewsets.ModelViewSet):
    queryset = APIIntegration.objects.all()
    serializer_class = APIIntegrationSerializer
    permission_classes = [permissions.IsAuthenticated]
