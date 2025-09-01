from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Subject, Course, Lesson, Enrollment, CourseReview, CourseMaterial
from .serializers import (
    SubjectSerializer, CourseListSerializer, CourseDetailSerializer,
    CourseCreateUpdateSerializer, LessonSerializer, EnrollmentSerializer,
    EnrollmentCreateSerializer, CourseReviewSerializer, CourseReviewCreateSerializer,
    CourseMaterialSerializer, CourseStatsSerializer
)
from .permissions import IsInstructorOrReadOnly, IsEnrolledOrInstructor, IsStudentOrInstructor
from users.models_student_id import StudentIDCard


class SubjectListView(generics.ListAPIView):
    """View for listing subjects."""

    queryset = Subject.objects.filter(is_active=True)
    serializer_class = SubjectSerializer
    permission_classes = [permissions.AllowAny]


class CourseListView(generics.ListCreateAPIView):
    """View for listing and creating courses."""

    queryset = Course.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['subject', 'grade_level', 'status', 'is_featured']
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['created_at', 'average_rating', 'total_enrollments', 'price']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CourseCreateUpdateSerializer
        return CourseListSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsInstructorOrReadOnly()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Only show published courses to non-instructors
        if not (self.request.user.is_authenticated and
                (self.request.user.is_teacher or self.request.user.is_admin)):
            queryset = queryset.filter(status='published')
        return queryset


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, and deleting courses."""

    queryset = Course.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CourseCreateUpdateSerializer
        return CourseDetailSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsInstructorOrReadOnly()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Allow instructors to see their own courses in any status
        if self.request.user.is_authenticated and self.request.user.is_teacher:
            return queryset.filter(
                Q(status='published') |
                Q(instructor=self.request.user)
            )
        return queryset.filter(status='published')


class LessonListView(generics.ListCreateAPIView):
    """View for listing and creating lessons."""

    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrReadOnly]

    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        return Lesson.objects.filter(course_id=course_id)

    def perform_create(self, serializer):
        course_id = self.kwargs.get('course_id')
        course = get_object_or_404(Course, id=course_id)
        # Check if user is the instructor
        if course.instructor != self.request.user and not self.request.user.is_admin:
            raise permissions.PermissionDenied("You can only create lessons for your own courses.")
        serializer.save(course=course)


class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, and deleting lessons."""

    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrReadOnly]

    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        return Lesson.objects.filter(course_id=course_id)

    def perform_update(self, serializer):
        lesson = self.get_object()
        if lesson.course.instructor != self.request.user and not self.request.user.is_admin:
            raise permissions.PermissionDenied("You can only modify lessons in your own courses.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.course.instructor != self.request.user and not self.request.user.is_admin:
            raise permissions.PermissionDenied("You can only delete lessons in your own courses.")
        instance.delete()


class EnrollmentListView(generics.ListCreateAPIView):
    """View for listing and creating enrollments."""

    serializer_class = EnrollmentSerializer

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EnrollmentCreateSerializer
        return EnrollmentSerializer

    def get_queryset(self):
        if self.request.user.is_teacher:
            # Teachers see enrollments in their courses
            return Enrollment.objects.filter(course__instructor=self.request.user)
        elif self.request.user.is_student:
            # Students see their own enrollments
            return Enrollment.objects.filter(student=self.request.user)
        return Enrollment.objects.none()

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsStudentOrInstructor()]

    def perform_create(self, serializer):
        enrollment = serializer.save()
        # Update course enrollment count
        course = enrollment.course
        course.total_enrollments = course.enrollments.filter(status='active').count()
        course.save()


class EnrollmentDetailView(generics.RetrieveUpdateAPIView):
    """View for retrieving and updating enrollments."""

    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsEnrolledOrInstructor]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and hasattr(user, 'is_teacher') and user.is_teacher:
            return Enrollment.objects.filter(course__instructor=user)
        elif user.is_authenticated:
            return Enrollment.objects.filter(student=user)
        return Enrollment.objects.none()


class CourseReviewListView(generics.ListCreateAPIView):
    """View for listing and creating course reviews."""

    serializer_class = CourseReviewSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['course', 'rating']
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CourseReviewCreateSerializer
        return CourseReviewSerializer

    def get_queryset(self):
        queryset = CourseReview.objects.filter(is_approved=True)
        course_id = self.kwargs.get('course_id')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        review = serializer.save()
        # Update course rating statistics
        course = review.course
        reviews = course.reviews.filter(is_approved=True)
        course.average_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
        course.total_ratings = reviews.count()
        course.save()


class CourseMaterialListView(generics.ListCreateAPIView):
    """View for listing and creating course materials."""

    serializer_class = CourseMaterialSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorOrReadOnly]

    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        lesson_id = self.kwargs.get('lesson_id')
        queryset = CourseMaterial.objects.filter(course_id=course_id)
        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
        return queryset

    def perform_create(self, serializer):
        course_id = self.kwargs.get('course_id')
        lesson_id = self.kwargs.get('lesson_id')
        course = get_object_or_404(Course, id=course_id)

        if course.instructor != self.request.user and not self.request.user.is_admin:
            raise permissions.PermissionDenied("You can only add materials to your own courses.")

        lesson = None
        if lesson_id:
            lesson = get_object_or_404(Lesson, id=lesson_id, course=course)

        serializer.save(course=course, lesson=lesson)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_lesson_complete(request, course_id, lesson_id):
    """Mark a lesson as completed for the current user."""

    course = get_object_or_404(Course, id=course_id)
    lesson = get_object_or_404(Lesson, id=lesson_id, course=course)

    try:
        enrollment = Enrollment.objects.get(
            student=request.user,
            course=course,
            status__in=['active', 'completed']
        )
    except Enrollment.DoesNotExist:
        return Response(
            {'error': 'You are not enrolled in this course.'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Add lesson to completed lessons
    enrollment.completed_lessons.add(lesson)

    # Update progress
    total_lessons = course.lessons.count()
    completed_count = enrollment.completed_lessons.count()
    enrollment.progress_percentage = (completed_count / total_lessons) * 100 if total_lessons > 0 else 0

    # Check if course is completed
    if completed_count == total_lessons:
        enrollment.status = 'completed'
        enrollment.completed_at = timezone.now()

    enrollment.save()

    return Response({
        'message': 'Lesson marked as completed.',
        'progress_percentage': enrollment.progress_percentage,
        'is_course_completed': enrollment.status == 'completed'
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def course_stats(request):
    """Get overall course statistics."""

    courses = Course.objects.filter(status='published')
    enrollments = Enrollment.objects.filter(status__in=['active', 'completed'])

    # Calculate statistics
    total_courses = courses.count()
    total_enrollments = enrollments.count()
    total_students = enrollments.values('student').distinct().count()
    average_rating = courses.aggregate(Avg('average_rating'))['average_rating__avg'] or 0

    # Completion rate
    completed_enrollments = enrollments.filter(status='completed').count()
    completion_rate = (completed_enrollments / total_enrollments * 100) if total_enrollments > 0 else 0

    # Popular subjects
    popular_subjects = courses.values('subject__name').annotate(
        course_count=Count('id')
    ).order_by('-course_count')[:5]

    stats_data = {
        'total_courses': total_courses,
        'published_courses': total_courses,
        'total_enrollments': total_enrollments,
        'total_students': total_students,
        'average_rating': round(average_rating, 2),
        'completion_rate': round(completion_rate, 2),
        'popular_subjects': list(popular_subjects),
        'enrollment_trends': []  # Could be populated with time-series data
    }

    serializer = CourseStatsSerializer(data=stats_data)
    serializer.is_valid(raise_exception=True)

    return Response(serializer.validated_data)


def ensure_student_has_id_card(user):
    """
    Ensure a student user has an ID card.
    Creates one if it doesn't exist.
    """
    if user.role != 'student':
        return

    # Check if student already has an ID card
    if hasattr(user, 'id_card') and user.id_card:
        return

    try:
        # Create ID card for the student
        id_card = StudentIDCard.objects.create(
            student=user,
            card_type='standard',
            status='active',
            emergency_contact_name='',
            emergency_contact_phone=user.phone_number or '',
            medical_info='',
            created_by=None,  # System-generated during enrollment
            notes=f'Auto-generated ID card during course enrollment for {user.get_full_name()}'
        )
        print(f"✓ Created ID card {id_card.card_number} for {user.get_full_name()} during enrollment")
    except Exception as e:
        print(f"✗ Failed to create ID card for {user.get_full_name()}: {str(e)}")
        # Log the error but don't prevent enrollment
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to create student ID card for user {user.id} during enrollment: {str(e)}")


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def enroll_in_course(request, course_id):
    """Enroll a student in a course."""

    course = get_object_or_404(Course, id=course_id, status='published')

    # Check if already enrolled
    if Enrollment.objects.filter(student=request.user, course=course).exists():
        return Response(
            {'error': 'You are already enrolled in this course.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check enrollment limit
    if course.enrollment_limit and course.current_enrollments >= course.enrollment_limit:
        return Response(
            {'error': 'This course is full.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Ensure student has an ID card (for students only)
    if request.user.role == 'student':
        ensure_student_has_id_card(request.user)

    # Create enrollment
    enrollment = Enrollment.objects.create(student=request.user, course=course)

    # Update course enrollment count
    course.total_enrollments = course.enrollments.filter(status='active').count()
    course.save()

    serializer = EnrollmentSerializer(enrollment)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
