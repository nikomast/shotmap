from django.urls import path
from .views import TeamListView, MatchListView, RegisterView

urlpatterns = [
    path('teams/', TeamListView.as_view(), name='team-list'),
    path('matches/', MatchListView.as_view(), name='match-list'),
    path('register/', RegisterView.as_view(), name='register'),

]
