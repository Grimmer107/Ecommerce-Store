import django

from django.conf import settings
from rest_framework import status
import pytest

# This ensures that Django is set up for pytest to run
django.setup()


@pytest.mark.django_db
class TestProductCategoryListAPI:
    category_list_endpoint = f'{settings.BASE_BACKEND_URL}/store/api/v1/product_categories/'

    def test_get_product_category_list_success(self, api_client, product_category_factory):
        """Test successful fetch of product category list."""
        product_category_factory.create_batch(3)
        response = api_client.get(self.category_list_endpoint)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3
