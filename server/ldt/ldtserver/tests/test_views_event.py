"""
Unit tests for all Event views

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db

:TODO:
- API unit tests (http://www.django-rest-framework.org/api-guide/testing/)
"""

import json

from django.test import TestCase
from django.contrib.auth.models import User

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import Event
from ..views.event import rsvp

# Test db Constants
U1 = "JohnnyTest"
U2 = "BobbyTest"
U3 = "JessieTest"
U4 = "GeorgieTest"
U5 = "JimmyTest"
U6 = "PollyTest"
PWD = "test"
EMAIL = "test@test.com"


class EventViewTests(TestCase):

    def setUp(self):
        User.objects._create_user(username=U1, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U2, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U3, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U4, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U5, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U6, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)

    def test_event_list(self):
        url = reverse('event_list')
        id1 = User.objects.get_by_natural_key(U1).id
        id2 = User.objects.get_by_natural_key(U2).id
        id3 = User.objects.get_by_natural_key(U3).id
        id4 = User.objects.get_by_natural_key(U4).id
        # Test GET all events before POST
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Event.objects.count(), 0)
        # Test POST basic new event
        data = {'display_name': 'test event'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Event.objects.count(), 1)
        self.assertEqual(Event.objects.get(pk=response.data["id"]).display_name, 'test event')
        self.assertEqual(response.data['display_name'], 'test event')
        self.assertIsNone(response.data['start_date'])
        self.assertIsNone(response.data['end_date'])
        self.assertIsNone(response.data['budget'])
        self.assertIsNone(response.data['location'])
        self.assertEqual(response.data['hosts'], [])
        self.assertEqual(response.data['invites'], [])
        self.assertEqual(response.data['accepts'], [])
        self.assertEqual(response.data['declines'], [])
        self.assertIsNotNone(response.data['shopping_list'])
        self.assertIsNotNone(response.data['contributions'])
        # Test POST detailed new event, all fields correct
        data = {
            "display_name": "detailed test event",
            "start_date": "2015-01-01T00:00:00Z",
            "end_date": "2015-12-31T23:59:00Z",
            "budget": "12345678.90",
            "location": "21 jump street",
            "hosts": [id1],
            "invites": [id2],
            "accepts": [id3],
            "declines": [id4]
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Event.objects.count(), 2)
        self.assertEqual(Event.objects.get(pk=response.data["id"]).display_name, 'detailed test event')
        self.assertEqual(response.data['display_name'], 'detailed test event')
        self.assertEqual(response.data['start_date'], "2015-01-01T00:00:00Z")
        self.assertEqual(response.data['end_date'], "2015-12-31T23:59:00Z")
        self.assertEqual(response.data['budget'], "12345678.90")
        self.assertEqual(response.data['location'], "21 jump street")
        self.assertEqual(response.data['hosts'], [User.objects.get_by_natural_key(U1).id])
        self.assertEqual(response.data['invites'], [User.objects.get_by_natural_key(U2).id])
        self.assertEqual(response.data['accepts'], [User.objects.get_by_natural_key(U3).id])
        self.assertEqual(response.data['declines'], [User.objects.get_by_natural_key(U4).id])
        self.assertIsNotNone(response.data['shopping_list'])
        self.assertIsNotNone(response.data['contributions'])
        # Test POST without display_name (invalid)
        data = {'not_display_name': 'test event error'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'KeyError: event display_name required.')
        self.assertEqual(Event.objects.count(), 2)

    def test_rsvp_helper(self):
        # Set up event1 before applying replies
        event1 = Event.objects.create(display_name="test event")
        event1.save()  # Cannot use ManyToMany relation until all pks saved
        event1.invites.add(User.objects.get_by_natural_key(U1))
        event1.accepts.add(User.objects.get_by_natural_key(U2))
        id1 = User.objects.get_by_natural_key(U1).id
        id2 = User.objects.get_by_natural_key(U2).id
        self.assertEqual(Event.get_invites(event1), [id1])
        self.assertEqual(Event.get_accepts(event1), [id2])

        # Apply replies to rsvp function on event1
        replies = {"accepts": [id1]}
        res = rsvp(event=event1, replies=replies)
        self.assertEqual(res["invites"], [])
        self.assertEqual(res["accepts"], [id1, id2])
        self.assertEqual(res["declines"], [])

        # Set up event2 before applying replies
        event2 = Event.objects.create(display_name="test event")
        event2.save()  # Cannot use ManyToMany relation until all pks saved
        event2.invites.add(User.objects.get_by_natural_key(U1))
        event2.invites.add(User.objects.get_by_natural_key(U2))
        event2.accepts.add(User.objects.get_by_natural_key(U3))
        event2.accepts.add(User.objects.get_by_natural_key(U4))
        event2.declines.add(User.objects.get_by_natural_key(U5))
        event2.declines.add(User.objects.get_by_natural_key(U6))
        id1 = User.objects.get_by_natural_key(U1).id
        id2 = User.objects.get_by_natural_key(U2).id
        id3 = User.objects.get_by_natural_key(U3).id
        id4 = User.objects.get_by_natural_key(U4).id
        id5 = User.objects.get_by_natural_key(U5).id
        id6 = User.objects.get_by_natural_key(U6).id
        self.assertEqual(Event.get_invites(event2), [id1, id2])
        self.assertEqual(Event.get_accepts(event2), [id3, id4])
        self.assertEqual(Event.get_declines(event2), [id5, id6])

        # Apply replies to rsvp function on event1
        replies = {
            "invites": [id6],
            "accepts": [id1, id2],
            "declines": [id3]
        }
        res = rsvp(event=event2, replies=replies)
        self.assertEqual(res["invites"], [id6])
        self.assertEqual(res["accepts"], [id1, id2, id4])
        self.assertEqual(res["declines"], [id3, id5])

        # Set up event3 before applying replies
        event3 = Event.objects.create(display_name="test event")
        event3.save()  # Cannot use ManyToMany relation until all pks saved
        event3.invites.add(User.objects.get_by_natural_key(U1))
        event3.invites.add(User.objects.get_by_natural_key(U2))
        event3.accepts.add(User.objects.get_by_natural_key(U3))
        event3.accepts.add(User.objects.get_by_natural_key(U4))
        event3.declines.add(User.objects.get_by_natural_key(U5))
        event3.declines.add(User.objects.get_by_natural_key(U6))
        id1 = User.objects.get_by_natural_key(U1).id
        id2 = User.objects.get_by_natural_key(U2).id
        id3 = User.objects.get_by_natural_key(U3).id
        id4 = User.objects.get_by_natural_key(U4).id
        id5 = User.objects.get_by_natural_key(U5).id
        id6 = User.objects.get_by_natural_key(U6).id
        self.assertEqual(Event.get_invites(event3), [id1, id2])
        self.assertEqual(Event.get_accepts(event3), [id3, id4])
        self.assertEqual(Event.get_declines(event3), [id5, id6])

        # Apply replies to rsvp function on event1
        replies_again = {
            "declines": [id4]
        }
        res = rsvp(event=event3, replies=replies_again)
        self.assertEqual(res["invites"], [id1, id2])
        self.assertEqual(res["accepts"], [id3])
        self.assertEqual(res["declines"], [id4, id5, id6])
