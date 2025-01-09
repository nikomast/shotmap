from rest_framework import serializers
from .models import Team, Match, MatchAction, Series

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = [
            'id', 
            'name', 
            'user',
            'series',
            ]

class MatchActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchAction
        fields = [
            'id',
            'match',
            'first_click_row',
            'first_click_col',
            'second_click_row',
            'second_click_col',
            'time_between_clicks',
            'shot_occurred',
            'goal_scored',
            'grid_rows', 
            'grid_cols',
        ]



class MatchSerializer(serializers.ModelSerializer):
    series_name = serializers.ReadOnlyField(source="series.name")
    team_name = serializers.ReadOnlyField(source="team.name")
    opponent_name = serializers.ReadOnlyField(source="opponent.name")

    class Meta:
        model = Match
        fields = [
            "id",
            "series",
            "series_name",
            "team",
            "team_name",
            "opponent",
            "opponent_name",
            "result",
            "match_date",
        ]


class SeriesSerializer(serializers.ModelSerializer):
    teams = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Series
        fields = ['id', 'name', 'teams']

