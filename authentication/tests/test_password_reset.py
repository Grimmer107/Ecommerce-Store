import django

from django.conf import settings
from rest_framework import status
import pytest

# This ensures that django is set up for pytest to run
# Place this before FIRST PARTY imports
django.setup()

from authentication.models import User


@pytest.mark.django_db
class TestPasswordReset:
    password_reset_endpoint = f'{settings.BASE_BACKEND_URL}/authentication/api/v1/password/reset/'

    @pytest.fixture
    def user(self):
        """Create a verified test user."""
        return User.objects.create_user(
            email='testuser@example.com',
            first_name='test',
            last_name='user',
            password='test_password',
        )

    def test_password_reset_success(self, api_client, user):
        """Test successful password reset."""
        payload = {
            'email': user.email
        }
        response = api_client.post(self.password_reset_endpoint, payload, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Password reset e-mail has been sent.'

    def test_password_reset_failure_missing_email(self, api_client, user):
        """Test password reset failure."""
        response = api_client.post(self.password_reset_endpoint, {}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['email'] == ['This field is required.']
