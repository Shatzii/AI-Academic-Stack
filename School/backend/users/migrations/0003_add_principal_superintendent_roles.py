# Generated manually to add principal and superintendent roles

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_brandingconfiguration_brandingpreset"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[
                    ("student", "Student"),
                    ("teacher", "Teacher"),
                    ("principal", "Principal"),
                    ("superintendent", "Superintendent"),
                    ("admin", "Administrator"),
                    ("parent", "Parent"),
                ],
                default="student",
                max_length=20,
            ),
        ),
    ]