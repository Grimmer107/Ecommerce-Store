import django

from django.conf import settings
from rest_framework import status
import pytest

# This ensures that django is set up for pytest to run
# Place this before FIRST PARTY imports
django.setup()

from authentication.models import User


@pytest.mark.django_db
class TestUserRegistration:
    registration_endpoint = f'{settings.BASE_BACKEND_URL}/authentication/api/v1/signup/'

    @pytest.fixture
    def valid_user_data(self):
        """Provide valid user data for registration."""
        return {
            'email': 'testuser@example.com',
            'first_name': 'test',
            'last_name': 'user',
            'password': 'test_password',
        }

    @pytest.fixture
    def invalid_user_data(self):
        """Provide invalid user data for registration."""
        return {
            'email': 'testuser@example.com',
        }

    def test_registration_success(self, api_client, valid_user_data):
        """Test successful user registration."""
        response = api_client.post(self.registration_endpoint, valid_user_data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(email=valid_user_data['email']).exists()
        assert response.data['detail'] == 'Verification e-mail sent.'

    def test_registration_failure_missing_data(self, api_client, invalid_user_data):
        """Test registration failure when required fields are missing."""
        response = api_client.post(self.registration_endpoint, invalid_user_data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert not User.objects.filter(email=invalid_user_data['email']).exists()
