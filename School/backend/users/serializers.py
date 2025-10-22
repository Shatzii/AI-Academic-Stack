from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .models import User, UserSession, PasswordResetToken
from .models_student_id import (
    StudentIDCard, AttendanceRecord, AccessPoint,
    AccessLog, IDCardTemplate, NotificationSettings
)
from .models_branding import BrandingConfiguration, BrandingPreset


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""

    password = serializers.CharField(write_only=True, required=False)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name', 'role',
            'phone_number', 'date_of_birth', 'profile_picture', 'bio',
            'is_email_verified', 'theme_preference', 'language_preference',
            'timezone', 'created_at', 'updated_at', 'password'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_email_verified']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def get_full_name(self, obj):
        return obj.get_full_name()

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    create_student_id = serializers.BooleanField(default=True, write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'role', 'password', 'password_confirm',
            'phone_number', 'date_of_birth', 'create_student_id'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(_("Passwords don't match."))
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        create_id = validated_data.pop('create_student_id', True)
        password = validated_data.pop('password')
        user = super().create(validated_data)
        user.set_password(password)
        user.save()

        # If this is a student and create_student_id is True, the signal will handle it
        # The signal is already set up in users/signals.py

        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""

    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                              username=email, password=password)
            if not user:
                raise serializers.ValidationError(_('Unable to log in with provided credentials.'))
            if not user.is_active:
                raise serializers.ValidationError(_('User account is disabled.'))
        else:
            raise serializers.ValidationError(_('Must include email and password.'))

        attrs['user'] = user
        return attrs


class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset request."""

    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(_("User with this email does not exist."))
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation."""

    token = serializers.CharField()
    password = serializers.CharField(min_length=8)
    password_confirm = serializers.CharField()

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(_("Passwords don't match."))
        return attrs


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone_number', 'date_of_birth',
            'profile_picture', 'bio', 'theme_preference', 'language_preference',
            'timezone'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password."""

    old_password = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    new_password_confirm = serializers.CharField()

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError(_("New passwords don't match."))
        return attrs


class UserSessionSerializer(serializers.ModelSerializer):
    """Serializer for UserSession model."""

    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = UserSession
        ref_name = 'UsersUserSession'
        fields = [
            'id', 'user_email', 'ip_address', 'user_agent', 'device_type',
            'browser', 'os', 'location', 'login_time', 'logout_time', 'is_active'
        ]
        read_only_fields = ['id', 'login_time', 'logout_time']


# Student ID System Serializers

class StudentIDCardSerializer(serializers.ModelSerializer):
    """Serializer for Student ID Card."""

    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    student_role = serializers.CharField(source='student.role', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    can_access_building = serializers.BooleanField(read_only=True)

    class Meta:
        model = StudentIDCard
        fields = [
            'id', 'student', 'student_name', 'student_email', 'student_role',
            'card_number', 'card_type', 'status', 'issued_date', 'expiry_date',
            'last_used', 'rfid_uid', 'nfc_data', 'barcode_data',
            'qr_code', 'barcode_image', 'card_image',
            'access_level', 'allowed_times',
            'emergency_contact_name', 'emergency_contact_phone', 'medical_info',
            'created_by', 'notes', 'is_active', 'is_expired', 'can_access_building'
        ]
        read_only_fields = ['card_number', 'issued_date', 'qr_code', 'barcode_image', 'card_image']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class AttendanceRecordSerializer(serializers.ModelSerializer):
    """Serializer for Attendance Record."""

    student_name = serializers.CharField(source='student.get_full_name', read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'student', 'student_name', 'id_card', 'attendance_type',
            'timestamp', 'location', 'device_id', 'classroom_id',
            'course_id', 'rfid_uid', 'nfc_data',
            'ip_address', 'user_agent', 'is_valid', 'notes'
        ]
        read_only_fields = ['timestamp']


class AccessPointSerializer(serializers.ModelSerializer):
    """Serializer for Access Point."""

    class Meta:
        model = AccessPoint
        fields = [
            'id', 'name', 'location', 'access_point_type', 'device_id',
            'ip_address', 'mac_address', 'allowed_roles', 'allowed_card_types',
            'time_restrictions', 'is_active', 'last_ping', 'firmware_version',
            'emergency_override', 'emergency_message'
        ]


class AccessLogSerializer(serializers.ModelSerializer):
    """Serializer for Access Log."""

    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    access_point_name = serializers.CharField(source='access_point.name', read_only=True)
    id_card_number = serializers.CharField(source='id_card.card_number', read_only=True)

    class Meta:
        model = AccessLog
        fields = [
            'id', 'user', 'user_name', 'id_card', 'id_card_number',
            'access_point', 'access_point_name', 'timestamp', 'result',
            'reason', 'rfid_uid', 'nfc_data', 'device_fingerprint'
        ]
        read_only_fields = ['timestamp']


class IDCardTemplateSerializer(serializers.ModelSerializer):
    """Serializer for ID Card Template."""

    class Meta:
        model = IDCardTemplate
        fields = [
            'id', 'name', 'description', 'background_color', 'text_color',
            'accent_color', 'layout_config', 'background_image', 'logo_image',
            'title_font', 'body_font', 'is_active', 'is_default'
        ]


class NotificationSettingsSerializer(serializers.ModelSerializer):
    """Serializer for Notification Settings."""

    class Meta:
        model = NotificationSettings
        fields = [
            'id', 'user', 'notification_type', 'late_arrival', 'early_departure',
            'missed_class', 'access_denied', 'card_lost_stolen',
            'quiet_hours_start', 'quiet_hours_end', 'email_address',
            'phone_number', 'webhook_url', 'is_active'
        ]


class StudentIDCardCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Student ID Cards."""

    class Meta:
        model = StudentIDCard
        fields = [
            'student', 'card_type', 'expiry_date', 'rfid_uid', 'nfc_data',
            'access_level', 'allowed_times', 'emergency_contact_name',
            'emergency_contact_phone', 'medical_info', 'notes'
        ]

    def validate_student(self, value):
        """Ensure student doesn't already have an active ID card."""
        if hasattr(value, 'id_card') and value.id_card and value.id_card.status == 'active':
            raise serializers.ValidationError("Student already has an active ID card.")
        return value

    def validate_expiry_date(self, value):
        """Ensure expiry date is in the future."""
        if value and value <= timezone.now().date():
            raise serializers.ValidationError("Expiry date must be in the future.")
        return value


class AttendanceCheckSerializer(serializers.Serializer):
    """Serializer for attendance check requests."""

    card_number = serializers.CharField(max_length=20)
    rfid_uid = serializers.CharField(max_length=50, required=False)
    nfc_data = serializers.CharField(required=False)
    attendance_type = serializers.ChoiceField(
        choices=[
            ('check_in', 'Check In'),
            ('check_out', 'Check Out'),
            ('class_entry', 'Class Entry'),
            ('class_exit', 'Class Exit'),
            ('building_entry', 'Building Entry'),
            ('building_exit', 'Building Exit'),
        ],
        default='check_in'
    )
    location = serializers.CharField(max_length=100, required=False)
    classroom_id = serializers.IntegerField(required=False)
    course_id = serializers.IntegerField(required=False)


class AccessControlSerializer(serializers.Serializer):
    """Serializer for access control requests."""

    card_number = serializers.CharField(max_length=20)
    rfid_uid = serializers.CharField(max_length=50, required=False)
    nfc_data = serializers.CharField(required=False)
    access_point_id = serializers.IntegerField()
    device_fingerprint = serializers.CharField(max_length=100, required=False)


class BulkAttendanceSerializer(serializers.Serializer):
    """Serializer for bulk attendance operations."""

    attendance_records = AttendanceCheckSerializer(many=True)
    classroom_id = serializers.IntegerField(required=False)
    course_id = serializers.IntegerField(required=False)


class AttendanceReportSerializer(serializers.Serializer):
    """Serializer for attendance reports."""

    start_date = serializers.DateField()
    end_date = serializers.DateField()
    student_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )
    classroom_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )
    course_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )
    attendance_types = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    report_format = serializers.ChoiceField(
        choices=['json', 'csv', 'pdf'],
        default='json'
    )


# Branding Serializers
class BrandingConfigurationSerializer(serializers.ModelSerializer):
    """Serializer for branding configuration."""

    logo_url = serializers.SerializerMethodField()
    small_logo_url = serializers.SerializerMethodField()
    favicon_url = serializers.SerializerMethodField()
    css_variables = serializers.SerializerMethodField()

    class Meta:
        model = BrandingConfiguration
        fields = [
            'id', 'school_name', 'school_tagline',
            'logo', 'logo_url', 'logo_small', 'small_logo_url',
            'favicon', 'favicon_url',
            'primary_color', 'secondary_color', 'accent_color',
            'background_color', 'text_color',
            'primary_font', 'heading_font',
            'support_email', 'support_phone', 'website_url',
            'facebook_url', 'twitter_url', 'linkedin_url', 'instagram_url',
            'footer_text', 'custom_css', 'css_variables',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['logo_url', 'small_logo_url', 'favicon_url', 'css_variables']

    def get_logo_url(self, obj):
        return obj.get_logo_url()

    def get_small_logo_url(self, obj):
        return obj.get_small_logo_url()

    def get_favicon_url(self, obj):
        return obj.get_favicon_url()

    def get_css_variables(self, obj):
        return obj.css_variables


class BrandingPresetSerializer(serializers.ModelSerializer):
    """Serializer for branding presets."""

    class Meta:
        model = BrandingPreset
        fields = [
            'id', 'name', 'description',
            'primary_color', 'secondary_color', 'accent_color',
            'background_color', 'text_color',
            'primary_font', 'heading_font',
            'is_default'
        ]
