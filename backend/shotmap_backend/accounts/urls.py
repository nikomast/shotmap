from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    TeamListView,
    MatchListCreateView,
    MatchActionListCreateView,
    SeriesListView,
    TeamsInSeriesView,
    UpdateMatchResultView,
    UserUpdateView,
)

urlpatterns = [
    path('series/', SeriesListView.as_view(), name='series-list'),
    path('teams/', TeamListView.as_view(), name='team-list'),
    path('series/<int:series_id>/teams/', TeamsInSeriesView.as_view(), name='teams-in-series'),
    path('matches/', MatchListCreateView.as_view(), name='match-list-create'),
    path('matches/<int:match_id>/end/', UpdateMatchResultView.as_view(), name='end_match'),
    path('team/<int:team_id>/matches/', MatchListCreateView.as_view(), name='team-matches'),
    path('actions/', MatchActionListCreateView.as_view(), name='match-action-list-create'),
    path('match/<int:match_id>/actions/', MatchActionListCreateView.as_view(), name='match-actions'),
    path('login/', LoginView.as_view(), name='login')
    ]
