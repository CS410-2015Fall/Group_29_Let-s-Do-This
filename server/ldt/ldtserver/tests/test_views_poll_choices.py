"""
Unit tests for all Poll and Choice views

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db
"""

import json
from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status
from ..models import Event, Poll


class PollAndChoiceViewTests(TestCase):

    def test_poll_list(self):
        # Set up
        e1 = Event.objects.create(display_name="test event")
        eid1 = e1.id
        # GET polls of event (before creating any)
        url = reverse('poll_list', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertEqual(response.data, [])
        # POST new poll with valid fields
        url = reverse('poll_list', kwargs={"pk": eid1})
        data = {
            "question": "Cupcakes?",
            "poll_choices": [
                "Yes",
                "No"
            ]
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        p1 = response.data
        self.assertEqual(p1["question"], "Cupcakes?")
        self.assertTrue(any("Yes" in od.values() for od in p1["poll_choices"]))
        self.assertTrue(any("No" in od.values() for od in p1["poll_choices"]))
        # GET polls of event (after creating some)
        url = reverse('poll_list', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertTrue(p1 in response.data)
        self.assertEqual(len(response.data), 1)
        # GET polls of event that doesn't exist
        url = reverse('poll_list', kwargs={"pk": 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # POST poll without question or at least poll_choice (invalid)
        url = reverse('poll_list', kwargs={"pk": eid1})
        data = {
            "poll_choices": [
                "Yes",
                "No"
            ]
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('poll_list', kwargs={"pk": eid1})
        data = {
            "question": "Cupcakes?",
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # POST poll with invalid question or poll_choice format
        # url = reverse('poll_list', kwargs={"pk": eid1})
        # data = {
        #     "question": [],
        #     "poll_choices": [
        #         "Yes",
        #         "No"
        #     ]
        # }
        # response = self.client.post(url, json.dumps(data), content_type='application/json')
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('poll_list', kwargs={"pk": eid1})
        data = {
            "question": "Cupcakes?",
            "poll_choices": 123
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_poll_detail(self):
        # Set up
        e1 = Event.objects.create(display_name="test event")
        eid1 = e1.id
        url = reverse('poll_list', kwargs={"pk": eid1})
        data = {
            "question": "Cupcakes?",
            "poll_choices": [
                "Yes",
                "No"
            ]
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        p1 = response.data
        pid1 = p1["id"]
        # GET event poll
        url = reverse('poll_detail', kwargs={"pk": eid1, "poll_id": pid1})
        response = self.client.get(url)
        self.assertEqual(response.data["question"], "Cupcakes?")
        self.assertTrue(any("Yes" in od.values() for od in p1["poll_choices"]))
        self.assertTrue(any("No" in od.values() for od in p1["poll_choices"]))
        # DELETE event poll
        url = reverse('poll_detail', kwargs={"pk": eid1, "poll_id": pid1})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # GET event that doesn't exist
        url = reverse('poll_detail', kwargs={"pk": 9999, "poll_id": pid1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # GET event poll that doesn't exist
        url = reverse('poll_detail', kwargs={"pk": eid1, "poll_id": 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_poll_choice_vote(self):
        # Set up
        e1 = Event.objects.create(display_name="test event")
        eid1 = e1.id
        url = reverse('poll_list', kwargs={"pk": eid1})
        data = {
            "question": "Cupcakes?",
            "poll_choices": [
                "Yes",
                "No"
            ]
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        pid1 = response.data["id"]
        poll1 = Poll.objects.get(pk=pid1)
        cid1 = Poll.get_choices(poll1)[0].id  # not sure which choice ID, but it is one
        # POST to vote
        url = reverse('poll_choice_vote', kwargs={"pk": eid1, "poll_id": pid1})
        data = {"vote": cid1}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        total = 0
        # Odd way to test (I'm tired): only one of the choices will have votes=1, so total should be 1
        for c in response.data["poll_choices"]:
            if "votes" in c:
                total += c["votes"]
        self.assertEqual(total, 1)
        # POST without 'vote' choice id
        url = reverse('poll_choice_vote', kwargs={"pk": eid1, "poll_id": pid1})
        data = {"abc": cid1}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # POST event that doesn't exist
        url = reverse('poll_choice_vote', kwargs={"pk": 9999, "poll_id": pid1})
        data = {"vote": cid1}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # POST event poll that doesn't exist
        url = reverse('poll_choice_vote', kwargs={"pk": eid1, "poll_id": 9999})
        data = {"vote": cid1}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # POST event poll choice that doesn't exist
        url = reverse('poll_choice_vote', kwargs={"pk": eid1, "poll_id": pid1})
        data = {"vote": 9999}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
