from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from authentication.models import User


class UserAdmin(BaseUserAdmin):
    list_display = ['id', 'email', 'first_name', 'last_name', 'date_joined',
                    'is_staff', 'is_active', 'registration_method']
    list_filter = ['is_staff', ('date_joined', admin.DateFieldListFilter)]
    fieldsets = [
        ('Credentials', {'fields': ['email', 'password', 'registration_method']}),
        ('Personal info', {'fields': ['first_name', 'last_name']}),
        ('Permissions', {'fields': ['is_staff']}),
        ('User Status', {'fields': ['is_active']}),
    ]
    add_fieldsets = [
        (
            None,
            {
                'classes': ['wide'],
                'fields': ['email', 'first_name', 'last_name', 'password1', 'password2'],
            },
        ),
    ]
    search_fields = ['email']
    ordering = ['email']
    filter_horizontal = []


admin.site.register(User, UserAdmin)
