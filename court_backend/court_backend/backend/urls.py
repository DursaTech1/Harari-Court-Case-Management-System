from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import home
from .custom_admin import overview_view

urlpatterns = [
    path("", home, name="home"),
    path("admin/overview/", admin.site.admin_view(overview_view), name="admin-overview"),
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/services/", include("services.urls")),
    path("api/admin/",    include("backend.admin_urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
