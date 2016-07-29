from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext as _, ugettext_lazy, ugettext_noop

from openslides.core.config import config
from openslides.motions.models import MotionPoll
from openslides.users.models import User
from openslides.utils.models import RESTModelMixin

from .access_permissions import KeypadAccessPermissions


KEYPAD_MAP = ({
    'Y': (ugettext_noop('Yes'), 'green'),
    'N': (ugettext_noop('No'), 'red'),
    'A': (ugettext_noop('Abstention'), 'yellow')})


class Seat(RESTModelMixin, models.Model):
    """
    Model for all seats. A seat has a number and x-axis and y-axis values in
    the seating plan.

    The seats are ordered according to their order in the database table.
    """
    access_permissions = KeypadAccessPermissions

    number = models.CharField(max_length=255)
    seating_plan_x_axis = models.PositiveIntegerField()
    seating_plan_y_axis = models.PositiveIntegerField()

    class Meta:
        default_permissions = ()
        ordering = ('pk',)
        unique_together = (('seating_plan_x_axis', 'seating_plan_y_axis'),)

    def __str__(self):
        return self.number

    def clean(self):
        """
        Ensures that a non empty seat number is unique.

        Attention: This method is not uses by save() or bulk_create().
        """
        if self.number != '':
            queryset = self.objects.filter(number=self.number)
            if self.pk is not None:
                queryset = queryset.exclude(pk=self.pk)
            if queryset.exists():
                raise ValidationError('Seat number must be unique or an empty string.')


class Keypad(RESTModelMixin, models.Model):
    """
    Model for keypads. Leave user field blank for anonymous keypads.
    """
    access_permissions = KeypadAccessPermissions

    user = models.OneToOneField(User, null=True, blank=True)
    keypad_id = models.IntegerField(unique=True)
    seat = models.OneToOneField(Seat, null=True, blank=True)
    battery_level = models.SmallIntegerField(default=-1)  # -1 = unknown
    in_range = models.BooleanField(default=False)

    class Meta:
        permissions = (
            ('can_manage_votecollector', ugettext_noop('Can manage VoteCollector')),
        )

    def __str__(self):
        if self.user is not None:
            return _('Keypad of %s') % self.user
        return _('Keypad %d') % self.keypad_id


class MotionPollKeypadConnection(RESTModelMixin, models.Model):
    """
    Model to connect a poll of a motion with a keypad per personal voting.
    """
    access_permissions = KeypadAccessPermissions

    poll = models.ForeignKey(MotionPoll, related_name='keypad_data_list')
    keypad = models.ForeignKey(Keypad, null=True)
    value = models.CharField(max_length=255)
    serial_number = models.CharField(null=True, max_length=255)

    def get_value(self):
        """
        Returns the vote value as human readable string.
        """
        return _(KEYPAD_MAP[self.value][0])

    def get_css_value(self):
        """
        Returns the value for the css class accordning to the value.
        """
        if config['votecollector_seats_grey']:
            return 'grey'
        else:
            return KEYPAD_MAP[self.value][1]
