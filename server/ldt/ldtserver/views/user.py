"""
All User views for ldtserver (for RESTful API)

:TODO:
- test below with cURL/httpie
- hash/don't return User passwords (here or in serializers.py)
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ..models import Event, LdtUser
from django.contrib.auth.models import User
from ..serializers import UserSerializer, LdtUserSerializer


USER_FIELDS = ["username", "password"]
OPTIONAL_PROFILE_FIELDS = ["email", "phone", "friends"]
ALL_USER_FIELDS = USER_FIELDS + OPTIONAL_PROFILE_FIELDS


@api_view(['POST'])
@permission_classes((AllowAny, ))
def user_new(request):
    """
    Create new User with associated LdtUser profile

    POST request data must be formatted as follows. Only username and password mandatory:
    {
        "username": "testyuser",
        "password": "test",
        "email": "testy@test.com",
        "phone": "6045555555",
        "friends": [123, 789]
    }

    After successful POSTs, "friends" is returned as a list of dictionaries/objects of user details
    (each formatted as below) instead of lists of IDs (shown above):
    {
        "id": 123,
        "username": "MartyMcFly",
        "phone": "6045554321",
        "email": "back@future.com"
    }

    Note: If a friend has no LdtUser profile (e.g. admin staff/superuser), only the friend's id and username will be
    shown. They will NOT have a phone or email.
    """
    # First create new User object
    # !!! refactor to use USER_FIELDS
    if not ("username" in request.data and "password" in request.data):
        return Response("KeyError: username and password required.", status=status.HTTP_400_BAD_REQUEST)
    pword = request.data["password"]
    data1 = {
        "username": request.data["username"],
    }
    ser1 = UserSerializer(data=data1)
    if ser1.is_valid():
        ser1.save()
    else:
        return Response(ser1.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(pk=ser1.data["id"])
    except User.DoesNotExist:
        return Response("error: Could not retrieve new user", status=status.HTTP_400_BAD_REQUEST)

    # Manually set password because serializer doesn't handle
    user.set_password(pword)
    user.save()

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
            # "password": ser1.data["password"],  # KeyError at view after post
            "phone": ser2.data["phone"],
            "email": ser2.data["email"],
            "friends": ser2.data["friends"]
        }
    else:
        return Response(ser2.errors, status=status.HTTP_400_BAD_REQUEST)

    # If resulting user info dict has friends, display as list of detailed dicts instead of IDs
    if "friends" in res:
        ulist = res["friends"]
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
                    # "password": user.password,
                    "phone": profile.phone,
                    "email": profile.email,
                }
            except:
                # User has no profile, e.g. superuser or staff
                udict = {
                    "id": user.id,
                    "username": user.username,
                    # "password": user.password,
                }
            detailed_ulist.append(udict)
        res["friends"] = detailed_ulist
        return Response(res, status=status.HTTP_201_CREATED)
    else:
        # Delete newly created user because shouldn't be used without ldtuser profile
        user = User.objects.get(pk=ser1.data["id"])
        user.delete()
        return Response(ser2.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def user_list(request):
    """
    List all User with associated LdtUser profile, each as follows:

    {
        "username": "testyuser",
        "password": "test",
        "email": "testy@test.com",
        "phone": "6045555555",
        "friends": [
            {
            "id": 123,
            "username": "MartyMcFly",
            "phone": "6045551985",
            "email": "back@future.com"
            },
            {
            "id": 456,
            "username": "DocBrown",
            "phone": "6045551885",
            "email": "back@in-time.com"
            }
        ]
    }

    Note: If a friend has no LdtUser profile (e.g. admin staff/superuser), only the friend's id and username will be
    shown. They will NOT have a phone or email.
    """
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
        # If resulting user info dict has friends, display as list of detailed dicts instead of IDs
        if "friends" in userdict:
            ulist = userdict["friends"]
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
                        # "password": user.password,
                        "phone": profile.phone,
                        "email": profile.email,
                    }
                except:
                    # User has no profile, e.g. superuser or staff
                    udict = {
                        "id": user.id,
                        "username": user.username,
                        # "password": user.password,
                    }
                detailed_ulist.append(udict)
            userdict["friends"] = detailed_ulist
        res.append(userdict.copy())
    return Response(res, status=status.HTTP_200_OK)


@api_view(['POST'])
def user_search(request):
    """
    Return specific User Id matching provided username

    POST request data must be formatted as follows.
    { "username": "testyuser" }
    """
    users = User.objects.all()
    userid = None
    for user in users:
        if user.username == request.data["username"]:
            userid = user.id
            break
    if userid:
        return Response({"id": userid}, status=status.HTTP_200_OK)
    else:
        return Response("No user matching that username", status=status.HTTP_404_NOT_FOUND)


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

    For GETs and after successful PUTs, "friends" is returned as a list of dictionaries/objects of user details
    (each formatted as below) instead of lists of IDs (shown above):
    {
        "id": 123,
        "username": "MartyMcFly",
        "phone": "6045554321",
        "email": "back@future.com"
    }

    Note: If a friend has no LdtUser profile (e.g. admin staff/superuser), only the friend's id and username will be
    shown. They will NOT have a phone or email.
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
        # If resulting user info dict has friends, display as list of detailed dicts instead of IDs
        if "friends" in res:
            ulist = res["friends"]
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
                        # "password": user.password,
                        "phone": profile.phone,
                        "email": profile.email,
                    }
                except:
                    # User has no profile, e.g. superuser or staff
                    udict = {
                        "id": user.id,
                        "username": user.username,
                        # "password": user.password,
                    }
                detailed_ulist.append(udict)
            res["friends"] = detailed_ulist
        return Response(res, status=status.HTTP_200_OK)

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
                # Add friend(s) to current list instead of overwriting list
                if key == "friends":
                    friends = []
                    friends.extend(LdtUser.objects.get(pk=user.userlink.id).get_friends())
                    for f in request.data[key]:
                        if f not in friends:
                            friends.append(f)
                    data2.update({key: friends})
                else:
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
        # If resulting user info dict has friends, display as list of detailed dicts instead of IDs
        if "friends" in res:
            ulist = res["friends"]
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
                        # "password": user.password,
                        "phone": profile.phone,
                        "email": profile.email,
                    }
                except:
                    # User has no profile, e.g. superuser or staff
                    udict = {
                        "id": user.id,
                        "username": user.username,
                        # "password": user.password,
                    }
                detailed_ulist.append(udict)
            res["friends"] = detailed_ulist
        return Response(res, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def user_friends_remove(request, pk):
    """
    Remove friend(s) from a specific user

    POST request data must be formatted as follows:
    { "friends": [1, 4] }

    After successful POSTs, "friends" is returned as a list of dictionaries/objects of user details
    (each formatted as below) instead of lists of IDs (shown above):
    {
        "id": 123,
        "username": "MartyMcFly",
        "phone": "6045554321",
        "email": "back@future.com"
    }

    Note: If a friend has no LdtUser profile (e.g. admin staff/superuser), only the friend's id and username will be
    shown. They will NOT have a phone or email.
    """
    try:
        user = User.objects.get(pk=pk)
        ldtuser = LdtUser.objects.get(pk=user.userlink.id)
        friends = ldtuser.get_friends()
    except Exception:
        return Response(status=status.HTTP_404_NOT_FOUND)

    data = {"user": user.id}

    newfriends = [f for f in friends if f not in request.data["friends"]]
    data.update({"friends": newfriends})

    serializer = LdtUserSerializer(ldtuser, data=data)
    if serializer.is_valid():
        serializer.save()
        res = serializer.data
        # If resulting user info dict has friends, display as list of detailed dicts instead of IDs
        if "friends" in res:
            ulist = res["friends"]
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
                        # "password": user.password,
                        "phone": profile.phone,
                        "email": profile.email,
                    }
                except:
                    # User has no profile, e.g. superuser or staff
                    udict = {
                        "id": user.id,
                        "username": user.username,
                        # "password": user.password,
                    }
                detailed_ulist.append(udict)
            res["friends"] = detailed_ulist
        return Response(res, status=status.HTTP_200_OK)                # friends as list of detailed udicts
        # return Response(serializer.data, status=status.HTTP_200_OK)  # original - friends as list of user ID
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
def user_events(request, pk):
    """
    Get all event IDs associated with given user: all that are hosted/invited/attending/declined
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        all_events = Event.objects.all()

        hosting_events = []
        for event in all_events:
            if event.hosts.all():
                for host in event.hosts.all():
                    if host.id == user.id:
                        hosting_events.append(event.id)

        invited_events = []
        for event in all_events:
            if event.invites.all():
                for inv in event.invites.all():
                    if inv.id == user.id:
                        invited_events.append(event.id)

        accepted_events = []
        for event in all_events:
            if event.accepts.all():
                for acc in event.accepts.all():
                    if acc.id == user.id:
                        accepted_events.append(event.id)

        decline_events = []
        for event in all_events:
            if event.declines.all():
                for dec in event.declines.all():
                    if dec.id == user.id:
                        decline_events.append(event.id)

        user_events = {
            "hosting": hosting_events,
            "invited": invited_events,
            "attending": accepted_events,
            "declined": decline_events,
        }

        return Response(user_events, status=status.HTTP_200_OK)

    elif request.method == 'PUT':

        # !!! need to implement - do we actually need this function?

        return Response({"test": "abc123"}, status=status.HTTP_200_OK)


# # BELOW are four alternative calls to replace user_events
#
# @api_view(['GET'])
# def user_hosting(request, pk):
#     """
#     Get all events where specific user is host
#     """
#     try:
#         user = User.objects.get(pk=pk)
#     except User.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
#
#     all_events = Event.objects.all()
#     hosting_events = []
#     for event in all_events:
#         if event.hosts.all():
#             for host in event.hosts.all():
#                 if host.id == user.id:
#                     hosting_events.append(event.id)
#     return Response(hosting_events, status=status.HTTP_200_OK)
#
#
# @api_view(['GET'])
# def user_invited(request, pk):
#     """
#     Get all events where specific user is invited
#     """
#     try:
#         user = User.objects.get(pk=pk)
#     except User.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
#
#     all_events = Event.objects.all()
#     invited_events = []
#     for event in all_events:
#         if event.invites.all():
#             for inv in event.invites.all():
#                 if inv.id == user.id:
#                     invited_events.append(event.id)
#     return Response(invited_events, status=status.HTTP_200_OK)
#
#
# @api_view(['GET'])
# def user_attending(request, pk):
#     """
#     Get all events where specific user is attending
#     """
#     try:
#         user = User.objects.get(pk=pk)
#     except User.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
#
#     all_events = Event.objects.all()
#     accepted_events = []
#     for event in all_events:
#         if event.accepts.all():
#             for acc in event.accepts.all():
#                 if acc.id == user.id:
#                     accepted_events.append(event.id)
#     return Response(accepted_events, status=status.HTTP_200_OK)
#
#
# @api_view(['GET'])
# def user_declined(request, pk):
#     """
#     Get all events where specific user is declined
#     """
#     try:
#         user = User.objects.get(pk=pk)
#     except User.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
#
#     all_events = Event.objects.all()
#     decline_events = []
#     for event in all_events:
#         if event.declines.all():
#             for dec in event.declines.all():
#                 if dec.id == user.id:
#                     decline_events.append(event.id)
#     return Response(decline_events, status=status.HTTP_200_OK)

