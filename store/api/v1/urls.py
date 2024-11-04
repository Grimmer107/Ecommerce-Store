from rest_framework import routers

from store.api.v1 import views

router = routers.SimpleRouter()
router.register(r'products', views.ProductViewSet, basename='products')
router.register(r'orders', views.OrderViewSet, basename='orders')
router.register(r'reviews', views.ProductReviewViewSet, basename='reviews')
router.register(r'countries', views.CountryViewSet, basename='countries')
router.register(r'cities', views.CityViewSet, basename='cities')
router.register(r'product_categories', views.ProductCategoryViewSet, basename='product_categories')
urlpatterns = router.urls
