"""
Unit tests for ShoppingList and ShoppingListItem model class methods

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db
"""
from django.test import TestCase
from django.contrib.auth.models import User
from ..models import Event, ShoppingList, ShoppingListItem

# Test db Constants
U1 = "JohnnyTest"
U2 = "BobbyTest"
U3 = "JessieTest"
PWD = "test"
EMAIL = "test@test.com"


class CommentMethodTests(TestCase):

    def setUp(self):
        User.objects._create_user(username=U1, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U2, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U3, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)

    def test_shoppinglist_and_item___str__(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use relation until all pks saved
        slist = ShoppingList.objects.create(event=event)  # only done automatically if through API
        slist.save()
        self.assertEqual(str(slist), event.display_name)
        i1 = ShoppingListItem.objects.create(display_name="cheese", supplier=User.objects.get_by_natural_key(U1))
        self.assertEqual(str(i1), i1.display_name)

    def test_shoppinglist_add_item(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use relation until all pks saved
        slist = ShoppingList.objects.create(event=event)  # only done automatically if through API
        slist.save()
        # Start by adding basics to shopping list, one with cost
        i1 = ShoppingListItem.objects.create(display_name="cheese", supplier=User.objects.get_by_natural_key(U1))
        i1.save()
        slist.add_item(i1)
        i2 = ShoppingListItem.objects.create(display_name="crackers", supplier=User.objects.get_by_natural_key(U2))
        i2.save()
        slist.add_item(i2)
        i3 = ShoppingListItem.objects.create(display_name="olives", supplier=User.objects.get_by_natural_key(U1))
        i3.save()
        slist.add_item(i3)
        actual_items = slist.items.all()
        self.assertTrue(i1 in actual_items)
        self.assertTrue(i2 in actual_items)
        self.assertTrue(i3 in actual_items)
