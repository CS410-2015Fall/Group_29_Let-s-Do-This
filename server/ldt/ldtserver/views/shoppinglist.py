"""
All ShoppingList views for ldtserver (for RESTful API)

These views only serve as batch update/delete functions for items on the list.
See views/shoppinglistitem.py for get, batch add, and individual update/delete functions.
"""

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Event, ShoppingListItem, User
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
    below) instead of an ID (shown above). ALL shoppinglistitem are returned in a list:
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

    Note: Only the user's id and username will be returned for these calls.
    """
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"error": "No Event matching primary key"}, status=status.HTTP_404_NOT_FOUND)
    # error if request data not a list
    try:
        request.data[0]
    except:
        return Response({"error": "data must be list of ShoppingListItem to update"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        items = [ShoppingListItem.objects.get(pk=item["id"]) for item in request.data]
    except ShoppingListItem.DoesNotExist:
        return Response({"error": "No ShoppingListItem matching primary key"}, status=status.HTTP_404_NOT_FOUND)

    # Request data should be a list of dicts
    list_of_data = request.data
    if not isinstance(list_of_data, list):
        return Response({"error": "Request must be list of ShoppingListItem dicts/objects"},
                        status=status.HTTP_400_BAD_REQUEST)

    # Update each item as specified by corresponding data in list_of_data
    for item in items:
        item_id = item.id
        data = [d for d in list_of_data if d["id"] == item_id][0]

        # Retrieve request vals or use original ShoppingListItem fields (all except supplier)
        fields = item._meta.get_all_field_names()
        for field in filter(lambda f: f != "supplier", fields):
            if field not in data:
                data.update({field: getattr(item, field, None)})
            else:
                data.update({field: data[field]})

        # Retrieve request val for supplier, or use existing supplier's ID, or use None
        if "supplier" in data:
            supplier_id = data["supplier"]
        elif item.supplier:
            supplier_id = item.supplier.id
        else:
            supplier_id = None

        serializer = ShoppingListItemSerializer(item, data=data)
        if serializer.is_valid():
            serializer.save()
            if supplier_id:
                # Hacky because Django REST framework doesn't support writable nested entities
                updated_item = ShoppingListItem.objects.get(pk=item_id)
                # error is supplier is nonexistent user
                try:
                    updated_item.supplier = User.objects.get(pk=supplier_id)
                except:
                    return Response({"error": "no comment author matching that user id"}, status=status.HTTP_400_BAD_REQUEST)
                updated_item.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Prepare response with up-to-date list of all items
    res = [ShoppingListItemSerializer(i).data for i in Event.get_shoppinglistitems(event)]
    return Response(res, status=status.HTTP_200_OK)


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
    # error if request data not a list
    try:
        request.data[0]
    except:
        return Response({"error": "data must be list of ShoppingListItem to update"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        items = [ShoppingListItem.objects.get(pk=item_id) for item_id in request.data]
    except ShoppingListItem.DoesNotExist:
        return Response({"error": "No ShoppingListItem matching primary key"}, status=status.HTTP_404_NOT_FOUND)

    [item.delete() for item in items]

    # Prepare response with list of remaining items
    res = [ShoppingListItemSerializer(i).data for i in Event.get_shoppinglistitems(event)]
    return Response(res, status=status.HTTP_204_NO_CONTENT)
