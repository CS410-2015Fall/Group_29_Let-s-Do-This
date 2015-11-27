"""
Unit tests for all User views

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db
"""

import json
from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status


# Test db Constants
U1 = "JohnnyTest"
U2 = "BobbyTest"
U3 = "JessieTest"
U4 = "GeorgieTest"
U5 = "JimmyTest"
U6 = "PollyTest"
PWD = "test"
EMAIL = "test@test.com"
PHONE = "6045554321"


class UserViewTests(TestCase):

    def test_user_new(self):
        # POST only mandatory fields
        url = reverse('user_new')
        data = {"username": U1, "password": PWD}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertTrue("id" in response.data)
        self.assertTrue("username" in response.data)
        self.assertTrue("phone" in response.data)
        self.assertTrue("email" in response.data)
        self.assertTrue("friends" in response.data)
        self.assertEqual(response.data["username"], U1)
        uid1 = response.data["id"]
        uobj1 = {
            "id": uid1,
            "username": response.data["username"],
            "phone": response.data["phone"],
            "email": response.data["email"]
        }
        # POST all valid fields
        url = reverse('user_new')
        data = {
            "username": U2,
            "password": PWD,
            "email": EMAIL,
            "phone": PHONE,
            "friends": [uid1]
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertTrue("id" in response.data)
        self.assertTrue("username" in response.data)
        self.assertTrue("phone" in response.data)
        self.assertTrue("email" in response.data)
        self.assertTrue("friends" in response.data)
        self.assertEqual(response.data["username"], U2)
        self.assertEqual(response.data["email"], EMAIL)
        self.assertEqual(response.data["phone"], PHONE)
        self.assertEqual(response.data["friends"], [uobj1])
        uid2 = response.data["id"]
        uobj2 = {
            "id": uid2,
            "username": response.data["username"],
            "phone": response.data["phone"],
            "email": response.data["email"]
        }
        # POST mandatory with extra field not recognized by serializer
        url = reverse('user_new')
        data = {
            "username": U3,
            "password": PWD,
            "safeword": "banana"
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertTrue("id" in response.data)
        self.assertTrue("username" in response.data)
        self.assertTrue("phone" in response.data)
        self.assertTrue("email" in response.data)
        self.assertTrue("friends" in response.data)
        self.assertEqual(response.data["username"], U3)
        # POST without username or password (invalid)
        url = reverse('user_new')
        data = {
            "username": U4
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('user_new')
        data = {
            "password": PWD
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # # POST invalid username or password format
        # url = reverse('user_new')
        # data = {
        #     "username": 123,
        #     "password": PWD
        # }
        # response = self.client.post(url, json.dumps(data), content_type='application/json')
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # url = reverse('user_new')
        # data = {
        #     "username": U4,
        #     "password": 123
        # }
        # response = self.client.post(url, json.dumps(data), content_type='application/json')
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # POST invalid email format
        url = reverse('user_new')
        data = {
            "username": U4,
            "password": PWD,
            "email": "abc"
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # POST invalid phone format
        url = reverse('user_new')
        data = {
            "username": U4,
            "password": PWD,
            "phone": "abc"
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # POST invalid friend format
        url = reverse('user_new')
        data = {
            "username": U4,
            "password": PWD,
            "friends": "abc"
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # POST non-existent user as friend
        url = reverse('user_new')
        data = {
            "username": U4,
            "password": PWD,
            "friends": [9999]
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_list(self):
        return  # !!! stub

    def test_user_search(self):
        return  # !!! stub

    def test_user_detail(self):
        return  # !!! stub

    def test_user_friends_remove(self):
        return  # !!! stub

    def test_user_events(self):
        return  # !!! stub
