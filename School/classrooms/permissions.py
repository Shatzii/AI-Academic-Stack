from rest_framework import permissions


class IsInstructorOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow instructors to edit their own classrooms."""

    def has_permission(self, request, view):
        # Allow read permissions for everyone
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only for authenticated users
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow read permissions for everyone
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only for the instructor
        return obj.instructor == request.user


class IsParticipantOrInstructor(permissions.BasePermission):
    """Custom permission to allow participants and instructors to access classroom features."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow instructors
        if hasattr(obj, 'instructor') and obj.instructor == request.user:
            return True

        # Allow participants
        if hasattr(obj, 'participants'):
            return obj.participants.filter(user=request.user).exists()

        return False


class IsClassroomParticipant(permissions.BasePermission):
    """Custom permission to only allow classroom participants to access certain features."""

    def has_object_permission(self, request, view, obj):
        classroom = None

        # Get classroom from different object types
        if hasattr(obj, 'classroom'):
            classroom = obj.classroom
        elif hasattr(obj, 'classroom_id'):
            from .models import Classroom
            classroom = Classroom.objects.get(id=obj.classroom_id)

        if classroom:
            # Allow instructors
            if classroom.instructor == request.user:
                return True

            # Allow participants
            return classroom.participants.filter(user=request.user, is_active=True).exists()

        return False
