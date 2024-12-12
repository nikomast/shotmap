from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Add custom fields here if needed
    pass

class Team(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Match(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    opponent_name = models.CharField(max_length=100) #Tämä voi tuottaa ongelmia.
    result = {
        "W": "Win",
        "D": "Draw",
        "L": "Loss",
    }
    match_date = models.DateField()
    data = models.JSONField() #Tämä pitää hajottaa omiin kenttiin
