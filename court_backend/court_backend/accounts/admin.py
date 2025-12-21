from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "full_name", "phone", "service_used")
    search_fields = ("email", "full_name")

    def service_used(self, obj):
        return obj.services.count()

    service_used.short_description = "Services Used"
