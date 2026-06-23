from django.contrib import admin
from django.contrib.auth.forms import AdminPasswordChangeForm
from django.utils.html import format_html
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display  = ('avatar', 'full_name', 'email', 'phone',
                     'role_badge', 'is_active_badge', 'total_submissions')
    list_filter   = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'full_name', 'phone')
    ordering      = ('-id',)
    list_per_page = 30
    list_display_links = ('avatar', 'full_name')

    fieldsets = (
        ('Account', {
            'fields': ('email',)
        }),
        ('Personal Info', {
            'fields': ('full_name', 'phone')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser'),
            'classes': ('collapse',),
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'phone', 'password1', 'password2'),
        }),
    )

    readonly_fields = ('last_login',)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj is None:
            # On add: include password fields
            from django import forms
            class AddUserForm(form):
                password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
                password2 = forms.CharField(label='Password (again)', widget=forms.PasswordInput)
                def clean(self):
                    data = super().clean()
                    if data.get('password1') != data.get('password2'):
                        raise forms.ValidationError("Passwords don't match.")
                    return data
                def save(self, commit=True):
                    user = super().save(commit=False)
                    user.set_password(self.cleaned_data['password1'])
                    if commit:
                        user.save()
                    return user
            return AddUserForm
        return form

    # ── Custom columns ────────────────────────────────────────────────────────

    @admin.display(description='')
    def avatar(self, obj):
        initial = (obj.full_name or obj.email)[0].upper()
        bg = '#8e44ad' if obj.is_superuser else ('#1a73e8' if obj.is_staff else '#34495e')
        return format_html(
            '<div style="width:34px;height:34px;border-radius:50%;background:{};'
            'color:#fff;display:flex;align-items:center;justify-content:center;'
            'font-weight:700;font-size:14px;">{}</div>',
            bg, initial
        )

    @admin.display(description='Role')
    def role_badge(self, obj):
        if obj.is_superuser:
            return format_html(
                '<span style="background:#8e44ad;color:#fff;padding:2px 9px;'
                'border-radius:10px;font-size:11px;">⚡ Superuser</span>'
            )
        if obj.is_staff:
            return format_html(
                '<span style="background:#1a73e8;color:#fff;padding:2px 9px;'
                'border-radius:10px;font-size:11px;">🛡 Staff</span>'
            )
        return format_html(
            '<span style="background:#27ae60;color:#fff;padding:2px 9px;'
            'border-radius:10px;font-size:11px;">👤 Citizen</span>'
        )

    @admin.display(description='Active')
    def is_active_badge(self, obj):
        color = '#27ae60' if obj.is_active else '#e74c3c'
        label = 'Active' if obj.is_active else 'Inactive'
        return format_html(
            '<span style="color:{};font-size:18px;" title="{}">●</span>',
            color, label
        )

    @admin.display(description='Submissions')
    def total_submissions(self, obj):
        from services.models import DocumentSubmission
        count = DocumentSubmission.objects.filter(user=obj).count()
        color = '#1a73e8' if count > 0 else '#95a5a6'
        return format_html('<strong style="color:{}">📄 {}</strong>', color, count)
