"""
Admin-only CRUD API views.
All endpoints require IsAdminUser (is_staff=True).

Routes (mounted at /api/admin/):
  GET    /api/admin/stats/
  GET    /api/admin/users/

  GET    /api/admin/document-submissions/
  GET    /api/admin/document-submissions/<id>/
  PATCH  /api/admin/document-submissions/<id>/
  DELETE /api/admin/document-submissions/<id>/

  GET    /api/admin/arbitration-fees/
  PATCH  /api/admin/arbitration-fees/<id>/
  DELETE /api/admin/arbitration-fees/<id>/

  GET    /api/admin/search-requests/
  PATCH  /api/admin/search-requests/<id>/
  DELETE /api/admin/search-requests/<id>/

  GET    /api/admin/appointments/
  PATCH  /api/admin/appointments/<id>/
  DELETE /api/admin/appointments/<id>/

  GET    /api/admin/complaints/
  PATCH  /api/admin/complaints/<id>/
  DELETE /api/admin/complaints/<id>/

  GET    /api/admin/feedback/
  DELETE /api/admin/feedback/<id>/
"""
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from services.models import (
    DocumentSubmission, ArbitrationFee, DocumentSearchRequest,
    Appointment, ComplaintForm, Feedback,
)
from services.serializers import (
    DocumentSubmissionSerializer, ArbitrationFeeSerializer,
    DocumentSearchRequestSerializer, AppointmentSerializer,
    ComplaintFormSerializer, FeedbackSerializer,
)

User = get_user_model()


# ─── helpers ─────────────────────────────────────────────────────────────────

def get_or_404(model, pk):
    try:
        return model.objects.get(pk=pk)
    except model.DoesNotExist:
        return None


class AdminMixin:
    permission_classes = [IsAdminUser]


# ─── Stats ────────────────────────────────────────────────────────────────────

class AdminStatsView(AdminMixin, APIView):
    def get(self, request):
        return Response({
            "total_users":          User.objects.count(),
            "document_submissions": DocumentSubmission.objects.count(),
            "arbitration_fees":     ArbitrationFee.objects.count(),
            "search_requests":      DocumentSearchRequest.objects.count(),
            "appointments":         Appointment.objects.count(),
            "complaints":           ComplaintForm.objects.count(),
            "feedback":             Feedback.objects.count(),
            # status breakdowns
            "pending_submissions":  DocumentSubmission.objects.filter(status='pending').count(),
            "pending_fees":         ArbitrationFee.objects.filter(status='pending').count(),
            "pending_appointments": Appointment.objects.filter(status='pending').count(),
            "pending_complaints":   ComplaintForm.objects.filter(status='submitted').count(),
        })


# ─── Users ────────────────────────────────────────────────────────────────────

class AdminUsersView(AdminMixin, APIView):
    def get(self, request):
        users = User.objects.all().values(
            'id', 'email', 'full_name', 'phone', 'is_staff', 'is_active', 'is_superuser'
        )
        return Response(list(users))


# ─── Document Submissions ─────────────────────────────────────────────────────

class AdminDocumentSubmissionsView(AdminMixin, APIView):
    def get(self, request):
        qs = DocumentSubmission.objects.select_related('user').prefetch_related('files').all()
        return Response(DocumentSubmissionSerializer(qs, many=True).data)


class AdminDocumentSubmissionDetailView(AdminMixin, APIView):
    def get(self, request, pk):
        obj = get_or_404(DocumentSubmission, pk)
        if not obj:
            return Response({'detail': 'Not found.'}, status=404)
        return Response(DocumentSubmissionSerializer(obj).data)

    def patch(self, request, pk):
        obj = get_or_404(DocumentSubmission, pk)
        if not obj:
            return Response({'detail': 'Not found.'}, status=404)
        serializer = DocumentSubmissionSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        obj = get_or_404(DocumentSubmission, pk)
        if not obj:
            return Response({'detail': 'Not found.'}, status=404)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ─── Arbitration Fees ─────────────────────────────────────────────────────────

class AdminArbitrationFeesView(AdminMixin, APIView):
    def get(self, request):
        qs = ArbitrationFee.objects.select_related('user').all()
        return Response(ArbitrationFeeSerializer(qs, many=True).data)


class AdminArbitrationFeeDetailView(AdminMixin, APIView):
    def patch(self, request, pk):
        obj = get_or_404(ArbitrationFee, pk)
        if not obj:
            return Response({'detail': 'Not found.'}, status=404)
        s = ArbitrationFeeSerializer(obj, data=request.data, partial=True)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)

    def delete(self, request, pk):
        obj = get_or_404(ArbitrationFee, pk)
        if not obj:
            return Response({'detail': 'Not found.'}, status=404)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ─── Document Search Requests ─────────────────────────────────────────────────

class AdminSearchRequestsView(AdminMixin, APIView):
    def get(self, request):
        qs = DocumentSearchRequest.objects.select_related('user').all()
        return Response(DocumentSearchRequestSerializer(qs, many=True).data)


class AdminSearchRequestDetailView(AdminMixin, APIView):
    def patch(self, request, pk):
        obj = get_or_404(DocumentSearchRequest, pk)
        if not obj:
            return Response({'detail': 'Not found.'}, status=404)
        s = DocumentSearchRequestSerializer(obj, data=request.data, partial=True)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)

    def delete(self, request, pk):
        obj = get_or_404(DocumentSearchRequest, pk)
        if not obj:
            return Response({'detail': 'Not found.'}, status=404)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ─── Appointments ─────────────────────────────────────────────────────────────

class AdminAppointmentsView(AdminMixin, APIView):
    def get(self, request):
        qs = Appointment.objects.select_related('user').all()
        return Response(AppointmentSerializer(qs, many=True).data)


class AdminAppointmentDetailView(AdminMixin, APIView):
    def patch(self, request, pk):
        obj = get_or_404(Appointment, pk)
        if not obj:
            return Response({'detail': 'Not found.'}, status=404)
        s = AppointmentSerializer(obj, data=request.data, partial=True)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)

    def delete(self, request, pk):
        obj = get_or_404(Appointment, pk)
        if not obj:
            return Response({'detail': 'Not found.'}, status=404)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ─── Complaints ───────────────────────────────────────────────────────────────

class AdminComplaintsView(AdminMixin, APIView):
    def get(self, request):
        qs = ComplaintForm.objects.select_related('user').prefetch_related('files').all()
        return Response(ComplaintFormSerializer(qs, many=True).data)


class AdminComplaintDetailView(AdminMixin, APIView):
    def patch(self, request, pk):
        obj = get_or_404(ComplaintForm, pk)
        if not obj:
            return Response({'detail': 'Not found.'}, status=404)
        s = ComplaintFormSerializer(obj, data=request.data, partial=True)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)

    def delete(self, request, pk):
        obj = get_or_404(ComplaintForm, pk)
        if not obj:
            return Response({'detail': 'Not found.'}, status=404)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ─── Feedback ─────────────────────────────────────────────────────────────────

class AdminFeedbackView(AdminMixin, APIView):
    def get(self, request):
        qs = Feedback.objects.select_related('user').all()
        return Response(FeedbackSerializer(qs, many=True).data)


class AdminFeedbackDetailView(AdminMixin, APIView):
    def delete(self, request, pk):
        obj = get_or_404(Feedback, pk)
        if not obj:
            return Response({'detail': 'Not found.'}, status=404)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
