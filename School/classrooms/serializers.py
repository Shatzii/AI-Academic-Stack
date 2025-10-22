from rest_framework import serializers
from .models import (
    Classroom, ClassroomParticipant, ChatMessage, ClassroomRecording,
    BreakoutRoom, Poll, PollResponse
)


class ClassroomSerializer(serializers.ModelSerializer):
    """Serializer for Classroom model."""

    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    current_participants = serializers.SerializerMethodField()
    is_user_participant = serializers.SerializerMethodField()

    class Meta:
        model = Classroom
        fields = [
            'id', 'title', 'description', 'course', 'course_title', 'instructor',
            'instructor_name', 'scheduled_at', 'duration_minutes', 'status',
            'is_recording_enabled', 'max_participants', 'is_private',
            'meeting_id', 'join_url', 'recording_url', 'total_participants',
            'current_participants', 'is_user_participant', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'meeting_id', 'join_url', 'created_at', 'updated_at']

    def get_current_participants(self, obj):
        return obj.current_participants

    def get_is_user_participant(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.participants.filter(user=request.user, is_active=True).exists()
        return False


class ClassroomCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating classrooms."""

    class Meta:
        model = Classroom
        fields = [
            'title', 'description', 'course', 'scheduled_at', 'duration_minutes',
            'is_recording_enabled', 'max_participants', 'is_private', 'access_code'
        ]

    def create(self, validated_data):
        validated_data['instructor'] = self.context['request'].user
        return super().create(validated_data)


class ClassroomParticipantSerializer(serializers.ModelSerializer):
    """Serializer for ClassroomParticipant model."""

    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = ClassroomParticipant
        fields = [
            'id', 'user', 'user_name', 'user_email', 'role', 'joined_at',
            'left_at', 'is_active', 'total_time_minutes', 'messages_sent',
            'can_speak', 'can_share_screen', 'can_record'
        ]
        read_only_fields = ['id', 'joined_at', 'left_at']


class ChatMessageSerializer(serializers.ModelSerializer):
    """Serializer for ChatMessage model."""

    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    sender_role = serializers.SerializerMethodField()
    replies_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = [
            'id', 'sender', 'sender_name', 'sender_role', 'message_type',
            'content', 'parent_message', 'replies', 'replies_count',
            'reactions', 'is_approved', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sender', 'created_at', 'updated_at']

    def get_sender_role(self, obj):
        try:
            participant = obj.classroom.participants.get(user=obj.sender)
            return participant.role
        except ClassroomParticipant.DoesNotExist:
            return 'unknown'

    def get_replies_count(self, obj):
        return obj.replies.count()


class ChatMessageCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating chat messages."""

    class Meta:
        model = ChatMessage
        fields = ['message_type', 'content', 'parent_message']

    def create(self, validated_data):
        classroom_id = self.context['classroom_id']
        classroom = Classroom.objects.get(id=classroom_id)
        validated_data['classroom'] = classroom
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)


class ClassroomRecordingSerializer(serializers.ModelSerializer):
    """Serializer for ClassroomRecording model."""

    class Meta:
        model = ClassroomRecording
        fields = [
            'id', 'title', 'description', 'file', 'file_size', 'duration_seconds',
            'recording_started_at', 'recording_ended_at', 'is_public',
            'view_count', 'download_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class BreakoutRoomSerializer(serializers.ModelSerializer):
    """Serializer for BreakoutRoom model."""

    participants_count = serializers.SerializerMethodField()
    participants_list = serializers.SerializerMethodField()

    class Meta:
        model = BreakoutRoom
        fields = [
            'id', 'name', 'description', 'participants', 'participants_count',
            'participants_list', 'max_participants', 'is_active', 'meeting_id',
            'join_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_participants_count(self, obj):
        return obj.participants.count()

    def get_participants_list(self, obj):
        return [
            {'id': p.id, 'name': p.get_full_name(), 'email': p.email}
            for p in obj.participants.all()
        ]


class PollSerializer(serializers.ModelSerializer):
    """Serializer for Poll model."""

    has_user_responded = serializers.SerializerMethodField()
    user_response = serializers.SerializerMethodField()

    class Meta:
        model = Poll
        fields = [
            'id', 'question', 'options', 'is_anonymous', 'allow_multiple_answers',
            'is_active', 'responses', 'total_responses', 'has_user_responded',
            'user_response', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'responses', 'total_responses', 'created_at', 'updated_at']

    def get_has_user_responded(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.poll_responses.filter(respondent=request.user).exists()
        return False

    def get_user_response(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                response = obj.poll_responses.get(respondent=request.user)
                return response.answers
            except PollResponse.DoesNotExist:
                pass
        return None


class PollCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating polls."""

    class Meta:
        model = Poll
        fields = [
            'question', 'options', 'correct_answer', 'is_anonymous',
            'allow_multiple_answers'
        ]


class PollResponseSerializer(serializers.ModelSerializer):
    """Serializer for PollResponse model."""

    respondent_name = serializers.CharField(source='respondent.get_full_name', read_only=True)

    class Meta:
        model = PollResponse
        fields = ['id', 'respondent', 'respondent_name', 'answers', 'created_at']
        read_only_fields = ['id', 'created_at']


class PollResponseCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating poll responses."""

    class Meta:
        model = PollResponse
        fields = ['answers']

    def create(self, validated_data):
        poll_id = self.context['poll_id']
        poll = Poll.objects.get(id=poll_id)
        validated_data['poll'] = poll
        validated_data['respondent'] = self.context['request'].user
        return super().create(validated_data)


class ClassroomStatsSerializer(serializers.Serializer):
    """Serializer for classroom statistics."""

    total_classrooms = serializers.IntegerField()
    active_classrooms = serializers.IntegerField()
    total_participants = serializers.IntegerField()
    average_participants = serializers.DecimalField(max_digits=5, decimal_places=2)
    total_messages = serializers.IntegerField()
    average_duration = serializers.DecimalField(max_digits=5, decimal_places=2)
    popular_times = serializers.ListField(child=serializers.DictField())
