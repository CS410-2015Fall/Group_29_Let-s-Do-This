"""
Unit tests for all Comment views

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db
"""

import json
from django.contrib.auth.models import User
from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status
from ..models import Event
from ..views.comment import author_id_to_username


# Test db Constants
U1 = "JohnnyTest"
U2 = "BobbyTest"
U3 = "JessieTest"
U4 = "GeorgieTest"
U5 = "JimmyTest"
U6 = "PollyTest"
PWD = "test"
PWD2 = "abcd"
EMAIL = "test@test.com"
PHONE = "6045554321"


class CommentViewTests(TestCase):

    def setUp(self):
        User.objects._create_user(username=U1, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U2, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U3, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U4, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U5, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U6, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)

    def test_comment_list(self):
        # Set up
        u1 = User.objects.get_by_natural_key(U1)
        uid1 = u1.id
        uobj1 = {
            "id": uid1,
            "username": u1.username,
        }
        e1 = Event.objects.create(display_name="test event")
        eid1 = e1.id
        # GET event comments before creating any
        url = reverse('comment_list', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertEqual(response.data, [])
        # POST new comment
        url = reverse('comment_list', kwargs={"pk": eid1})
        post_date = "2015-01-01T00:00:00Z"
        data = {
            "post_date": post_date,
            "author": uid1,
            "content": "test content"
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        c1 = response.data
        self.assertEqual(c1["post_date"], post_date)
        self.assertEqual(c1["author"], uobj1)
        self.assertEqual(c1["content"], "test content")
        # GET event comments after creating some
        url = reverse('comment_list', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertTrue(c1 in response.data)
        self.assertTrue(len(response.data), 1)
        # GET nonexistent event
        url = reverse('comment_list', kwargs={"pk": 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # POST without post_date, author, content (invalid)
        url = reverse('comment_list', kwargs={"pk": eid1})
        data = {}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('comment_list', kwargs={"pk": eid1})
        data = {"post_date": post_date, "author": uid1}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('comment_list', kwargs={"pk": eid1})
        data = {"author": uid1, "content": "test content"}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('comment_list', kwargs={"pk": eid1})
        data = {"post_date": post_date, "content": "test content"}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # POST invalid post_date, author, content formats
        url = reverse('comment_list', kwargs={"pk": eid1})
        post_date = "2015-01-01T00:00:00Z"
        data = {
            "post_date": 123,
            "author": uid1,
            "content": "test content"
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = {
            "post_date": post_date,
            "author": 9999,
            "content": "test content"
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # data = {
        #     "post_date": post_date,
        #     "author": uid1,
        #     "content": {}
        # }
        # response = self.client.post(url, json.dumps(data), content_type='application/json')
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_comment_detail(self):
        # Set up
        u1 = User.objects.get_by_natural_key(U1)
        uid1 = u1.id
        uobj1 = {
            "id": uid1,
            "username": u1.username,
        }
        e1 = Event.objects.create(display_name="test event")
        eid1 = e1.id
        url = reverse('comment_list', kwargs={"pk": eid1})
        post_date = "2015-01-01T00:00:00Z"
        data = {
            "post_date": post_date,
            "author": uid1,
            "content": "test content"
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        c1 = response.data
        cid1 = c1["id"]
        # GET event comment
        url = reverse('comment_detail', kwargs={"pk": eid1, "comment_id": cid1})
        response = self.client.get(url)
        self.assertEqual(response.data["id"], cid1)
        self.assertEqual(response.data["content"], "test content")
        self.assertEqual(response.data["post_date"], post_date)
        self.assertEqual(response.data["author"], uobj1)
        # PUT event comment with valid fields
        url = reverse('comment_detail', kwargs={"pk": eid1, "comment_id": cid1})
        u2 = User.objects.get_by_natural_key(U2)
        uid2 = u2.id
        uobj2 = {
            "id": uid2,
            "username": u2.username,
        }
        post_date = "2016-02-02T05:05:05Z"
        data = {
            "post_date": post_date,
            "author": uid2,
            "content": "updated content"
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.data["content"], "updated content")
        self.assertEqual(response.data["post_date"], post_date)
        self.assertEqual(response.data["author"], uobj2)
        # PUT invalid post_date, author, content formats
        url = reverse('comment_detail', kwargs={"pk": eid1, "comment_id": cid1})
        data = {
            "post_date": 123,
            "author": uid1,
            "content": "updated content"
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('comment_detail', kwargs={"pk": eid1, "comment_id": cid1})
        data = {
            "post_date": post_date,
            "author": 9999,
            "content": "updated content"
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('comment_detail', kwargs={"pk": eid1, "comment_id": cid1})
        data = {
            "post_date": post_date,
            "author": 9999,
            "content": {}
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # DELETE event comment
        url = reverse('comment_detail', kwargs={"pk": eid1, "comment_id": cid1})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # GET event that doesn't exist
        url = reverse('comment_detail', kwargs={"pk": 9999, "comment_id": 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # GET event comment that doesn't exist
        url = reverse('comment_detail', kwargs={"pk": eid1, "comment_id": 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_author_id_to_username_helper(self):
        # method not implemented
        self.assertIsNone(author_id_to_username(user_id=1))
