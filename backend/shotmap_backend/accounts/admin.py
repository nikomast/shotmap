from django.contrib import admin
from .models import User, Team, Match

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff')

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('team', 'match_date')
