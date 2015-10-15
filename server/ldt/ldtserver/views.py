"""
All views for ldtserver (all for the RESTful API)

Examples using httpie:
http -a user:pword http://.../api/events/
http -a user:pword --form POST http://.../api/events/ display_name="test event"
http -a user:pword --form PUT http://.../api/events/123 display_name="even testier event"
http -a user:pword DELETE http://.../api/events/123

:TODO:
- test below with httpie
- Support queries (see also models.py):
    - Post/Put users by pk to Event
    - Post Event should set current user as host
    - Get all Events where LdtUser is Host/Invitee/Accept/Decline
    - Put user to Event's Host/Invitee/Accept/Decline

- Authentication tokens (see also models.py): http://www.django-rest-framework.org/api-guide/authentication/
- hash/don't return User passwords (here or in serializers.py)
"""
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from models import Event, LdtUser
from django.contrib.auth.models import User
from serializers import EventSerializer, UserSerializer, LdtUserSerializer


@api_view(['GET', 'POST'])
def event_list(request):
    """
    List all events, or create a new event.
    """
    if request.method == 'GET':
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # res = {"user_pk": request.user.id}    # this does give requesting user's pk

        # New - !!! Post with host and invitees

        # Original
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def event_detail(request, pk):
    """
    Get, update, or delete a specific event
    See event_list for format of accept fields for PUT
    """
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EventSerializer(event)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def user_list(request):
    """
    List all User, or create new User with associated LdtUser profile

    POST request data must be formatted as follows:
    {
        "username": "testyuser",
        "password": "test",
        "email": "testy@test.com",
        "phone": "6045555555",
        "friends": [123, 789]
    }
    """
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':

        # !!! Allow for only one/few fields, not all mandatory
        # !!! Make less naive

        # First create new User object
        data1 = {
            "username": request.data["username"],
            "password": request.data["password"],
        }
        ser1 = UserSerializer(data=data1)
        if ser1.is_valid():
            ser1.save()
        else:
            return Response(ser1.errors, status=status.HTTP_400_BAD_REQUEST)

        # Then create new LdtUser associated with new User
        data2 = {
            "user": ser1.data["id"],
            "email": request.data["email"],
            "phone": request.data["phone"],
            "friends": request.data["friends"]
        }
        ser2 = LdtUserSerializer(data=data2)
        if ser2.is_valid():
            ser2.save()
            # Return a flat JSON response of new user with ldtuser profile fields
            # !!! refactor: flexible instead of hardcoded
            #     but note: copying ser1 and updating with ser2 gives 'BoundField" object is not iterable
            res = {
                "id": ser1.data["id"],
                "username": ser1.data["username"],
                "password": ser1.data["password"],
                "phone": ser2.data["phone"],
                "email": ser2.data["email"],
                "friends": ser2.data["friends"]
            }
            return Response(res, status=status.HTTP_201_CREATED)
        else:
            return Response(ser2.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk):
    """
    Get, update, or delete a specific user

    PUT request data must be formatted as follows:
    {
        "username": "testyuser",
        "password": "test",
        "email": "testy@test.com",
        "phone": "6045555555",
        "friends": [123, 789]
    }
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':

        # return Response(user.ldtuser.id) # test

        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':

        # !!! Allow for only one/few fields, not all mandatory
        # !!! Make less naive

        # First update User object
        data1 = {
            "username": request.data["username"],
            "password": request.data["password"],
        }
        ser1 = UserSerializer(user, data=data1)
        if ser1.is_valid():
            ser1.save()
        else:
            return Response(ser1.errors, status=status.HTTP_400_BAD_REQUEST)

        # Then update LdtUser associated with User
        # return Response(user.userlink.id)
        ldtuser = LdtUser.objects.get(pk=user.userlink.id)
        data2 = {
            "user": user.id,
            "email": request.data["email"],
            "phone": request.data["phone"],
            "friends": request.data["friends"]
        }
        ser2 = LdtUserSerializer(ldtuser, data=data2)
        if ser2.is_valid():
            ser2.save()
            # Return a flat JSON response of new user with ldtuser profile fields
            # !!! refactor: flexible instead of hardcoded
            #     but note: copying ser1 and updating with ser2 gives 'BoundField" object is not iterable
            res = {
                "id": ser1.data["id"],
                "username": ser1.data["username"],
                "password": ser1.data["password"],
                "phone": ser2.data["phone"],
                "email": ser2.data["email"],
                "friends": ser2.data["friends"]
            }
            return Response(res, status=status.HTTP_201_CREATED)
        else:
            return Response(ser2.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
