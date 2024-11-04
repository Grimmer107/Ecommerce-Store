import os

import django
import pytest
from pytest_factoryboy import register

# Set the DJANGO_SETTINGS_MODULE environment variable for pytest
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.mysite.settings.local')

from store.tests.factories import (CityFactory, CountryFactory, ProductCategoryFactory, ProductFactory, UserFactory,
                                   OrderProductFactory, OrderFactory)


# Ensure Django setup is called when pytest is running
@pytest.fixture(autouse=True)
def django_setup():
    django.setup()


@pytest.fixture
def api_client():
    """Provides a DRF APIClient instance for use in tests"""
    from rest_framework.test import APIClient
    return APIClient()

register(CityFactory)
register(CountryFactory)
register(ProductCategoryFactory)
register(ProductFactory)
register(UserFactory)
register(OrderFactory)
register(OrderProductFactory)
