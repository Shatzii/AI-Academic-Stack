from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/classroom/(?P<classroom_id>\d+)/$', consumers.ClassroomConsumer.as_asgi()),
    re_path(r'ws/classroom/(?P<classroom_id>\d+)/chat/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/classroom/(?P<classroom_id>\d+)/poll/$', consumers.PollConsumer.as_asgi()),
]
