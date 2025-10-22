from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
import uuid
import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from PIL import Image, ImageDraw, ImageFont
import barcode
from barcode.writer import ImageWriter
import os
import logging

logger = logging.getLogger(__name__)


class StudentIDCard(models.Model):
    """Student ID card model with multiple format support."""

    CARD_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('lost', 'Lost'),
        ('stolen', 'Stolen'),
        ('expired', 'Expired'),
    ]

    CARD_TYPE_CHOICES = [
        ('standard', 'Standard Student'),
        ('staff', 'Staff/Faculty'),
        ('visitor', 'Visitor'),
        ('temporary', 'Temporary'),
    ]

    # Basic Information
    student = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='id_card'
    )
    card_number = models.CharField(
        max_length=20,
        unique=True,
        help_text="Unique card identifier"
    )
    card_type = models.CharField(
        max_length=20,
        choices=CARD_TYPE_CHOICES,
        default='standard'
    )

    # Card Status
    status = models.CharField(
        max_length=20,
        choices=CARD_STATUS_CHOICES,
        default='active'
    )
    issued_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateField(blank=True, null=True)
    last_used = models.DateTimeField(blank=True, null=True)

    # Physical Card Features
    rfid_uid = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        unique=True,
        help_text="RFID chip unique identifier"
    )
    nfc_data = models.TextField(
        blank=True,
        null=True,
        help_text="NFC data payload"
    )
    barcode_data = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Barcode data"
    )

    # Digital Assets
    qr_code = models.ImageField(
        upload_to='id_cards/qr_codes/',
        blank=True,
        null=True
    )
    barcode_image = models.ImageField(
        upload_to='id_cards/barcodes/',
        blank=True,
        null=True
    )
    card_image = models.ImageField(
        upload_to='id_cards/generated/',
        blank=True,
        null=True
    )

    # Access Control
    access_level = models.JSONField(
        default=dict,
        help_text="Access permissions for different areas"
    )
    allowed_times = models.JSONField(
        default=dict,
        help_text="Time restrictions for access"
    )

    # Emergency Contact
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    medical_info = models.TextField(blank=True, help_text="Medical conditions/allergies")

    # Metadata
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_cards'
    )
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-issued_date']
        indexes = [
            models.Index(fields=['card_number']),
            models.Index(fields=['rfid_uid']),
            models.Index(fields=['status']),
            models.Index(fields=['card_type']),
        ]

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.card_number}"

    def save(self, *args, **kwargs):
        if not self.card_number:
            self.card_number = self.generate_card_number()

        # Generate QR code if not exists
        if not self.qr_code:
            self.generate_qr_code()

        # Generate barcode if not exists
        if not self.barcode_image:
            self.generate_barcode()

        # Generate card image if not exists
        if not self.card_image:
            self.generate_card_image()

        super().save(*args, **kwargs)

    def generate_card_number(self):
        """Generate unique card number."""
        while True:
            card_num = f"STU{uuid.uuid4().hex[:8].upper()}"
            if not StudentIDCard.objects.filter(card_number=card_num).exists():
                return card_num

    def generate_qr_code(self):
        """Generate QR code containing card data."""
        qr_data = f"OpenEdTex:{self.card_number}:{self.student.id}"
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(qr_data)
        qr.make(fit=True)

        img = qr.make_image(fill='black', back_color='white')
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)

        self.qr_code.save(f'qr_{self.card_number}.png', ContentFile(buffer.getvalue()), save=False)

    def generate_barcode(self):
        """Generate barcode image."""
        code128 = barcode.get('code128', self.card_number, writer=ImageWriter())
        buffer = BytesIO()
        code128.write(buffer)
        buffer.seek(0)

        self.barcode_image.save(f'barcode_{self.card_number}.png', ContentFile(buffer.getvalue()), save=False)

    def generate_card_image(self):
        """Generate physical ID card image."""
        # Create base image
        width, height = 600, 400
        img = Image.new('RGB', (width, height), color='#ffffff')
        draw = ImageDraw.Draw(img)

        try:
            # Try to load a font, fallback to default if not available
            font_large = ImageFont.truetype("arial.ttf", 24)
            font_medium = ImageFont.truetype("arial.ttf", 18)
            font_small = ImageFont.truetype("arial.ttf", 12)
        except:
            font_large = ImageFont.load_default()
            font_medium = ImageFont.load_default()
            font_small = ImageFont.load_default()

        # Draw border
        draw.rectangle([10, 10, width-10, height-10], outline='#000000', width=2)

        # Add school logo/header
        draw.text((30, 30), "OpenEdTex University", fill='#000000', font=font_large)

        # Add student photo placeholder
        draw.rectangle([30, 80, 180, 230], outline='#000000', fill='#f0f0f0')
        draw.text((60, 140), "Photo", fill='#666666', font=font_medium)

        # Add student information
        y_pos = 80
        draw.text((200, y_pos), f"Name: {self.student.get_full_name()}", fill='#000000', font=font_medium)
        draw.text((200, y_pos + 30), f"ID: {self.card_number}", fill='#000000', font=font_medium)
        draw.text((200, y_pos + 60), f"Type: {self.get_card_type_display()}", fill='#000000', font=font_medium)
        draw.text((200, y_pos + 90), f"Issued: {self.issued_date.strftime('%Y-%m-%d') if self.issued_date else 'Pending'}", fill='#000000', font=font_small)

        # Add QR code (if exists)
        if self.qr_code:
            try:
                qr_img = Image.open(self.qr_code.path)
                qr_img = qr_img.resize((100, 100))
                img.paste(qr_img, (450, 250))
            except Exception as e:
                logger.warning(f"Failed to add QR code: {e}")

        # Add barcode (if exists)
        if self.barcode_image:
            try:
                barcode_img = Image.open(self.barcode_image.path)
                barcode_img = barcode_img.resize((200, 50))
                img.paste(barcode_img, (350, 320))
            except Exception as e:
                logger.warning(f"Failed to add barcode: {e}")

        # Add footer
        draw.text((30, height - 40), "This card remains property of OpenEdTex University", fill='#666666', font=font_small)

        # Save image
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)

        self.card_image.save(f'card_{self.card_number}.png', ContentFile(buffer.getvalue()), save=False)

    @property
    def is_expired(self):
        from django.utils import timezone
        if self.expiry_date:
            return timezone.now().date() > self.expiry_date
        return False

    @property
    def can_access_building(self):
        """Check if card can access building based on time and status."""
        from django.utils import timezone
        now = timezone.now()

        if self.status != 'active' or not self.is_active or self.is_expired:
            return False

        # Check time restrictions
        if self.allowed_times:
            current_time = now.time()
            current_day = now.strftime('%A').lower()

            if current_day in self.allowed_times:
                time_slots = self.allowed_times[current_day]
                for slot in time_slots:
                    start_time = slot.get('start')
                    end_time = slot.get('end')
                    if start_time and end_time:
                        if start_time <= current_time <= end_time:
                            return True
                return False

        return True


class AttendanceRecord(models.Model):
    """Attendance record for students."""

    ATTENDANCE_TYPE_CHOICES = [
        ('check_in', 'Check In'),
        ('check_out', 'Check Out'),
        ('class_entry', 'Class Entry'),
        ('class_exit', 'Class Exit'),
        ('building_entry', 'Building Entry'),
        ('building_exit', 'Building Exit'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    id_card = models.ForeignKey(
        StudentIDCard,
        on_delete=models.SET_NULL,
        null=True,
        related_name='attendance_records'
    )

    # Attendance Details
    attendance_type = models.CharField(
        max_length=20,
        choices=ATTENDANCE_TYPE_CHOICES,
        default='check_in'
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=100, blank=True)
    device_id = models.CharField(max_length=100, blank=True)

    # Context Information
    classroom_id = models.PositiveIntegerField(null=True, blank=True)
    course_id = models.PositiveIntegerField(null=True, blank=True)

    # Device Information
    rfid_uid = models.CharField(max_length=50, blank=True)
    nfc_data = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)

    # Status
    is_valid = models.BooleanField(default=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['student', 'timestamp']),
            models.Index(fields=['attendance_type', 'timestamp']),
            models.Index(fields=['classroom_id', 'timestamp']),
            models.Index(fields=['is_valid']),
        ]

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.attendance_type} - {self.timestamp}"


class AccessPoint(models.Model):
    """Physical access points (doors, gates, etc.)."""

    ACCESS_POINT_TYPE_CHOICES = [
        ('door', 'Door'),
        ('gate', 'Gate'),
        ('turnstile', 'Turnstile'),
        ('elevator', 'Elevator'),
        ('room', 'Room'),
    ]

    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    access_point_type = models.CharField(
        max_length=20,
        choices=ACCESS_POINT_TYPE_CHOICES,
        default='door'
    )

    # Hardware Information
    device_id = models.CharField(max_length=100, unique=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    mac_address = models.CharField(max_length=17, blank=True)

    # Access Control
    allowed_roles = models.JSONField(
        default=list,
        help_text="User roles allowed to access this point"
    )
    allowed_card_types = models.JSONField(
        default=list,
        help_text="Card types allowed to access this point"
    )
    time_restrictions = models.JSONField(
        default=dict,
        help_text="Time-based access restrictions"
    )

    # Status
    is_active = models.BooleanField(default=True)
    last_ping = models.DateTimeField(blank=True, null=True)
    firmware_version = models.CharField(max_length=20, blank=True)

    # Emergency
    emergency_override = models.BooleanField(default=False)
    emergency_message = models.TextField(blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.location}"

    def can_access(self, user, id_card):
        """Check if user with card can access this point."""
        if not self.is_active or self.emergency_override:
            return False

        # Check user role
        if self.allowed_roles and user.role not in self.allowed_roles:
            return False

        # Check card type
        if self.allowed_card_types and id_card.card_type not in self.allowed_card_types:
            return False

        # Check card status
        if not id_card.can_access_building:
            return False

        # Check time restrictions
        from django.utils import timezone
        now = timezone.now()
        current_time = now.time()
        current_day = now.strftime('%A').lower()

        if self.time_restrictions and current_day in self.time_restrictions:
            time_slots = self.time_restrictions[current_day]
            for slot in time_slots:
                start_time = slot.get('start')
                end_time = slot.get('end')
                if start_time and end_time:
                    if start_time <= current_time <= end_time:
                        return True
            return False

        return True


class AccessLog(models.Model):
    """Log of all access attempts."""

    ACCESS_RESULT_CHOICES = [
        ('granted', 'Granted'),
        ('denied', 'Denied'),
        ('error', 'Error'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='access_logs'
    )
    id_card = models.ForeignKey(
        StudentIDCard,
        on_delete=models.SET_NULL,
        null=True,
        related_name='access_logs'
    )
    access_point = models.ForeignKey(
        AccessPoint,
        on_delete=models.CASCADE,
        related_name='access_logs'
    )

    # Access Details
    timestamp = models.DateTimeField(auto_now_add=True)
    result = models.CharField(
        max_length=20,
        choices=ACCESS_RESULT_CHOICES,
        default='denied'
    )
    reason = models.TextField(blank=True)

    # Technical Details
    rfid_uid = models.CharField(max_length=50, blank=True)
    nfc_data = models.TextField(blank=True)
    device_fingerprint = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['access_point', 'timestamp']),
            models.Index(fields=['result']),
        ]

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.access_point.name} - {self.result} - {self.timestamp}"


class IDCardTemplate(models.Model):
    """Templates for generating ID cards."""

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    # Template Configuration
    background_color = models.CharField(max_length=7, default='#ffffff')
    text_color = models.CharField(max_length=7, default='#000000')
    accent_color = models.CharField(max_length=7, default='#007bff')

    # Layout Configuration
    layout_config = models.JSONField(
        default=dict,
        help_text="Layout configuration for card elements"
    )

    # Assets
    background_image = models.ImageField(
        upload_to='id_templates/backgrounds/',
        blank=True,
        null=True
    )
    logo_image = models.ImageField(
        upload_to='id_templates/logos/',
        blank=True,
        null=True
    )

    # Fonts
    title_font = models.CharField(max_length=50, default='Arial')
    body_font = models.CharField(max_length=50, default='Arial')

    # Status
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.is_default:
            # Ensure only one default template
            IDCardTemplate.objects.filter(is_default=True).update(is_default=False)
        super().save(*args, **kwargs)


class NotificationSettings(models.Model):
    """Notification settings for attendance and access events."""

    NOTIFICATION_TYPE_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push Notification'),
        ('webhook', 'Webhook'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notification_settings'
    )

    # Notification Types
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPE_CHOICES
    )

    # Events to Notify
    late_arrival = models.BooleanField(default=True)
    early_departure = models.BooleanField(default=True)
    missed_class = models.BooleanField(default=True)
    access_denied = models.BooleanField(default=True)
    card_lost_stolen = models.BooleanField(default=True)

    # Schedule
    quiet_hours_start = models.TimeField(blank=True, null=True)
    quiet_hours_end = models.TimeField(blank=True, null=True)

    # Contact Information
    email_address = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    webhook_url = models.URLField(blank=True)

    # Status
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['user', 'notification_type']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.notification_type}"
