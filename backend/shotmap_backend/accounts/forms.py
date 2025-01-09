from django import forms
from .models import Series, Team

class SeriesForm(forms.ModelForm):
    teams = forms.ModelMultipleChoiceField(
        queryset=Team.objects.all(),  
        widget=forms.CheckboxSelectMultiple(attrs={"class": "team-checkbox-list"}),  
        required=False, 
        label="Select Teams for Series"
    )

    class Meta:
        model = Series
        fields = ['name', 'teams']
        

class TeamForm(forms.ModelForm):
    class Meta:
        model = Team
        fields = ['name'] 
