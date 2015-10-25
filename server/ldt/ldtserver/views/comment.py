"""
All Comment views for ldtserver (for RESTful API)
"""

import copy
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Event, Comment
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
        # !!! display username? or display user_ids?
        all_comment_with_names = []
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # !!! accept username? or keep as accepting user_ids?
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET', 'PUT', 'DELETE'])
# def event_detail(request, pk):
#     """
#     Get, update, or delete a specific event
#
#     PUT request data must be formatted as follows. No fields mandatory:
#     {
#         "display_name": "best event ever",
#         "start_date": "2015-01-01T00:00Z",
#         "end_date": "2015-12-31T23:59Z",
#         "budget": 12345678.90,
#         "location": "21 jump street",
#         "hosts": [1],
#         "invites": [86, 90],
#         "accepts": [90],
#         "declines": [86]
#     }
#
#     Note: DateTime is UTC and in format YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
#     """
#     try:
#         event = Event.objects.get(pk=pk)
#     except Event.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
#
#     if request.method == 'GET':
#         serializer = EventSerializer(event)
#         # Display details of Comments
#         event_data = serializer.data
#         comments_details = []
#         for c in event_data["comments"]:
#             comment = Comment.objects.get(pk=c)
#             comments_details.append(
#                 {
#                     "author": comment.author.username,
#                     "post_date": comment.post_date,
#                     "content": comment.content
#                 }
#             )
#         event_data.update({"comments": comments_details})
#         return Response(event_data, status=status.HTTP_200_OK)
#
#     elif request.method == 'PUT':
#         data = {}
#         if "display_name" not in request.data:
#             data.update({"display_name": event.display_name})
#         else:
#             data.update({"display_name": request.data["display_name"]})
#
#         # Prepare data with any event fields except those related to rsvp
#         for key in OPTIONAL_EVENT_FIELDS:
#             if key in request.data:
#                 # Add host(s) to current list instead of overwriting list
#                 if key == "hosts":
#                     data.update({key: insert_hosts(event=event, newhosts=request.data[key])})
#                 else:
#                     data.update({key: request.data[key]})
#
#         # Prepare data with updated invites/accepts/declines lists
#         replies = {}
#         for key in EVENT_RSVP_FIELDS:
#             if key in request.data:
#                 replies.update({key: request.data[key]})
#         updated_lists = rsvp(event=event, replies=replies)
#         data.update(updated_lists)
#
#         serializer = EventSerializer(event, data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#     elif request.method == 'DELETE':
#         event.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)