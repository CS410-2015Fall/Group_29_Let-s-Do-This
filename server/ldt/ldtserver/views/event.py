"""
All Event views for ldtserver (for RESTful API)
"""
import copy
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Event, LdtUser
from django.contrib.auth.models import User
from ..serializers import EventSerializer, ShoppingListSerializer


OPTIONAL_EVENT_FIELDS = ["start_date", "end_date", "budget", "location", "hosts", "comments", "changed"]
EVENT_RSVP_FIELDS = ["invites", "accepts", "declines"]
USERLIST_FIELDS = ["hosts", "invites", "accepts", "declines"]
ALL_FIELDS_BUT_SHOPLIST = OPTIONAL_EVENT_FIELDS + USERLIST_FIELDS + ["display_name"] + ["id"]


@api_view(['GET', 'POST'])
def event_list(request):
    """
    List all events, or create a new event.

    POST request data must be formatted as follows. Only display_name mandatory:
    {
        "display_name": "best event ever",
        "start_date": "2015-01-01T00:00Z",
        "end_date": "2015-12-31T23:59Z",
        "budget": 12345678.90,
        "location": "21 jump street",
        "hosts": [1],
        "invites": [86, 90],
        "accepts": [90],
        "declines": [86]
    }
    Note1: DateTime is UTC and in format YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]

    Note2: This will automatically create a "shopping_list" and "contributions" for that event, both empty when first returned.

    Note3: At this time, the "shopping_list" cannot be edited through this call. It can only be edited using the Event
    Shopping List-related functions (see server README).

    Note4: "contributions" cannot be edited. It is just the "shopping_list" restructured on per-user basis. Items that
    have no set "supplier" will not be included in "contributions". Items with no set "cost" will not be included in
    each contributor's "total" amount.
    """
    if request.method == 'GET':
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # First create new Event
        if "display_name" not in request.data:
            return Response("KeyError: event display_name required.", status=status.HTTP_400_BAD_REQUEST)
        data1 = {k: request.data[k] for k in request.data}
        ser1 = EventSerializer(data=data1)
        if ser1.is_valid():
            ser1.save()
        else:
            return Response(ser1.errors, status=status.HTTP_400_BAD_REQUEST)

        # Then create new ShoppingList associated with new Event
        data2 = {"event": ser1.data["id"]}
        ser2 = ShoppingListSerializer(data=data2)
        if ser2.is_valid():
            ser2.save()
            # Return flat JSON response of new Event with ShoppingList fields
            res = {k: ser1.data[k] for k in ALL_FIELDS_BUT_SHOPLIST}
            res.update({"shopping_list": ser2.data})
            res["contributions"] = Event.get_contributions(Event.objects.get(pk=ser1.data["id"]))
            return Response(res, status=status.HTTP_201_CREATED)
        else:
            # Delete newly created Event because shouldn't be used without ShoppingList
            event = Event.objects.get(pk=ser1.data["id"])
            event.delete()
            return Response(ser2.errors, status=status.HTTP_400_BAD_REQUEST)


def rsvp(event=None, replies=None):
    """
    Returns dict of lists of User IDs according to replies such that
        (1) User is placed on one of invites/accepts/declines lists according to replies
        (2) one User cannot be on all three lists
        (3) original lists are not completely replaced

    replies is dict of lists of User IDs, with each kv optional:
    {
        "invites": [],
        "accepts": [],
        "declines": []
    }

    returned dict is same as above or empty dict (no changes)
    """
    if not replies:
        return {}

    # Dict of shallow copies of all current invites/accepts/declines lists of User IDs
    current_iad = {
        "invites": list(Event.get_invites(event)),
        "accepts": list(Event.get_accepts(event)),
        "declines": list(Event.get_declines(event))
    }

    # List of tuples for changes as, e.g. ("accepts", user_id)
    if "invites" in replies:
        list_of_new_invites = [("invites", user_id) for user_id in replies["invites"]]
    else:
        list_of_new_invites = []
    if "accepts" in replies:
        list_of_new_accepts = [("accepts", user_id) for user_id in replies["accepts"]]
    else:
        list_of_new_accepts = []
    if "declines" in replies:
        list_of_new_declines = [("declines", user_id) for user_id in replies["declines"]]
    else:
        list_of_new_declines = []

    # Dict of new invites/accepts/declines, initially as current_iad
    new_iad = copy.deepcopy(current_iad)

    # Update new_iad according to list_of_new_* before return
    # !!! refactor three loops as calls to single helper function
    for c in list_of_new_invites:
        dest_list = c[0]
        other_lists = [erf for erf in EVENT_RSVP_FIELDS if erf != dest_list]
        user_id = c[1]
        # Remove, if present, appearances of user_id from other_lists in new_iad
        for key in new_iad:
            if key in other_lists:
                new_iad[key] = filter(lambda u: u != user_id, new_iad[key])
        # Add, if not present, user_id to dest_list in new_iad
        if user_id not in new_iad[dest_list]:
            new_iad[dest_list].append(user_id)
        new_iad[dest_list].sort(key=int)

    for c in list_of_new_accepts:
        dest_list = c[0]
        other_lists = [erf for erf in EVENT_RSVP_FIELDS if erf != dest_list]
        user_id = c[1]
        # Remove, if present, appearances of user_id from other_lists in new_iad
        for key in new_iad:
            if key in other_lists:
                new_iad[key] = filter(lambda u: u != user_id, new_iad[key])
        # Add, if not present, user_id to dest_list in new_iad
        if user_id not in new_iad[dest_list]:
            new_iad[dest_list].append(user_id)
        new_iad[dest_list].sort(key=int)

    for c in list_of_new_declines:
        dest_list = c[0]
        other_lists = [erf for erf in EVENT_RSVP_FIELDS if erf != dest_list]
        user_id = c[1]
        # Remove, if present, appearances of user_id from other_lists in new_iad
        for key in new_iad:
            if key in other_lists:
                new_iad[key] = filter(lambda u: u != user_id, new_iad[key])
        # Add, if not present, user_id to dest_list in new_iad
        if user_id not in new_iad[dest_list]:
            new_iad[dest_list].append(user_id)
        new_iad[dest_list].sort(key=int)

    return new_iad


@api_view(['GET', 'PUT', 'DELETE'])
def event_detail(request, pk):
    """
    Get, update, or delete a specific event

    PUT request data must be formatted as follows. No fields mandatory:
    {
        "display_name": "best event ever",
        "start_date": "2015-01-01T00:00Z",
        "end_date": "2015-12-31T23:59Z",
        "budget": 12345678.90,
        "location": "21 jump street",
        "hosts": [1],
        "invites": [86, 90],
        "accepts": [90],
        "declines": [86]
    }
    Note1: DateTime is UTC and in format YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]

    Note2: At this time, the "shopping_list" cannot be edited through this call. It can only be edited using the Event
    Shopping List-related functions (see server README).

    For GETs, the lists "hosts", "invites", "accepts", "declines" are returned as lists of dictionaries/objects of
    user details (each formatted as below) instead of lists of IDs (shown above):
    {
        "id": 123,
        "username": "MartyMcFly",
        "phone": "6045554321",
        "email": "back@future.com"
    }

    Note3: If the user has no LdtUser profile (e.g. admin staff/superuser), only the user's id and username will be
    shown. They will NOT have a phone or email.

    For GETs, there is also a "shopping_list" returned, in addition to above PUT request fields. "shopping_list" is a
    list of dictionaries/objects of shopping list items (each formatted as below):
    {
        "display_name": "hot dogs",
        "quantity": 9001,
        "cost": 12345678.90,
        "supplier": {
            "id": 123,
            "username": "MartyMcFly",
            "phone": "6045554321",
            "email": "back@future.com"
        },
        "ready": null, "Yes", or "No"
    }

    Note4: "contributions" cannot be edited. It is just the "shopping_list" restructured on per-user basis. Items that
    have no set "supplier" will not be included in "contributions". Items with no set "cost" will not be included in
    each contributor's "total" amount.
    """
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EventSerializer(event)

        res = serializer.data

        for f in USERLIST_FIELDS:
            ulist = res[f]
            detailed_ulist = []
            for uid in ulist:
                user = User.objects.get(pk=uid)
                # Setup flat JSON response of new user with ldtuser profile fields, WITHOUT friends
                # !!! refactor: flexible instead of hardcoded
                #     See also user.py
                try:
                    profile_id = user.userlink.id
                    profile = LdtUser.objects.get(pk=profile_id)
                    udict = {
                        "id": user.id,
                        "username": user.username,
                        "phone": profile.phone,
                        "email": profile.email,
                    }
                except:
                    # User has no profile, e.g. superuser or staff
                    udict = {
                        "id": user.id,
                        "username": user.username,
                    }
                detailed_ulist.append(udict)
            res[f] = detailed_ulist
        return Response(res, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        data = {}
        if "display_name" not in request.data:
            data.update({"display_name": event.display_name})
        else:
            data.update({"display_name": request.data["display_name"]})

        # Prepare data with any event fields except those related to rsvp
        for key in OPTIONAL_EVENT_FIELDS:
            if key in request.data:
                # Add host(s) to current list instead of overwriting list
                if key == "hosts":
                    data.update({key: insert_hosts(event=event, newhosts=request.data[key])})
                else:
                    data.update({key: request.data[key]})

        # Prepare data with updated invites/accepts/declines lists
        replies = {}
        for key in EVENT_RSVP_FIELDS:
            if key in request.data:
                replies.update({key: request.data[key]})
        updated_lists = rsvp(event=event, replies=replies)
        data.update(updated_lists)

        # !!! TODO: Prepare data with new comments associated with event

        serializer = EventSerializer(event, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def event_cancel(request, pk):
    """
    Cancels a given event, puts all users on 'changed' list, and returns event.

    Data needs to be: {"cancelled": true}
    """
    try:
        event = Event.objects.get(pk=pk)
        already_on_changed = Event.get_changed(event)
    except Event.DoesNotExist:
        return Response({"error": "No event for that id"}, status=status.HTTP_404_NOT_FOUND)

    # Error if event already cancelled
    if event.is_cancelled():
        return Response({"error": "Event has already been cancelled"}, status=status.HTTP_400_BAD_REQUEST)

    # Set 'cancelled' to True
    try:
        event.cancel()
    except Exception as e:
        return Response({"error": "Could not cancel event. " + e.message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Prepare data with updated changed list
    data = {}
    try:
        hosts = event.get_hosts()
        invites = event.get_invites()
        accepts = event.get_accepts()
        declines = event.get_declines()
        all_unique_hiad_uids = list(set(hosts + invites + accepts + declines))
        new_changed = list(set(all_unique_hiad_uids + already_on_changed))
    except Exception as e:
        return Response({"error": "Could not update 'changed' list of event. " + e.message},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    data.update({"changed": new_changed})

    # Django REST requires a display_name
    data.update({"display_name": event.display_name})

    serializer = EventSerializer(event, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def event_changed_remove(request, pk):
    """
    Remove user(s) from the 'changed' list of an event

    POST request data must be formatted as follows:
    { "changed: [4] }

    Note: The value must be a list
    """
    try:
        event = Event.objects.get(pk=pk)
        old_changed = Event.get_changed(event)
    except Event.DoesNotExist:
        return Response({"error": "No event for that id"}, status=status.HTTP_404_NOT_FOUND)

    if "changed" not in request.data:
        return Response({"error": "'changed' must be provided as list of user IDs"}, status=status.HTTP_400_BAD_REQUEST)

    # Error if trying to remove non-existent user from changed list
    try:
        [User.objects.get(pk=uid) for uid in request.data["changed"]]
    except:
        return Response({"error": "no user exists for one or more IDs provided"}, status=status.HTTP_400_BAD_REQUEST)

    # Error if trying to remove user who isn't already on changed list
    try:
        for uid in request.data["changed"]:
            if uid not in old_changed:
                raise Exception
    except:
        return Response({"error": "user(s) is not on 'changed' list and cannot be removed"}, status=status.HTTP_400_BAD_REQUEST)

    # Prepare data with updated changed list
    data = {}
    try:
        new_changed = [uid for uid in old_changed if uid not in request.data["changed"]]
    except:
        return Response({"error": "'changed' must be provided as list of user IDs"}, status=status.HTTP_404_NOT_FOUND)
    data.update({"changed": new_changed})

    # Django REST requires a display_name
    data.update({"display_name": event.display_name})

    serializer = EventSerializer(event, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def event_hosts_remove(request, pk):
    """
    Remove host(s) from a specific event

    POST request data must be formatted as follows:
    { "hosts": [1, 4] }
    """
    try:
        event = Event.objects.get(pk=pk)
        hosts = event.get_hosts()
    except Event.DoesNotExist:
        return Response({"error": "No event for that id"}, status=status.HTTP_404_NOT_FOUND)

    if "hosts" not in request.data:
        return Response({"error": "'hosts' must be provided as list of user IDs"}, status=status.HTTP_400_BAD_REQUEST)

    # Error if trying to remove non-existent user from changed list
    try:
        [User.objects.get(pk=uid) for uid in request.data["hosts"]]
    except:
        return Response({"error": "no user exists for one or more IDs provided"}, status=status.HTTP_400_BAD_REQUEST)

    # Error if trying to remove user who isn't already on changed list
    try:
        for uid in request.data["hosts"]:
            if uid not in hosts:
                raise Exception
    except:
        return Response({"error": "user(s) is not on 'hosts' list and cannot be removed"}, status=status.HTTP_400_BAD_REQUEST)

    # "display_name" is mandatory for any Event serializer updates
    data = {}
    data.update({"display_name": event.display_name})

    newhosts = [h for h in hosts if h not in request.data["hosts"]]
    data.update({"hosts": newhosts})

    serializer = EventSerializer(event, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def insert_hosts(event=None, newhosts=None):
    """ Return list of hosts (User Ids): event's hosts with newhosts inserted """
    hosts = []
    hosts.extend(event.get_hosts())
    for n in newhosts:
        if n not in hosts:
            hosts.append(n)
    return hosts


@api_view(['POST'])
def event_invites_remove(request, pk):
    """
    Remove invite(s) from a specific event

    POST request data must be formatted as follows:
    { "invites": [1, 4] }
    """
    try:
        event = Event.objects.get(pk=pk)
        invites = event.get_invites()
    except Event.DoesNotExist:
        return Response({"error": "No event for that id"}, status=status.HTTP_404_NOT_FOUND)

    if "invites" not in request.data:
        return Response({"error": "'hosts' must be provided as list of user IDs"}, status=status.HTTP_400_BAD_REQUEST)

    # Error if trying to remove non-existent user from changed list
    try:
        [User.objects.get(pk=uid) for uid in request.data["invites"]]
    except:
        return Response({"error": "no user exists for one or more IDs provided"}, status=status.HTTP_400_BAD_REQUEST)

    # Error if trying to remove user who isn't already on changed list
    try:
        for uid in request.data["invites"]:
            if uid not in invites:
                raise Exception
    except:
        return Response({"error": "user(s) is not on 'invites' list and cannot be removed"}, status=status.HTTP_400_BAD_REQUEST)

    # "display_name" is mandatory for any Event serializer updates
    data = {}
    data.update({"display_name": event.display_name})

    newinvites = [i for i in invites if i not in request.data["invites"]]
    data.update({"invites": newinvites})

    serializer = EventSerializer(event, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
