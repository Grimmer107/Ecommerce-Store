import django
from django.conf import settings
from rest_framework import status
import pytest

# Ensure Django is set up for pytest
django.setup()

from store.models import Product
from store.api.v1.views import ProductViewSet


@pytest.mark.django_db
class TestProductAPI:
    product_list_endpoint = f'{settings.BASE_BACKEND_URL}/store/api/v1/products/'
    single_product_endpoint = f'{settings.BASE_BACKEND_URL}/store/api/v1/products/1/'

    def test_get_product_list_success(self, api_client, product_factory):
        """Test successful fetching of product list."""
        product_factory.create_batch(2)
        response = api_client.get(self.product_list_endpoint)
        products = response.data['results']
        assert response.status_code == status.HTTP_200_OK
        assert len(products) == 2

    def test_get_product_success(self, api_client, product_factory):
        """Test successful fetching of single product."""
        product_factory.create()
        response = api_client.get(self.single_product_endpoint)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == 1

    def test_get_non_existent_product(self, api_client, mocker):
        """Test fetching an empty product with a mocked queryset"""
        mocked_queryset = mocker.patch.object(ProductViewSet, 'get_queryset')
        mocked_queryset.return_value = Product.objects.none()
        response = api_client.get(self.single_product_endpoint)
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data['detail'] == 'No Product matches the given query.'
