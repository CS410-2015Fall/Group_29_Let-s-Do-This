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
            "ready": false or true      (No quotes needed)
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
        res = [ShoppingListItemSerializer(i).data for i in Event.get_shoppinglistitems(event)]
        return Response(res, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # Request data should be a list of dicts
        list_of_data = request.data
        if not isinstance(list_of_data, list):
            return Response({"error": "Request must be list of ShoppingListItem dicts/objects"},
                            status=status.HTTP_400_BAD_REQUEST)
        # Perform serializations on each in list_of_data
        res = []
        for data in list_of_data:
            # Get supplier ID to add author after comment serialization (but not a mandatory field)
            if "supplier" in data:
                supplier_id = data["supplier"]
            else:
                supplier_id = None
            serializer = ShoppingListItemSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                # If supplier ID has been provided need to add to new item after creation
                if supplier_id:
                    # Hacky because Django REST framework doesn't support writable nested entities
                    new_item = ShoppingListItem.objects.get(pk=serializer.data["id"])
                    new_item.supplier = User.objects.get(pk=supplier_id)
                    new_item.save()
                    # Also update serializer data to return with supplier's id
                    new_item_dict = serializer.data
                    new_item_dict["supplier"] = supplier_id
                    res.append(new_item_dict)
                else:
                    res.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # After all serializations, add each newly-created ShoppingListItem to Event's ShoppingList
        [event.shopping_list.add_item(ShoppingListItem.objects.get(id=i["id"])) for i in res]
        # Finally, return the newly-created ShoppingListItems
        return Response(res, status=status.HTTP_201_CREATED)


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

    # return Response({"test": "detail of shoppinglistitem"}, status=status.HTTP_200_OK)  # temp stub

    try:
        item = ShoppingListItem.objects.get(pk=item_id)
        # return Response({"yes": "we have lift off"}, status=status.HTTP_200_OK)  # temp stub
    except ShoppingListItem.DoesNotExist:
        return Response({"error": "No Comment matching primary key"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ShoppingListItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
