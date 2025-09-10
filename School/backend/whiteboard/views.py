from rest_framework import viewsets, permissions
from .models import WhiteboardSession, WhiteboardAction
from .serializers import WhiteboardSessionSerializer, WhiteboardActionSerializer

class WhiteboardSessionViewSet(viewsets.ModelViewSet):
    queryset = WhiteboardSession.objects.all()
    serializer_class = WhiteboardSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

class WhiteboardActionViewSet(viewsets.ModelViewSet):
    queryset = WhiteboardAction.objects.all()
    serializer_class = WhiteboardActionSerializer
    permission_classes = [permissions.IsAuthenticated]
