"""
Unit tests for Event model class methods

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db
"""
from datetime import datetime
from django.test import TestCase
from django.contrib.auth.models import User

from ..models import Event, Comment, Poll, PollChoice, ShoppingListItem, ShoppingList

# Test db Constants
U1 = "JohnnyTest"
U2 = "BobbyTest"
U3 = "JessieTest"
PWD = "test"
EMAIL = "test@test.com"


class EventMethodTests(TestCase):

    def setUp(self):
        User.objects._create_user(username=U1, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U2, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U3, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)

    def test_event_get_hosts(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        self.assertEqual(Event.get_hosts(event), [])
        event.hosts.add(User.objects.get_by_natural_key(U1))
        event.hosts.add(User.objects.get_by_natural_key(U2))
        expected_hosts = [User.objects.get_by_natural_key(U1).id,
                          User.objects.get_by_natural_key(U2).id]
        self.assertEqual(Event.get_hosts(event), expected_hosts)

    def test_event_get_invites(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        self.assertEqual(Event.get_hosts(event), [])
        event.invites.add(User.objects.get_by_natural_key(U1))
        event.invites.add(User.objects.get_by_natural_key(U2))
        expected_invites = [User.objects.get_by_natural_key(U1).id,
                            User.objects.get_by_natural_key(U2).id]
        self.assertEqual(Event.get_invites(event), expected_invites)

    def test_event_get_accepts(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        self.assertEqual(Event.get_hosts(event), [])
        event.accepts.add(User.objects.get_by_natural_key(U1))
        event.accepts.add(User.objects.get_by_natural_key(U2))
        expected_accepts = [User.objects.get_by_natural_key(U1).id,
                            User.objects.get_by_natural_key(U2).id]
        self.assertEqual(Event.get_accepts(event), expected_accepts)

    def test_event_get_declines(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        self.assertEqual(Event.get_hosts(event), [])
        event.declines.add(User.objects.get_by_natural_key(U1))
        event.declines.add(User.objects.get_by_natural_key(U2))
        expected_declines = [User.objects.get_by_natural_key(U1).id,
                             User.objects.get_by_natural_key(U2).id]
        self.assertEqual(Event.get_declines(event), expected_declines)

    def test_event_get_changed(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        self.assertEqual(Event.get_changed(event), [])
        event.changed.add(User.objects.get_by_natural_key(U1))
        event.changed.add(User.objects.get_by_natural_key(U2))
        expected_changed = [User.objects.get_by_natural_key(U1).id,
                            User.objects.get_by_natural_key(U2).id]
        self.assertEqual(Event.get_changed(event), expected_changed)

    def test_event_get_comments(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        self.assertEqual(Event.get_hosts(event), [])
        c1 = Comment.objects.create(post_date=datetime.now(), content="first test comment",
                                   author=User.objects.get_by_natural_key(U1))
        event.comments.add(c1)
        c2 = Comment.objects.create(post_date=datetime.now(), content="second test comment",
                                   author=User.objects.get_by_natural_key(U2))
        event.comments.add(c2)
        expected_comments = [c1, c2]
        self.assertEqual(Event.get_comments(event), expected_comments)

    def test_event_get_polls_and_choices(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        self.assertEqual(event.get_polls(), [])
        p1 = Poll.objects.create(question="Is that so?", event=event)
        p1.save()
        c1 = PollChoice.objects.create(poll=p1, choice_text="Yes")
        c1.save()
        c2 = PollChoice.objects.create(poll=p1, choice_text="No")
        c2.save()
        self.assertEqual(event.get_polls(), [p1])
        # Want to make sure first poll's count of poll_choices is only two
        actual_choices = event.get_polls_choices()[0]
        self.assertEqual(len(actual_choices), 2)

    def test_event_shoppinglist_and_items_and_contributions(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        self.assertFalse(event.has_shoppinglist())
        slist = ShoppingList.objects.create(event=event)  # only done automatically if through API
        slist.save()
        self.assertTrue(event.has_shoppinglist())
        self.assertEqual(event.get_shoppinglistitems(), [])
        self.assertEqual(event.get_contributions(), [])
        # Start by adding basics to shopping list, one with cost
        i1 = ShoppingListItem.objects.create(display_name="cheese", supplier=User.objects.get_by_natural_key(U1), cost="1.11")
        i1.save()
        slist.add_item(i1)
        i2 = ShoppingListItem.objects.create(display_name="crackers", supplier=User.objects.get_by_natural_key(U2))
        i2.save()
        slist.add_item(i2)
        i3 = ShoppingListItem.objects.create(display_name="olives", supplier=User.objects.get_by_natural_key(U1))
        i3.save()
        slist.add_item(i3)
        expected_items = [i1, i2, i3]
        self.assertEqual(event.get_shoppinglistitems(), expected_items)
        expected_contributions = [
            {
                "username": User.objects.get_by_natural_key(U1).username,
                "items": [
                    {
                        "ready": None,
                        "cost": "1.11",
                        "display_name": "cheese",
                        "id": i1.id,
                        "quantity": None
                    },
                    {
                        "ready": None,
                        "cost": None,
                        "display_name": "olives",
                        "id": i3.id,
                        "quantity": None
                    }
                ],
                "total": "1.11",
                "id": User.objects.get_by_natural_key(U1).id
            },
            {
                "username": User.objects.get_by_natural_key(U2).username,
                "items": [
                    {
                        "ready": None,
                        "cost": None,
                        "display_name": "crackers",
                        "id": i2.id,
                        "quantity": None
                    }
                ],
                "total": "0.00",
                "id": User.objects.get_by_natural_key(U2).id
            }
        ]
        self.assertEqual(event.get_contributions(), expected_contributions)
        # Add more complex but expected items and test again
        i4 = ShoppingListItem.objects.create(display_name="meat", supplier=User.objects.get_by_natural_key(U1),
                                             cost="2.22", quantity="1.00")
        i4.save()
        slist.add_item(i4)
        i5 = ShoppingListItem.objects.create(display_name="fruit", supplier=User.objects.get_by_natural_key(U2),
                                             cost="3.33", ready=True)
        i5.save()
        slist.add_item(i5)
        i6 = ShoppingListItem.objects.create(display_name="thyme", supplier=User.objects.get_by_natural_key(U2),
                                             cost="4.44", quantity="1.00", ready=False)
        i6.save()
        slist.add_item(i6)
        expected_items.extend([i4, i5, i6])
        self.assertEqual(event.get_shoppinglistitems(), expected_items)
        expected_contributions_2 = [
            {
                "username": User.objects.get_by_natural_key(U1).username,
                "items": [
                    {
                        "ready": None,
                        "cost": "1.11",
                        "display_name": "cheese",
                        "id": i1.id,
                        "quantity": None
                    },
                    {
                        "ready": None,
                        "cost": None,
                        "display_name": "olives",
                        "id": i3.id,
                        "quantity": None
                    },
                    {
                        "ready": None,
                        "cost": "2.22",
                        "display_name": "meat",
                        "id": i4.id,
                        "quantity": "1.00"
                    }
                ],
                "total": "3.33",
                "id": User.objects.get_by_natural_key(U1).id
            },
            {
                "username": User.objects.get_by_natural_key(U2).username,
                "items": [
                    {
                        "ready": None,
                        "cost": None,
                        "display_name": "crackers",
                        "id": i2.id,
                        "quantity": None
                    },
                    {
                        "ready": True,
                        "cost": "3.33",
                        "display_name": "fruit",
                        "id": i5.id,
                        "quantity": None
                    },
                    {
                        "ready": False,
                        "cost": "4.44",
                        "display_name": "thyme",
                        "id": i6.id,
                        "quantity": "1.00"
                    }
                ],
                "total": "7.77",
                "id": User.objects.get_by_natural_key(U2).id
            }
        ]
        self.assertEqual(event.get_contributions(), expected_contributions_2)

    def test_event_cancel_functions(self):
        uid1 = User.objects.get_by_natural_key(U1).id
        uid2 = User.objects.get_by_natural_key(U2).id
        uid3 = User.objects.get_by_natural_key(U3).id
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        # Not realistic lists for real events, but here to test the cancel function
        event.hosts.add(User.objects.get_by_natural_key(U1))
        event.invites.add(User.objects.get_by_natural_key(U1))
        event.invites.add(User.objects.get_by_natural_key(U2))
        event.accepts.add(User.objects.get_by_natural_key(U2))
        event.accepts.add(User.objects.get_by_natural_key(U3))
        event.declines.add(User.objects.get_by_natural_key(U1))
        event.declines.add(User.objects.get_by_natural_key(U3))
        # Test is_cancelled() and make sure event set up correctly
        self.assertFalse(event.is_cancelled())
        self.assertEqual(event.get_hosts(), [uid1])
        self.assertEqual(event.get_invites(), [uid1, uid2])
        self.assertEqual(event.get_accepts(), [uid2, uid3])
        self.assertEqual(event.get_declines(), [uid1, uid3])
        self.assertEqual(event.get_changed(), [])
        # Test cancel()
        event.cancel()
        self.assertTrue(event.is_cancelled())
        # Test uncancel()
        event.uncancel()
        self.assertFalse(event.is_cancelled())
