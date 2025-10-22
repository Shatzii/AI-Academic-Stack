from django.db import models
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from PIL import Image
import uuid


class BrandingConfiguration(models.Model):
    """Main branding configuration for white-label schools."""

    school_name = models.CharField(
        max_length=100,
        default="OpenEdTex University",
        help_text="The name of the school/institution"
    )

    school_tagline = models.CharField(
        max_length=200,
        blank=True,
        help_text="School tagline or motto"
    )

    # Logo and branding assets
    logo = models.ImageField(
        upload_to='branding/logos/',
        blank=True,
        null=True,
        help_text="Main logo (PNG, JPG, SVG recommended)"
    )

    logo_small = models.ImageField(
        upload_to='branding/logos/',
        blank=True,
        null=True,
        help_text="Small logo for mobile/navbar"
    )

    favicon = models.ImageField(
        upload_to='branding/favicons/',
        blank=True,
        null=True,
        help_text="Favicon (16x16, 32x32, ICO format)"
    )

    # Color scheme
    primary_color = models.CharField(
        max_length=7,
        default="#007bff",
        help_text="Primary brand color (hex code)"
    )

    secondary_color = models.CharField(
        max_length=7,
        default="#6c757d",
        help_text="Secondary brand color (hex code)"
    )

    accent_color = models.CharField(
        max_length=7,
        default="#28a745",
        help_text="Accent/success color (hex code)"
    )

    background_color = models.CharField(
        max_length=7,
        default="#ffffff",
        help_text="Background color (hex code)"
    )

    text_color = models.CharField(
        max_length=7,
        default="#212529",
        help_text="Primary text color (hex code)"
    )

    # Typography
    primary_font = models.CharField(
        max_length=50,
        default="'Inter', sans-serif",
        help_text="Primary font family"
    )

    heading_font = models.CharField(
        max_length=50,
        default="'Inter', sans-serif",
        help_text="Heading font family"
    )

    # Contact information
    support_email = models.EmailField(
        default="support@openedtex.edu",
        help_text="Support contact email"
    )

    support_phone = models.CharField(
        max_length=20,
        blank=True,
        help_text="Support contact phone"
    )

    website_url = models.URLField(
        default="https://openedtex.edu",
        help_text="School website URL"
    )

    # Social media
    facebook_url = models.URLField(blank=True, help_text="Facebook page URL")
    twitter_url = models.URLField(blank=True, help_text="Twitter/X profile URL")
    linkedin_url = models.URLField(blank=True, help_text="LinkedIn page URL")
    instagram_url = models.URLField(blank=True, help_text="Instagram profile URL")

    # Footer content
    footer_text = models.TextField(
        default="© 2025 OpenEdTex University. All rights reserved.",
        help_text="Footer copyright text"
    )

    # Custom CSS
    custom_css = models.TextField(
        blank=True,
        help_text="Custom CSS for additional styling"
    )

    # Meta information
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this branding configuration is active"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Branding Configuration"
        verbose_name_plural = "Branding Configurations"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.school_name} Branding"

    def save(self, *args, **kwargs):
        # Auto-generate small logo if not provided
        if self.logo and not self.logo_small:
            self.generate_small_logo()

        # Auto-generate favicon if not provided
        if self.logo and not self.favicon:
            self.generate_favicon()

        super().save(*args, **kwargs)

    def generate_small_logo(self):
        """Generate a small version of the logo for mobile/navbar use."""
        try:
            # Open the original logo
            with Image.open(self.logo.path) as img:
                # Convert to RGBA if necessary
                if img.mode != 'RGBA':
                    img = img.convert('RGBA')

                # Resize to 40x40 for small logo
                img.thumbnail((40, 40), Image.Resampling.LANCZOS)

                # Save the small logo
                small_logo_path = f"branding/logos/small_{uuid.uuid4().hex[:8]}.png"
                buffer = BytesIO()
                img.save(buffer, format='PNG')
                buffer.seek(0)

                self.logo_small.save(small_logo_path, ContentFile(buffer.getvalue()), save=False)

        except Exception as e:
            print(f"Error generating small logo: {e}")

    def generate_favicon(self):
        """Generate favicon from logo."""
        try:
            # Open the original logo
            with Image.open(self.logo.path) as img:
                # Convert to RGBA if necessary
                if img.mode != 'RGBA':
                    img = img.convert('RGBA')

                # Create multiple sizes for favicon
                sizes = [(16, 16), (32, 32), (48, 48)]

                favicon_images = []
                for size in sizes:
                    favicon_img = img.copy()
                    favicon_img.thumbnail(size, Image.Resampling.LANCZOS)

                    # Create new image with the exact size
                    favicon_final = Image.new('RGBA', size, (255, 255, 255, 0))
                    # Center the thumbnail
                    x = (size[0] - favicon_img.size[0]) // 2
                    y = (size[1] - favicon_img.size[1]) // 2
                    favicon_final.paste(favicon_img, (x, y), favicon_img if favicon_img.mode == 'RGBA' else None)
                    favicon_images.append(favicon_final)

                # Save as ICO format
                favicon_path = f"branding/favicons/favicon_{uuid.uuid4().hex[:8]}.ico"
                buffer = BytesIO()

                # Save the largest size as ICO
                favicon_images[-1].save(buffer, format='ICO', sizes=[(s[0], s[1]) for s in sizes])
                buffer.seek(0)

                self.favicon.save(favicon_path, ContentFile(buffer.getvalue()), save=False)

        except Exception as e:
            print(f"Error generating favicon: {e}")

    @property
    def css_variables(self):
        """Generate CSS custom properties for theming."""
        return f"""
        :root {{
            --brand-primary: {self.primary_color};
            --brand-secondary: {self.secondary_color};
            --brand-accent: {self.accent_color};
            --brand-background: {self.background_color};
            --brand-text: {self.text_color};
            --brand-primary-font: {self.primary_font};
            --brand-heading-font: {self.heading_font};
        }}
        """

    def get_logo_url(self):
        """Get the logo URL, falling back to default if not set."""
        if self.logo:
            return self.logo.url
        return "/static/images/default-logo.png"

    def get_small_logo_url(self):
        """Get the small logo URL, falling back to main logo or default."""
        if self.logo_small:
            return self.logo_small.url
        elif self.logo:
            return self.logo.url
        return "/static/images/default-logo-small.png"

    def get_favicon_url(self):
        """Get the favicon URL, falling back to default if not set."""
        if self.favicon:
            return self.favicon.url
        return "/static/favicon.ico"


class BrandingPreset(models.Model):
    """Predefined branding presets for quick setup."""

    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    # Preset color schemes
    primary_color = models.CharField(max_length=7, default="#007bff")
    secondary_color = models.CharField(max_length=7, default="#6c757d")
    accent_color = models.CharField(max_length=7, default="#28a745")
    background_color = models.CharField(max_length=7, default="#ffffff")
    text_color = models.CharField(max_length=7, default="#212529")

    # Preset fonts
    primary_font = models.CharField(max_length=50, default="'Inter', sans-serif")
    heading_font = models.CharField(max_length=50, default="'Inter', sans-serif")

    is_default = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Branding Preset"
        verbose_name_plural = "Branding Presets"

    def __str__(self):
        return self.name

    def apply_to_branding(self, branding_config):
        """Apply this preset to a branding configuration."""
        branding_config.primary_color = self.primary_color
        branding_config.secondary_color = self.secondary_color
        branding_config.accent_color = self.accent_color
        branding_config.background_color = self.background_color
        branding_config.text_color = self.text_color
        branding_config.primary_font = self.primary_font
        branding_config.heading_font = self.heading_font
        branding_config.save()
