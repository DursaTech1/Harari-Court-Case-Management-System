from django.urls import path
from .views import RegisterView, LoginView, ProfileView

urlpatterns = [
    # POST /api/accounts/register/
    path("register/", RegisterView.as_view(), name="accounts-register"),

    # POST /api/accounts/login/
    path("login/", LoginView.as_view(), name="accounts-login"),

    # GET/PUT /api/accounts/profile/
    path("profile/", ProfileView.as_view(), name="accounts-profile"),
]
