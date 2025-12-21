from django.db import models
from django.conf import settings

class ServiceRequest(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="services"
    )
    service_name = models.CharField(max_length=255)
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.service_name}"


class ServiceDocument(models.Model):
    service_request = models.ForeignKey(
        ServiceRequest,
        related_name="documents",
        on_delete=models.CASCADE
    )
    file = models.FileField(upload_to="documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
