import django

from django.conf import settings
from rest_framework import status
import pytest

# This ensures that django is set up for pytest to run
# Place this before FIRST PARTY imports
django.setup()

from authentication.models import User


@pytest.mark.django_db
class TestTokenRefresh:
    login_endpoint = f'{settings.BASE_BACKEND_URL}/authentication/api/v1/login/'
    token_refresh_endpoint = f'{settings.BASE_BACKEND_URL}/authentication/api/v1/token/refresh/'

    @pytest.fixture
    def user(self):
        """Create a verified test user."""
        return User.objects.create_user(
            email='testuser@example.com',
            first_name='test',
            last_name='user',
            password='test_password',
        )

    @pytest.fixture
    def login_data(self, user):
        """Provide valid login data for verified user."""
        return {
            'email': 'testuser@example.com',
            'password': 'test_password',
        }

    @pytest.fixture
    def get_refresh_token(self, api_client, login_data):
        """Get access token by log in a verified user"""
        response = api_client.post(self.login_endpoint, login_data, format='json')
        return response.data['refresh']

    def test_get_access_token_success(self, api_client, get_refresh_token):
        """Test successful access token refresh"""
        payload = {
            'refresh': get_refresh_token
        }
        response = api_client.post(self.token_refresh_endpoint, payload, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data

    def test_get_access_token_failure_invalid_refresh(self, api_client):
        """Test failed access token refresh"""
        payload = {
            'refresh': 'invalid_refresh'
        }
        response = api_client.post(self.token_refresh_endpoint, payload, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['detail'] == 'Token is invalid or expired'
        assert response.data['code'] == 'token_not_valid'

    def test_get_access_token_failure_missing_refresh(self, api_client):
        """Test failed access token refresh"""
        response = api_client.post(self.token_refresh_endpoint, {}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['refresh'] == ['This field is required.']
