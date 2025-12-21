from django.contrib import admin
from .models import ServiceRequest, ServiceDocument

class ServiceDocumentInline(admin.TabularInline):
    model = ServiceDocument
    extra = 0
    readonly_fields = ("file", "uploaded_at")


@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ("service_name", "user", "created_at")
    list_filter = ("service_name", "created_at")
    search_fields = ("service_name", "user__email")
    readonly_fields = ("created_at",)
    inlines = [ServiceDocumentInline]

    fieldsets = (
        ("User", {"fields": ("user",)}),
        ("Service", {"fields": ("service_name", "created_at")}),
        ("Submitted Data", {"fields": ("data",)}),
    )


@admin.register(ServiceDocument)
class ServiceDocumentAdmin(admin.ModelAdmin):
    list_display = ("file", "service_request", "uploaded_at")
