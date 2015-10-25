"""
All Event views for ldtserver (for RESTful API)

:TODO:
- test below with cURL/httpie
- Support queries (see also models.py):
    - Add/Rm event's host/invitee/accept/decline without rewriting entire list
    - Invited/Accepted/Declined: User can only be on one of these lists
- different timezones? leave to client side to convert from UTC
"""
import copy
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Event
from ..serializers import EventSerializer


OPTIONAL_EVENT_FIELDS = ["start_date", "end_date", "budget", "location", "hosts", "comments", "shopping_list"]
EVENT_RSVP_FIELDS = ["invites", "accepts", "declines"]


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

    Note: DateTime is UTC and in format YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
    """
    if request.method == 'GET':
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # example = request.user.id    # to give requesting user's pk
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    # return replies    # stub; original functionality


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

    Note: DateTime is UTC and in format YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
    """
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
        return Response(status=status.HTTP_404_NOT_FOUND)

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
