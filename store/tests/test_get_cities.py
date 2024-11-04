import django

from django.conf import settings
from rest_framework import status
import pytest

# This ensures that Django is set up for pytest to run
django.setup()


@pytest.mark.django_db
class TestCityListAPI:
    city_list_endpoint = f'{settings.BASE_BACKEND_URL}/store/api/v1/cities/'

    def test_get_city_list_success(self, api_client, city_factory, country_factory):
        """Test successful fetch of city list."""
        country = country_factory.create()
        city_factory.create_batch(country=country)
        city_factory.create(country=country)
        response = api_client.get(f'{self.city_list_endpoint}?country={country.name}')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
