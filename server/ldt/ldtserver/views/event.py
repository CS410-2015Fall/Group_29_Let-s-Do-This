"""
All Event views for ldtserver (for RESTful API)

:TODO:
- test below with cURL/httpie
- Support queries (see also models.py):
    - Add/Rm event's host/invitee/accept/decline without rewriting entire list
    - Invited/Accepted/Declined: User can only be on one of these lists

- Adjust permissions.py to require tokens in headers (linked at settings.py)
- different timezones? leave to client side to convert from UTC
"""
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Event
from ..serializers import EventSerializer


OPTIONAL_EVENT_FIELDS = ["start_date", "end_date", "budget", "location", "hosts", "invites", "accepts", "declines",
                         "comments", "shopping_list"]


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

        for key in OPTIONAL_EVENT_FIELDS:
            if key in request.data:
                # Add host(s) to current list instead of overwriting list
                if key == "hosts":
                    data.update({key: insert_hosts(event=event, newhosts=request.data[key])})
                else:
                    data.update({key: request.data[key]})

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
    """
    Return list of hosts (User Ids): event's hosts with newhosts inserted
    """
    hosts = []
    hosts.extend(event.get_hosts())
    for n in newhosts:
        if n not in hosts:
            hosts.append(n)
    return hosts
