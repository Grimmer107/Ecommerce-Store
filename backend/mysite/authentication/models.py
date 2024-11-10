from django.contrib.auth.models import AbstractUser
from django.db import models

from authentication.managers import UserManager


class User(AbstractUser):

    class RegistrationChoices(models.TextChoices):
        EMAIL = 'email',
        GOOGLE = 'google'

    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True
    )
    registration_method = models.CharField(
        max_length=12,
        choices=RegistrationChoices.choices,
        default=RegistrationChoices.EMAIL
    )
    username = None

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
