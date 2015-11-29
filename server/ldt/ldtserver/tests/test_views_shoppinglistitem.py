"""
Unit tests for all ShoppingListItem views

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db
"""

import json
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from rest_framework import status

# Test db Constants
U1 = "JohnnyTest"
U2 = "BobbyTest"
PWD = "test"
EMAIL = "test@test.com"


class ShoppingListTest(TestCase):

    def setUp(self):
        User.objects._create_user(username=U1, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U2, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)

    def test_shoppinglist_put(self):
        # Set up
        u1 = User.objects.get_by_natural_key(U1)
        uid1 = u1.id
        uobj1 = {
            "id": uid1,
            "username": u1.username
        }
        u2 = User.objects.get_by_natural_key(U2)
        uid2 = u2.id
        uobj2 = {
            "id": uid2,
            "username": u2.username
        }
        url = reverse('event_list')
        data = {"display_name": "test event"}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        eid1 = response.data["id"]
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        data = [{"display_name": "hot dogs"}]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        sli1 = response.data[0]
        sliid1 = sli1["id"]
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        data = [{"display_name": "cold buns"}]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        sli2 = response.data[0]
        sliid2 = sli2["id"]
        # PUT shoppinglistitem with valid fields
        url = reverse('shoppinglist_put', kwargs={"pk": eid1})
        sli1 = {
            "id": sliid1,
            "display_name": "big hot dogs",
            "quantity": "9001.00",
            "cost": "12345678.90",
            "supplier": uid1,
            "ready": False
        }
        sli2 = {
            "id": sliid2,
            "display_name": "little cold buns",
            "quantity": "1.00",
            "cost": "9.99",
            "ready": True
        }
        data = [sli1, sli2]
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        sli1["supplier"] = uobj1
        sli2["supplier"] = None
        self.assertTrue(sli1 in response.data)
        self.assertTrue(sli2 in response.data)
        # PUT event that does not exist
        url = reverse('shoppinglist_put', kwargs={"pk": 9999})
        data = [sli1]
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # PUT at least one shoppinglistitem that does not exist
        url = reverse('shoppinglist_put', kwargs={"pk": eid1})
        data = [{
            "id": 9999,
            "display_name": "invisible cookies"
        }]
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # PUT not as list of items
        url = reverse('shoppinglist_put', kwargs={"pk": eid1})
        data = {
            "id": sliid1,
            "display_name": "singular cookie"
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # PUT with invalid format in quantity, cost, ready
        url = reverse('shoppinglist_put', kwargs={"pk": eid1})
        data = [{
            "id": sliid1,
            "quantity": "abc"
        }]
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('shoppinglist_put', kwargs={"pk": eid1})
        data = [{
            "id": sliid1,
            "cost": "abc"
        }]
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('shoppinglist_put', kwargs={"pk": eid1})
        data = [{
            "id": sliid1,
            "ready": "abc"
        }]
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # PUT with nonexistent user as supplier
        url = reverse('shoppinglist_put', kwargs={"pk": eid1})
        data = [{
            "id": sliid1,
            "supplier": 9999
        }]
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_shopplinglist_delete(self):
        # Set up
        u1 = User.objects.get_by_natural_key(U1)
        uid1 = u1.id
        uobj1 = {
            "id": uid1,
            "username": u1.username
        }
        u2 = User.objects.get_by_natural_key(U2)
        uid2 = u2.id
        uobj2 = {
            "id": uid2,
            "username": u2.username
        }
        url = reverse('event_list')
        data = {"display_name": "test event"}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        eid1 = response.data["id"]
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        data = [{"display_name": "hot dogs"}]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        sli1 = response.data[0]
        sliid1 = sli1["id"]
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        data = [{"display_name": "cold buns"}]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        sli2 = response.data[0]
        sliid2 = sli2["id"]
        # POST to delete some items
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertEqual(len(response.data), 2)
        url = reverse('shoppinglist_delete', kwargs={"pk": eid1})
        data = [sliid1]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertEqual(len(response.data), 1)
        # POST event that does not exist
        url = reverse('shoppinglist_delete', kwargs={"pk": 9999})
        data = [sliid2]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # POST at least one shoppinglistitem that does not exist
        url = reverse('shoppinglist_delete', kwargs={"pk": eid1})
        data = [9999]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
