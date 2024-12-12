from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Team, Match
from .serializers import TeamSerializer, MatchSerializer
from django.contrib.auth import get_user_model

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Get the custom user model
        User = get_user_model()

        # Check if the username already exists
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=400)

        # Create a new user
        user = User.objects.create_user(username=username, password=password)
        return Response({"message": "User created successfully"}, status=201)



class TeamListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        teams = Team.objects.filter(user=request.user)
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)

class MatchListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches = Match.objects.filter(team__user=request.user)
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)
