"""
Models for (de)serialization at API requests

This is for remote CRUD requests only. Most app logic will be in front-end client.

:TODO:
- hash/don't return User passwords (here or in views.py)
"""
from rest_framework import serializers
from models import Event, LdtUser, Comment
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

    # useful for displaying id + username, but not helpful for POSTs - see views/comment for logic
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'author', 'post_date', 'content', 'event')

    # def create(self, validated_data):
    #     """
    #     Trying to follow http://www.django-rest-framework.org/api-guide/relations/ but can't get to work
    #     """
    #     author_data = validated_data.pop('author')
    #     # return author_data
    #     comment = Comment.objects.create(**validated_data)
    #     comment.author = author_data
    #     # comment.author = author_data
    #     # for au in author_data:
    #     #     Track.objects.create(album=album, **track_data)
    #     return comment


class EventSerializer(serializers.ModelSerializer):

    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'display_name', 'start_date', 'end_date', 'budget', 'location', 'hosts', 'invites',
                  'accepts', 'declines', 'comments', 'shopping_list')
