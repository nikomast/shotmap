from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Series(models.Model):
    name = models.CharField(max_length=100, unique=True) 
    teams = models.ManyToManyField('Team', related_name='series')

    def add_team(self, team_id):
        # Get the team by ID
        team = Team.objects.filter(id=team_id).first()
        if not team:
            raise ValueError("Team does not exist.")

        # Add the team to the series
        if not self.teams.filter(id=team.id).exists():
            self.teams.add(team)
        else:
            raise ValueError("Team is already part of the series.")

    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} (User: {self.user.username if self.user else 'Global'})"


#Ottelu sisältää joukkueen ja muita tarvittavia tietoja. Se on kesken kunnes sille on annettu tulos. Vastustajan nimi voi olla ongelma. Tulos?
class Match(models.Model):
    RESULT_CHOICES = [
        ("P", "Pending"),
        ("W", "Win"),
        ("D", "Draw"),
        ("L", "Loss"),
    ]
    series = models.ForeignKey(Series, on_delete=models.CASCADE, null=True, blank=True) 
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='matches') 
    opponent = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='opponent_matches', null=True)
    result = models.CharField(
        max_length=1,
        choices=RESULT_CHOICES,
        default="P"
    )
    match_date = models.DateField(auto_now_add=True)

    def is_completed(self):
        return self.result not in ["P", None] 

    def __str__(self):
        team_name = self.team.name if self.team else "Unknown Team"
        opponent_name = self.opponent.name if self.opponent else "Unknown Opponent"
        series_name = self.series.name if self.series else "Unknown Series"
        return f"{team_name} vs {opponent_name} in {series_name} on {self.match_date}"



#Ottelun tapahtumat on luotu aika pitkälti käyttöliittymän ehdoilla (joka on tehty ensin).
class MatchAction(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name="actions")
    first_click_row = models.IntegerField()
    first_click_col = models.IntegerField()
    second_click_row = models.IntegerField()
    second_click_col = models.IntegerField()
    time_between_clicks = models.FloatField()
    shot_occurred = models.BooleanField()
    goal_scored = models.BooleanField()
    grid_rows = models.IntegerField(default=16) 
    grid_cols = models.IntegerField(default=32)

    def __str__(self):
        return f"Action for Match {self.match.id}: Shot-{self.shot_occurred}, Goal-{self.goal_scored}"

