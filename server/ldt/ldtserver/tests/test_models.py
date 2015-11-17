"""
Unit tests for all model classes

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db
"""
from datetime import datetime
from django.test import TestCase
from django.contrib.auth.models import User

from ..models import LdtUser, Comment, ShoppingListItem, ShoppingList, Event

# Test db Constants
U1 = "JohnnyTest"
U2 = "BobbyTest"
U3 = "JessieTest"
PWD = "test"
EMAIL = "test@test.com"


# class LdtUserMethodTests(TestCase):
#
#     def setUp(self):
#         User.objects._create_user(username=U1, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
#
#     def test___str__(self):
#         user = User.objects.get_by_natural_key(U1)
#         ldtuser = LdtUser(user=user)
#         ldtuser.save()                                # str(ldtuser) is None unless this saved
#         self.assertEqual(str(ldtuser), str(user.id))  # !!! '1' != '7'


class EventMethodTests(TestCase):

    def setUp(self):
        User.objects._create_user(username=U1, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U2, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U3, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)

    def test_get_hosts(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        event.hosts.add(User.objects.get_by_natural_key(U1))
        event.hosts.add(User.objects.get_by_natural_key(U2))
        expected_hosts = [User.objects.get_by_natural_key(U1).id,
                          User.objects.get_by_natural_key(U2).id]
        self.assertEqual(Event.get_hosts(event), expected_hosts)

    def test_get_invites(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        event.invites.add(User.objects.get_by_natural_key(U1))
        event.invites.add(User.objects.get_by_natural_key(U2))
        expected_invites = [User.objects.get_by_natural_key(U1).id,
                            User.objects.get_by_natural_key(U2).id]
        self.assertEqual(Event.get_invites(event), expected_invites)

    def test_get_accepts(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        event.accepts.add(User.objects.get_by_natural_key(U1))
        event.accepts.add(User.objects.get_by_natural_key(U2))
        expected_accepts = [User.objects.get_by_natural_key(U1).id,
                            User.objects.get_by_natural_key(U2).id]
        self.assertEqual(Event.get_accepts(event), expected_accepts)

    def test_get_declines(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        event.declines.add(User.objects.get_by_natural_key(U1))
        event.declines.add(User.objects.get_by_natural_key(U2))
        expected_declines = [User.objects.get_by_natural_key(U1).id,
                             User.objects.get_by_natural_key(U2).id]
        self.assertEqual(Event.get_declines(event), expected_declines)

    def test_get_comments(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        c1 = Comment.objects.create(post_date=datetime.now(), content="first test comment",
                                   author=User.objects.get_by_natural_key(U1))
        event.comments.add(c1)
        c2 = Comment.objects.create(post_date=datetime.now(), content="second test comment",
                                   author=User.objects.get_by_natural_key(U2))
        event.comments.add(c2)
        expected_comments = [c1, c2]
        self.assertEqual(Event.get_comments(event), expected_comments)

    def test_get_shoppinglistitems(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use ManyToMany relation until all pks saved
        self.assertEqual(Event.get_contributions(event), ["abc", "def"])



