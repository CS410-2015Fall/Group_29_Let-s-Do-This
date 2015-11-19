"""
All Poll views for ldtserver (for RESTful API)
"""

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Event, Poll, PollChoice
from ..serializers import EventSerializer, PollSerializer, PollChoiceSerializer


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
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        all_polls = Poll.objects.all()
        event_polls = [ap for ap in all_polls if ap in Event.get_polls(event)]
        ser1 = PollSerializer(event_polls, many=True)
        return Response(ser1.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
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
                    return Response(ser2.errors, status=status.HTTP_400_BAD_REQUEST)
                choices.append(ser2.data)
            ser3 = PollSerializer(new_poll)
            res = ser3.data
            return Response(res, status=status.HTTP_201_CREATED)
        else:
            return Response(ser1.errors, status=status.HTTP_400_BAD_REQUEST)


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

