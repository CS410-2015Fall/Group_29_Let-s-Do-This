"""
Unit tests for all ShoppingListItem views

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db
"""

import json
from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status


class ShoppingListTest(TestCase):

    def test_shoppinglist_put(self):
        # Set up

        # PUT shoppinglistitem with valid fields

        # PUT event that does not exist

        # PUT at least one shoppinglistitem that does not exist

        # PUT not as list of items

        # PUT with invalid format in quantity, cost, ready

        # PUT with nonexistent user as supplier

        return  # !!! stub

    def test_shopplinglist_delete(self):
        # Set up

        # POST to delete some items

        # POST event that does not exist

        # POST at least one shoppinglistitem that does not exist

        return  # !!! stub
