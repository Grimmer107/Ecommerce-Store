import django
from django.conf import settings
from rest_framework import status
import pytest

# This ensures Django is set up for pytest
django.setup()

# from authentication.models import User
from django.contrib.auth import get_user_model

User = get_user_model()
from store.models import Product, ProductCategory, City, Country, Order


@pytest.mark.django_db
class TestPostOrderAPI:
    order_create_endpoint = f'{settings.BASE_BACKEND_URL}/store/api/v1/orders/'

    @pytest.fixture()
    def user(self):
        """Create a test user for authentication."""
        return User.objects.create_user(
            email='testuser@example.com',
            first_name='test',
            last_name='user',
            password='test_password'
        )

    @pytest.fixture
    def valid_user_data(self, user):
        """Return test user data."""
        return dict(
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
        )

    @pytest.fixture
    def product_category(self):
        """Create a product category."""
        return ProductCategory.objects.create(
            name='Home & Lifestyle',
        )

    @pytest.fixture
    def create_country(self):
        """Create a country."""
        return Country.objects.create(
            name='Pakistan',
        )

    @pytest.fixture
    def create_city(self, create_country):
        """Create a city."""
        return City.objects.create(
            name='Lahore',
            country=create_country
        )

    @pytest.fixture
    def create_products(self, product_category):
        """Create new products."""
        product1 = Product(
            name='Door Matt',
            price=400,
            discount=5,
            category=product_category,
            description='Door matt for your house.',
            quantity=200,
        )
        product2 = Product(
            name='Door Knob',
            price=200,
            discount=0,
            category=product_category,
            description='Door knob for your door.',
            quantity=10,
        )
        return Product.objects.bulk_create([product1, product2])

    @pytest.fixture
    def order_data(self, create_city, create_country, create_products, valid_user_data):
        """Return valid order data."""
        return {
            'products': [
                {'product': create_products[0].id, 'quantity': 2},
                {'product': create_products[1].id, 'quantity': 1}
            ],
            'email': valid_user_data['email'],
            'first_name': valid_user_data['first_name'],
            'last_name': valid_user_data['last_name'],
            'city': create_city.id,
            'country': create_country.name,
            'address': 'random',
            'postal_code': '54000',
            'phone_number': 'random',
            'payment_method': Order.PaymentMethods.COD,
        }

    def test_post_order_success(self, api_client, order_data):
        """Test posting an order with valid data."""
        response = api_client.post(self.order_create_endpoint, order_data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['status'] == Order.OrderStatuses.PENDING
        assert len(response.data['products']) == 2
        assert response.data['total_price'] == '960.00'

    def test_post_order_missing_data_failure(self, api_client, order_data):
        """Test posting an order with missing data."""
        order_data.pop('payment_method')
        response = api_client.post(self.order_create_endpoint, order_data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['payment_method'] == ['This field is required.']

    def test_post_order_invalid_data_failure(self, api_client, order_data):
        """Test posting an order with invalid data (payment_method)."""
        order_data['payment_method'] = 'random'
        response = api_client.post(self.order_create_endpoint, order_data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['payment_method'] == ['\"random\" is not a valid choice.']
