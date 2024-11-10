import django

from django.conf import settings
from rest_framework import status
import pytest

# This ensures that Django is set up for pytest to run
django.setup()


@pytest.mark.django_db
class TestCountryListAPI:
    country_list_endpoint = f'{settings.BASE_BACKEND_URL}/store/api/v1/countries/'

    def test_get_country_list_success(self, api_client, country_factory):
        """Test successful fetch of country list."""
        country_factory.create_batch(3)
        response = api_client.get(self.country_list_endpoint)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3
