"""
Unit tests for Comment model class methods

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db
"""
from datetime import datetime
from django.test import TestCase
from django.contrib.auth.models import User
from ..models import Event, Comment

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

    def test_comment__str__(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use relation until all pks saved
        c1 = Comment.objects.create(post_date=datetime.now(), content="first test comment",
                                    author=User.objects.get_by_natural_key(U1))
        event.comments.add(c1)
        c2 = Comment.objects.create(post_date=datetime.now(), content="second test comment",
                                    author=User.objects.get_by_natural_key(U2))
        event.comments.add(c2)
        self.assertEqual(str(c1), str(c1.id))
        self.assertEqual(str(c2), str(c2.id))
