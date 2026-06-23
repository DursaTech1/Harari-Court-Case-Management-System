import itertools
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    ServiceRequest, ServiceDocument,
    DocumentSubmission, SubmissionFile,
    ArbitrationFee, DocumentSearchRequest,
    Appointment, ComplaintForm, ComplaintFile, Feedback,
)
from .serializers import (
    ServiceRequestSerializer,
    DocumentSubmissionSerializer,
    ArbitrationFeeSerializer,
    DocumentSearchRequestSerializer,
    AppointmentSerializer,
    ComplaintFormSerializer,
    FeedbackSerializer,
)

# ─── Static public services list ─────────────────────────────────────────────

COURT_SERVICES = [
    {"id": 1, "name": "Document Submission", "icon": "📄",
     "description": "Submit legal documents electronically",
     "requirements": ["Valid ID", "Case Documents", "Cover Letter (optional)"]},
    {"id": 2, "name": "Arbitration Fee", "icon": "💰",
     "description": "Pay court and arbitration fees online",
     "requirements": ["Case Type", "Claim Amount", "Case Title"]},
    {"id": 3, "name": "Search Document", "icon": "🔍",
     "description": "Search and retrieve court documents",
     "requirements": ["Case Number or Keywords"]},
    {"id": 4, "name": "Daily Appointment", "icon": "📅",
     "description": "Book a daily appointment with court officials",
     "requirements": ["Preferred Date & Time", "Purpose"]},
    {"id": 5, "name": "Complaint Form", "icon": "📝",
     "description": "File official complaints or grievances",
     "requirements": ["Complaint Description", "Supporting Evidence (optional)"]},
    {"id": 6, "name": "FeedBack", "icon": "💬",
     "description": "Rate and review court services",
     "requirements": ["Service Name", "Rating (1-5)"]},
]


class CourtServicesListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(COURT_SERVICES)


# ─── Dashboard stats ──────────────────────────────────────────────────────────

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        stats = {
            "active_cases": DocumentSubmission.objects.filter(user=user).count(),
            "pending_payments": ArbitrationFee.objects.filter(user=user, status='pending').count(),
            "upcoming_hearings": Appointment.objects.filter(user=user, status__in=['pending', 'confirmed']).count(),
            "unread_messages": 0,
            "completed_services": (
                DocumentSubmission.objects.filter(user=user, status='approved').count() +
                ArbitrationFee.objects.filter(user=user, status='paid').count() +
                Appointment.objects.filter(user=user, status='completed').count()
            ),
        }
        return Response(stats)


# ─── My Requests (unified history) ───────────────────────────────────────────

class MyRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        def fmt(qs, service_label):
            return [
                {
                    "id": obj.id,
                    "service": service_label,
                    "reference_id": obj.reference_id,
                    "status": obj.status,
                    "created_at": obj.created_at.isoformat(),
                }
                for obj in qs
            ]

        all_requests = list(itertools.chain(
            fmt(DocumentSubmission.objects.filter(user=user), "Document Submission"),
            fmt(ArbitrationFee.objects.filter(user=user), "Arbitration Fee"),
            fmt(DocumentSearchRequest.objects.filter(user=user), "Search Document"),
            fmt(Appointment.objects.filter(user=user), "Daily Appointment"),
            fmt(ComplaintForm.objects.filter(user=user), "Complaint Form"),
            fmt(Feedback.objects.filter(user=user), "Feedback"),
        ))

        all_requests.sort(key=lambda x: x["created_at"], reverse=True)
        return Response(all_requests)


# ─── Document Submission ──────────────────────────────────────────────────────

class DocumentSubmissionView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DocumentSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save(user=request.user)

        # Attach uploaded files
        for file in request.FILES.getlist('files'):
            SubmissionFile.objects.create(
                submission=submission,
                file=file,
                file_name=file.name,
            )

        return Response(DocumentSubmissionSerializer(submission).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        qs = DocumentSubmission.objects.filter(user=request.user)
        return Response(DocumentSubmissionSerializer(qs, many=True).data)


# ─── Arbitration Fee ──────────────────────────────────────────────────────────

class ArbitrationFeeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ArbitrationFeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        fee = serializer.save(user=request.user)
        return Response(ArbitrationFeeSerializer(fee).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        qs = ArbitrationFee.objects.filter(user=request.user)
        return Response(ArbitrationFeeSerializer(qs, many=True).data)


# ─── Document Search ──────────────────────────────────────────────────────────

class DocumentSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DocumentSearchRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        search = serializer.save(user=request.user)
        return Response(DocumentSearchRequestSerializer(search).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        qs = DocumentSearchRequest.objects.filter(user=request.user)
        return Response(DocumentSearchRequestSerializer(qs, many=True).data)


# ─── Appointment ──────────────────────────────────────────────────────────────

class AppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        appt = serializer.save(user=request.user)
        return Response(AppointmentSerializer(appt).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        qs = Appointment.objects.filter(user=request.user)
        return Response(AppointmentSerializer(qs, many=True).data)


# ─── Complaint Form ───────────────────────────────────────────────────────────

class ComplaintFormView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ComplaintFormSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        complaint = serializer.save(user=request.user)

        for file in request.FILES.getlist('files'):
            ComplaintFile.objects.create(
                complaint=complaint,
                file=file,
                file_name=file.name,
            )

        return Response(ComplaintFormSerializer(complaint).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        qs = ComplaintForm.objects.filter(user=request.user)
        return Response(ComplaintFormSerializer(qs, many=True).data)


# ─── Feedback ─────────────────────────────────────────────────────────────────

class FeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        fb = serializer.save(user=request.user)
        return Response(FeedbackSerializer(fb).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        qs = Feedback.objects.filter(user=request.user)
        return Response(FeedbackSerializer(qs, many=True).data)


# ─── Legacy generic submit (kept for backward compat) ────────────────────────

class ServiceRequestView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist('documents[]')
        service_data = {
            k: v for k, v in request.data.items()
            if k not in ('documents[]', 'documents')
        }
        service_request = ServiceRequest.objects.create(
            user=request.user,
            service_name=request.data.get('service_name', ''),
            data=service_data,
        )
        for file in files:
            ServiceDocument.objects.create(
                service_request=service_request,
                file=file,
                document_type=request.data.get('document_type', 'general'),
            )
        serializer = ServiceRequestSerializer(service_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)