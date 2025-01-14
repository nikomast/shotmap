# Generated by Django 5.1.4 on 2024-12-18 13:11

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_alter_match_result'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='match',
            name='opponent_name',
        ),
        migrations.AddField(
            model_name='match',
            name='opponent',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='opponent_matches', to='accounts.team'),
        ),
        migrations.AlterField(
            model_name='match',
            name='team',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches', to='accounts.team'),
        ),
        migrations.AlterField(
            model_name='team',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='team',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Series',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('teams', models.ManyToManyField(related_name='series', to='accounts.team')),
            ],
        ),
        migrations.AddField(
            model_name='match',
            name='series',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts.series'),
        ),
    ]
