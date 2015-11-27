"""
Models to abstract ldtserver's database.

This is for remote CRUD requests. Most app logic will be in front-end client.

:NOTE:
The Poll and Choice options are inspired by the Django Tutorial:
https://docs.djangoproject.com/en/1.8/intro/tutorial01/

:TODO:
- login with email instead of username
- add profile picture to LdtUser
"""
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

EVENT_RSVP_FIELDS = ["invites", "accepts", "declines"]
ITEM_FIELDS_FOR_CONTRIBUTION = ["id", "display_name", "quantity", "cost", "ready"]


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

    At this point it is possible for a user to have themselves as a friend.
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
    post_date = models.DateTimeField('post_date')
    content = models.CharField(max_length=300)
    # "Optional"
    # Note: one-to-many author:comment but REST framework limited. Create comment first then add author after
    author = models.ForeignKey(User, related_name="author", null=True, blank=True)

    def __str__(self):
        """
        e.g. Comment.objects.all() == id
        """
        return str(self.id)


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
    location = models.CharField('location', max_length=100, blank=True, null=True)
    hosts = models.ManyToManyField(User, related_name="hosts", blank=True)
    invites = models.ManyToManyField(User, related_name="invites", blank=True)
    accepts = models.ManyToManyField(User, related_name="accepts", blank=True)
    declines = models.ManyToManyField(User, related_name="declines", blank=True)
    changed = models.ManyToManyField(User, related_name="changed", blank=True)
    comments = models.ManyToManyField(Comment, related_name="event", blank=True)
    cancelled = models.NullBooleanField(blank=True, null=True)

    def __str__(self):
        """
        e.g. Event.objects.all() == display_name
        """
        return self.display_name

    def is_cancelled(self):
        """ Return true if Event cancelled, false otherwise """
        if self.cancelled:
            return True
        return False

    def cancel(self):
        """ Set Event's cancelled status to True, returns self.cancelled """
        self.cancelled = True
        return self.cancelled

    def uncancel(self):
        """ Set Event's cancelled status to False, returns self.cancelled """
        self.cancelled = False
        return self.cancelled

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

    def get_changed(self):
        """ Return list of IDs of Event's 'changed', i.e. which users need to be updated on changed Event """
        return [c.id for c in self.changed.all()]

    def get_comments(self):
        """ Return list of Event's Comments """
        return [c for c in self.comments.all()]

    def get_polls(self):
        """ Return list of Event's Polls """
        return [p for p in self.event_polls.all()]

    def get_polls_choices(self):
        """ Return list of lists of Event's Polls choices """
        return [p.get_choices() for p in self.event_polls.all()]

    def has_shoppinglist(self):
        """ Return True ShoppingList if exists, else False """
        try:
            list = self.shopping_list
            return True
        except:
            return False

    def get_shoppinglistitems(self):
        """ Return list of Event's shoppinglistitem (can be empty) """
        return [i for i in self.shopping_list.items.all()]

    def get_contributions(self):
        """
        Return list of "contributions" objects: current shopping_list as list of users. Example:

        [
        {
            "username": "mcgrandlej",
            "items": [
                {
                    "ready": false,
                    "cost": "200.00",
                    "display_name": "rain coats",
                    "id": 2,
                    "quantity": "4.00"
                }
            ],
            "total": "200.0",
            "id": 1
        },
        ...
        ]
        """
        contributions = []
        # This is to avoid interruption of new Event cascade via API or bugs
        if not self.has_shoppinglist():
            return []
        items = self.get_shoppinglistitems()
        # Extract all users from items, only if "supplier" is set
        users = list(set([i.supplier for i in items if i.supplier]))
        # Use each user to construct contribution object of id, username, total, and items
        for user in users:
            c = {}
            user_items = []
            user_total = "0.00"
            c["id"] = user.id
            c["username"] = user.username
            # For each item, check if supplied by current user
            for i in items:
                if i.supplier and i.supplier.id == user.id:
                    # For item, create object with all fields except "supplier"
                    user_item = {field: getattr(i, field, None) for field in ITEM_FIELDS_FOR_CONTRIBUTION}
                    # Hacky for now: if item has cost and quantity, we want returned as string or null for the API
                    # If item has a cost, add it to user's total
                    if i.cost:
                        user_item["cost"] = str(user_item["cost"])
                        user_total = str(float(user_total) + float(i.cost))
                    else:
                        user_item["cost"] = None
                    if i.quantity:
                        user_item["quantity"] = str(user_item["quantity"])
                    else:
                        user_item["quantity"] = None
                    user_items.append(user_item)
            # Add all user's items and total to contribution object
            c["items"] = user_items
            c["total"] = user_total
            contributions.append(c)
        return contributions


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
    supplier = models.ForeignKey(User, related_name="supplier", null=True, blank=True)
    ready = models.NullBooleanField(blank=True)

    def __str__(self):
        return self.display_name


class ShoppingList(models.Model):
    """
    ShoppingList of ShoppingListItems
    """
    # Optional
    event = models.OneToOneField(Event, related_name="shopping_list", on_delete=models.CASCADE, null=True, blank=True)
    items = models.ManyToManyField(ShoppingListItem, related_name="items", blank=True)

    def __str__(self):
        if self.event:
            return self.event.display_name   # display_name of linked Event
        else:
            return "(ShoppingList without Event)"

    def add_item(self, item):
        """ Add item to items """
        self.items.add(item)
        return self.items


class Poll(models.Model):
    """
    Poll consisting of question
    """
    # Required
    question = models.CharField(max_length=200)
    # Optional (but treat as required)
    event = models.ForeignKey(Event, related_name="event_polls", on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.question

    def get_choices(self):
        """ Returns list of poll's choices """
        return [c for c in self.poll_choices.all()]


class PollChoice(models.Model):
    """
    Choices of responses for a poll
    """
    poll = models.ForeignKey(Poll, related_name="poll_choices")
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.choice_text

    def get_votes(self):
        """ Returns integer of poll's votes """
        return self.votes

    def add_vote(self, n=1):
        """
        Adds n to votes of poll (default n=1). Returns new count of votes
        :param n must be integer or None
        """
        try:
            if not isinstance(n, int):
                raise Exception("n must be an integer")
        except Exception as e:
            return Exception
        self.votes += n
        self.save()
        return self.votes

