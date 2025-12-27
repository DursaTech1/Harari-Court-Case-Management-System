from django.urls import path
from .views import ServiceRequestView

urlpatterns = [
     path('services/submit/', ServiceRequestView.as_view(), name='service-submit'),
]
