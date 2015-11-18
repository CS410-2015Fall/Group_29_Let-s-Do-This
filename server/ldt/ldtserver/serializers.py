"""
Models for (de)serialization at API requests

This is for remote CRUD requests only. Most app logic will be in front-end client.

:TODO:
- hash/don't return User passwords (here or in views.py)
"""
from rest_framework import serializers
from models import Event, LdtUser, Comment, ShoppingList, ShoppingListItem
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username',)


class LdtUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = LdtUser
        fields = ('user', 'phone', 'email', 'friends')


class CommentSerializer(serializers.ModelSerializer):

    # useful for displaying id + username, but not helpful for POSTs - see views/comment for that logic
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'author', 'post_date', 'content', 'event')


class ShoppingListItemSerializer(serializers.ModelSerializer):

    # useful for displaying id + username, but not helpful for POSTs - see views/comment for that logic
    supplier = UserSerializer(read_only=True)

    class Meta:
        model = ShoppingListItem
        fields = ('id', 'display_name', 'quantity', 'cost', 'supplier', 'ready')


class ShoppingListSerializer(serializers.ModelSerializer):

    # useful for item details, but not helpful for POSTs - see views/comment for that logic
    items = ShoppingListItemSerializer(many=True, read_only=True)

    class Meta:
        model = ShoppingList
        fields = ('id', 'items', 'event')


class EventSerializer(serializers.ModelSerializer):

    # useful for Event details, but not helpful for POSTs - see views/comment for that logic
    comments = CommentSerializer(many=True, read_only=True)
    shopping_list = ShoppingListSerializer(read_only=True)

    contributions = serializers.SerializerMethodField("get_event_contributions")

    def get_event_contributions(self, event):
        return Event.get_contributions(event)

    class Meta:
        model = Event
        fields = ('id', 'display_name', 'start_date', 'end_date', 'budget', 'location', 'hosts', 'invites',
                  'accepts', 'declines', 'comments', 'shopping_list', 'contributions')
