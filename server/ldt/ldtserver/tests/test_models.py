"""
Unit tests for all model classes
"""
from django.test import TestCase
from django.contrib.auth.models import User

from ..models import LdtUser, Comment, ShoppingListItem, ShoppingList, Event


class LdtUserMethodTests(TestCase):

    def test_str__(self):
        """
        __str__ should return str version of LdtUser id
        """
        user = User.objects._create_user(username='JohnnyTest', first_name='Johnny',  last_name='Test', password='test', email='test@test.com')
        ldtuser = LdtUser(user=user)
        self.assertEqual(type(ldtuser.__str__()), str)
