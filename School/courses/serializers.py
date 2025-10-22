from rest_framework import serializers
from django.utils.text import slugify
from .models import Subject, Course, Lesson, Enrollment, CourseReview, CourseMaterial


class SubjectSerializer(serializers.ModelSerializer):
    """Serializer for Subject model."""

    course_count = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'code', 'description', 'color', 'icon',
            'is_active', 'order', 'course_count'
        ]

    def get_course_count(self, obj):
        return obj.courses.filter(status='published').count()


class CourseListSerializer(serializers.ModelSerializer):
    """Serializer for listing courses."""

    subject_name = serializers.CharField(source='subject.name', read_only=True)
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    current_enrollments = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'subject_name', 'grade_level',
            'instructor_name', 'thumbnail', 'status', 'is_featured', 'price',
            'currency', 'average_rating', 'total_ratings', 'current_enrollments',
            'enrollment_limit', 'duration_weeks', 'created_at', 'is_enrolled'
        ]

    def get_current_enrollments(self, obj):
        return obj.current_enrollments

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.enrollments.filter(
                student=request.user,
                status__in=['active', 'completed']
            ).exists()
        return False


class CourseDetailSerializer(serializers.ModelSerializer):
    """Serializer for course details."""

    subject = SubjectSerializer(read_only=True)
    instructor = serializers.SerializerMethodField()
    lessons = serializers.SerializerMethodField()
    enrollment_stats = serializers.SerializerMethodField()
    user_progress = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'subject', 'grade_level',
            'instructor', 'thumbnail', 'video_intro', 'learning_objectives',
            'prerequisites', 'tags', 'teks_standards', 'status', 'is_featured',
            'enrollment_limit', 'duration_weeks', 'price', 'currency',
            'total_enrollments', 'average_rating', 'total_ratings',
            'created_at', 'updated_at', 'published_at', 'lessons',
            'enrollment_stats', 'user_progress'
        ]

    def get_instructor(self, obj):
        from users.serializers import UserSerializer
        return UserSerializer(obj.instructor).data

    def get_lessons(self, obj):
        lessons = obj.lessons.all()
        return LessonSerializer(lessons, many=True).data

    def get_enrollment_stats(self, obj):
        return {
            'current_enrollments': obj.current_enrollments,
            'available_spots': obj.available_spots,
            'completion_rate': self.calculate_completion_rate(obj)
        }

    def get_user_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                enrollment = obj.enrollments.get(
                    student=request.user,
                    status__in=['active', 'completed']
                )
                return {
                    'enrolled': True,
                    'status': enrollment.status,
                    'progress_percentage': enrollment.progress_percentage,
                    'current_lesson': enrollment.current_lesson.id if enrollment.current_lesson else None,
                    'completed_lessons_count': enrollment.completed_lessons.count(),
                    'total_lessons_count': obj.lessons.count()
                }
            except Enrollment.DoesNotExist:
                return {'enrolled': False}
        return {'enrolled': False}

    def calculate_completion_rate(self, obj):
        """Calculate course completion rate."""
        total_enrollments = obj.enrollments.filter(status__in=['active', 'completed']).count()
        if total_enrollments == 0:
            return 0
        completed_enrollments = obj.enrollments.filter(status='completed').count()
        return round((completed_enrollments / total_enrollments) * 100, 2)


class CourseCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating courses."""

    class Meta:
        model = Course
        fields = [
            'title', 'description', 'subject', 'grade_level', 'thumbnail',
            'video_intro', 'learning_objectives', 'prerequisites', 'tags',
            'teks_standards', 'status', 'is_featured', 'enrollment_limit',
            'duration_weeks', 'price', 'currency'
        ]

    def create(self, validated_data):
        validated_data['instructor'] = self.context['request'].user
        validated_data['slug'] = slugify(validated_data['title'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'title' in validated_data:
            validated_data['slug'] = slugify(validated_data['title'])
        return super().update(instance, validated_data)


class LessonSerializer(serializers.ModelSerializer):
    """Serializer for Lesson model."""

    materials = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'slug', 'description', 'order', 'content_type',
            'video_file', 'video_url', 'duration_minutes', 'content',
            'quiz_data', 'is_preview', 'is_required', 'materials',
            'is_completed', 'created_at', 'updated_at'
        ]

    def get_materials(self, obj):
        materials = obj.materials.all()
        return CourseMaterialSerializer(materials, many=True).data

    def get_is_completed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                enrollment = obj.course.enrollments.get(
                    student=request.user,
                    status__in=['active', 'completed']
                )
                return enrollment.completed_lessons.filter(id=obj.id).exists()
            except Enrollment.DoesNotExist:
                pass
        return False


class EnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for Enrollment model."""

    course_title = serializers.CharField(source='course.title', read_only=True)
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id', 'student', 'student_name', 'course', 'course_title', 'status',
            'progress_percentage', 'current_lesson', 'final_grade',
            'certificate_issued', 'certificate_url', 'enrolled_at',
            'completed_at', 'last_accessed'
        ]
        read_only_fields = ['id', 'enrolled_at', 'last_accessed']


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating enrollments."""

    class Meta:
        model = Enrollment
        fields = ['course']

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)


class CourseReviewSerializer(serializers.ModelSerializer):
    """Serializer for CourseReview model."""

    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = CourseReview
        fields = [
            'id', 'student', 'student_name', 'course', 'course_title',
            'rating', 'review_text', 'is_anonymous', 'is_approved',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CourseReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating course reviews."""

    class Meta:
        model = CourseReview
        fields = ['course', 'rating', 'review_text', 'is_anonymous']

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)


class CourseMaterialSerializer(serializers.ModelSerializer):
    """Serializer for CourseMaterial model."""

    class Meta:
        model = CourseMaterial
        fields = [
            'id', 'title', 'description', 'material_type', 'file', 'url',
            'is_downloadable', 'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CourseStatsSerializer(serializers.Serializer):
    """Serializer for course statistics."""

    total_courses = serializers.IntegerField()
    published_courses = serializers.IntegerField()
    total_enrollments = serializers.IntegerField()
    total_students = serializers.IntegerField()
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    completion_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    popular_subjects = serializers.ListField(child=serializers.DictField())
    enrollment_trends = serializers.ListField(child=serializers.DictField())
