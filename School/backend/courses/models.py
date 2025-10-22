from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator


class Subject(models.Model):
    """Model for academic subjects."""

    name = models.CharField(_('name'), max_length=100, unique=True)
    code = models.CharField(_('code'), max_length=10, unique=True)
    description = models.TextField(_('description'), blank=True)
    color = models.CharField(_('color'), max_length=7, default='#007bff')  # Hex color
    icon = models.CharField(_('icon'), max_length=50, blank=True)
    is_active = models.BooleanField(_('is active'), default=True)
    order = models.PositiveIntegerField(_('order'), default=0)

    class Meta:
        verbose_name = _('subject')
        verbose_name_plural = _('subjects')
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Course(models.Model):
    """Model for courses."""

    GRADE_LEVEL_CHOICES = [
        ('K', 'Kindergarten'),
        ('1', '1st Grade'),
        ('2', '2nd Grade'),
        ('3', '3rd Grade'),
        ('4', '4th Grade'),
        ('5', '5th Grade'),
        ('6', '6th Grade'),
        ('7', '7th Grade'),
        ('8', '8th Grade'),
        ('9', '9th Grade'),
        ('10', '10th Grade'),
        ('11', '11th Grade'),
        ('12', '12th Grade'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(_('title'), max_length=255)
    slug = models.SlugField(_('slug'), unique=True, max_length=255)
    description = models.TextField(_('description'))
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='courses')
    grade_level = models.CharField(_('grade level'), max_length=2, choices=GRADE_LEVEL_CHOICES)
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='courses_taught'
    )

    # Content
    thumbnail = models.ImageField(_('thumbnail'), upload_to='course_thumbnails/', blank=True)
    video_intro = models.FileField(_('intro video'), upload_to='course_videos/', blank=True)
    learning_objectives = models.JSONField(_('learning objectives'), default=list)
    prerequisites = models.JSONField(_('prerequisites'), default=list)
    tags = models.JSONField(_('tags'), default=list)

    # TEKS alignment (Texas Essential Knowledge and Skills)
    teks_standards = models.JSONField(_('TEKS standards'), default=dict)

    # Settings
    status = models.CharField(_('status'), max_length=20, choices=STATUS_CHOICES, default='draft')
    is_featured = models.BooleanField(_('is featured'), default=False)
    enrollment_limit = models.PositiveIntegerField(_('enrollment limit'), blank=True, null=True)
    duration_weeks = models.PositiveIntegerField(_('duration (weeks)'), default=8)

    # Pricing
    price = models.DecimalField(_('price'), max_digits=8, decimal_places=2, default=0.00)
    currency = models.CharField(_('currency'), max_length=3, default='USD')

    # Statistics
    total_enrollments = models.PositiveIntegerField(_('total enrollments'), default=0)
    average_rating = models.DecimalField(
        _('average rating'),
        max_digits=3,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    total_ratings = models.PositiveIntegerField(_('total ratings'), default=0)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    published_at = models.DateTimeField(_('published at'), blank=True, null=True)

    class Meta:
        verbose_name = _('course')
        verbose_name_plural = _('courses')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.grade_level})"

    @property
    def is_published(self):
        return self.status == 'published'

    @property
    def current_enrollments(self):
        return self.enrollments.filter(status='active').count()

    @property
    def available_spots(self):
        if self.enrollment_limit:
            return max(0, self.enrollment_limit - self.current_enrollments)
        return None


class Lesson(models.Model):
    """Model for course lessons."""

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(_('title'), max_length=255)
    slug = models.SlugField(_('slug'), max_length=255)
    description = models.TextField(_('description'), blank=True)
    order = models.PositiveIntegerField(_('order'))

    # Content
    content_type = models.CharField(
        _('content type'),
        max_length=20,
        choices=[
            ('video', 'Video'),
            ('text', 'Text'),
            ('quiz', 'Quiz'),
            ('assignment', 'Assignment'),
            ('discussion', 'Discussion'),
        ],
        default='text'
    )

    # Video content
    video_file = models.FileField(_('video file'), upload_to='lesson_videos/', blank=True)
    video_url = models.URLField(_('video URL'), blank=True)
    duration_minutes = models.PositiveIntegerField(_('duration (minutes)'), blank=True, null=True)

    # Text content
    content = models.TextField(_('content'), blank=True)

    # Quiz content
    quiz_data = models.JSONField(_('quiz data'), default=dict)

    # Settings
    is_preview = models.BooleanField(_('is preview'), default=False)
    is_required = models.BooleanField(_('is required'), default=True)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('lesson')
        verbose_name_plural = _('lessons')
        ordering = ['course', 'order']
        unique_together = ['course', 'order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Enrollment(models.Model):
    """Model for course enrollments."""

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('dropped', 'Dropped'),
        ('suspended', 'Suspended'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    status = models.CharField(_('status'), max_length=20, choices=STATUS_CHOICES, default='active')

    # Progress
    progress_percentage = models.DecimalField(
        _('progress percentage'),
        max_digits=5,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    current_lesson = models.ForeignKey(
        Lesson,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='current_for_enrollments'
    )
    completed_lessons = models.ManyToManyField(Lesson, related_name='completed_by', blank=True)

    # Grades and certificates
    final_grade = models.DecimalField(
        _('final grade'),
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    certificate_issued = models.BooleanField(_('certificate issued'), default=False)
    certificate_url = models.URLField(_('certificate URL'), blank=True)

    # Timestamps
    enrolled_at = models.DateTimeField(_('enrolled at'), auto_now_add=True)
    completed_at = models.DateTimeField(_('completed at'), blank=True, null=True)
    last_accessed = models.DateTimeField(_('last accessed'), auto_now=True)

    class Meta:
        verbose_name = _('enrollment')
        verbose_name_plural = _('enrollments')
        ordering = ['-enrolled_at']
        unique_together = ['student', 'course']

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.course.title}"

    @property
    def is_completed(self):
        return self.status == 'completed'

    @property
    def days_enrolled(self):
        from django.utils import timezone
        return (timezone.now().date() - self.enrolled_at.date()).days


class CourseReview(models.Model):
    """Model for course reviews and ratings."""

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='course_reviews'
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField(
        _('rating'),
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review_text = models.TextField(_('review text'), blank=True)
    is_anonymous = models.BooleanField(_('is anonymous'), default=False)

    # Moderation
    is_approved = models.BooleanField(_('is approved'), default=True)
    moderated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='moderated_reviews'
    )

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('course review')
        verbose_name_plural = _('course reviews')
        ordering = ['-created_at']
        unique_together = ['student', 'course']

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.course.title} ({self.rating}★)"


class CourseMaterial(models.Model):
    """Model for course materials and resources."""

    MATERIAL_TYPE_CHOICES = [
        ('document', 'Document'),
        ('presentation', 'Presentation'),
        ('spreadsheet', 'Spreadsheet'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('link', 'External Link'),
        ('other', 'Other'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='materials')
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='materials',
        blank=True,
        null=True
    )

    title = models.CharField(_('title'), max_length=255)
    description = models.TextField(_('description'), blank=True)
    material_type = models.CharField(_('type'), max_length=20, choices=MATERIAL_TYPE_CHOICES)
    file = models.FileField(_('file'), upload_to='course_materials/', blank=True)
    url = models.URLField(_('URL'), blank=True)
    is_downloadable = models.BooleanField(_('is downloadable'), default=True)
    order = models.PositiveIntegerField(_('order'), default=0)

    # Timestamps
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('course material')
        verbose_name_plural = _('course materials')
        ordering = ['course', 'lesson', 'order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"
