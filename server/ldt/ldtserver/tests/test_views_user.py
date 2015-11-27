"""
Unit tests for all User views

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db
"""

import json
from django.contrib.auth.models import User
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
        usercount = len(User.objects.all())
        self.assertEqual(usercount, 1)
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
        usercount = len(User.objects.all())
        self.assertEqual(usercount, 2)
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
        usercount = len(User.objects.all())
        self.assertEqual(usercount, 3)
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
        usercount = len(User.objects.all())
        self.assertEqual(usercount, 3)
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
        usercount = len(User.objects.all())
        self.assertEqual(usercount, 3)
        # POST invalid phone format
        url = reverse('user_new')
        data = {
            "username": U4,
            "password": PWD,
            "phone": "abc"
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        usercount = len(User.objects.all())
        self.assertEqual(usercount, 3)
        # POST invalid friend format
        url = reverse('user_new')
        data = {
            "username": U4,
            "password": PWD,
            "friends": "abc"
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        usercount = len(User.objects.all())
        self.assertEqual(usercount, 3)
        # POST non-existent user as friend
        url = reverse('user_new')
        data = {
            "username": U4,
            "password": PWD,
            "friends": [9999]
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        usercount = len(User.objects.all())
        self.assertEqual(usercount, 3)

    def test_user_list(self):
        # Set up
        url = reverse('user_new')
        data = {"username": U1, "password": PWD}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        uid1 = response.data["id"]
        uobj1 = {
            "id": uid1,
            "username": response.data["username"],
            "phone": response.data["phone"],
            "email": response.data["email"],
            "friends": []
        }
        uobj1nf = {
            "id": uid1,
            "username": response.data["username"],
            "phone": response.data["phone"],
            "email": response.data["email"]
        }
        url = reverse('user_new')
        data = {
            "username": U2,
            "password": PWD,
            "email": EMAIL,
            "phone": PHONE,
            "friends": [uid1]
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        uid2 = response.data["id"]
        uobj2 = {
            "id": uid2,
            "username": response.data["username"],
            "phone": response.data["phone"],
            "email": response.data["email"],
            "friends": [uobj1nf]
        }
        # GET all
        url = reverse('user_list')
        response = self.client.get(url, content_type='application/json')
        self.assertTrue(uobj1 in response.data)
        self.assertTrue(uobj2 in response.data)

    def test_user_search(self):
        # Set up
        url = reverse('user_new')
        data = {"username": U1, "password": PWD, "email": EMAIL, "phone": PHONE}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        uname1 = response.data["username"]
        uobj1 = {"id": response.data["id"]}
        # POST search for existing user
        url = reverse('user_search')
        data = {"username": uname1}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.data, uobj1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # POST search for nonexistent user
        url = reverse('user_search')
        data = {"username": "abcdefghi123456789"}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.data, "No user matching that username")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # POST without specifying username
        url = reverse('user_search')
        data = {"abc": uname1}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # # POST with malformed "username"
        # url = reverse('user_search')
        # data = {"username": []}
        # response = self.client.post(url, json.dumps(data), content_type='application/json')
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_detail(self):
        # Set up
        url = reverse('user_new')
        data = {"username": U1, "password": PWD}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        uid1 = response.data["id"]
        uobj1 = {
            "id": uid1,
            "username": response.data["username"],
            "phone": response.data["phone"],
            "email": response.data["email"],
            "friends": []
        }
        uobj1nf = {
            "id": uid1,
            "username": response.data["username"],
            "phone": response.data["phone"],
            "email": response.data["email"]
        }
        url = reverse('user_new')
        data = {
            "username": U2,
            "password": PWD,
            "email": EMAIL,
            "phone": PHONE,
            "friends": [uid1]
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        uid2 = response.data["id"]
        uobj2 = {
            "id": uid2,
            "username": response.data["username"],
            "phone": response.data["phone"],
            "email": response.data["email"],
            "friends": [uobj1nf]
        }
        superuser = User.objects._create_user(username=U3, password=PWD, email=EMAIL, is_staff=True, is_superuser=True)
        suid = superuser.id
        suobj = {
            "id": suid,
            "username": superuser.username
        }
        # GET regular user that exists
        url = reverse('user_detail', kwargs={"pk": uid2})
        response = self.client.get(url, content_type='application/json')
        self.assertEqual(response.data, uobj2)
        # GET superuser (no associated LdtUser profile)
        url = reverse('user_detail', kwargs={"pk": suid})
        response = self.client.get(url, content_type='application/json')
        self.assertEqual(response.data, suobj)
        # GET user that does not exist
        url = reverse('user_detail', kwargs={"pk": 9999})
        response = self.client.get(url, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # PUT existing user with valid fields

        # PUT existing user with invalid email

        # PUT existing user with invalid phone

        # PUT existing user with invalid email

        # PUT existing user with invalid friends

        # PUT existing user with non-existent friends

        # # PUT user that does not exist
        # url = reverse('user_detail', kwargs={"pk": 9999})
        # response = self.client.PUT(url, json.dumps(data), content_type='application/json')
        # self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


        # DELETE user that exists
        url = reverse('user_detail', kwargs={"pk": uid2})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # DELETE user that does not exist
        url = reverse('user_detail', kwargs={"pk": 9999})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_user_friends_remove(self):
        return  # !!! stub

    def test_user_events(self):
        return  # !!! stub
