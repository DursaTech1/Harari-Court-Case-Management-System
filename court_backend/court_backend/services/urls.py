from django.urls import path
from .views import (
    CourtServicesListView,
    DashboardStatsView,
    MyRequestsView,
    DocumentSubmissionView,
    ArbitrationFeeView,
    DocumentSearchView,
    AppointmentView,
    ComplaintFormView,
    FeedbackView,
    ServiceRequestView,
)

urlpatterns = [
    # Public
    path('', CourtServicesListView.as_view(), name='services-list'),

    # Authenticated — dashboard
    path('dashboard/', DashboardStatsView.as_view(), name='services-dashboard'),
    path('my-requests/', MyRequestsView.as_view(), name='my-requests'),

    # Authenticated — individual service endpoints
    path('document-submission/', DocumentSubmissionView.as_view(), name='document-submission'),
    path('arbitration-fee/', ArbitrationFeeView.as_view(), name='arbitration-fee'),
    path('search-document/', DocumentSearchView.as_view(), name='search-document'),
    path('appointment/', AppointmentView.as_view(), name='appointment'),
    path('complaint/', ComplaintFormView.as_view(), name='complaint'),
    path('feedback/', FeedbackView.as_view(), name='feedback'),

    # Legacy generic submit (backward compat)
    path('submit/', ServiceRequestView.as_view(), name='service-submit'),
]
