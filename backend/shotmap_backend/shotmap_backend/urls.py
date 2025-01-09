from django.contrib import admin
from django.urls import path, include
from accounts.views import (
        UserDashboardView,
        #SignUpView,
        BackendLoginView,
        BackendLogoutView,
        TeamsInSeriesView,
        MatchesInTeamView,
        FilterDataAPI,
        AddSeriesView,
        AddTeamView,
        UserProfileView,
        PasswordChangeView,
        ModifySeriesView
)


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('accounts.urls')), 

    path('dashboard/', UserDashboardView.as_view(), name='user-dashboard'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path("profile/password/", PasswordChangeView.as_view(
        template_name="accounts/password_change.html",
        success_url="/profile/"), name="accounts-password-change"),
    path("filter/", FilterDataAPI.as_view(), name="filter-data"),
    #path('signup/', SignUpView.as_view(), name='signup'),
    path('', BackendLoginView.as_view(), name="user-login"),
    path('logout/', BackendLogoutView.as_view(), name='user-logout'),
    path("teams-in-series/<int:series_id>/", TeamsInSeriesView.as_view(), name="teams-in-series"),
    path("matches-in-team/<int:team_id>/", MatchesInTeamView.as_view(), name="matches-in-team"),
    path('add-series/', AddSeriesView.as_view(), name='add-series'),
    path("modify-series/", ModifySeriesView.as_view(), name="modify-series"),
    path('add-team/', AddTeamView.as_view(), name='add-team'),
]
