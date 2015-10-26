"""
All Comment views for ldtserver (for RESTful API)
"""

import copy
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Event, Comment, User
from ..serializers import EventSerializer, CommentSerializer


COMMENT_FIELDS = ["author", "post_date", "content"]


def author_id_to_username(user_id=None):
    """ Helper to get username matching user_id """
    return


@api_view(['GET', 'POST'])
def comment_list(request, pk):
    """
    List all comments associated with event of pk, or create a new comment.

    POST request data must be formatted as follows. All fields mandatory:
    {
        "post_date": "2015-01-01T00:00Z",
        "author": 15,
        "content": "This string makes up my comment, by user of ID 15."
    }

    Note: DateTime is UTC and in format YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
    """
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        all_comments = Comment.objects.all()
        event_comments = [ac for ac in all_comments if ac in Event.get_comments(event)]
        serializer = CommentSerializer(event_comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # Automatically add event ID, which is pk provided
        data_with_event = request.data
        data_with_event.update({"event": [pk]})
        # Get author ID to add author after comment serialization
        author_id = request.data["author"]
        serializer = CommentSerializer(data=data_with_event)
        if serializer.is_valid():
            serializer.save()
            # Hacky because Django REST framework doesn't support writable nested entities
            new_comment = Comment.objects.get(pk=serializer.data["id"])
            new_comment.author = User.objects.get(pk=author_id)
            new_comment.save()
            # Return flat JSON response of new comment with author user fields
            # !!! refactor: flexible instead of hardcoded
            res = {
                "id": serializer.data["id"],
                "author": {
                    "id": new_comment.author.id,
                    "username": new_comment.author.username
                },
                "post_date": serializer.data["post_date"],
                "content": serializer.data["content"],
                "event": serializer.data["event"]
            }
            return Response(res, status=status.HTTP_201_CREATED)     # new
            # return Response(serializer.data, status=status.HTTP_201_CREATED)   # original
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
