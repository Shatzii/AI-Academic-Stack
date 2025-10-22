import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from .models import Classroom, ClassroomParticipant, ChatMessage, Poll, PollResponse


class ClassroomConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for classroom real-time updates."""

    async def connect(self):
        self.classroom_id = self.scope['url_route']['kwargs']['classroom_id']
        self.room_group_name = f'classroom_{self.classroom_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Update participant status
        await self.update_participant_status(True)

        # Send welcome message
        await self.send(text_data=json.dumps({
            'type': 'welcome',
            'message': 'Connected to classroom',
            'classroom_id': self.classroom_id
        }))

    async def disconnect(self, close_code):
        # Update participant status
        await self.update_participant_status(False)

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'ping':
            await self.send(text_data=json.dumps({
                'type': 'pong',
                'timestamp': timezone.now().isoformat()
            }))
        elif message_type == 'participant_update':
            await self.handle_participant_update(data)
        elif message_type == 'status_update':
            await self.handle_status_update(data)

    async def handle_participant_update(self, data):
        """Handle participant count updates."""
        participant_count = await self.get_participant_count()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'participant_update',
                'count': participant_count,
                'timestamp': timezone.now().isoformat()
            }
        )

    async def handle_status_update(self, data):
        """Handle classroom status updates."""
        status = data.get('status')
        await self.update_classroom_status(status)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'status_update',
                'status': status,
                'timestamp': timezone.now().isoformat()
            }
        )

    async def participant_update(self, event):
        """Send participant update to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'participant_update',
            'count': event['count'],
            'timestamp': event['timestamp']
        }))

    async def status_update(self, event):
        """Send status update to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'status_update',
            'status': event['status'],
            'timestamp': event['timestamp']
        }))

    @database_sync_to_async
    def update_participant_status(self, is_active):
        """Update participant active status."""
        try:
            participant = ClassroomParticipant.objects.get(
                classroom_id=self.classroom_id,
                user=self.scope['user'],
                is_active=not is_active  # Opposite of target status
            )
            participant.is_active = is_active
            if is_active:
                participant.joined_at = timezone.now()
            else:
                participant.left_at = timezone.now()
                if participant.joined_at:
                    time_diff = participant.left_at - participant.joined_at
                    participant.total_time_minutes = time_diff.total_seconds() / 60
            participant.save()
        except ClassroomParticipant.DoesNotExist:
            pass

    @database_sync_to_async
    def get_participant_count(self):
        """Get current participant count."""
        return ClassroomParticipant.objects.filter(
            classroom_id=self.classroom_id,
            is_active=True
        ).count()

    @database_sync_to_async
    def update_classroom_status(self, status):
        """Update classroom status."""
        try:
            classroom = Classroom.objects.get(id=self.classroom_id)
            classroom.status = status
            if status == 'active':
                classroom.actual_start_time = timezone.now()
            elif status == 'completed':
                classroom.actual_end_time = timezone.now()
            classroom.save()
        except Classroom.DoesNotExist:
            pass


class ChatConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time chat."""

    async def connect(self):
        self.classroom_id = self.scope['url_route']['kwargs']['classroom_id']
        self.room_group_name = f'chat_{self.classroom_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'chat_message':
            await self.handle_chat_message(data)
        elif message_type == 'reaction':
            await self.handle_reaction(data)

    async def handle_chat_message(self, data):
        """Handle new chat messages."""
        content = data.get('content')
        message_type = data.get('message_type', 'text')
        parent_id = data.get('parent_id')

        # Save message to database
        message = await self.save_chat_message(content, message_type, parent_id)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': message.id,
                    'sender': message.sender.get_full_name(),
                    'content': message.content,
                    'message_type': message.message_type,
                    'parent_id': message.parent_message_id,
                    'timestamp': message.created_at.isoformat()
                }
            }
        )

    async def handle_reaction(self, data):
        """Handle message reactions."""
        message_id = data.get('message_id')
        reaction = data.get('reaction')

        # Update message reactions
        await self.update_message_reaction(message_id, reaction)

        # Send reaction update to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'reaction_update',
                'message_id': message_id,
                'reaction': reaction,
                'user': self.scope['user'].get_full_name()
            }
        )

    async def chat_message(self, event):
        """Send chat message to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))

    async def reaction_update(self, event):
        """Send reaction update to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'reaction_update',
            'message_id': event['message_id'],
            'reaction': event['reaction'],
            'user': event['user']
        }))

    @database_sync_to_async
    def save_chat_message(self, content, message_type, parent_id):
        """Save chat message to database."""
        return ChatMessage.objects.create(
            classroom_id=self.classroom_id,
            sender=self.scope['user'],
            content=content,
            message_type=message_type,
            parent_message_id=parent_id
        )

    @database_sync_to_async
    def update_message_reaction(self, message_id, reaction):
        """Update message reactions."""
        try:
            message = ChatMessage.objects.get(id=message_id)
            if not message.reactions:
                message.reactions = {}
            user_id = str(self.scope['user'].id)
            if user_id not in message.reactions:
                message.reactions[user_id] = []
            if reaction not in message.reactions[user_id]:
                message.reactions[user_id].append(reaction)
            message.save()
        except ChatMessage.DoesNotExist:
            pass


class PollConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time polls."""

    async def connect(self):
        self.classroom_id = self.scope['url_route']['kwargs']['classroom_id']
        self.room_group_name = f'poll_{self.classroom_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'poll_response':
            await self.handle_poll_response(data)
        elif message_type == 'poll_update':
            await self.handle_poll_update(data)

    async def handle_poll_response(self, data):
        """Handle poll responses."""
        poll_id = data.get('poll_id')
        answers = data.get('answers')

        # Save response
        await self.save_poll_response(poll_id, answers)

        # Update poll statistics
        stats = await self.get_poll_stats(poll_id)

        # Send update to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'poll_update',
                'poll_id': poll_id,
                'stats': stats
            }
        )

    async def handle_poll_update(self, data):
        """Handle poll updates from instructor."""
        poll_data = data.get('poll_data')

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'poll_update',
                'poll_data': poll_data
            }
        )

    async def poll_update(self, event):
        """Send poll update to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'poll_update',
            'poll_id': event.get('poll_id'),
            'stats': event.get('stats'),
            'poll_data': event.get('poll_data')
        }))

    @database_sync_to_async
    def save_poll_response(self, poll_id, answers):
        """Save poll response to database."""
        try:
            poll = Poll.objects.get(id=poll_id)
            response, created = PollResponse.objects.get_or_create(
                poll=poll,
                respondent=self.scope['user'],
                defaults={'answers': answers}
            )
            if not created:
                response.answers = answers
                response.save()

            # Update poll statistics
            poll.total_responses = poll.poll_responses.count()
            poll.responses = {}
            for response in poll.poll_responses.all():
                for answer_index in response.answers:
                    answer_key = str(answer_index)
                    if answer_key not in poll.responses:
                        poll.responses[answer_key] = 0
                    poll.responses[answer_key] += 1
            poll.save()

        except Poll.DoesNotExist:
            pass

    @database_sync_to_async
    def get_poll_stats(self, poll_id):
        """Get poll statistics."""
        try:
            poll = Poll.objects.get(id=poll_id)
            return {
                'total_responses': poll.total_responses,
                'responses': poll.responses
            }
        except Poll.DoesNotExist:
            return {}
