from django.core.management.base import BaseCommand
from users.models_branding import BrandingConfiguration


class Command(BaseCommand):
    help = 'Create default branding configuration'

    def handle(self, *args, **options):
        # Check if a branding configuration already exists
        if BrandingConfiguration.objects.exists():
            self.stdout.write(
                self.style.WARNING('Branding configuration already exists. Skipping creation.')
            )
            return

        # Create default branding configuration
        branding = BrandingConfiguration.objects.create(
            school_name='OpenEdTex University',
            school_tagline='Empowering Education Through Technology',
            primary_color='#007bff',
            secondary_color='#6c757d',
            accent_color='#28a745',
            background_color='#ffffff',
            text_color='#212529',
            primary_font="'Inter', sans-serif",
            heading_font="'Inter', sans-serif",
            support_email='support@openedtex.edu',
            support_phone='+1-555-0123',
            website_url='https://openedtex.edu',
            facebook_url='https://facebook.com/openedtex',
            twitter_url='https://twitter.com/openedtex',
            linkedin_url='https://linkedin.com/company/openedtex',
            instagram_url='https://instagram.com/openedtex',
            footer_text='© 2025 OpenEdTex University. All rights reserved.',
            is_active=True
        )

        self.stdout.write(
            self.style.SUCCESS(f'Created default branding configuration: {branding.school_name}')
        )
