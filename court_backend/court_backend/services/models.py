from django.db import models
from django.conf import settings

# models.py
class ServiceRequest(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="services"
    )
    service_name = models.CharField(max_length=255)
    data = models.TextField(default="{}")   # Add default
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.service_name}"


class ServiceDocument(models.Model):
    service_request = models.ForeignKey(
        ServiceRequest,
        related_name="documents",
        on_delete=models.CASCADE
    )
    file = models.FileField(upload_to="service_documents/%Y/%m/%d/")  # Better organization
    uploaded_at = models.DateTimeField(auto_now_add=True)
    document_type = models.CharField(max_length=100, blank=True)  # Add document type field
    
    def __str__(self):
        return f"{self.document_type} - {self.file.name}"