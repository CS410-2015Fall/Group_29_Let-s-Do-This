"""
Unit tests for all ShoppingList views

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db
"""

import json
from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status


class ShoppingListItemTest(TestCase):

    def test_shoppinglistitem_list(self):
        # Set up

        # GET all shoppinglistitem for event (before any created)

        # POST new shoppinglistitem to event

        # GET all shoppinglistitem for event (after some created)

        # GET event that does not exist

        # POST without display_name (invalid)

        # POST with invalid format in quantity, cost, ready

        # POST with nonexistent user as supplier

        return  # !!! stub

    def test_shoppinglistitem_detail(self):
        # Set up

        # GET shoppinglistitem

        # PUT shoppinglistitem with valid fields

        # PUT with invalid format in quantity, cost, ready

        # PUT with nonexistent user as supplier

        # DELETE shoppinglistitem

        # GET event that does not exist

        # GET event shoppinglistitem that does not exist

        return  # !!! stub
