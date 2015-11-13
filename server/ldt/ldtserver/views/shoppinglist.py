"""
All ShoppingList views for ldtserver (for RESTful API)

These views only serve as batch update/delete functions for items on the list.
See views/shoppinglistitem.py for get, batch add, and individual update/delete functions.
"""

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Event, ShoppingList, ShoppingListItem, User
from ..serializers import ShoppingListItemSerializer


@api_view(['PUT'])
def shoppinglist_put(request, pk):
    """
    Batch update existing shoppinglistitem to shopping list associated with a specific event.

    Request data must be formatted as follows. The list contains 1+ items. Only "id" field is mandatory:
    [
        {
            "id": 456,
            "display_name": "hot dogs",
            "quantity": 9001,
            "cost": 12345678.90,
            "supplier": 123,
            "ready": "Yes"
        },
        ...
    ]

    After successful PUT, the "supplier" of each item is returned as a dictionary/object of user details (formatted as
    below) instead of an ID (shown above):
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
        return Response({"test": "put shoppinglist"}, status=status.HTTP_200_OK)  # temp stub
    except Event.DoesNotExist:
        return Response({"error": "No Event matching primary key"}, status=status.HTTP_404_NOT_FOUND)




@api_view(['POST'])
def shoppinglist_delete(request, pk):
    """
    Batch delete existing item(s) to shopping list associated with a specific event.

    Note1: This is not a RESTful DELETE call. This is a POST call because this function requires IDs in request data.

    Note2: Only items can be added/updated/deleted. The shopping list itself cannot be deleted, unless its parent event
    is deleted. Then the list is automatically deleted.

    POST request data must be formatted as follows:
    [456, 789]
    where each number is the id of an existing shopping list item.

    After successful POST, the response is the list of items that remain after deletion:
    [
        {
        "id": 2,
        "display_name": "just a few hot dogs",
        "quantity": "9001.00",
        "cost": "12345678.90",
        "supplier": {
            "id": 92,
            "username": "EmilioEstevez"
        },
        "ready": true
        },
        ...
    ]

    Note3: Only the user's id and username will be returned for these calls.
    """
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"error": "No Event matching primary key"}, status=status.HTTP_404_NOT_FOUND)
    try:
        items = [ShoppingListItem.objects.get(pk=item_id) for item_id in request.data]
    except ShoppingListItem.DoesNotExist:
        return Response({"error": "No ShoppingListItem matching primary key"}, status=status.HTTP_404_NOT_FOUND)

    [item.delete() for item in items]

    # Prepare response with list of remaining items
    res = [ShoppingListItemSerializer(i).data for i in Event.get_shoppinglistitems(event)]
    return Response(res, status=status.HTTP_204_NO_CONTENT)


    # COPIED from comment.py
    # try:
    #     shoppinglist = ShoppingList.objects.get(pk=comment_id)
    # except ShoppingList.DoesNotExist:
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
