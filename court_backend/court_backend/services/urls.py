from django.urls import path
from .views import SubmitServiceView

urlpatterns = [
    path("", SubmitServiceView.as_view()),
]
