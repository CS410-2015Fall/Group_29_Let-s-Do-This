"""
Unit tests for LdtUser model class methods

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db
"""
from django.test import TestCase
from django.contrib.auth.models import User
from ..models import LdtUser

# Test db Constants
U1 = "JohnnyTest"
U2 = "BobbyTest"
U3 = "JessieTest"
PWD = "test"
EMAIL = "test@test.com"


class LdtUserMethodTests(TestCase):

    def setUp(self):
        User.objects._create_user(username=U1, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U2, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)
        User.objects._create_user(username=U3, password=PWD, email=EMAIL, is_staff=False, is_superuser=False)

    def test___str__(self):
        user1 = User.objects.get_by_natural_key(U1)
        ldtuser1 = LdtUser(user=user1)
        ldtuser1.save()
        self.assertEqual(str(ldtuser1), str(user1.userlink))
        user2 = User.objects.get_by_natural_key(U2)
        ldtuser2 = LdtUser(user=user2)
        ldtuser2.save()
        self.assertEqual(str(ldtuser2), str(user2.userlink))
        self.assertFalse(str(ldtuser1) == str(ldtuser2))

    def test_get_friends(self):
        user1 = User.objects.get_by_natural_key(U1)
        ldtuser1 = LdtUser(user=user1)
        ldtuser1.save()
        user2 = User.objects.get_by_natural_key(U2)
        ldtuser2 = LdtUser(user=user2)
        ldtuser2.save()
        user3 = User.objects.get_by_natural_key(U3)
        ldtuser3 = LdtUser(user=user3)
        ldtuser3.save()
        ldtuser1.friends = [user2, user3]
        ldtuser2.friends = [user1, user3]
        ldtuser3.friends = [user1, user2]
        ldtuser1.save()
        ldtuser2.save()
        ldtuser3.save()
        self.assertEqual(ldtuser1.get_friends(), [user2.id, user3.id])
        self.assertEqual(ldtuser2.get_friends(), [user1.id, user3.id])
        self.assertEqual(ldtuser3.get_friends(), [user1.id, user2.id])
