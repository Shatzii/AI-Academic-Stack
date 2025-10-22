from django.urls import path
from .views import (
    ClassroomListView, ClassroomDetailView, ClassroomParticipantListView,
    ChatMessageListView, ClassroomRecordingListView, BreakoutRoomListView,
    PollListView, PollResponseListView, join_classroom, leave_classroom,
    start_classroom, end_classroom, classroom_stats
)

app_name = 'classrooms'

urlpatterns = [
    # Classrooms
    path('', ClassroomListView.as_view(), name='classroom-list'),
    path('<int:pk>/', ClassroomDetailView.as_view(), name='classroom-detail'),

    # Classroom actions
    path('<int:classroom_id>/join/', join_classroom, name='join-classroom'),
    path('<int:classroom_id>/leave/', leave_classroom, name='leave-classroom'),
    path('<int:classroom_id>/start/', start_classroom, name='start-classroom'),
    path('<int:classroom_id>/end/', end_classroom, name='end-classroom'),

    # Participants
    path('<int:classroom_id>/participants/', ClassroomParticipantListView.as_view(), name='participant-list'),

    # Chat
    path('<int:classroom_id>/chat/', ChatMessageListView.as_view(), name='chat-list'),

    # Recordings
    path('<int:classroom_id>/recordings/', ClassroomRecordingListView.as_view(), name='recording-list'),

    # Breakout rooms
    path('<int:classroom_id>/breakout-rooms/', BreakoutRoomListView.as_view(), name='breakout-room-list'),

    # Polls
    path('<int:classroom_id>/polls/', PollListView.as_view(), name='poll-list'),
    path('polls/<int:poll_id>/responses/', PollResponseListView.as_view(), name='poll-response-list'),

    # Statistics
    path('stats/', classroom_stats, name='classroom-stats'),
]
