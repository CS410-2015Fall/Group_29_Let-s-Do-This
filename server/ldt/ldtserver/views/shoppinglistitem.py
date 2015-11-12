"""
All ShoppingListItem views for ldtserver (for RESTful API)
"""

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Event, ShoppingList, ShoppingListItem, User
from ..serializers import ShoppingListItemSerializer


@api_view(['GET', 'POST'])
def shoppinglistitem_list(request, pk):
    """
    List all shoppinglistitem associated with event of pk, or create ONE OR MORE new shoppinglistitem.

    Request data must be formatted as follows. The list contains 1+ items. Only "display_name" field is mandatory:
    [
        {
            "display_name": "hot dogs",
            "quantity": 9001,
            "cost": 12345678.90,
            "supplier": 123,
            "ready": "Yes"
        },
        ...
    ]

    At GET of after successful POST, the "supplier" of each item is returned as a dictionary/object of user details
    (formatted as below) instead of a user's ID (shown above):
    {
        "id": 123,
        "username": "MartyMcFly",
        "phone": "6045554321",
        "email": "back@future.com"
    }

    Note: If the user has no LdtUser profile (e.g. admin staff/superuser), only the user's id and username will be
    shown. They will NOT have a phone or email.
    """
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # return Response({"test": "got shoppinglist"}, status=status.HTTP_200_OK)  # temp stub
        all_items = Event.get_shoppinglistitems(event)
        res = []
        for item in all_items:
            ser = ShoppingListItemSerializer(item)
            res.append(ser.data)
        return Response({"res_is": res}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        return Response({"test": "posted shoppinglist"}, status=status.HTTP_200_OK)  # temp stub

        # # FROM comments.py
        # # Automatically add event ID, which is pk provided
        # data_with_event = request.data
        # data_with_event.update({"event": [pk]})
        # # Get author ID to add author after comment serialization
        # author_id = request.data["author"]
        # serializer = CommentSerializer(data=data_with_event)
        # if serializer.is_valid():
        #     serializer.save()
        #     # Hacky because Django REST framework doesn't support writable nested entities
        #     new_comment = Comment.objects.get(pk=serializer.data["id"])
        #     new_comment.author = User.objects.get(pk=author_id)
        #     new_comment.save()
        #     # Return flat JSON response of new comment with author user fields
        #     # !!! refactor: flexible instead of hardcoded
        #     res = {
        #         "id": serializer.data["id"],
        #         "author": {
        #             "id": new_comment.author.id,
        #             "username": new_comment.author.username
        #         },
        #         "post_date": serializer.data["post_date"],
        #         "content": serializer.data["content"],
        #         "event": serializer.data["event"]
        #     }
        #     return Response(res, status=status.HTTP_201_CREATED)     # new
        #     # return Response(serializer.data, status=status.HTTP_201_CREATED)   # original
        # else:
        #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





@api_view(['GET', 'PUT', 'DELETE'])
def shoppinglistitem_detail(request, pk, item_id):
    """
    Get, update, or delete a specific shoppinglistitem associated with a specific event.

    List all shoppinglistitem associated with event of pk, or create a shoppinglistitem.

    PUT request data must be formatted as follows. No fields mandatory:
    {
        "display_name": "hot dogs",
        "quantity": 9001,
        "cost": 12345678.90,
        "supplier": 123,
        "ready": "Yes"
    }

    At GET of after successful PUT, the "supplier" is returned as a dictionary/object of user details (formatted as
    below) instead of a user's ID (shown above):
    {
        "id": 123,
        "username": "MartyMcFly",
        "phone": "6045554321",
        "email": "back@future.com"
    }

    Note: If the user has no LdtUser profile (e.g. admin staff/superuser), only the user's id and username will be
    shown. They will NOT have a phone or email.
    """
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"error": "No Event matching primary key"}, status=status.HTTP_404_NOT_FOUND)

    return Response({"test": "detail of shoppinglistitem"}, status=status.HTTP_200_OK)  # temp stub

    # # FROM comments.py
    # try:
    #     comment = Comment.objects.get(pk=comment_id)
    # except Comment.DoesNotExist:
    #     return Response({"error": "No Comment matching primary key"}, status=status.HTTP_404_NOT_FOUND)
    #
    # if request.method == 'GET':
    #     serializer = CommentSerializer(comment)
    #     return Response(serializer.data, status=status.HTTP_200_OK)
    #
    # elif request.method == 'PUT':
    #     data = {}
    #
    #     # Retrieve request vals or use original Comment fields (all except author and event)
    #     fields = comment._meta.get_all_field_names()
    #     for field in filter(lambda f: f != "author" and f != "event", fields):
    #         if field not in request.data:
    #             data.update({field: getattr(comment, field, None)})
    #         else:
    #             data.update({field: request.data[field]})
    #
    #     # Automatically add event ID, which is pk provided
    #     data.update({"event": [pk]})
    #
    #     # Retrieve request val for author, or use existing author's ID
    #     if "author" in request.data:
    #         author_id = request.data["author"]
    #     else:
    #         author_id = comment.author.id
    #
    #     serializer = CommentSerializer(comment, data=data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         # Hacky because Django REST framework doesn't support writable nested entities
    #         updated_comment = Comment.objects.get(pk=comment_id)
    #         updated_comment.author = User.objects.get(pk=author_id)
    #         updated_comment.save()
    #         # Return flat JSON response of new comment with author user fields
    #         # !!! refactor: flexible instead of hardcoded
    #         res = {
    #             "id": serializer.data["id"],
    #             "author": {
    #                 "id": updated_comment.author.id,
    #                 "username": updated_comment.author.username
    #             },
    #             "post_date": serializer.data["post_date"],
    #             "content": serializer.data["content"],
    #             "event": serializer.data["event"]
    #         }
    #         return Response(res, status=status.HTTP_200_OK)
    #     else:
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #
    # elif request.method == 'DELETE':
    #     comment.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
