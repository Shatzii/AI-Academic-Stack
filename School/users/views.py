from rest_framework import generics, status, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django.http import HttpResponse
import csv
import json
from datetime import datetime, timedelta

# Optional PDF generation (install reportlab for PDF reports)
try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    from io import BytesIO
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False

from .models import User, UserSession, PasswordResetToken
from .models_student_id import (
    StudentIDCard, AttendanceRecord, AccessPoint,
    AccessLog, IDCardTemplate, NotificationSettings
)
from .models_branding import BrandingConfiguration, BrandingPreset
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    PasswordResetSerializer, PasswordResetConfirmSerializer,
    UserProfileUpdateSerializer, ChangePasswordSerializer, UserSessionSerializer,
    StudentIDCardSerializer, AttendanceRecordSerializer,
    AccessPointSerializer, AccessLogSerializer,
    IDCardTemplateSerializer, NotificationSettingsSerializer,
    StudentIDCardCreateSerializer, AttendanceCheckSerializer,
    AccessControlSerializer, BulkAttendanceSerializer,
    AttendanceReportSerializer, BrandingConfigurationSerializer, BrandingPresetSerializer
)


# Student ID System ViewSets

class StudentIDCardViewSet(viewsets.ModelViewSet):
    """ViewSet for Student ID Cards."""

    queryset = StudentIDCard.objects.all()
    serializer_class = StudentIDCardSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = StudentIDCard.objects.select_related('student', 'created_by')

        # Filter by user role
        user = self.request.user
        if user.is_authenticated:
            if hasattr(user, 'role') and user.role == 'student':
                return queryset.filter(student=user)
            elif hasattr(user, 'role') and user.role == 'teacher':
                # Teachers can see cards for students in their classes
                return queryset.filter(
                    student__enrollments__course__instructor=user
                ).distinct()
        # Admins can see all, anonymous users see nothing

        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return StudentIDCardCreateSerializer
        return StudentIDCardSerializer

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate an ID card."""
        card = self.get_object()
        card.status = 'inactive'
        card.save()

        serializer = self.get_serializer(card)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def report_lost(self, request, pk=None):
        """Report card as lost/stolen."""
        card = self.get_object()
        card.status = 'lost'
        card.save()

        serializer = self.get_serializer(card)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def regenerate_assets(self, request, pk=None):
        """Regenerate QR code, barcode, and card image."""
        card = self.get_object()

        # Clear existing assets
        if card.qr_code:
            card.qr_code.delete()
        if card.barcode_image:
            card.barcode_image.delete()
        if card.card_image:
            card.card_image.delete()

        # Regenerate
        card.save()  # This will trigger the generation methods

        serializer = self.get_serializer(card)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_card(self, request):
        """Get current user's ID card."""
        try:
            card = StudentIDCard.objects.get(student=request.user, status='active')
            serializer = self.get_serializer(card)
            return Response(serializer.data)
        except StudentIDCard.DoesNotExist:
            return Response(
                {'error': 'No active ID card found'},
                status=status.HTTP_404_NOT_FOUND
            )


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    """ViewSet for Attendance Records."""

    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = AttendanceRecord.objects.select_related(
            'student', 'id_card', 'classroom', 'course'
        )

        # Filter by user role
        user = self.request.user
        if user.is_authenticated:
            if hasattr(user, 'role') and user.role == 'student':
                return queryset.filter(student=user)
            elif hasattr(user, 'role') and user.role == 'teacher':
                return queryset.filter(
                    Q(classroom__instructor=user) |
                    Q(course__instructor=user)
                ).distinct()

        return queryset

    @action(detail=False, methods=['post'])
    def check_attendance(self, request):
        """Record attendance check-in/check-out."""
        serializer = AttendanceCheckSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Find student by card number
        try:
            card = StudentIDCard.objects.get(
                card_number=serializer.validated_data['card_number'],
                status='active'
            )
            student = card.student
        except StudentIDCard.DoesNotExist:
            return Response(
                {'error': 'Invalid or inactive card'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create attendance record
        attendance_data = {
            'student': student,
            'id_card': card,
            'attendance_type': serializer.validated_data['attendance_type'],
            'location': serializer.validated_data.get('location', ''),
            'rfid_uid': serializer.validated_data.get('rfid_uid', ''),
            'nfc_data': serializer.validated_data.get('nfc_data', ''),
            'ip_address': request.META.get('REMOTE_ADDR'),
            'user_agent': request.META.get('HTTP_USER_AGENT'),
        }

        # Add classroom/course if provided
        if 'classroom_id' in serializer.validated_data:
            attendance_data['classroom_id'] = serializer.validated_data['classroom_id']
        if 'course_id' in serializer.validated_data:
            attendance_data['course_id'] = serializer.validated_data['course_id']

        attendance = AttendanceRecord.objects.create(**attendance_data)

        # Update card's last_used timestamp
        card.last_used = timezone.now()
        card.save()

        response_serializer = self.get_serializer(attendance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def access_control(request):
    """Handle access control requests from physical devices."""
    serializer = AccessControlSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Find card
        card = StudentIDCard.objects.get(
            card_number=serializer.validated_data['card_number'],
            status='active'
        )
        user = card.student

        # Find access point
        access_point = AccessPoint.objects.get(
            id=serializer.validated_data['access_point_id'],
            is_active=True
        )

        # Check access permissions
        if access_point.can_access(user, card):
            result = 'granted'
            reason = 'Access granted'
        else:
            result = 'denied'
            reason = 'Access denied - insufficient permissions'

        # Create access log
        AccessLog.objects.create(
            user=user,
            id_card=card,
            access_point=access_point,
            result=result,
            reason=reason,
            rfid_uid=serializer.validated_data.get('rfid_uid', ''),
            nfc_data=serializer.validated_data.get('nfc_data', ''),
            device_fingerprint=serializer.validated_data.get('device_fingerprint', '')
        )

        return Response({
            'result': result,
            'reason': reason,
            'user_name': user.get_full_name(),
            'card_number': card.card_number,
            'access_point': access_point.name
        })

    except StudentIDCard.DoesNotExist:
        return Response({
            'result': 'denied',
            'reason': 'Invalid card'
        }, status=status.HTTP_403_FORBIDDEN)

    except AccessPoint.DoesNotExist:
        return Response({
            'result': 'error',
            'reason': 'Invalid access point'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def attendance_stats(request):
    """Get attendance statistics."""
    # Date range (default to current month)
    end_date = timezone.now().date()
    start_date = end_date.replace(day=1)

    if 'start_date' in request.query_params:
        start_date = datetime.strptime(request.query_params['start_date'], '%Y-%m-%d').date()
    if 'end_date' in request.query_params:
        end_date = datetime.strptime(request.query_params['end_date'], '%Y-%m-%d').date()

    # Basic stats
    total_records = AttendanceRecord.objects.filter(
        timestamp__date__range=[start_date, end_date]
    ).count()

    valid_records = AttendanceRecord.objects.filter(
        timestamp__date__range=[start_date, end_date],
        is_valid=True
    ).count()

    return Response({
        'period': {
            'start_date': start_date,
            'end_date': end_date
        },
        'summary': {
            'total_records': total_records,
            'valid_records': valid_records,
            'invalid_records': total_records - valid_records,
            'validity_rate': (valid_records / total_records * 100) if total_records > 0 else 0
        }
    })
class UserRegistrationView(generics.CreateAPIView):
    """View for user registration."""

    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully.'
        }, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    """View for user login."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Create user session
        UserSession.objects.create(
            user=user,
            session_key=request.session.session_key or '',
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            device_type=self.get_device_type(request),
            browser=self.get_browser_info(request),
        )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Login successful.'
        })

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def get_device_type(self, request):
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        if 'mobile' in user_agent or 'android' in user_agent or 'iphone' in user_agent:
            return 'mobile'
        elif 'tablet' in user_agent or 'ipad' in user_agent:
            return 'tablet'
        else:
            return 'desktop'

    def get_browser_info(self, request):
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        if 'chrome' in user_agent:
            return 'Chrome'
        elif 'firefox' in user_agent:
            return 'Firefox'
        elif 'safari' in user_agent:
            return 'Safari'
        elif 'edge' in user_agent:
            return 'Edge'
        else:
            return 'Unknown'


class UserProfileView(generics.RetrieveUpdateAPIView):
    """View for retrieving and updating user profile."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserProfileUpdateView(generics.UpdateAPIView):
    """View for updating user profile information."""

    serializer_class = UserProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """View for changing user password."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'error': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({'message': 'Password changed successfully.'})


class PasswordResetView(APIView):
    """View for requesting password reset."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        user = User.objects.get(email=email)

        # Generate reset token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Save token to database
        expires_at = timezone.now() + timezone.timedelta(hours=24)
        PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )

        # Send reset email
        reset_url = f"{request.scheme}://{request.get_host()}/reset-password/{uid}/{token}/"
        subject = 'Password Reset Request'
        message = render_to_string('password_reset_email.html', {
            'user': user,
            'reset_url': reset_url,
        })

        send_mail(subject, message, 'noreply@openedtex.org', [email])

        return Response({'message': 'Password reset email sent.'})


class PasswordResetConfirmView(APIView):
    """View for confirming password reset."""

    permission_classes = [permissions.AllowAny]

    def post(self, request, uidb64, token):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {'error': 'Invalid reset link.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {'error': 'Invalid or expired reset token.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data['password'])
        user.save()

        # Mark token as used
        PasswordResetToken.objects.filter(
            user=user,
            token=token,
            is_used=False
        ).update(is_used=True)

        return Response({'message': 'Password reset successfully.'})


class UserSessionsView(generics.ListAPIView):
    """View for listing user sessions."""

    serializer_class = UserSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSession.objects.filter(user=self.request.user)


class LogoutView(APIView):
    """View for user logout."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Update user session
        if hasattr(request, 'session') and request.session.session_key:
            UserSession.objects.filter(
                user=request.user,
                session_key=request.session.session_key,
                is_active=True
            ).update(
                logout_time=timezone.now(),
                is_active=False
            )

        return Response({'message': 'Logout successful.'})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request):
    """Get user statistics."""
    user = request.user
    sessions_count = UserSession.objects.filter(user=user).count()
    active_sessions = UserSession.objects.filter(user=user, is_active=True).count()

    return Response({
        'total_sessions': sessions_count,
        'active_sessions': active_sessions,
        'account_created': user.created_at,
        'last_login': user.last_login,
    })


@api_view(['POST'])
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_student_enrollment(request):
    """
    Bulk enroll multiple students and ensure they all have ID cards.
    Expects a list of student data.
    """
    if not request.user.is_staff and not request.user.is_admin:
        return Response(
            {'error': 'Only administrators can perform bulk enrollment.'},
            status=status.HTTP_403_FORBIDDEN
        )

    student_data = request.data.get('students', [])
    if not student_data:
        return Response(
            {'error': 'No student data provided.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    results = {
        'successful': [],
        'failed': [],
        'total_processed': len(student_data)
    }

    for student_info in student_data:
        try:
            # Create or get user
            email = student_info.get('email')
            if not email:
                results['failed'].append({
                    'data': student_info,
                    'error': 'Email is required'
                })
                continue

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': student_info.get('first_name', ''),
                    'last_name': student_info.get('last_name', ''),
                    'role': 'student',
                    'phone_number': student_info.get('phone_number', ''),
                    'date_of_birth': student_info.get('date_of_birth'),
                }
            )

            if created:
                # Set a default password if not provided
                password = student_info.get('password', 'changeme123')
                user.set_password(password)
                user.save()

                results['successful'].append({
                    'user_id': user.id,
                    'email': user.email,
                    'name': user.get_full_name(),
                    'created': True,
                    'id_card_created': hasattr(user, 'id_card') and user.id_card is not None
                })
            else:
                results['successful'].append({
                    'user_id': user.id,
                    'email': user.email,
                    'name': user.get_full_name(),
                    'created': False,
                    'id_card_exists': hasattr(user, 'id_card') and user.id_card is not None
                })

        except Exception as e:
            results['failed'].append({
                'data': student_info,
                'error': str(e)
            })

    results['summary'] = {
        'successful_count': len(results['successful']),
        'failed_count': len(results['failed']),
        'id_cards_created': sum(1 for s in results['successful'] if s.get('id_card_created', False))
    }

    return Response(results, status=status.HTTP_200_OK)


# Branding Views
class BrandingConfigurationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing branding configuration."""

    queryset = BrandingConfiguration.objects.all()
    serializer_class = BrandingConfigurationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return only active branding configurations for non-admin users."""
        user = self.request.user
        if user.is_authenticated and (user.is_staff or (hasattr(user, 'role') and user.role == 'admin')):
            return BrandingConfiguration.objects.all()
        return BrandingConfiguration.objects.filter(is_active=True)

    def get_permissions(self):
        """Allow read access to all authenticated users, write access to admins only."""
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    @action(detail=True, methods=['post'])
    def apply_preset(self, request, pk=None):
        """Apply a branding preset to the current configuration."""
        branding = self.get_object()
        preset_id = request.data.get('preset_id')

        try:
            preset = BrandingPreset.objects.get(id=preset_id)
            preset.apply_to_branding(branding)
            serializer = self.get_serializer(branding)
            return Response(serializer.data)
        except BrandingPreset.DoesNotExist:
            return Response(
                {'error': 'Preset not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get the active branding configuration."""
        try:
            branding = BrandingConfiguration.objects.get(is_active=True)
            serializer = self.get_serializer(branding)
            return Response(serializer.data)
        except BrandingConfiguration.DoesNotExist:
            return Response(
                {'error': 'No active branding configuration found'},
                status=status.HTTP_404_NOT_FOUND
            )


class BrandingPresetViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing branding presets."""

    queryset = BrandingPreset.objects.all()
    serializer_class = BrandingPresetSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        """Apply a preset to create a new branding configuration."""
        preset = self.get_object()

        # Create new branding configuration from preset
        branding = BrandingConfiguration.objects.create(
            school_name=f"{preset.name} School",
            primary_color=preset.primary_color,
            secondary_color=preset.secondary_color,
            accent_color=preset.accent_color,
            background_color=preset.background_color,
            text_color=preset.text_color,
            primary_font=preset.primary_font,
            heading_font=preset.heading_font
        )

        serializer = BrandingConfigurationSerializer(branding)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def branding_config(request):
    """Get the active branding configuration for public access."""
    try:
        branding = BrandingConfiguration.objects.get(is_active=True)
        serializer = BrandingConfigurationSerializer(branding)
        return Response(serializer.data)
    except BrandingConfiguration.DoesNotExist:
        # Return default branding if no active configuration exists
        return Response({
            'school_name': 'OpenEdTex University',
            'school_tagline': 'Empowering Education Through Technology',
            'primary_color': '#007bff',
            'secondary_color': '#6c757d',
            'accent_color': '#28a745',
            'background_color': '#ffffff',
            'text_color': '#212529',
            'primary_font': "'Inter', sans-serif",
            'heading_font': "'Inter', sans-serif",
            'support_email': 'support@openedtex.edu',
            'website_url': 'https://openedtex.edu',
            'footer_text': '© 2025 OpenEdTex University. All rights reserved.',
            'logo_url': '/static/images/default-logo.png',
            'small_logo_url': '/static/images/default-logo-small.png',
            'favicon_url': '/static/favicon.ico',
            'css_variables': '''
            :root {
                --brand-primary: #007bff;
                --brand-secondary: #6c757d;
                --brand-accent: #28a745;
                --brand-background: #ffffff;
                --brand-text: #212529;
                --brand-primary-font: 'Inter', sans-serif;
                --brand-heading-font: 'Inter', sans-serif;
            }
            '''
        })
