# Generated by Django 5.1.4 on 2024-12-16 20:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_alter_match_match_date_alter_match_result'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='result',
            field=models.CharField(choices=[('P', 'Pending'), ('W', 'Win'), ('D', 'Draw'), ('L', 'Loss')], default='P', max_length=1),
        ),
    ]
