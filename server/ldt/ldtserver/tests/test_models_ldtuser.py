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
        user = User.objects.get_by_natural_key(U1)
        ldtuser = LdtUser(user=user)
        ldtuser.save()
        self.assertEqual(str(ldtuser), str(user.userlink))

    def test_get_friends(self):
        return  # !!! stub
