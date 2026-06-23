from django.urls import path
from .admin_views import (
    AdminStatsView,
    AdminUsersView,
    AdminDocumentSubmissionsView, AdminDocumentSubmissionDetailView,
    AdminArbitrationFeesView, AdminArbitrationFeeDetailView,
    AdminSearchRequestsView, AdminSearchRequestDetailView,
    AdminAppointmentsView, AdminAppointmentDetailView,
    AdminComplaintsView, AdminComplaintDetailView,
    AdminFeedbackView, AdminFeedbackDetailView,
)

urlpatterns = [
    # Stats & Users
    path('stats/',                        AdminStatsView.as_view(),                    name='admin-stats'),
    path('users/',                        AdminUsersView.as_view(),                    name='admin-users'),

    # Document Submissions
    path('document-submissions/',         AdminDocumentSubmissionsView.as_view(),      name='admin-doc-submissions'),
    path('document-submissions/<int:pk>/', AdminDocumentSubmissionDetailView.as_view(), name='admin-doc-submission-detail'),

    # Arbitration Fees
    path('arbitration-fees/',             AdminArbitrationFeesView.as_view(),          name='admin-arb-fees'),
    path('arbitration-fees/<int:pk>/',    AdminArbitrationFeeDetailView.as_view(),     name='admin-arb-fee-detail'),

    # Search Requests
    path('search-requests/',              AdminSearchRequestsView.as_view(),           name='admin-search-requests'),
    path('search-requests/<int:pk>/',     AdminSearchRequestDetailView.as_view(),      name='admin-search-request-detail'),

    # Appointments
    path('appointments/',                 AdminAppointmentsView.as_view(),             name='admin-appointments'),
    path('appointments/<int:pk>/',        AdminAppointmentDetailView.as_view(),        name='admin-appointment-detail'),

    # Complaints
    path('complaints/',                   AdminComplaintsView.as_view(),               name='admin-complaints'),
    path('complaints/<int:pk>/',          AdminComplaintDetailView.as_view(),          name='admin-complaint-detail'),

    # Feedback
    path('feedback/',                     AdminFeedbackView.as_view(),                 name='admin-feedback'),
    path('feedback/<int:pk>/',            AdminFeedbackDetailView.as_view(),           name='admin-feedback-detail'),
]
