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
PWD2 = "abcd"
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
        usercount = len(User.objects.all())
        self.assertEqual(usercount, 3)
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
        # PUT existing user with valid fields (User fields)
        url = reverse('user_detail', kwargs={"pk": uid2})
        data = {"username": "skippy", "password": PWD2}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.data["id"], uid2)
        self.assertEqual(response.data["username"], "skippy")
        # self.assertEqual(User.objects.get(pk=uid2).password, PWD2)  # cannot test; password is hashed
        # PUT existing user with valid fields (LdtUser fields)
        url = reverse('user_detail', kwargs={"pk": uid2})
        data = {"email": "abc@xyz.com", "phone": "7783334444", "friends": [suid]}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.data["id"], uid2)
        self.assertEqual(response.data["email"], "abc@xyz.com")
        self.assertEqual(response.data["phone"], "7783334444")
        self.assertTrue(suobj in response.data["friends"])
        self.assertTrue(uobj1nf in response.data["friends"])
        # PUT existing user with no fields (method allowed but user does not change)
        url = reverse('user_detail', kwargs={"pk": uid2})
        data = {}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.data["id"], uid2)
        self.assertEqual(response.data["email"], "abc@xyz.com")
        self.assertEqual(response.data["phone"], "7783334444")
        self.assertTrue(suobj in response.data["friends"])
        self.assertTrue(uobj1nf in response.data["friends"])
        # PUT existing user with invalid email
        url = reverse('user_detail', kwargs={"pk": uid2})
        data = {"email": "abc"}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # PUT existing user with invalid phone
        url = reverse('user_detail', kwargs={"pk": uid2})
        data = {"phone": "abc"}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # PUT existing user with invalid friends format
        url = reverse('user_detail', kwargs={"pk": uid2})
        data = {"friends": "abc"}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # PUT existing user with friends that are nonexistent users
        url = reverse('user_detail', kwargs={"pk": uid2})
        data = {"friends": [9999]}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # PUT user that does not exist
        url = reverse('user_detail', kwargs={"pk": 9999})
        data = {}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # DELETE user that exists
        url = reverse('user_detail', kwargs={"pk": uid2})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        usercount = len(User.objects.all())
        self.assertEqual(usercount, 2)
        # DELETE user that does not exist
        url = reverse('user_detail', kwargs={"pk": 9999})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_friends_remove(self):
        # Set up
        superuser = User.objects._create_user(username=U3, password=PWD, email=EMAIL, is_staff=True, is_superuser=True)
        suid = superuser.id
        suobj = {
            "id": suid,
            "username": superuser.username
        }
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
        uobj2nf = {
            "id": uid2,
            "username": response.data["username"],
            "phone": response.data["phone"],
            "email": response.data["email"]
        }
        url = reverse('user_new')
        data = {
            "username": U5,
            "password": PWD,
            "email": EMAIL,
            "phone": PHONE,
            "friends": [uid1, uid2, suid]
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        print response
        uid5 = response.data["id"]
        uobj5 = {
            "id": uid5,
            "username": response.data["username"],
            "phone": response.data["phone"],
            "email": response.data["email"],
            "friends": [uobj1nf, uobj2nf, suobj]
        }

        usercount = len(User.objects.all())
        self.assertEqual(usercount, 4)
        # Remove a friend
        url = reverse('user_friends_remove', kwargs={"pk": uid2})
        data = {"friends": [uid1]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.data["friends"], [])
        # Remove a friend, return remaining friend including admin user
        url = reverse('user_friends_remove', kwargs={"pk": uid5})
        data = {"friends": [uid1]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertTrue(uobj2nf in response.data["friends"])
        self.assertTrue(suobj in response.data["friends"])
        # Attempt to remove friends from non-existent user
        url = reverse('user_friends_remove', kwargs={"pk": 9999})
        data = {"friends": [uid1]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # Attempt to remove friends from admin user (has no friends)
        url = reverse('user_friends_remove', kwargs={"pk": suid})
        data = {"friends": [uid1]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # Don't provide list of friends to remove
        url = reverse('user_friends_remove', kwargs={"pk": uid5})
        data = {"abc": [uid2]}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_events(self):
        return  # !!! stub
