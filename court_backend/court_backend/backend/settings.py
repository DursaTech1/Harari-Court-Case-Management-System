"""
Django settings for Harari Court Case Management System.
"""

from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-4#rano^pl(d$(_8w!#6t=nb5v@auu!rv33o15y)pl!5&3eqgm5'

DEBUG = True

ALLOWED_HOSTS = ['*']

# ─── Jazzmin UI Configuration ─────────────────────────────────────────────────

JAZZMIN_SETTINGS = {
    # Title & Branding
    "site_title": "Harari Court Admin",
    "site_header": "Harari Court CMS",
    "site_brand": "⚖️ Harari Court",
    "welcome_sign": "Welcome to Harari Court Case Management System",
    "copyright": "Harari Region Supreme Court © 2024",

    # Top menu
    "topmenu_links": [
        {"name": "Home",          "url": "admin:index",     "permissions": ["auth.view_user"]},
        {"name": "📊 Overview",   "url": "/admin/overview/"},
        {"name": "🌐 Court Portal","url": "http://localhost:5173", "new_window": True},
        {"model": "accounts.User"},
    ],

    # User menu
    "usermenu_links": [
        {"model": "accounts.User"},
    ],

    # Sidebar
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],

    "order_with_respect_to": [
        "accounts",
        "services",
        "auth",
    ],

    # Icons for apps and models
    "icons": {
        "auth":                            "fas fa-users-cog",
        "auth.user":                       "fas fa-user",
        "auth.Group":                      "fas fa-users",
        "accounts":                        "fas fa-id-card",
        "accounts.User":                   "fas fa-user-tie",
        "services":                        "fas fa-balance-scale",
        "services.ServiceRequest":         "fas fa-file-alt",
        "services.DocumentSubmission":     "fas fa-file-upload",
        "services.SubmissionFile":         "fas fa-paperclip",
        "services.ArbitrationFee":         "fas fa-coins",
        "services.DocumentSearchRequest":  "fas fa-search",
        "services.Appointment":            "fas fa-calendar-check",
        "services.ComplaintForm":          "fas fa-exclamation-circle",
        "services.ComplaintFile":          "fas fa-paperclip",
        "services.Feedback":               "fas fa-star",
    },

    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",

    # UI Tweaks
    "related_modal_active": True,
    "custom_css": None,
    "custom_js": None,
    "use_google_fonts_cdn": True,
    "show_ui_builder": False,
    "changeform_format": "horizontal_tabs",

    # Search
    "search_model": ["accounts.User", "services.DocumentSubmission", "services.ComplaintForm"],
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-dark",
    "accent": "accent-primary",
    "navbar": "navbar-dark",
    "no_navbar_border": False,
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": True,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "darkly",           # Bootstrap 4 theme: darkly (dark elegant)
    "dark_mode_theme": "darkly",
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success",
    },
    "actions_sticky_top": True,
}

# ─── Apps ─────────────────────────────────────────────────────────────────────

INSTALLED_APPS = [
    "jazzmin",                              # ← must be BEFORE django.contrib.admin
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "corsheaders",
    "rest_framework",

    "accounts",
    "services",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ─── Database ─────────────────────────────────────────────────────────────────

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ─── Password Validation ──────────────────────────────────────────────────────

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ─── Internationalisation ─────────────────────────────────────────────────────

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Addis_Ababa'
USE_I18N = True
USE_TZ = True

# ─── Static & Media ───────────────────────────────────────────────────────────

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ─── DRF ──────────────────────────────────────────────────────────────────────

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=8),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}

AUTH_USER_MODEL = "accounts.User"
