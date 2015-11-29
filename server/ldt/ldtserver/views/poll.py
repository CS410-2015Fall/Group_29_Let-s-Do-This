"""
All Poll views for ldtserver (for RESTful API)
"""

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Event, Poll, PollChoice
from ..serializers import PollSerializer, PollChoiceSerializer


@api_view(['GET', 'POST'])
def poll_list(request, pk):
    """
    List all polls associated with event of pk, or create a new poll.

    POST request data must be formatted as follows. All fields mandatory:
    {
        "question": "How about some cupcakes before the pie-eating contest?",
        "poll_choices": [
            "Yes",          # At least one choice is required
            "No",
            "Maybe",
            "1000"
        ]
    }

    Note: A poll can be created or deleted, but not edited at this time.
    """
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"error": "no event matching pk"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        all_polls = Poll.objects.all()
        event_polls = [ap for ap in all_polls if ap in Event.get_polls(event)]
        ser1 = PollSerializer(event_polls, many=True)
        return Response(ser1.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':

        # error if 'question' or 'poll_choices' not provided
        if 'question' not in request.data or 'poll_choices' not in request.data:
            return Response({"error": "must provide 'question' and 'poll_choices'"}, status=status.HTTP_400_BAD_REQUEST)

        # error if 'poll_choices' not list of string
        try:
            request.data["poll_choices"][0]
        except:
            return Response({"error": "'poll_choices' must be list of string"}, status=status.HTTP_400_BAD_REQUEST)

        # Automatically add event ID, which is pk provided
        data_with_event = request.data
        data_with_event.update({"event": pk})

        # Get choices (list of str) to add choices AFTER new poll serialization
        choices_strings = request.data["poll_choices"]

        ser1 = PollSerializer(data=data_with_event)
        if ser1.is_valid():
            ser1.save()
            # Hacky because Django REST framework doesn't support writable nested entities
            new_poll = Poll.objects.get(pk=ser1.data["id"])
            # For each of choices_data (list of str), create new choice
            choices = []
            for ctext in choices_strings:
                choice_data = {"choice_text": ctext, "poll": ser1.data["id"]}
                ser2 = PollChoiceSerializer(data=choice_data)
                if ser2.is_valid():
                    ser2.save()
                else:
                    return Response(ser2.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                choices.append(ser2.data)
            ser3 = PollSerializer(new_poll)
            res = ser3.data
            return Response(res, status=status.HTTP_201_CREATED)
        else:
            return Response(ser1.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'DELETE'])
def poll_detail(request, pk, poll_id):
    """
    Get or delete a specific poll associated with a specific event.

    Note: A poll can be created or deleted, but not edited at this time.
    """
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"error": "No Event matching primary key"}, status=status.HTTP_404_NOT_FOUND)

    try:
        poll = Poll.objects.get(pk=poll_id)
    except Poll.DoesNotExist:
        return Response({"error": "No Poll matching primary key"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PollSerializer(poll)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        poll.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def poll_choice_vote(request, pk, poll_id):
    """
    For given event id, poll id, and choice id (provided as below), adds one vote:

        .../events/<event_id>/polls/<poll_id>/vote/

    Request data formatted as: {"vote": 5}
    where number is a choice id

    Returns entire poll after successful post.

    Note1: A poll can be created or deleted, but not edited at this time.
    Note2: Votes can only be added, not removed
    """
    try:
        Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"error": "No Event matching primary key"}, status=status.HTTP_404_NOT_FOUND)

    try:
        Poll.objects.get(pk=poll_id)
    except Poll.DoesNotExist:
        return Response({"error": "No Poll matching primary key"}, status=status.HTTP_404_NOT_FOUND)

    try:
        if "vote" not in request.data:
            raise Exception("Data must be formatted as {'vote': 123}")
        choice_id = request.data["vote"]
        if not isinstance(choice_id, int):
            raise Exception("vote must be an integer")
    except Exception as e:
        return Response({"error": e.message}, status=status.HTTP_400_BAD_REQUEST)

    try:
        choice = PollChoice.objects.get(pk=choice_id)
    except PollChoice.DoesNotExist:
        return Response({"error": "No PollChoice matching primary key"}, status=status.HTTP_404_NOT_FOUND)

    try:
        choice.add_vote(n=1)
        serializer = PollSerializer(Poll.objects.get(pk=poll_id))
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": e.message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
