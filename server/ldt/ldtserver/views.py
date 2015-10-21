"""
All views for ldtserver (all for the RESTful API)

Examples using httpie:
http -a user:pword http://.../api/events/
http -a user:pword --form POST http://.../api/events/ display_name="test event"
http -a user:pword --form PUT http://.../api/events/123 display_name="even testier event"
http -a user:pword DELETE http://.../api/events/123

:TODO:
- test below with httpie
- unit tests (http://www.django-rest-framework.org/api-guide/testing/)
- Support queries (see also models.py):
    - Consider re-routing User-specific Event Gets as a single call and json divided by Host/Invitee/Accept/Decline
    - Add/Rm user's friends without rewriting entire list
    - Add/Rm event's host/invitee/accept/decline without rewriting entire list

- Authentication tokens (see also models.py): http://www.django-rest-framework.org/api-guide/authentication/
- Adjust permissions.py (linked at settings.py)
- hash/don't return User passwords (here or in serializers.py)
- different timezones? leave to client side to convert from UTC
"""
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from models import Event, LdtUser
from django.contrib.auth.models import User
from serializers import EventSerializer, UserSerializer, LdtUserSerializer


USER_FIELDS = ["username", "password"]
OPTIONAL_PROFILE_FIELDS = ["email", "phone", "friends"]
ALL_USER_FIELDS = USER_FIELDS + OPTIONAL_PROFILE_FIELDS
OPTIONAL_EVENT_FIELDS = ["start_date", "end_date", "budget", "location", "hosts", "invites", "accepts", "declines"]


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
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        return Response(serializer.data)

    elif request.method == 'PUT':
        if "display_name" not in request.data:
            request.data.update({"display_name": event.display_name})
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

    POST request data must be formatted as follows. Only username and password mandatory:
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
        # Return flat JSON response of new user with ldtuser profile fields
        # !!! refactor: flexible instead of hardcoded
        #     but note: copying ser1 and updating with ser2 gives 'BoundField" object is not iterable
        res = []
        for user in users:
            try:
                profile_id = user.userlink.id
                profile = LdtUser.objects.get(pk=profile_id)
                friends = [f.id for f in profile.friends.all()]
                userdict = {
                    "id": user.id,
                    "username": user.username,
                    "password": user.password,
                    "phone": profile.phone,
                    "email": profile.email,
                    "friends": friends
                }
            except:
                # User has no profile, e.g. superuser
                userdict = {
                    "id": user.id,
                    "username": user.username,
                    "password": user.password,
                }
            res.append(userdict.copy())
        return Response(res, status=status.HTTP_200_OK)

        # # Original
        # users = User.objects.all()
        # serializer = UserSerializer(users, many=True)
        # return Response(serializer.data)

    elif request.method == 'POST':
        # First create new User object
        # !!! refactor to use USER_FIELDS
        if not ("username" in request.data and "password" in request.data):
            return Response("KeyError: username and password required.", status=status.HTTP_400_BAD_REQUEST)
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
        data2 = {"user": ser1.data["id"]}
        for key in OPTIONAL_PROFILE_FIELDS:
            if key in request.data:
                data2.update({key: request.data[key]})

        ser2 = LdtUserSerializer(data=data2)
        if ser2.is_valid():
            ser2.save()
            # Return flat JSON response of new user with ldtuser profile fields
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
            # Delete newly created user because shouldn't be used without ldtuser profile
            user = User.objects.get(pk=ser1.data["id"])
            user.delete()
            return Response(ser2.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk):
    """
    Get, update, or delete a specific user

    PUT request data must be formatted as follows. No fields are mandatory.
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
        # Return flat JSON response of new user with ldtuser profile fields
        # !!! refactor: flexible instead of hardcoded
        #     but note: copying ser1 and updating with ser2 gives 'BoundField" object is not iterable
        try:
            profile_id = user.userlink.id
            profile = LdtUser.objects.get(pk=profile_id)
            friends = [f.id for f in profile.friends.all()]
            res = {
                "id": user.id,
                "username": user.username,
                "password": user.password,
                "phone": profile.phone,
                "email": profile.email,
                "friends": friends
            }
        except:
            # User has no profile, e.g. superuser
            res = {
                "id": user.id,
                "username": user.username,
                "password": user.password,
            }
        return Response(res, status=status.HTTP_200_OK)

        # # Original
        # serializer = UserSerializer(user)
        # return Response(serializer.data)

    elif request.method == 'PUT':
        # First update User object if needed
        data1 = {}
        for key in USER_FIELDS:
            if key in request.data:
                data1.update({key: request.data[key]})
        if data1:
            # !!! refactor to use USER_FIELDS
            if "username" not in data1:
                data1.update({"username": user.username})
            if "password" not in data1:
                data1.update({"password": user.password})

            ser1 = UserSerializer(user, data=data1)
            if ser1.is_valid():
                ser1.save()
            else:
                return Response(ser1.errors, status=status.HTTP_400_BAD_REQUEST)

        # Then update LdtUser associated with User if needed
        data2 = {}
        for key in OPTIONAL_PROFILE_FIELDS:
            if key in request.data:
                data2.update({key: request.data[key]})
        if data2:
            data2.update({"user": user.id})
            ldtuser = LdtUser.objects.get(pk=user.userlink.id)
            ser2 = LdtUserSerializer(ldtuser, data=data2)
            if ser2.is_valid():
                ser2.save()
            else:
                return Response(ser2.errors, status=status.HTTP_400_BAD_REQUEST)

        # Return flat JSON response of new user with ldtuser profile fields
        # !!! refactor: flexible instead of hardcoded
        #     but note: copying ser1 and updating with ser2 gives 'BoundField" object is not iterable
        updated_user = User.objects.get(pk=pk)
        updated_profile = LdtUser.objects.get(pk=updated_user.userlink.id)
        friends = [f.id for f in updated_profile.friends.all()]
        res = {
            "id": updated_user.id,
            "username": updated_user.username,
            "password": updated_user.password,
            "phone": updated_profile.phone,
            "email": updated_profile.email,
            "friends": friends
        }
        return Response(res, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def user_hosting(request, pk):
    """
    Get all events where specific user is host
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    all_events = Event.objects.all()
    hosting_events = []
    for event in all_events:
        if event.hosts.all():
            for host in event.hosts.all():
                if host.id == user.id:
                    hosting_events.append(event.id)
    return Response(hosting_events, status=status.HTTP_200_OK)


@api_view(['GET'])
def user_invited(request, pk):
    """
    Get all events where specific user is invited
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    all_events = Event.objects.all()
    invited_events = []
    for event in all_events:
        if event.invites.all():
            for inv in event.invites.all():
                if inv.id == user.id:
                    invited_events.append(event.id)
    return Response(invited_events, status=status.HTTP_200_OK)


@api_view(['GET'])
def user_attending(request, pk):
    """
    Get all events where specific user is attending
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    all_events = Event.objects.all()
    accepted_events = []
    for event in all_events:
        if event.accepts.all():
            for acc in event.accepts.all():
                if acc.id == user.id:
                    accepted_events.append(event.id)
    return Response(accepted_events, status=status.HTTP_200_OK)


@api_view(['GET'])
def user_declined(request, pk):
    """
    Get all events where specific user is declined
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    all_events = Event.objects.all()
    decline_events = []
    for event in all_events:
        if event.declines.all():
            for dec in event.declines.all():
                if dec.id == user.id:
                    decline_events.append(event.id)
    return Response(decline_events, status=status.HTTP_200_OK)
