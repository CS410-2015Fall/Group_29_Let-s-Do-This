"""
Unit tests for all Event views

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db

:TODO:
- API unit tests (http://www.django-rest-framework.org/api-guide/testing/)
"""

from django.test import TestCase
from django.contrib.auth.models import User

from ..models import LdtUser, Comment, ShoppingListItem, ShoppingList, Event
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

    def test_rsvp(self):
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

