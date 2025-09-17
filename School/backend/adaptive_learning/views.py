from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import LearningProfile, PerformanceMetrics, AdaptivePath, StudySession, LearningGoal
from .services import AdaptiveLearningEngine
from .serializers import (
    LearningProfileSerializer,
    PerformanceMetricsSerializer,
    AdaptivePathSerializer,
    StudySessionSerializer,
    LearningGoalSerializer
)


class LearningProfileViewSet(viewsets.ModelViewSet):
    """Manage learning profiles"""
    serializer_class = LearningProfileSerializer
    permission_classes = [IsAuthenticated]
    queryset = LearningProfile.objects.all()

    def get_queryset(self):
        return LearningProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PerformanceMetricsViewSet(viewsets.ModelViewSet):
    """Manage performance metrics"""
    serializer_class = PerformanceMetricsSerializer
    permission_classes = [IsAuthenticated]
    queryset = PerformanceMetrics.objects.all()

    def get_queryset(self):
        return PerformanceMetrics.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def update_performance(self, request):
        """Update performance after answering a question"""
        subject = request.data.get('subject')
        topic = request.data.get('topic')
        correct = request.data.get('correct', False)
        time_taken = request.data.get('time_taken', 0)

        if not all([subject, topic]):
            return Response(
                {'error': 'Subject and topic are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        engine = AdaptiveLearningEngine(request.user)
        metric = engine.analyze_performance(subject, topic, correct, time_taken)

        if metric:
            serializer = self.get_serializer(metric)
            return Response(serializer.data)
        else:
            return Response(
                {'error': 'Failed to update performance'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdaptivePathViewSet(viewsets.ModelViewSet):
    """Manage adaptive learning paths"""
    serializer_class = AdaptivePathSerializer
    permission_classes = [IsAuthenticated]
    queryset = AdaptivePath.objects.all()

    def get_queryset(self):
        return AdaptivePath.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def recommendation(self, request):
        """Get next learning recommendation"""
        engine = AdaptiveLearningEngine(request.user)
        recommendation = engine.get_next_recommendation()
        return Response(recommendation)

    @action(detail=False, methods=['post'])
    def generate_plan(self, request):
        """Generate personalized study plan"""
        subject = request.data.get('subject')
        duration_days = request.data.get('duration_days', 30)

        if not subject:
            return Response(
                {'error': 'Subject is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        engine = AdaptiveLearningEngine(request.user)
        study_plan = engine.generate_study_plan(subject, duration_days)
        return Response({'study_plan': study_plan})

    @action(detail=False, methods=['post'])
    def predict_success(self, request):
        """Predict success probability for a subject"""
        subject = request.data.get('subject')
        target_date = request.data.get('target_date')

        if not all([subject, target_date]):
            return Response(
                {'error': 'Subject and target_date are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from datetime import datetime
        try:
            target_date_obj = datetime.fromisoformat(target_date.replace('Z', '+00:00')).date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        engine = AdaptiveLearningEngine(request.user)
        probability = engine.predict_success_probability(subject, target_date_obj)
        return Response({'success_probability': probability})


class StudySessionViewSet(viewsets.ModelViewSet):
    """Manage study sessions"""
    serializer_class = StudySessionSerializer
    permission_classes = [IsAuthenticated]
    queryset = StudySession.objects.all()

    def get_queryset(self):
        return StudySession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def end_session(self, request, pk=None):
        """End a study session and calculate metrics"""
        session = get_object_or_404(StudySession, pk=pk, user=request.user)

        if session.end_time:
            return Response(
                {'error': 'Session already ended'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from datetime import datetime
        session.end_time = datetime.now()
        session.duration_minutes = (session.end_time - session.start_time).total_seconds() / 60
        session.save()

        serializer = self.get_serializer(session)
        return Response(serializer.data)


class LearningGoalViewSet(viewsets.ModelViewSet):
    """Manage learning goals"""
    serializer_class = LearningGoalSerializer
    permission_classes = [IsAuthenticated]
    queryset = LearningGoal.objects.all()

    def get_queryset(self):
        return LearningGoal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        """Mark a learning goal as completed"""
        goal = get_object_or_404(LearningGoal, pk=pk, user=request.user)

        from datetime import datetime
        goal.is_completed = True
        goal.completed_at = datetime.now()
        goal.save()

        serializer = self.get_serializer(goal)
        return Response(serializer.data)
