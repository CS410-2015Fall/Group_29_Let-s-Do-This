"""
Models to abstract ldtserver's database.

This is for remote CRUD requests. Most app logic will be in front-end client.

:TODO:
- Support queries (see also views.py):
    - Add/Rm event's invitee/accept/decline without rewriting entire list AND user cannot be on all three lists
    - Put User-specific Event as single call (is this needed?)

- BudgetContribution class - ??? 1:1 accepted user within Event
- EventPoll class (FP16-3) - ??? link ldtpolls app many:1 with Event class

:LATER:
- login with email instead of username
- add profile picture to LdtUser
"""
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

EVENT_RSVP_FIELDS = ["invites", "accepts", "declines"]


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

    def get_friends(self):
        """
        Return list of IDs of LdtUser's friends
        """
        friend_list = []
        for friend in self.friends.all():
            friend_list.append(friend.id)
        return friend_list


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
    # !!! ready flag enumeration


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

    def get_hosts(self):
        """ Return list of User IDs of Event's hosts """
        return [h.id for h in self.hosts.all()]

    def get_invites(self):
        """ Return list of IDs of Event's invites """
        return [i.id for i in self.invites.all()]

    def get_accepts(self):
        """ Return list of IDs of Event's invites """
        return [a.id for a in self.accepts.all()]

    def get_declines(self):
        """ Return list of IDs of Event's invites """
        return [d.id for d in self.declines.all()]
