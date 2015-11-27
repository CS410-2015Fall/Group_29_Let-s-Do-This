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

from ..models import Event
from ..views.event import rsvp, old_and_new_hosts_no_duplicates

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
        # vars for the following tests
        url = reverse('event_list')
        id1 = User.objects.get_by_natural_key(U1).id
        id2 = User.objects.get_by_natural_key(U2).id
        id3 = User.objects.get_by_natural_key(U3).id
        id4 = User.objects.get_by_natural_key(U4).id
        # Test GET all events before POST
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
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
        # Test POST basic new event, with extra (benign) field not recognized by serializer
        data = {'display_name': 'test event with extra', 'extra': 'abc123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Event.objects.count(), 3)
        # Test POST without display_name (invalid)
        data = {'not_display_name': 'test event error'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'KeyError: event display_name required.')
        self.assertEqual(Event.objects.count(), 3)
        # Test POST with invalid date format
        data = {'display_name': 'test event error', 'start_date': "May 4 2016"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Event.objects.count(), 3)
        # Test POST with invalid budget format
        data = {'display_name': 'test event error', 'budget': 100.123}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Event.objects.count(), 3)
        # Test POST with invalid hosts format
        data = {"display_name": "test event error", "hosts": ["sammy", "sosa"]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Event.objects.count(), 3)
        # Test POST with host user that does not exist
        data = {"display_name": "test event error", "hosts": [9999]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Event.objects.count(), 3)
        # Test GET all events after POST
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Event.objects.count(), 3)

    def test_event_detail(self):
        # vars for the following tests
        u1 = User.objects.get_by_natural_key(U1)
        u2 = User.objects.get_by_natural_key(U2)
        u3 = User.objects.get_by_natural_key(U3)
        u4 = User.objects.get_by_natural_key(U4)
        u5 = User.objects.get_by_natural_key(U5)
        u6 = User.objects.get_by_natural_key(U6)
        u1o = {"id": u1.id, "username": u1.username}
        u2o = {"id": u2.id, "username": u2.username}
        u3o = {"id": u3.id, "username": u3.username}
        u4o = {"id": u4.id, "username": u4.username}
        # Setup by POST detailed new event, all fields correct
        data = {
            "display_name": "test event",
            "start_date": "2015-01-01T00:00:00Z",
            "end_date": "2015-12-31T23:59:00Z",
            "budget": "12345678.90",
            "location": "21 jump street",
            "hosts": [u1.id],
            "invites": [u2.id],
            "accepts": [u3.id],
            "declines": [u4.id]
        }
        url = reverse('event_list')
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        eid1 = response.data["id"]
        # GET event that exists
        url = reverse('event_detail', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(Event.objects.get(pk=response.data["id"]).display_name, 'test event')
        self.assertEqual(response.data['display_name'], 'test event')
        self.assertEqual(response.data['start_date'], "2015-01-01T00:00:00Z")
        self.assertEqual(response.data['end_date'], "2015-12-31T23:59:00Z")
        self.assertEqual(response.data['budget'], "12345678.90")
        self.assertEqual(response.data['location'], "21 jump street")
        self.assertEqual(response.data['hosts'], [u1o])
        self.assertEqual(response.data['invites'], [u2o])
        self.assertEqual(response.data['accepts'], [u3o])
        self.assertEqual(response.data['declines'], [u4o])
        self.assertIsNotNone(response.data['shopping_list'])
        self.assertIsNotNone(response.data['contributions'])
        # GET event that does not exist
        url = reverse('event_detail', kwargs={"pk": 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # PUT event that does not exist
        url = reverse('event_detail', kwargs={"pk": 9999})
        data = {}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # PUT event that exists (id = eid1), with no fields (returns event, unchanged)
        url = reverse('event_detail', kwargs={"pk": eid1})
        data = {}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(Event.objects.get(pk=response.data["id"]).display_name, 'test event')
        self.assertEqual(response.data['display_name'], 'test event')
        self.assertEqual(response.data['start_date'], "2015-01-01T00:00:00Z")
        self.assertEqual(response.data['end_date'], "2015-12-31T23:59:00Z")
        self.assertEqual(response.data['budget'], "12345678.90")
        self.assertEqual(response.data['location'], "21 jump street")
        self.assertEqual(response.data['hosts'], [u1.id])
        self.assertEqual(response.data['invites'], [u2.id])
        self.assertEqual(response.data['accepts'], [u3.id])
        self.assertEqual(response.data['declines'], [u4.id])
        self.assertIsNotNone(response.data['shopping_list'])
        self.assertIsNotNone(response.data['contributions'])
        # PUT event that exists, with valid fields
        # Note that the rsvp and old_and_new_hosts helpers will manage I/A/D and H lists
        data = {
            "display_name": "updated event",
            "start_date": "2016-02-02T05:55:00Z",
            "end_date": "2017-02-01T04:59:00Z",
            "budget": "1.00",
            "location": "the most northern I-5 Rest stop",
            "hosts": [u2.id],               # add U2, with U1
            "invites": [u5.id],             # add U5, with U2
            "accepts": [u4.id, u6.id],      # add U4 (rm from D) and U6
            "declines": [u3.id]             # add U3 (rm from A)
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(Event.objects.get(pk=response.data["id"]).display_name, 'updated event')
        self.assertEqual(response.data['display_name'], 'updated event')
        self.assertEqual(response.data['start_date'], "2016-02-02T05:55:00Z")
        self.assertEqual(response.data['end_date'], "2017-02-01T04:59:00Z")
        self.assertEqual(response.data['budget'], "1.00")
        self.assertEqual(response.data['location'], "the most northern I-5 Rest stop")
        self.assertEqual(response.data['hosts'], [u1.id, u2.id])
        self.assertEqual(response.data['invites'], [u2.id, u5.id])
        self.assertEqual(response.data['accepts'], [u4.id, u6.id])
        self.assertEqual(response.data['declines'], [u3.id])
        # PUT event that exists, with extra (benign) field not recognized by serializer
        data = {
            "display_name": "updated the event again",
            "non_existent": "field"
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(Event.objects.get(pk=response.data["id"]).display_name, 'updated the event again')
        self.assertEqual(response.data['display_name'], 'updated the event again')
        # PUT event that exists, with invalid date format
        data = {
            "start_date": "May 4 2016"
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # PUT event that exists, with invalid budget format
        data = {
            "budget": "100.123"
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # PUT event that exists, with invalid hosts format
        data = {
            "hosts": ["sammy", "sosa"]
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # PUT event that exists, with host user that does not exist
        data = {
            "hosts": [9999]
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # DELETE event that exists
        url = reverse('event_detail', kwargs={"pk": eid1})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # DELETE event that does not exist
        url = reverse('event_detail', kwargs={"pk": 9999})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_changed_remove(self):
        # vars for the following tests
        u1 = User.objects.get_by_natural_key(U1)
        u2 = User.objects.get_by_natural_key(U2)
        u3 = User.objects.get_by_natural_key(U3)
        u4 = User.objects.get_by_natural_key(U4)
        # Setup by POST new event
        data = {"display_name": "test event"}
        url = reverse('event_list')
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        eid1 = response.data["id"]
        # PUT event's 'changed' list
        url = reverse('event_detail', kwargs={"pk": eid1})
        data = {"changed": [u1.id, u2.id, u3.id]}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data['changed'], [u1.id, u2.id, u3.id])
        # POST to remove one from 'changed'
        url = reverse('event_changed_remove', kwargs={"pk": eid1})
        data = {"changed": [u2.id]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data['changed'], [u1.id, u3.id])
        # POST to remove rest from 'changed'
        url = reverse('event_changed_remove', kwargs={"pk": eid1})
        data = {"changed": [u1.id, u3.id]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data['changed'], [])
        # PUT event's 'changed' list - should not duplicate U1
        url = reverse('event_detail', kwargs={"pk": eid1})
        data = {"changed": [u1.id, u2.id, u3.id]}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data['changed'], [u1.id, u2.id, u3.id])
        # POST to remove one from event that does not exist
        url = reverse('event_changed_remove', kwargs={"pk": 9999})
        data = {"changed": []}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # POST without 'changed' list provided
        url = reverse('event_changed_remove', kwargs={"pk": eid1})
        data = {"abcdef": []}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # POST to remove non-existent user from existing event
        url = reverse('event_changed_remove', kwargs={"pk": eid1})
        data = {"changed": [9999]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('event_detail', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data['changed'], [u1.id, u2.id, u3.id])
        # POST to remove existent user from existing event, but isn't on "changed" list
        url = reverse('event_changed_remove', kwargs={"pk": eid1})
        data = {"changed": [u4.id]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('event_detail', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data['changed'], [u1.id, u2.id, u3.id])

    def test_event_hosts_remove(self):
        # vars for the following tests
        u1 = User.objects.get_by_natural_key(U1)
        u2 = User.objects.get_by_natural_key(U2)
        u3 = User.objects.get_by_natural_key(U3)
        u4 = User.objects.get_by_natural_key(U4)
        u1o = {"id": u1.id, "username": u1.username}
        u2o = {"id": u2.id, "username": u2.username}
        u3o = {"id": u3.id, "username": u3.username}
        # Setup by POST new event
        data = {"display_name": "test event"}
        url = reverse('event_list')
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        eid1 = response.data["id"]
        # PUT event's 'hosts' list
        url = reverse('event_detail', kwargs={"pk": eid1})
        data = {"hosts": [u1.id, u2.id, u3.id]}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data['hosts'], [u1.id, u2.id, u3.id])
        # POST to remove one from 'hosts'
        url = reverse('event_hosts_remove', kwargs={"pk": eid1})
        data = {"hosts": [u2.id]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data["hosts"], [u1.id, u3.id])
        # POST to remove rest from 'hosts'
        url = reverse('event_hosts_remove', kwargs={"pk": eid1})
        data = {"hosts": [u1.id, u3.id]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data["hosts"], [])
        # PUT event's 'hosts' list for more tests
        url = reverse('event_detail', kwargs={"pk": eid1})
        data = {"hosts": [u1.id, u2.id, u3.id]}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data["hosts"], [u1.id, u2.id, u3.id])
        # POST to remove one from event that does not exist
        url = reverse('event_hosts_remove', kwargs={"pk": 9999})
        data = {"hosts": []}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # POST without 'hosts' list provided
        url = reverse('event_hosts_remove', kwargs={"pk": eid1})
        data = {"abcdef": []}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # POST to remove non-existent user from existing event
        url = reverse('event_hosts_remove', kwargs={"pk": eid1})
        data = {"hosts": [9999]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('event_detail', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data["hosts"], [u1o, u2o, u3o])
        # POST to remove existent user from existing event, but isn't on "hosts" list
        url = reverse('event_hosts_remove', kwargs={"pk": eid1})
        data = {"hosts": [u4.id]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('event_detail', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data["hosts"], [u1o, u2o, u3o])

    def test_event_invites_remove(self):
        # vars for the following tests
        u1 = User.objects.get_by_natural_key(U1)
        u2 = User.objects.get_by_natural_key(U2)
        u3 = User.objects.get_by_natural_key(U3)
        u4 = User.objects.get_by_natural_key(U4)
        u1o = {"id": u1.id, "username": u1.username}
        u2o = {"id": u2.id, "username": u2.username}
        u3o = {"id": u3.id, "username": u3.username}
        # Setup by POST new event
        data = {"display_name": "test event"}
        url = reverse('event_list')
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        eid1 = response.data["id"]
        # PUT event's 'invites' list
        url = reverse('event_detail', kwargs={"pk": eid1})
        data = {"invites": [u1.id, u2.id, u3.id]}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data['invites'], [u1.id, u2.id, u3.id])
        # POST to remove one from 'invites'
        url = reverse('event_invites_remove', kwargs={"pk": eid1})
        data = {"invites": [u2.id]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data["invites"], [u1.id, u3.id])
        # POST to remove rest from 'invites'
        url = reverse('event_invites_remove', kwargs={"pk": eid1})
        data = {"invites": [u1.id, u3.id]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data["invites"], [])
        # PUT event's 'invites' list for more tests
        url = reverse('event_detail', kwargs={"pk": eid1})
        data = {"invites": [u1.id, u2.id, u3.id]}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data["invites"], [u1.id, u2.id, u3.id])
        # POST to remove one from event that does not exist
        url = reverse('event_invites_remove', kwargs={"pk": 9999})
        data = {"invites": []}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # POST without 'invites' list provided
        url = reverse('event_invites_remove', kwargs={"pk": eid1})
        data = {"abcdef": []}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # POST to remove non-existent user from existing event
        url = reverse('event_invites_remove', kwargs={"pk": eid1})
        data = {"invites": [9999]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('event_detail', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data["invites"], [u1o, u2o, u3o])
        # POST to remove existent user from existing event, but isn't on "invites" list
        url = reverse('event_invites_remove', kwargs={"pk": eid1})
        data = {"invites": [u4.id]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('event_detail', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], eid1)
        self.assertEqual(response.data["invites"], [u1o, u2o, u3o])

    def test_event_cancel(self):
        # vars for the following tests
        u1 = User.objects.get_by_natural_key(U1)
        u2 = User.objects.get_by_natural_key(U2)
        u3 = User.objects.get_by_natural_key(U3)
        u4 = User.objects.get_by_natural_key(U4)
        # Setup by POST new event
        data = {"display_name": "test event"}
        url = reverse('event_list')
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        eid1 = response.data["id"]
        event = Event.objects.get(pk=eid1)
        self.assertIsNone(response.data["cancelled"])
        self.assertFalse(event.is_cancelled())
        self.assertEqual(response.data["changed"], [])
        self.assertEqual(event.get_changed(), [])
        # POST to cancel, if nobody is host/invited/accepted/declined
        data = {"cancelled": True}
        url = reverse('event_cancel', kwargs={"pk": eid1})
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertTrue(response.data["cancelled"])
        event = Event.objects.get(pk=eid1)
        self.assertTrue(event.is_cancelled())   # !!!
        self.assertEqual(response.data["changed"], [])
        self.assertEqual(event.get_changed(), [])
        # Set back to uncancelled
        event = Event.objects.get(pk=eid1)
        event.uncancel()
        event.save()
        # POST to cancel, if some are host/invited/accepted/declined
        data = {
            "hosts": [u1.id],
            "invites": [u2.id],
            "accepts": [u3.id],
            "declines": [u4.id]
        }
        url = reverse('event_detail', kwargs={"pk": eid1})
        self.client.put(url, json.dumps(data), content_type='application/json')
        data = {"cancelled": True}
        url = reverse('event_cancel', kwargs={"pk": eid1})
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        event = Event.objects.get(pk=eid1)
        self.assertTrue(response.data["cancelled"])
        self.assertTrue(event.is_cancelled())
        self.assertEqual(response.data["changed"], [u1.id, u2.id, u3.id, u4.id])
        self.assertEqual(event.get_changed(), [u1.id, u2.id, u3.id, u4.id])
        # Reset 'changed' list but keep as cancelled
        data = {"changed": [u1.id, u2.id, u3.id, u4.id]}
        url = reverse('event_changed_remove', kwargs={"pk": eid1})
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        event = Event.objects.get(pk=eid1)
        self.assertEqual(response.data["changed"], [])
        self.assertEqual(event.get_changed(), [])
        self.assertTrue(response.data["cancelled"])
        self.assertTrue(event.is_cancelled())
        # POST to uncancel and add all to changed
        data = {"cancelled": False}
        url = reverse('event_cancel', kwargs={"pk": eid1})
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        event = Event.objects.get(pk=eid1)
        self.assertFalse(response.data["cancelled"])
        self.assertFalse(event.is_cancelled())
        self.assertEqual(response.data["changed"], [u1.id, u2.id, u3.id, u4.id])
        self.assertEqual(event.get_changed(), [u1.id, u2.id, u3.id, u4.id])
        # POST to cancel nonexistent event
        data = {"cancelled": True}
        url = reverse('event_cancel', kwargs={"pk": 9999})
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # POST without "cancelled" key
        data = {"abcdef": False}
        url = reverse('event_cancel', kwargs={"pk": eid1})
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # POST with "cancelled" as not True or False
        data = {"cancelled": 123}
        url = reverse('event_cancel', kwargs={"pk": eid1})
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = {"cancelled": []}
        url = reverse('event_cancel', kwargs={"pk": eid1})
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = {"cancelled": None}
        url = reverse('event_cancel', kwargs={"pk": eid1})
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_old_and_new_hosts_helper(self):
        # vars for the following tests
        u1 = User.objects.get_by_natural_key(U1)
        u2 = User.objects.get_by_natural_key(U2)
        u3 = User.objects.get_by_natural_key(U3)
        u4 = User.objects.get_by_natural_key(U4)
        u5 = User.objects.get_by_natural_key(U5)
        u6 = User.objects.get_by_natural_key(U6)
        # Setup by POST new event
        data = {"display_name": "test event"}
        url = reverse('event_list')
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        eid1 = response.data["id"]
        # All are new
        event = Event.objects.get(pk=eid1)
        res = old_and_new_hosts_no_duplicates(event, [u1.id, u2.id])
        self.assertEqual(res, [u1.id, u2.id])
        event.save()
        # One new + one duplicate
        event = Event.objects.get(pk=eid1)
        res = old_and_new_hosts_no_duplicates(event, [u2.id, u3.id])
        self.assertEqual(res, [u2.id, u3.id])
        event.save()

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
