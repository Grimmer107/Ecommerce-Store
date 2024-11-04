from unicodedata import category

import django
from allauth.account.views import email
from django.conf import settings
from rest_framework import status
import pytest

# Ensure Django is set up for pytest
django.setup()


@pytest.mark.django_db
class TestGetOrdersAPI:
    order_list_endpoint = f'{settings.BASE_BACKEND_URL}/store/api/v1/orders/'

    @pytest.fixture
    def user(self, user_factory):
        """Create a test user for authentication."""
        return user_factory.create()

    @pytest.fixture
    def jwt_access_token(self, api_client, user):
        """Generate an access token using JWT authentication."""
        login_url = f'{settings.BASE_BACKEND_URL}/authentication/api/v1/login/'
        response = api_client.post(
            login_url, {'email': user.email, 'password': 'test_password'}, format='json',
        )
        return response.data['access']

    @pytest.fixture
    def create_orders(self, user, product_factory, city_factory, country_factory,
                      product_category_factory, order_product_factory, order_factory):
        product_category = product_category_factory.create()
        products = product_factory.create_batch(2, category=product_category)

        country = country_factory.create()
        city_factory.create(country=country)

        order1 = order_factory.create(customer=user)
        order_product_factory.create(product=products[0], order=order1)
        order_product_factory.create(product=products[1], order=order1)

        order2 = order_factory.create(customer=user)
        order_product_factory.create(product=products[0], order=order2)

    def test_get_orders_success(self, api_client, create_orders, jwt_access_token):
        """Test fetching orders with JWT token"""
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {jwt_access_token}')
        response = api_client.get(self.order_list_endpoint)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 2

    def test_get_orders_unauthenticated(self, api_client):
        """Test fetching orders without JWT token"""
        response = api_client.get(self.order_list_endpoint)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['detail'] == 'Authentication credentials were not provided.'
