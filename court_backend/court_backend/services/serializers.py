import uuid
from rest_framework import serializers
from .models import (
    ServiceRequest, ServiceDocument,
    DocumentSubmission, SubmissionFile,
    ArbitrationFee, DocumentSearchRequest,
    Appointment, ComplaintForm, ComplaintFile, Feedback,
)


def generate_ref(prefix):
    return f"{prefix}-{uuid.uuid4().hex[:8].upper()}"


# ─── Existing ─────────────────────────────────────────────────────────────────

class ServiceDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceDocument
        fields = ['id', 'file', 'document_type', 'uploaded_at']
        read_only_fields = ['uploaded_at']


class ServiceRequestSerializer(serializers.ModelSerializer):
    documents = ServiceDocumentSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ServiceRequest
        fields = ['id', 'user', 'service_name', 'data', 'documents', 'created_at']
        read_only_fields = ['user', 'created_at']


# ─── Document Submission ──────────────────────────────────────────────────────

class SubmissionFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmissionFile
        fields = ['id', 'file', 'file_name', 'uploaded_at']
        read_only_fields = ['uploaded_at']


class DocumentSubmissionSerializer(serializers.ModelSerializer):
    files = SubmissionFileSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DocumentSubmission
        fields = [
            'id', 'user', 'case_number', 'document_type', 'description',
            'status', 'reference_id', 'files', 'created_at',
        ]
        read_only_fields = ['user', 'status', 'reference_id', 'created_at']

    def create(self, validated_data):
        validated_data['reference_id'] = generate_ref('DOC')
        return super().create(validated_data)


# ─── Arbitration Fee ──────────────────────────────────────────────────────────

class ArbitrationFeeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ArbitrationFee
        fields = [
            'id', 'user', 'court_cause_type', 'case_title',
            'claim_amount', 'calculated_fee', 'status', 'reference_id', 'created_at',
        ]
        read_only_fields = ['user', 'status', 'reference_id', 'created_at']

    def create(self, validated_data):
        validated_data['reference_id'] = generate_ref('FEE')
        return super().create(validated_data)


# ─── Document Search ──────────────────────────────────────────────────────────

class DocumentSearchRequestSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DocumentSearchRequest
        fields = [
            'id', 'user', 'search_case_number', 'search_keywords',
            'search_document_type', 'search_case_year',
            'requested_document_ids', 'status', 'reference_id', 'created_at',
        ]
        read_only_fields = ['user', 'status', 'reference_id', 'created_at']

    def create(self, validated_data):
        validated_data['reference_id'] = generate_ref('SCH')
        return super().create(validated_data)


# ─── Appointment ──────────────────────────────────────────────────────────────

class AppointmentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'user', 'appointment_date', 'appointment_time',
            'purpose', 'case_number', 'notes', 'status', 'reference_id', 'created_at',
        ]
        read_only_fields = ['user', 'status', 'reference_id', 'created_at']

    def create(self, validated_data):
        validated_data['reference_id'] = generate_ref('APT')
        return super().create(validated_data)


# ─── Complaint Form ───────────────────────────────────────────────────────────

class ComplaintFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintFile
        fields = ['id', 'file', 'file_name', 'uploaded_at']
        read_only_fields = ['uploaded_at']


class ComplaintFormSerializer(serializers.ModelSerializer):
    files = ComplaintFileSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ComplaintForm
        fields = [
            'id', 'user', 'complaint_type', 'against_whom',
            'complaint_description', 'desired_resolution',
            'status', 'reference_id', 'files', 'created_at',
        ]
        read_only_fields = ['user', 'status', 'reference_id', 'created_at']

    def create(self, validated_data):
        validated_data['reference_id'] = generate_ref('CMP')
        return super().create(validated_data)


# ─── Feedback ─────────────────────────────────────────────────────────────────

class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Feedback
        fields = [
            'id', 'user', 'service_name', 'rating',
            'comments', 'suggestions', 'reference_id', 'created_at',
        ]
        read_only_fields = ['user', 'reference_id', 'created_at']

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def create(self, validated_data):
        validated_data['reference_id'] = generate_ref('FBK')
        return super().create(validated_data)


# ─── My Requests (unified list) ───────────────────────────────────────────────

class MyRequestsSerializer(serializers.Serializer):
    """Combines all service types into one list for the dashboard."""
    id = serializers.IntegerField()
    service = serializers.CharField()
    reference_id = serializers.CharField()
    status = serializers.CharField()
    created_at = serializers.DateTimeField()