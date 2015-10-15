"""
Models for (de)serialization at API requests

This is for remote CRUD requests only. Most app logic will be in front-end client.

:TODO:
- hash/don't return User passwords (here or in views.py)
"""
from rest_framework import serializers
from models import Event, LdtUser
from django.contrib.auth.models import User


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = ('id', 'display_name', 'start_date', 'end_date', 'budget', 'location', 'hosts', 'invites',
                  'accepts', 'declines',)


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'password',)


class LdtUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = LdtUser
        fields = ('user', 'phone', 'email', 'friends')
