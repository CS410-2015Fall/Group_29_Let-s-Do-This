"""
Unit tests for all ShoppingList views

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
PWD = "test"
EMAIL = "test@test.com"


class ShoppingListItemTest(TestCase):

    def setUp(self):
        User.objects._create_user(username=U1, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)

    def test_shoppinglistitem_list(self):
        # Set up
        u1 = User.objects.get_by_natural_key(U1)
        uid1 = u1.id
        uobj1 = {
            "id": uid1,
            "username": u1.username
        }
        url = reverse('event_list')
        data = {"display_name": "test event"}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        eid1 = response.data["id"]
        # GET all shoppinglistitem for event (before any created)
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertEqual(response.data, [])
        # POST new shoppinglistitem to event
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        data = [
            {
                "display_name": "hot dogs",
                "quantity": 9001,
                "cost": 12345678.90,
                "supplier": uid1,
                "ready": False
            }
        ]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertIsInstance(response.data, list)
        sli1 = response.data[0]
        self.assertEqual(sli1["supplier"], uobj1)
        self.assertEqual(sli1["display_name"], "hot dogs")
        self.assertEqual(sli1["quantity"], "9001.00")
        self.assertEqual(sli1["cost"], "12345678.90")
        self.assertEqual(sli1["ready"], False)
        # GET all shoppinglistitem for event (after some created)
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        response = self.client.get(url)
        self.assertTrue(sli1 in response.data)
        self.assertTrue(len(response.data), 1)
        # GET event that does not exist
        url = reverse('shoppinglistitem_list', kwargs={"pk": 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # POST without display_name (invalid)
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        data = [
            {
                "quantity": 9001,
                "cost": 12345678.90,
                "supplier": uid1,
                "ready": False
            }
        ]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # POST with invalid format in quantity, cost, ready
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        data = [
            {
                "display_name": "hot dogs",
                "quantity": "abc",
            }
        ]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        data = [
            {
                "display_name": "hot dogs",
                "cost": "abc",
            }
        ]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        data = [
            {
                "display_name": "hot dogs",
                "ready": "abc"
            }
        ]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # POST with nonexistent user as supplier
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        data = [
            {
                "display_name": "hot dogs",
                "supplier": 9999,
            }
        ]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_shoppinglistitem_detail(self):
        # Set up
        u1 = User.objects.get_by_natural_key(U1)
        uid1 = u1.id
        uobj1 = {
            "id": uid1,
            "username": u1.username
        }
        url = reverse('event_list')
        data = {"display_name": "test event"}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        eid1 = response.data["id"]
        url = reverse('shoppinglistitem_list', kwargs={"pk": eid1})
        data = [
            {
                "display_name": "hot dogs",
                "quantity": 9001,
                "cost": 12345678.90,
                "ready": False
            }
        ]
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        sli1 = response.data[0]
        sliid1 = sli1["id"]
        # GET shoppinglistitem
        url = reverse('shoppinglistitem_detail', kwargs={"pk": eid1, "item_id": sliid1})
        response = self.client.get(url)
        self.assertEqual(response.data, sli1)
        self.assertTrue(len(response.data), 1)
        # PUT shoppinglistitem with valid fields
        url = reverse('shoppinglistitem_detail', kwargs={"pk": eid1, "item_id": sliid1})
        data = {
                "display_name": "even more hot dogs",
                "quantity": 9002,
                "cost": 9.99,
                "supplier": uid1,
                "ready": True
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.data["display_name"], "even more hot dogs")
        self.assertEqual(response.data["quantity"], "9002.00")
        self.assertEqual(response.data["cost"], "9.99")
        self.assertEqual(response.data["supplier"], uobj1)
        self.assertEqual(response.data["ready"], True)
        # PUT with invalid format in quantity, cost, ready
        url = reverse('shoppinglistitem_detail', kwargs={"pk": eid1, "item_id": sliid1})
        data = {"quantity": "abc"}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('shoppinglistitem_detail', kwargs={"pk": eid1, "item_id": sliid1})
        data = {"cost": "abc"}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        url = reverse('shoppinglistitem_detail', kwargs={"pk": eid1, "item_id": sliid1})
        data = {"ready": "abc"}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # PUT with nonexistent user as supplier
        url = reverse('shoppinglistitem_detail', kwargs={"pk": eid1, "item_id": sliid1})
        data = {"supplier": 9999}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # DELETE shoppinglistitem
        url = reverse('shoppinglistitem_detail', kwargs={"pk": eid1, "item_id": sliid1})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # GET event that does not exist
        url = reverse('shoppinglistitem_detail', kwargs={"pk": 9999, "item_id": sliid1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # GET event shoppinglistitem that does not exist
        url = reverse('shoppinglistitem_detail', kwargs={"pk": eid1, "item_id": 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
