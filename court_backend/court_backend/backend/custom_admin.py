"""
Standalone overview view for /admin/overview/.
Imported in urls.py and wrapped with admin.site.admin_view().
"""
from django.contrib import admin
from django.shortcuts import render


def overview_view(request):
    from services.models import (
        DocumentSubmission, ArbitrationFee, DocumentSearchRequest,
        Appointment, ComplaintForm, Feedback,
    )
    from accounts.models import User

    feedback_qs = Feedback.objects.all()
    avg_rating = (
        round(sum(f.rating for f in feedback_qs) / max(feedback_qs.count(), 1), 1)
        if feedback_qs.exists() else 0.0
    )

    context = {
        **admin.site.each_context(request),
        'title': 'System Overview',
        'stats': {
            'users':           User.objects.count(),
            'active_users':    User.objects.filter(is_active=True).count(),
            'submissions':     DocumentSubmission.objects.count(),
            'pending_subs':    DocumentSubmission.objects.filter(status='pending').count(),
            'fees':            ArbitrationFee.objects.count(),
            'pending_fees':    ArbitrationFee.objects.filter(status='pending').count(),
            'searches':        DocumentSearchRequest.objects.count(),
            'appointments':    Appointment.objects.count(),
            'pending_apts':    Appointment.objects.filter(status='pending').count(),
            'complaints':      ComplaintForm.objects.count(),
            'open_complaints': ComplaintForm.objects.filter(status='submitted').count(),
            'feedback':        feedback_qs.count(),
            'avg_rating':      avg_rating,
        },
        'recent_submissions':  DocumentSubmission.objects.select_related('user').order_by('-created_at')[:5],
        'recent_complaints':   ComplaintForm.objects.select_related('user').order_by('-created_at')[:5],
        'recent_appointments': Appointment.objects.select_related('user').order_by('-created_at')[:5],
    }
    return render(request, 'admin/overview.html', context)
