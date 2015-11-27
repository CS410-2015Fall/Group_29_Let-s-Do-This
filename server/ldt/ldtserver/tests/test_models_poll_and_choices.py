"""
Unit tests for Poll and PollChoice model class methods

Running `python manage.py test` runs test_* methods in classes that extend TestCase, in all /tests/test_* files
using a test db
"""
from django.test import TestCase
from ..models import Event, Poll, PollChoice

# Test db Constants
U1 = "JohnnyTest"
U2 = "BobbyTest"
U3 = "JessieTest"
PWD = "test"
EMAIL = "test@test.com"


class PollAndChoiceMethodTests(TestCase):

    def test_poll_and_choice___str__(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use relation until all pks saved
        poll = Poll.objects.create(question="Are you sure", event=event)
        self.assertEqual(str(poll), "Are you sure")
        c1 = PollChoice(poll=poll, choice_text="Yes")
        self.assertEqual(str(c1), "Yes")

    def test_poll_get_choices(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use relation until all pks saved
        poll = Poll.objects.create(question="Are you sure", event=event)
        poll.save()
        c1 = PollChoice(poll=poll, choice_text="Yes")
        c1.save()
        c2 = PollChoice(poll=poll, choice_text="No")
        c2.save()
        self.assertTrue(c1 in poll.get_choices())
        self.assertTrue(c2 in poll.get_choices())
        self.assertEqual(len(poll.get_choices()), 2)

    def test_poll_choice_votes(self):
        event = Event.objects.create(display_name="test event")
        event.save()  # Cannot use relation until all pks saved
        poll = Poll.objects.create(question="Are you sure", event=event)
        poll.save()
        c1 = PollChoice(poll=poll, choice_text="Yes", votes=5)
        c1.save()
        c2 = PollChoice(poll=poll, choice_text="No")
        c2.save()
        self.assertEqual(c1.get_votes(), 5)
        self.assertEqual(c2.get_votes(), 0)
        c2.add_vote()
        self.assertEqual(c1.get_votes(), 5)
        self.assertEqual(c2.get_votes(), 1)
        c2.add_vote(n=4)
        self.assertEqual(c2.get_votes(), 5)
        self.assertRaises(TypeError, c2.add_vote(n="abc"))
