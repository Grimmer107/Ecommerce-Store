import django
from django.conf import settings
from rest_framework import status
import pytest

# Ensure Django is set up for pytest
django.setup()

from authentication.models import User
from store.models import Product, ProductCategory


@pytest.mark.django_db
class TestReviewAPI:
    review_post_endpoint = f'{settings.BASE_BACKEND_URL}/store/api/v1/reviews/'
    user_login_endpoint = f'{settings.BASE_BACKEND_URL}/authentication/api/v1/login/'

    @pytest.fixture
    def user(self):
        """Create a test user with JWT authentication."""
        return User.objects.create_user(
            email='testuser@example.com',
            password='test_password',
            first_name='test',
            last_name='user',
        )

    @pytest.fixture
    def jwt_access_token(self, user, api_client):
        """Obtain a JWT token for the test user."""
        response = api_client.post(self.user_login_endpoint, {
            'email': user.email,
            'password': 'test_password',
        })
        return response.data['access']

    @pytest.fixture
    def product_category(self):
        """Create a product category."""
        return ProductCategory.objects.create(
            name='Home & Lifestyle',
        )

    @pytest.fixture
    def product(self, product_category):
        """Create a product."""
        return Product.objects.create(
            name='Door Matt',
            price=400,
            discount=5,
            category=product_category,
            description='Door matt for your house.',
            quantity=200,
        )

    @pytest.fixture
    def valid_review_data(self, product):
        """Provide valid data for posting a review."""
        return {
            'review': 'This product is amazing!',
            'review_title': 'Great Product',
            'rating': 5,
            'product': product.id,
        }

    def test_post_review_success(self, api_client, jwt_access_token, valid_review_data):
        """Test posting a review successfully."""
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {jwt_access_token}')
        response = api_client.post(self.review_post_endpoint, valid_review_data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['review'] == valid_review_data['review']
        assert response.data['review_title'] == valid_review_data['review_title']
        assert response.data['rating'] == valid_review_data['rating']
        assert response.data['product'] == valid_review_data['product']

    def test_post_review_missing_fields(self, api_client, jwt_access_token):
        """Test posting a review with missing fields."""
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {jwt_access_token}')
        invalid_data = {
            'review': 'Anything',
            'review_title': 'No Review',
            'rating': 5,
            # product id is missing
        }
        response = api_client.post(self.review_post_endpoint, invalid_data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['product'] == ['This field is required.']

    def test_post_review_invalid_rating(self, api_client, jwt_access_token, valid_review_data):
        """Test posting a review with an invalid rating."""
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {jwt_access_token}')
        invalid_review_data = valid_review_data.copy()
        invalid_review_data['rating'] = 6
        response = api_client.post(self.review_post_endpoint, invalid_review_data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['rating'] == ['Ensure this value is less than or equal to 5.']

    def test_post_review_unauthorized(self, api_client, valid_review_data):
        """Test posting a review without authorization."""
        response = api_client.post(self.review_post_endpoint, valid_review_data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['detail'] == 'Authentication credentials were not provided.'

    def test_post_review_invalid_token(self, api_client, valid_review_data):
        """Test posting a review with invalid authorization token."""
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer random_token')
        response = api_client.post(self.review_post_endpoint, valid_review_data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['detail'] == 'Given token not valid for any token type'
