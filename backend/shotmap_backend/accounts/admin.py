from django.contrib import admin
from .models import User, Team, Match, Series, MatchAction

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff')

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('id', 'team', 'opponent', 'series', 'result', 'match_date')
    list_filter = ('series', 'result')
    search_fields = ('team__name', 'opponent__name', 'series__name')

@admin.register(MatchAction)
class MatchActionAdmin(admin.ModelAdmin):
    list_display = (
    'match_id',
    'first_click_row',
    'first_click_col',
    'second_click_row',
    'second_click_col',
    'time_between_clicks',
    'shot_occurred',
    'goal_scored')
    list_filter = ('match_id','goal_scored')

@admin.register(Series)
class SeriesAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',) 