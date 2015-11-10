"""
All models and registrations for Admin pages

:TODO:
- Update layout with models.py changes
"""

from django.contrib import admin
from .models import Event, LdtUser, Comment, ShoppingListItem, ShoppingList
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User


class LdtUserAdmin(admin.ModelAdmin):
    fields = ['display_name', 'user', 'friends', 'email', 'phone']


class EventAdmin(admin.ModelAdmin):
    fields = ['display_name', 'start_date', 'end_date', 'participants', 'hosts']


class CommentAdmin(admin.ModelAdmin):
    fields = ['post_date', 'author', 'content']


class ShoppingListItemAdmin(admin.ModelAdmin):
    fields = ["display_name", "quantity", "cost", "supplier", "ready"]
    list_display = ("id", "display_name")


class ShoppingListAdmin(admin.ModelAdmin):
    fields = ["id", "items"]


# Customize views of Users
UserAdmin.list_display = ('id', 'username', 'userlink', 'email', 'is_staff',)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Event)
admin.site.register(LdtUser)
admin.site.register(Comment)
admin.site.register(ShoppingList)
admin.site.register(ShoppingListItem)
