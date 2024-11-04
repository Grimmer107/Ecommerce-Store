from rest_framework import viewsets
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from store.api.v1.serializers import (
    CitySerializer,
    CountrySerializer,
    OrderCreateSerializer,
    OrderDetailSerializer,
    ProductCategorySerializer,
    ProductReviewSerializer,
    ProductSerializer
)
from store.models import Country, Order, Product, ProductCategory


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    pagination_class = PageNumberPagination
    http_method_names = ['get']

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['action'] = self.action
        return context

    def get_queryset(self):
        queryset = Product.objects.prefetch_related('images').all()
        query_params = self.request.query_params
        if query_params:
            category = query_params.get('category', '')
            if category:
                queryset = queryset.filter(category__name=category)

            sort_order = query_params.get('sort_order', '')
            sort_order_queryset = dict(
                lowest_price=queryset.order_by('price'),
                highest_price=queryset.order_by('-price'),
                new=queryset.order_by('-created_at'),
            )
            if sort_order:
                queryset = sort_order_queryset.get(sort_order, queryset)
        return queryset


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderDetailSerializer
    pagination_class = PageNumberPagination
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_queryset(self):
        return self.request.user.orders.prefetch_related('products').all()

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def get_authenticators(self):
        if self.request and self.request.method == 'POST':
            return []
        return [JWTAuthentication()]

    def get_permissions(self):
        if self.request and self.request.method == 'POST':
            return []
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderDetailSerializer

    def perform_destroy(self, instance):
        instance.status = Order.OrderStatuses.CANCELLED
        instance.save()


class ProductReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ProductReviewSerializer
    pagination_class = PageNumberPagination
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']


class ProductCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = ProductCategorySerializer
    queryset = ProductCategory.objects.all()
    http_method_names = ['get']
    pagination_class = None


class CountryViewSet(viewsets.ModelViewSet):
    serializer_class = CountrySerializer
    queryset = Country.objects.all()
    http_method_names = ['get']
    pagination_class = None


class CityViewSet(viewsets.ModelViewSet):
    serializer_class = CitySerializer
    http_method_names = ['get']
    pagination_class = None

    def get_queryset(self):
        country_name = self.request.query_params.get('country', None)
        if country_name:
            try:
                country = Country.objects.get(name=country_name)
                return country.cities.all()
            except Country.DoesNotExist:
                raise NotFound(f'Country with name {country_name} does not exist.')
