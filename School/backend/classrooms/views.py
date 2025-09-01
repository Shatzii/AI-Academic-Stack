from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import (
    Classroom, ClassroomParticipant, ChatMessage, ClassroomRecording,
    BreakoutRoom, Poll, PollResponse
)
from .serializers import (
    ClassroomSerializer, ClassroomCreateUpdateSerializer, ClassroomParticipantSerializer,
    ChatMessageSerializer, ChatMessageCreateSerializer, ClassroomRecordingSerializer,
    BreakoutRoomSerializer, PollSerializer, PollCreateSerializer,
    PollResponseSerializer, PollResponseCreateSerializer, ClassroomStatsSerializer
)
from .permissions import IsInstructorOrReadOnly, IsParticipantOrInstructor


class ClassroomListView(generics.ListCreateAPIView):
    """View for listing and creating classrooms."""

    serializer_class = ClassroomSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['course', 'status', 'is_private']
    search_fields = ['title', 'description']
    ordering_fields = ['scheduled_at', 'created_at', 'total_participants']
    ordering = ['-scheduled_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ClassroomCreateUpdateSerializer
        return ClassroomSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsInstructorOrReadOnly()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Classroom.objects.all()

        # Filter by user role
        user = self.request.user
        if user.is_authenticated:
            if hasattr(user, 'is_teacher') and user.is_teacher:
                # Teachers see their own classrooms
                queryset = queryset.filter(instructor=user)
            elif hasattr(user, 'is_student') and user.is_student:
                # Students see classrooms they're enrolled in
                enrolled_course_ids = user.enrollments.filter(
                    status__in=['active', 'completed']
                ).values_list('course_id', flat=True)
                queryset = queryset.filter(
                    Q(course_id__in=enrolled_course_ids) |
                    Q(is_private=False)
                )
            else:
                # Other authenticated users see public classrooms
                queryset = queryset.filter(is_private=False)
        else:
            # Anonymous users see public classrooms
            queryset = queryset.filter(is_private=False)

        return queryset


class ClassroomDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, and deleting classrooms."""

    serializer_class = ClassroomSerializer

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ClassroomCreateUpdateSerializer
        return ClassroomSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsInstructorOrReadOnly()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_teacher:
            return Classroom.objects.filter(instructor=self.request.user)
        return Classroom.objects.filter(is_private=False)


class ClassroomParticipantListView(generics.ListCreateAPIView):
    """View for listing and managing classroom participants."""

    serializer_class = ClassroomParticipantSerializer
    permission_classes = [permissions.IsAuthenticated, IsParticipantOrInstructor]

    def get_queryset(self):
        classroom_id = self.kwargs.get('classroom_id')
        return ClassroomParticipant.objects.filter(classroom_id=classroom_id)

    def perform_create(self, serializer):
        classroom_id = self.kwargs.get('classroom_id')
        classroom = get_object_or_404(Classroom, id=classroom_id)
        serializer.save(classroom=classroom, user=self.request.user)


class ChatMessageListView(generics.ListCreateAPIView):
    """View for listing and creating chat messages."""

    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsParticipantOrInstructor]
    filter_backends = [OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ChatMessageCreateSerializer
        return ChatMessageSerializer

    def get_queryset(self):
        classroom_id = self.kwargs.get('classroom_id')
        queryset = ChatMessage.objects.filter(
            classroom_id=classroom_id,
            is_approved=True
        )

        # Filter by parent message for thread replies
        parent_id = self.request.query_params.get('parent')
        if parent_id:
            queryset = queryset.filter(parent_message_id=parent_id)

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['classroom_id'] = self.kwargs.get('classroom_id')
        return context


class ClassroomRecordingListView(generics.ListCreateAPIView):
    """View for listing and creating classroom recordings."""

    serializer_class = ClassroomRecordingSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrReadOnly]

    def get_queryset(self):
        classroom_id = self.kwargs.get('classroom_id')
        classroom = get_object_or_404(Classroom, id=classroom_id)

        # Only instructors and participants can see recordings
        if (self.request.user == classroom.instructor or
            classroom.participants.filter(user=self.request.user).exists()):
            return classroom.recordings.all()
        return ClassroomRecording.objects.none()

    def perform_create(self, serializer):
        classroom_id = self.kwargs.get('classroom_id')
        classroom = get_object_or_404(Classroom, id=classroom_id)

        if classroom.instructor != self.request.user:
            raise permissions.PermissionDenied("Only instructors can create recordings.")

        serializer.save(classroom=classroom)


class BreakoutRoomListView(generics.ListCreateAPIView):
    """View for listing and creating breakout rooms."""

    serializer_class = BreakoutRoomSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrReadOnly]

    def get_queryset(self):
        classroom_id = self.kwargs.get('classroom_id')
        return BreakoutRoom.objects.filter(classroom_id=classroom_id)

    def perform_create(self, serializer):
        classroom_id = self.kwargs.get('classroom_id')
        classroom = get_object_or_404(Classroom, id=classroom_id)

        if classroom.instructor != self.request.user:
            raise permissions.PermissionDenied("Only instructors can create breakout rooms.")

        serializer.save(classroom=classroom)


class PollListView(generics.ListCreateAPIView):
    """View for listing and creating polls."""

    serializer_class = PollSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PollCreateSerializer
        return PollSerializer

    def get_queryset(self):
        classroom_id = self.kwargs.get('classroom_id')
        return Poll.objects.filter(classroom_id=classroom_id)

    def perform_create(self, serializer):
        classroom_id = self.kwargs.get('classroom_id')
        classroom = get_object_or_404(Classroom, id=classroom_id)

        if classroom.instructor != self.request.user:
            raise permissions.PermissionDenied("Only instructors can create polls.")

        serializer.save(classroom=classroom)


class PollResponseListView(generics.ListCreateAPIView):
    """View for listing and creating poll responses."""

    serializer_class = PollResponseSerializer

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PollResponseCreateSerializer
        return PollResponseSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsParticipantOrInstructor()]
        return [permissions.IsAuthenticated(), IsInstructorOrReadOnly()]

    def get_queryset(self):
        poll_id = self.kwargs.get('poll_id')
        poll = get_object_or_404(Poll, id=poll_id)

        # Only instructors can see all responses
        if poll.classroom.instructor == self.request.user:
            return poll.poll_responses.all()
        # Participants can only see their own responses if not anonymous
        elif not poll.is_anonymous:
            return poll.poll_responses.filter(respondent=self.request.user)
        return PollResponse.objects.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['poll_id'] = self.kwargs.get('poll_id')
        return context

    def perform_create(self, serializer):
        poll_id = self.kwargs.get('poll_id')
        poll = get_object_or_404(Poll, id=poll_id)

        # Check if user already responded
        if poll.poll_responses.filter(respondent=self.request.user).exists():
            raise serializers.ValidationError("You have already responded to this poll.")

        response = serializer.save()

        # Update poll statistics
        for answer_index in response.answers:
            if str(answer_index) not in poll.responses:
                poll.responses[str(answer_index)] = 0
            poll.responses[str(answer_index)] += 1

        poll.total_responses = poll.poll_responses.count()
        poll.save()


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_classroom(request, classroom_id):
    """Join a classroom session."""

    classroom = get_object_or_404(Classroom, id=classroom_id)

    # Check if classroom is active
    if classroom.status != 'active':
        return Response(
            {'error': 'Classroom is not currently active.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check access permissions
    if classroom.is_private:
        # Check access code or allowed emails
        access_code = request.data.get('access_code')
        if classroom.access_code and access_code != classroom.access_code:
            return Response(
                {'error': 'Invalid access code.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if classroom.allowed_emails and request.user.email not in classroom.allowed_emails:
            return Response(
                {'error': 'You are not authorized to join this classroom.'},
                status=status.HTTP_403_FORBIDDEN
            )

    # Check participant limit
    if classroom.current_participants >= classroom.max_participants:
        return Response(
            {'error': 'Classroom is full.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create or update participant record
    participant, created = ClassroomParticipant.objects.get_or_create(
        classroom=classroom,
        user=request.user,
        defaults={'role': 'student' if request.user.is_student else 'instructor'}
    )

    if not created and not participant.is_active:
        participant.is_active = True
        participant.joined_at = timezone.now()
        participant.save()

    serializer = ClassroomParticipantSerializer(participant)
    return Response({
        'participant': serializer.data,
        'join_url': classroom.join_url,
        'meeting_id': classroom.meeting_id
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def leave_classroom(request, classroom_id):
    """Leave a classroom session."""

    classroom = get_object_or_404(Classroom, id=classroom_id)

    try:
        participant = classroom.participants.get(user=request.user, is_active=True)
        participant.left_at = timezone.now()
        participant.is_active = False

        # Calculate total time
        if participant.joined_at:
            time_diff = participant.left_at - participant.joined_at
            participant.total_time_minutes = time_diff.total_seconds() / 60

        participant.save()

        return Response({'message': 'Successfully left the classroom.'})

    except ClassroomParticipant.DoesNotExist:
        return Response(
            {'error': 'You are not currently in this classroom.'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def start_classroom(request, classroom_id):
    """Start a classroom session."""

    classroom = get_object_or_404(Classroom, id=classroom_id)

    if classroom.instructor != request.user:
        return Response(
            {'error': 'Only instructors can start classroom sessions.'},
            status=status.HTTP_403_FORBIDDEN
        )

    if classroom.status != 'scheduled':
        return Response(
            {'error': 'Classroom cannot be started.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    classroom.status = 'active'
    classroom.actual_start_time = timezone.now()
    classroom.save()

    return Response({
        'message': 'Classroom session started.',
        'classroom': ClassroomSerializer(classroom).data
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def end_classroom(request, classroom_id):
    """End a classroom session."""

    classroom = get_object_or_404(Classroom, id=classroom_id)

    if classroom.instructor != request.user:
        return Response(
            {'error': 'Only instructors can end classroom sessions.'},
            status=status.HTTP_403_FORBIDDEN
        )

    if classroom.status != 'active':
        return Response(
            {'error': 'Classroom is not currently active.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    classroom.status = 'completed'
    classroom.actual_end_time = timezone.now()
    classroom.save()

    # Update all active participants
    active_participants = classroom.participants.filter(is_active=True)
    for participant in active_participants:
        if not participant.left_at:
            participant.left_at = classroom.actual_end_time
            time_diff = participant.left_at - participant.joined_at
            participant.total_time_minutes = time_diff.total_seconds() / 60
            participant.save()

    return Response({
        'message': 'Classroom session ended.',
        'classroom': ClassroomSerializer(classroom).data
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def classroom_stats(request):
    """Get classroom statistics."""

    classrooms = Classroom.objects.all()
    active_classrooms = classrooms.filter(status='active')

    stats_data = {
        'total_classrooms': classrooms.count(),
        'active_classrooms': active_classrooms.count(),
        'total_participants': ClassroomParticipant.objects.count(),
        'average_participants': 0,
        'total_messages': ChatMessage.objects.count(),
        'average_duration': 0,
        'popular_times': []
    }

    # Calculate averages
    if classrooms.exists():
        total_participants = sum(c.total_participants for c in classrooms)
        stats_data['average_participants'] = total_participants / classrooms.count()

        completed_classrooms = classrooms.filter(status='completed')
        if completed_classrooms.exists():
            total_duration = sum(
                (c.actual_end_time - c.actual_start_time).total_seconds() / 3600
                for c in completed_classrooms
                if c.actual_end_time and c.actual_start_time
            )
            stats_data['average_duration'] = total_duration / completed_classrooms.count()

    serializer = ClassroomStatsSerializer(data=stats_data)
    serializer.is_valid(raise_exception=True)

    return Response(serializer.validated_data)
