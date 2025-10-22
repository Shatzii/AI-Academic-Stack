from django.core.management.base import BaseCommand
from users.models_branding import BrandingPreset


class Command(BaseCommand):
    help = 'Create default branding presets'

    def handle(self, *args, **options):
        presets = [
            {
                'name': 'Modern Blue',
                'description': 'Clean, professional blue theme',
                'primary_color': '#007bff',
                'secondary_color': '#6c757d',
                'accent_color': '#28a745',
                'background_color': '#ffffff',
                'text_color': '#212529',
                'primary_font': "'Inter', sans-serif",
                'heading_font': "'Inter', sans-serif",
                'is_default': True
            },
            {
                'name': 'Corporate Green',
                'description': 'Professional green theme for corporate education',
                'primary_color': '#28a745',
                'secondary_color': '#6c757d',
                'accent_color': '#007bff',
                'background_color': '#ffffff',
                'text_color': '#212529',
                'primary_font': "'Roboto', sans-serif",
                'heading_font': "'Roboto', sans-serif",
                'is_default': False
            },
            {
                'name': 'University Purple',
                'description': 'Traditional university purple theme',
                'primary_color': '#6f42c1',
                'secondary_color': '#e83e8c',
                'accent_color': '#fd7e14',
                'background_color': '#ffffff',
                'text_color': '#212529',
                'primary_font': "'Open Sans', sans-serif",
                'heading_font': "'Open Sans', sans-serif",
                'is_default': False
            },
            {
                'name': 'Tech Dark',
                'description': 'Modern dark theme for tech-focused schools',
                'primary_color': '#212529',
                'secondary_color': '#343a40',
                'accent_color': '#007bff',
                'background_color': '#f8f9fa',
                'text_color': '#212529',
                'primary_font': "'Fira Code', monospace",
                'heading_font': "'Fira Code', monospace",
                'is_default': False
            },
            {
                'name': 'Creative Orange',
                'description': 'Vibrant orange theme for creative institutions',
                'primary_color': '#fd7e14',
                'secondary_color': '#6c757d',
                'accent_color': '#e83e8c',
                'background_color': '#ffffff',
                'text_color': '#212529',
                'primary_font': "'Poppins', sans-serif",
                'heading_font': "'Poppins', sans-serif",
                'is_default': False
            }
        ]

        for preset_data in presets:
            preset, created = BrandingPreset.objects.get_or_create(
                name=preset_data['name'],
                defaults=preset_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created branding preset: {preset.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Branding preset already exists: {preset.name}')
                )

        self.stdout.write(
            self.style.SUCCESS('Branding presets creation completed!')
        )
