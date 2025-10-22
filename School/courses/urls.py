from django.urls import path
from .views import (
    SubjectListView, CourseListView, CourseDetailView, LessonListView,
    LessonDetailView, EnrollmentListView, EnrollmentDetailView,
    CourseReviewListView, CourseMaterialListView, mark_lesson_complete,
    course_stats, enroll_in_course
)

app_name = 'courses'

urlpatterns = [
    # Subjects
    path('subjects/', SubjectListView.as_view(), name='subject-list'),

    # Courses
    path('', CourseListView.as_view(), name='course-list'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('<int:course_id>/enroll/', enroll_in_course, name='course-enroll'),

    # Lessons
    path('<int:course_id>/lessons/', LessonListView.as_view(), name='lesson-list'),
    path('<int:course_id>/lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
    path('<int:course_id>/lessons/<int:lesson_id>/complete/', mark_lesson_complete, name='lesson-complete'),

    # Enrollments
    path('enrollments/', EnrollmentListView.as_view(), name='enrollment-list'),
    path('enrollments/<int:pk>/', EnrollmentDetailView.as_view(), name='enrollment-detail'),

    # Reviews
    path('reviews/', CourseReviewListView.as_view(), name='review-list'),
    path('<int:course_id>/reviews/', CourseReviewListView.as_view(), name='course-review-list'),

    # Materials
    path('<int:course_id>/materials/', CourseMaterialListView.as_view(), name='material-list'),
    path('<int:course_id>/lessons/<int:lesson_id>/materials/', CourseMaterialListView.as_view(), name='lesson-material-list'),

    # Statistics
    path('stats/', course_stats, name='course-stats'),
]
