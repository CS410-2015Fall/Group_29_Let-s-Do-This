"""
All models and registrations for Admin pages

:TODO:
- Update layout with models.py changes
"""

from django.contrib import admin
from .models import Event, LdtUser
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User


class LdtUserAdmin(admin.ModelAdmin):
    fields = ['display_name', 'user', 'friends', 'email', 'phone']


class EventAdmin(admin.ModelAdmin):
    fields = ['display_name', 'start_date', 'end_date', 'participants', 'hosts']


# Customize views of Users
UserAdmin.list_display = ('id', 'username', 'userlink', 'email', 'is_staff',)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Event)
admin.site.register(LdtUser)
