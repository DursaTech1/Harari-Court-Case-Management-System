import json
from django.db import models
from django.conf import settings


# ─── Existing models (unchanged) ─────────────────────────────────────────────

class ServiceRequest(models.Model):
    """Generic log of any service request submitted by a user."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="services"
    )
    service_name = models.CharField(max_length=255)
    data = models.TextField(default="{}")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.service_name}"


class ServiceDocument(models.Model):
    service_request = models.ForeignKey(
        ServiceRequest,
        related_name="documents",
        on_delete=models.CASCADE
    )
    file = models.FileField(upload_to="service_documents/%Y/%m/%d/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    document_type = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.document_type} - {self.file.name}"


# ─── New service-specific models ─────────────────────────────────────────────

class DocumentSubmission(models.Model):
    """A user's legal document submission to the court."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="document_submissions"
    )
    case_number = models.CharField(max_length=100, blank=True)
    document_type = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reference_id = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference_id} - {self.user.email}"


class SubmissionFile(models.Model):
    """A file attached to a DocumentSubmission."""
    submission = models.ForeignKey(
        DocumentSubmission,
        on_delete=models.CASCADE,
        related_name="files"
    )
    file = models.FileField(upload_to="submissions/%Y/%m/%d/")
    file_name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name


class ArbitrationFee(models.Model):
    """A court fee payment record."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="arbitration_fees"
    )
    court_cause_type = models.CharField(max_length=100)
    case_title = models.CharField(max_length=255)
    claim_amount = models.DecimalField(max_digits=14, decimal_places=2)
    calculated_fee = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reference_id = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference_id} - {self.court_cause_type}"


class DocumentSearchRequest(models.Model):
    """A request to search/access court documents."""
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('pending_approval', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('downloaded', 'Downloaded'),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="document_searches"
    )
    search_case_number = models.CharField(max_length=100, blank=True)
    search_keywords = models.CharField(max_length=255, blank=True)
    search_document_type = models.CharField(max_length=100, blank=True)
    search_case_year = models.CharField(max_length=10, blank=True)
    # Stores the IDs of documents the user requested access to
    requested_document_ids = models.JSONField(default=list)
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='submitted')
    reference_id = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference_id} - {self.user.email}"


class Appointment(models.Model):
    """A citizen's appointment booking."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    PURPOSE_CHOICES = [
        ('hearing', 'Hearing'),
        ('consultation', 'Consultation'),
        ('document_pickup', 'Document Pickup'),
        ('filing', 'Filing'),
        ('other', 'Other'),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="appointments"
    )
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    purpose = models.CharField(max_length=50, choices=PURPOSE_CHOICES, default='other')
    case_number = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reference_id = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-appointment_date', '-appointment_time']

    def __str__(self):
        return f"{self.reference_id} - {self.appointment_date} {self.appointment_time}"


class ComplaintForm(models.Model):
    """A citizen complaint filed against a court service or official."""
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="complaints"
    )
    complaint_type = models.CharField(max_length=100, blank=True)
    against_whom = models.CharField(max_length=255, blank=True)
    complaint_description = models.TextField()
    desired_resolution = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    reference_id = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference_id} - {self.user.email}"


class ComplaintFile(models.Model):
    """A file attached to a ComplaintForm."""
    complaint = models.ForeignKey(
        ComplaintForm,
        on_delete=models.CASCADE,
        related_name="files"
    )
    file = models.FileField(upload_to="complaints/%Y/%m/%d/")
    file_name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name


class Feedback(models.Model):
    """User feedback / rating for a court service."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="feedback"
    )
    service_name = models.CharField(max_length=100)
    rating = models.IntegerField()          # 1-5
    comments = models.TextField(blank=True)
    suggestions = models.TextField(blank=True)
    reference_id = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference_id} - {self.service_name} ({self.rating}★)"