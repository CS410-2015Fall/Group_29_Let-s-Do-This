"""
Models to abstract ldtserver's database.

This is for remote CRUD requests. Most app logic will be in front-end client.

:TODO:
- Support queries (see also views.py):
    - Put User-specific Event as single call
    - Add/Rm user's friends without rewriting entire list - ??? responsibility of client
    - Add/Rm event's host/invitee/accept/decline without rewriting entire list - ??? responsibility of client

- Authentication tokens (see also views.py): http://www.django-rest-framework.org/api-guide/authentication/
- ShoppingListItem class - fields for 'display_name', 'assigned_to', 'cost', 'ready'
- ShoppingList class - 1:many with ShoopingListItem, 1:1 with Event
- Comment class - many:1 with Event
- BudgetContribution class - ??? 1:1 accepted user within Event
- EventPoll class (FP16-3) - ??? link ldtpolls app many:1 with Event class

:LATER:
- login with email instead of username
- add profile picture to LdtUser
"""
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator


class PhoneValidator(RegexValidator):
    """
    Validate phone numbers as 15 number digits (no dashes or letters)
    """
    regex = r'^\+?1?\d{7,15}$'
    message = "Phone number must be entered as string in format '999999999' (7-15 digits), with optional '+1' at start."


class LdtUser(models.Model):
    """
    LdtUser, a profile associated with Django built-in user.
    Note: This is only accessible to admin. Not directly accessible through API.
    """
    # Required
    user = models.OneToOneField(User, related_name="userlink", on_delete=models.CASCADE)
    # Optional
    friends = models.ManyToManyField(User, related_name="friends", blank=True)
    email = models.EmailField(max_length=254, blank=True)
    phone = models.CharField(validators=[PhoneValidator()], max_length=15, blank=True)

    def __str__(self):
        """
        e.g. LdtUser.objects.all() == id
        """
        return str(self.id)


class Comment(models.Model):
    """
    Comment with fields for author (User), post_date, content
    """
    # Required
    author = models.OneToOneField(User, related_name="author")
    start_date = models.DateTimeField('post date')
    content = models.CharField(max_length=300)


class ShoppingListItem(models.Model):
    """
    ShoppingListItem with fields for display_name, quantity, cost, supplier (User)

    Acts as a checklist + what was already bought
    """
    # Required
    display_name = models.CharField(max_length=50)
    # Optional
    quantity = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    # For now, if user it Null then there is nobody assigned
    supplier = models.OneToOneField(User, related_name="supplier", null=True, blank=True)


class ShoppingList(models.Model):
    """
    ShoppingList of ShoppingListItems
    """
    # Optional
    items = models.ManyToManyField(ShoppingListItem, related_name="items", blank=True)


class Event(models.Model):
    """
    Event with fields for display_name, dates, hosts, invitees, accepts, declines.
    See also: https://docs.djangoproject.com/en/1.8/topics/db/examples/many_to_many/
    """
    # Required
    display_name = models.CharField(max_length=50)
    # Optional
    start_date = models.DateTimeField('start date', blank=True, null=True)
    end_date = models.DateTimeField('end date', blank=True, null=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    location = models.CharField('location', max_length=100, blank=True)
    hosts = models.ManyToManyField(User, related_name="hosts", blank=True)
    invites = models.ManyToManyField(User, related_name="invitees", blank=True)
    accepts = models.ManyToManyField(User, related_name="accepts", blank=True)
    declines = models.ManyToManyField(User, related_name="declines", blank=True)
    comments = models.ManyToManyField(Comment, related_name="comments", blank=True)
    shopping_list = models.OneToOneField(ShoppingList, related_name="shopping_list", null=True, blank=True)

    def __str__(self):
        """
        e.g. Event.objects.all() == display_name
        """
        return self.display_name

