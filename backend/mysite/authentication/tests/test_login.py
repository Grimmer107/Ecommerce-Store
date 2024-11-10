import django

from django.conf import settings
from rest_framework import status
import pytest

# This ensures that django is set up for pytest to run
# Place this before FIRST PARTY imports
django.setup()

from authentication.models import User


@pytest.mark.django_db
class TestUserLogin:
    login_endpoint = f'{settings.BASE_BACKEND_URL}/authentication/api/v1/login/'

    @pytest.fixture
    def verified_user(self):
        """Create a test user."""
        return User.objects.create_user(
            email='testuser@example.com',
            first_name='test',
            last_name='user',
            password='test_password',
        )

    @pytest.fixture
    def verified_user_login_data(self, verified_user):
        """Provide valid login data."""
        return {
            'email': 'testuser@example.com',
            'password': 'test_password',
        }

    @pytest.fixture
    def not_verified_user(self):
        """Create a not verified test user."""
        return User.objects.create_user(
            email='testuser_not_verified@example.com',
            first_name='test',
            last_name='user',
            password='test_password',
        )

    @pytest.fixture
    def not_verified_user_login_data(self, not_verified_user):
        """Provide login data for not-verified user."""
        return {
            'email': 'testuser_not_verified@example.com',
            'password': 'test_password',
        }

    def test_login_success(self, api_client, verified_user_login_data):
        """Test successful user login."""
        response = api_client.post(self.login_endpoint, verified_user_login_data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data

    def test_login_failure_not_verified(self, api_client, not_verified_user_login_data):
        """Test login failure for non-verified user login."""
        response = api_client.post(self.login_endpoint, not_verified_user_login_data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['detail'] == 'User email not verified!'
        assert 'access' not in response.data

    def test_login_failure_invalid_password(self, api_client):
        """Test login failure with invalid password."""
        invalid_password_data = {
            'email': 'testuser@example.com',
            'password': 'wrong_password',
        }
        response = api_client.post(self.login_endpoint, invalid_password_data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'access' not in response.data

    def test_login_failure_missing_data(self, api_client):
        """Test login failure when required fields are missing."""
        missing_data = {
            'email': 'testuser@example.com',
        }
        response = api_client.post(self.login_endpoint, missing_data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'access' not in response.data

    def test_login_failure_non_existent_user(self, api_client):
        """Test login failure for non-existent user."""
        non_existent_user_data = {
            'email': 'nonexistent@example.com',
            'password': 'some_password',
        }
        response = api_client.post(self.login_endpoint, non_existent_user_data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'access' not in response.data
