from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.serializers import ModelSerializer
from rest_framework.generics import UpdateAPIView
from django.http import HttpResponse
from django.http import JsonResponse
from django.contrib import messages
from django.shortcuts import redirect
from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth.views import LoginView as DjangoLoginView
from django.contrib.auth.views import LogoutView
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, get_object_or_404
from django.views import View
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from .models import Team, Match, MatchAction, Series
from .serializers import TeamSerializer, MatchSerializer, MatchActionSerializer, SeriesSerializer
from .forms import SeriesForm, TeamForm



class RegisterView(APIView):
    pass

def debug_host(request):
    return HttpResponse(f"Host: {request.get_host()}")

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=200)
        else:
            return Response({"error": "Invalid username or password"}, status=400)


#Näytetään käyttäjän joukkueet
class TeamListView(generics.ListCreateAPIView):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print(self.request.user)
        return Team.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SeriesListView(generics.ListAPIView):
    serializer_class = SeriesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Series.objects.all()
    
class TeamsInSeriesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, series_id):
        try:
            series = Series.objects.get(id=series_id)
            teams = series.teams.all()  # Get all teams in the series
            serializer = TeamSerializer(teams, many=True)
            return Response(serializer.data)
        except Series.DoesNotExist:
            return Response({"error": "Series not found"}, status=404)


class MatchListCreateView(generics.ListCreateAPIView):
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        team_id = self.kwargs.get('team_id')
        if team_id:
            return Match.objects.filter(team_id=team_id, team__user=self.request.user)
        return Match.objects.filter(team__user=self.request.user)

    def perform_create(self, serializer):
        series_id = self.request.data.get("series")
        team_id = self.request.data.get("team")
        opponent_id = self.request.data.get("opponent")

        try:
            series = Series.objects.get(id=series_id)
        except Series.DoesNotExist:
            raise ValidationError({"series": "Invalid series ID."})

        try:
            team = Team.objects.get(id=team_id, user=self.request.user, series=series)
        except Team.DoesNotExist:
            raise ValidationError({"team": "Invalid team ID or team does not belong to the series."})

        try:
            opponent = Team.objects.get(id=opponent_id, series=series)
            if opponent == team:
                raise ValidationError({"opponent": "Team cannot play against itself."})
        except Team.DoesNotExist:
            raise ValidationError({"opponent": "Invalid opponent ID or opponent does not belong to the series."})

        serializer.save(series=series, team=team, opponent=opponent)


#Kun matsi loppuu asetetaan sille tulos
class UpdateMatchResultView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        try:
            match = Match.objects.get(id=match_id, team__user=request.user)
        except Match.DoesNotExist:
            return Response({"error": "Match not found."}, status=404)

        result = request.data.get("result")
        if result not in ["W", "D", "L"]:
            return Response({"error": "Invalid result value."}, status=400)

        match.result = result
        match.save()
        return Response({"message": "Result updated successfully."})
    
#Asetetaan ottelulle tapahtumia pitäisikö tässä varmistaa että ottelulla ei ole tulosta eli se on kesken?
class MatchActionListCreateView(generics.ListCreateAPIView):
    serializer_class = MatchActionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        match_id = self.kwargs.get('match_id')
        if match_id:
            return MatchAction.objects.filter(match_id=match_id, match__team__user=self.request.user)
        return MatchAction.objects.none()

    def perform_create(self, serializer):
        match = serializer.validated_data['match']
        if match.team.user != self.request.user:
            raise PermissionDenied("You cannot add actions for this match.")
        serializer.save()

    

#Back endin käyttäjän käyttöliittymän juttuja, nämä pitäisi järjestää paremmin esim omaan tiedostoon?
User = get_user_model()

def custom_404_view(request):
    return render(request, "errors/404.html", status=404)

def custom_500_view(request):
    return render(request, "errors/500.html", status=500)

class SignUpView(View):
    def get(self, request):
        form = UserCreationForm()
        return render(request, "accounts/signup.html", {"form": form})

    def post(self, request):
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, "Account created successfully! Please log in.")
            return redirect("login")
        else:
            messages.error(request, "There was an error in your registration.")
        return render(request, "accounts/signup.html", {"form": form})

class BackendLoginView(DjangoLoginView):
    template_name = "accounts/login.html" 
    success_url = "/dashboard/" 

class BackendLogoutView(LogoutView):
    template_name = "accounts/logout.html" 
    success_url = "/login/" 

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']

class UserUpdateView(UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class UserDashboardView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return redirect("user-login")
        
        series = Series.objects.all()
        teams = Team.objects.filter(user=request.user)
        matches = Match.objects.filter(team__in=teams)

        context = {
            "user": request.user,
            "series": series,
            "teams": teams,
            "matches": matches,
            "series_form": SeriesForm(),
            "team_form": TeamForm(),
        }
        return render(request, "accounts/dashboard.html", context)
    

class UserProfileView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return redirect("user-login")
        
        return render(request, "accounts/profile.html", {"user": request.user})

    def post(self, request):
        username = request.POST.get("username")
        email = request.POST.get("email")
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")

        user = request.user
        user.username = username
        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        user.save()

        messages.success(request, "Your account information has been updated.")
        return redirect("profile")




class MatchesInTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, team_id):
        try:
            team = Team.objects.get(id=team_id, user=request.user)
            matches = Match.objects.filter(team=team)
            serializer = MatchSerializer(matches, many=True)
            return Response(serializer.data)
        except Team.DoesNotExist:
            return Response({"error": "Team not found or not associated with the user."}, status=404)


class FilterDataAPI(View):
    def get(self, request):
        series_id = request.GET.get("series")
        team_id = request.GET.get("team")

        user_teams = Team.objects.filter(user=request.user)
        user_matches = Match.objects.none()
        filtered_series = Series.objects.all()

        selected_series = None
        selected_team_id = None  # Track the selected team ID

        if series_id:
            selected_series = Series.objects.filter(id=series_id).first()
            if selected_series:
                user_teams = user_teams.filter(series=selected_series)
                user_matches = Match.objects.filter(team__in=user_teams, series=selected_series)
                filtered_series = [selected_series]

        if team_id:
            selected_team = Team.objects.filter(id=team_id, user=request.user).first()
            if selected_team:
                selected_team_id = selected_team.id  # Save the selected team ID
                if selected_series:
                    user_matches = Match.objects.filter(team=selected_team, series=selected_series)
                else:
                    user_matches = Match.objects.filter(team=selected_team)

        if not series_id and not team_id:
            user_matches = Match.objects.filter(team__in=user_teams)

        data = {
            "series": [{"id": s.id, "name": s.name} for s in filtered_series],
            "teams": [
                {"id": team.id, "name": team.name, "selected": team.id == selected_team_id}
                for team in user_teams
            ],
            "matches": [
                {
                    "team": match.team.name,
                    "opponent": match.opponent.name if match.opponent else "Unknown Opponent",
                    "date": match.match_date,
                    "result": match.result,
                }
                for match in user_matches
            ],
        }
        return JsonResponse(data)

class AddSeriesView(View):
    def post(self, request):
        form = SeriesForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Series added successfully!")
        else:
            messages.error(request, "Error adding series.")
        return redirect("user-dashboard")


class AddTeamView(View):
    def post(self, request):
        form = TeamForm(request.POST)
        if form.is_valid():
            team = form.save(commit=False)
            team.user = request.user 
            team.save()
            messages.success(request, "Team added successfully!")
        else:
            messages.error(request, "Error adding team.")
        return redirect("user-dashboard")
    
class ModifySeriesView(View):
    def post(self, request):
        series_id = request.POST.get("series_id")
        series = get_object_or_404(Series, id=series_id)
        form = SeriesForm(request.POST, instance=series)

        if form.is_valid():
            form.save()
            messages.success(request, "Series updated successfully!")
        else:
            messages.error(request, "Error updating series.")
        return redirect("user-dashboard")
