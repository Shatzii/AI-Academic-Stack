from rest_framework import permissions


def is_administrative_user(user):
    """Helper function to check if user has administrative privileges."""
    return user.is_admin or user.is_principal or user.is_superintendent


class IsInstructorOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow instructors to edit their own courses."""

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

        # Write permissions only for the instructor or administrative users
        return obj.instructor == request.user or is_administrative_user(request.user)


class IsEnrolledOrInstructor(permissions.BasePermission):
    """Custom permission to only allow enrolled students or instructors to access enrollment data."""

    def has_object_permission(self, request, view, obj):
        # Allow instructors of the course
        if hasattr(obj, 'course') and obj.course.instructor == request.user:
            return True

        # Allow administrative users
        if is_administrative_user(request.user):
            return True

        # Allow the student who owns the enrollment
        if hasattr(obj, 'student') and obj.student == request.user:
            return True

        return False


class IsStudentOrInstructor(permissions.BasePermission):
    """Custom permission to allow students to view their data and instructors to view course data."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow instructors to see their course data
        if hasattr(obj, 'course') and obj.course.instructor == request.user:
            return True

        # Allow administrative users
        if is_administrative_user(request.user):
            return True

        # Allow students to see their own data
        if hasattr(obj, 'student') and obj.student == request.user:
            return True

        return False


class IsEnrolledStudent(permissions.BasePermission):
    """Custom permission to only allow enrolled students to access course content."""

    def has_object_permission(self, request, view, obj):
        # Allow instructors
        if hasattr(obj, 'course') and obj.course.instructor == request.user:
            return True

        # Allow administrative users
        if is_administrative_user(request.user):
            return True

        # Allow enrolled students
        if hasattr(obj, 'course'):
            return obj.course.enrollments.filter(
                student=request.user,
                status__in=['active', 'completed']
            ).exists()

        return False
