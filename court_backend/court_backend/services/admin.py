from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from .models import (
    ServiceRequest, ServiceDocument,
    DocumentSubmission, SubmissionFile,
    ArbitrationFee, DocumentSearchRequest,
    Appointment, ComplaintForm, ComplaintFile, Feedback,
)


# ─── Helpers ──────────────────────────────────────────────────────────────────

STATUS_COLORS = {
    'pending':         '#f39c12',
    'under_review':    '#3498db',
    'approved':        '#27ae60',
    'rejected':        '#e74c3c',
    'paid':            '#27ae60',
    'failed':          '#e74c3c',
    'submitted':       '#3498db',
    'pending_approval':'#f39c12',
    'downloaded':      '#27ae60',
    'confirmed':       '#27ae60',
    'cancelled':       '#e74c3c',
    'completed':       '#27ae60',
    'postponed':       '#95a5a6',
    'resolved':        '#27ae60',
    'dismissed':       '#e74c3c',
    'in_progress':     '#3498db',
}

def colored_status(status):
    color = STATUS_COLORS.get(status, '#95a5a6')
    return format_html(
        '<span style="background:{};color:#fff;padding:3px 10px;'
        'border-radius:12px;font-size:11px;font-weight:600;">{}</span>',
        color, status.replace('_', ' ').title()
    )

def star_rating(rating):
    stars = '★' * rating + '☆' * (5 - rating)
    return format_html(
        '<span style="color:#f1c40f;font-size:16px;" title="{}/5">{}</span>',
        rating, stars
    )


# ─── Bulk status actions ──────────────────────────────────────────────────────

def make_status_action(new_status, label):
    def action_fn(modeladmin, request, queryset):
        updated = queryset.update(status=new_status)
        modeladmin.message_user(request, f'{updated} record(s) marked as "{new_status}".')
    action_fn.short_description = label
    action_fn.__name__ = f'mark_{new_status}'
    return action_fn


# ─── Inlines ──────────────────────────────────────────────────────────────────

class SubmissionFileInline(admin.TabularInline):
    model = SubmissionFile
    extra = 0
    readonly_fields = ('file_name', 'file', 'uploaded_at')
    can_delete = True
    verbose_name = "Attached File"
    verbose_name_plural = "Attached Files"


class ComplaintFileInline(admin.TabularInline):
    model = ComplaintFile
    extra = 0
    readonly_fields = ('file_name', 'file', 'uploaded_at')
    can_delete = True
    verbose_name = "Evidence File"
    verbose_name_plural = "Evidence Files"


class ServiceDocumentInline(admin.TabularInline):
    model = ServiceDocument
    extra = 0
    readonly_fields = ('document_type', 'file', 'uploaded_at')


# ─── ServiceRequest (legacy) ──────────────────────────────────────────────────

@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display  = ['id', 'user', 'service_name', 'created_at']
    list_filter   = ['service_name', 'created_at']
    search_fields = ['user__email', 'service_name']
    inlines       = [ServiceDocumentInline]
    readonly_fields = ['created_at']
    ordering      = ['-created_at']


# ─── Document Submission ──────────────────────────────────────────────────────

@admin.register(DocumentSubmission)
class DocumentSubmissionAdmin(admin.ModelAdmin):
    list_display  = ['reference_id', 'user_email', 'case_number',
                     'document_type', 'status_badge', 'file_count', 'created_at']
    list_filter   = ['status', 'document_type', 'created_at']
    search_fields = ['reference_id', 'user__email', 'user__full_name', 'case_number']
    readonly_fields = ['reference_id', 'created_at']
    list_per_page = 25
    ordering      = ['-created_at']
    inlines       = [SubmissionFileInline]
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Identification', {
            'fields': ('reference_id', 'user', 'created_at')
        }),
        ('Document Details', {
            'fields': ('case_number', 'document_type', 'description')
        }),
        ('Status', {
            'fields': ('status',)
        }),
    )

    actions = [
        make_status_action('under_review', '📋 Mark as Under Review'),
        make_status_action('approved',     '✅ Mark as Approved'),
        make_status_action('rejected',     '❌ Mark as Rejected'),
    ]

    @admin.display(description='User')
    def user_email(self, obj):
        return format_html('<strong>{}</strong><br><small>{}</small>',
                           obj.user.full_name, obj.user.email)

    @admin.display(description='Status')
    def status_badge(self, obj):
        return colored_status(obj.status)

    @admin.display(description='Files')
    def file_count(self, obj):
        count = obj.files.count()
        color = '#27ae60' if count > 0 else '#95a5a6'
        return format_html('<span style="color:{}">📎 {}</span>', color, count)


# ─── Arbitration Fee ──────────────────────────────────────────────────────────

@admin.register(ArbitrationFee)
class ArbitrationFeeAdmin(admin.ModelAdmin):
    list_display  = ['reference_id', 'user_email', 'court_cause_type',
                     'claim_formatted', 'fee_formatted', 'status_badge', 'created_at']
    list_filter   = ['status', 'court_cause_type', 'created_at']
    search_fields = ['reference_id', 'user__email', 'user__full_name', 'case_title']
    readonly_fields = ['reference_id', 'created_at']
    list_per_page = 25
    ordering      = ['-created_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Identification', {
            'fields': ('reference_id', 'user', 'created_at')
        }),
        ('Case Details', {
            'fields': ('court_cause_type', 'case_title')
        }),
        ('Financial', {
            'fields': ('claim_amount', 'calculated_fee')
        }),
        ('Status', {
            'fields': ('status',)
        }),
    )

    actions = [
        make_status_action('paid',   '✅ Mark as Paid'),
        make_status_action('failed', '❌ Mark as Failed'),
    ]

    @admin.display(description='User')
    def user_email(self, obj):
        return format_html('<strong>{}</strong><br><small>{}</small>',
                           obj.user.full_name, obj.user.email)

    @admin.display(description='Claim Amount')
    def claim_formatted(self, obj):
        return format_html('ETB {:,.2f}', obj.claim_amount)

    @admin.display(description='Court Fee')
    def fee_formatted(self, obj):
        return format_html('<strong style="color:#27ae60;">ETB {:,.2f}</strong>', obj.calculated_fee)

    @admin.display(description='Status')
    def status_badge(self, obj):
        return colored_status(obj.status)


# ─── Document Search Request ──────────────────────────────────────────────────

@admin.register(DocumentSearchRequest)
class DocumentSearchRequestAdmin(admin.ModelAdmin):
    list_display  = ['reference_id', 'user_email', 'search_case_number',
                     'search_keywords', 'status_badge', 'doc_count', 'created_at']
    list_filter   = ['status', 'created_at']
    search_fields = ['reference_id', 'user__email', 'user__full_name', 'search_case_number']
    readonly_fields = ['reference_id', 'created_at']
    list_per_page = 25
    ordering      = ['-created_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Identification', {'fields': ('reference_id', 'user', 'created_at')}),
        ('Search Criteria', {'fields': ('search_case_number', 'search_keywords',
                                        'search_document_type', 'search_case_year')}),
        ('Requested Documents', {'fields': ('requested_document_ids',)}),
        ('Status', {'fields': ('status',)}),
    )

    actions = [
        make_status_action('approved',  '✅ Approve Access'),
        make_status_action('rejected',  '❌ Reject Access'),
        make_status_action('downloaded','📥 Mark as Downloaded'),
    ]

    @admin.display(description='User')
    def user_email(self, obj):
        return format_html('<strong>{}</strong><br><small>{}</small>',
                           obj.user.full_name, obj.user.email)

    @admin.display(description='Status')
    def status_badge(self, obj):
        return colored_status(obj.status)

    @admin.display(description='Docs Requested')
    def doc_count(self, obj):
        count = len(obj.requested_document_ids) if obj.requested_document_ids else 0
        return format_html('📄 {}', count)


# ─── Appointment ──────────────────────────────────────────────────────────────

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display  = ['reference_id', 'user_email', 'appointment_date',
                     'appointment_time', 'purpose_badge', 'case_number',
                     'status_badge', 'created_at']
    list_filter   = ['status', 'purpose', 'appointment_date']
    search_fields = ['reference_id', 'user__email', 'user__full_name', 'case_number']
    readonly_fields = ['reference_id', 'created_at']
    list_per_page = 25
    ordering      = ['-appointment_date', '-appointment_time']
    date_hierarchy = 'appointment_date'

    fieldsets = (
        ('Identification', {'fields': ('reference_id', 'user', 'created_at')}),
        ('Appointment Details', {'fields': ('appointment_date', 'appointment_time',
                                            'purpose', 'case_number')}),
        ('Notes', {'fields': ('notes',)}),
        ('Status', {'fields': ('status',)}),
    )

    actions = [
        make_status_action('confirmed',  '✅ Confirm Appointment'),
        make_status_action('cancelled',  '❌ Cancel Appointment'),
        make_status_action('completed',  '🏁 Mark as Completed'),
    ]

    PURPOSE_ICONS = {
        'hearing': '🔔', 'consultation': '💬',
        'document_pickup': '📦', 'filing': '📝', 'other': '📅',
    }

    @admin.display(description='User')
    def user_email(self, obj):
        return format_html('<strong>{}</strong><br><small>{}</small>',
                           obj.user.full_name, obj.user.email)

    @admin.display(description='Status')
    def status_badge(self, obj):
        return colored_status(obj.status)

    @admin.display(description='Purpose')
    def purpose_badge(self, obj):
        icon = self.PURPOSE_ICONS.get(obj.purpose, '📅')
        return format_html('{} {}', icon, obj.get_purpose_display())


# ─── Complaint Form ───────────────────────────────────────────────────────────

@admin.register(ComplaintForm)
class ComplaintFormAdmin(admin.ModelAdmin):
    list_display  = ['reference_id', 'user_email', 'complaint_type',
                     'against_whom', 'status_badge', 'file_count', 'created_at']
    list_filter   = ['status', 'complaint_type', 'created_at']
    search_fields = ['reference_id', 'user__email', 'user__full_name',
                     'complaint_type', 'against_whom']
    readonly_fields = ['reference_id', 'created_at']
    list_per_page = 25
    ordering      = ['-created_at']
    date_hierarchy = 'created_at'
    inlines       = [ComplaintFileInline]

    fieldsets = (
        ('Identification', {'fields': ('reference_id', 'user', 'created_at')}),
        ('Complaint Details', {
            'fields': ('complaint_type', 'against_whom', 'complaint_description')
        }),
        ('Resolution', {'fields': ('desired_resolution',)}),
        ('Status', {'fields': ('status',)}),
    )

    actions = [
        make_status_action('under_review', '📋 Mark as Under Review'),
        make_status_action('resolved',     '✅ Mark as Resolved'),
        make_status_action('dismissed',    '❌ Dismiss'),
    ]

    @admin.display(description='User')
    def user_email(self, obj):
        return format_html('<strong>{}</strong><br><small>{}</small>',
                           obj.user.full_name, obj.user.email)

    @admin.display(description='Status')
    def status_badge(self, obj):
        return colored_status(obj.status)

    @admin.display(description='Evidence')
    def file_count(self, obj):
        count = obj.files.count()
        color = '#e74c3c' if count > 0 else '#95a5a6'
        return format_html('<span style="color:{}">📎 {} file(s)</span>', color, count)


# ─── Feedback ─────────────────────────────────────────────────────────────────

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display  = ['reference_id', 'user_email', 'service_name',
                     'rating_stars', 'comment_preview', 'created_at']
    list_filter   = ['rating', 'service_name', 'created_at']
    search_fields = ['reference_id', 'user__email', 'user__full_name', 'service_name']
    readonly_fields = ['reference_id', 'created_at']
    list_per_page = 25
    ordering      = ['-created_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Identification', {'fields': ('reference_id', 'user', 'created_at')}),
        ('Feedback', {'fields': ('service_name', 'rating', 'comments', 'suggestions')}),
    )

    @admin.display(description='User')
    def user_email(self, obj):
        return format_html('<strong>{}</strong><br><small>{}</small>',
                           obj.user.full_name, obj.user.email)

    @admin.display(description='Rating')
    def rating_stars(self, obj):
        return star_rating(obj.rating)

    @admin.display(description='Comment')
    def comment_preview(self, obj):
        if obj.comments:
            preview = obj.comments[:60] + ('…' if len(obj.comments) > 60 else '')
            return format_html('<span title="{}">{}</span>', obj.comments, preview)
        return format_html('<em style="color:#95a5a6;">No comment</em>')
