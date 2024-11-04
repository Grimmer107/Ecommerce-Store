from decimal import Decimal

from django.conf import settings
from rest_framework import serializers

from authentication.models import User
from store.models import City, Country, Order, OrderProduct, Product, ProductCategory, ProductImage, ProductReview


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'discount', 'quantity']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        action = self.context.get('action')
        if action == 'retrieve':
            image_urls = []
            for image in ProductImageSerializer(instance.images, many=True).data:
                image_urls.append(settings.BASE_BACKEND_URL + image['image'])
            representation['images'] = image_urls
            representation['description'] = instance.description
        else:
            first_image = instance.images.first()
            representation['image'] = settings.BASE_BACKEND_URL + str(ProductImageSerializer(first_image).data['image'])
        return representation


class OrderProductSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = OrderProduct
        fields = ['product', 'quantity']


class OrderDetailSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'total_price', 'status', 'payment_method', 'products']


class OrderCreateSerializer(serializers.ModelSerializer):
    products = OrderProductSerializer(many=True)
    email = serializers.EmailField(max_length=255)
    first_name = serializers.CharField(max_length=255)
    last_name = serializers.CharField(max_length=255)

    class Meta:
        model = Order
        fields = [
            'email', 'first_name', 'last_name', 'products', 'city', 'address',
            'country', 'postal_code', 'phone_number', 'payment_method',
        ]

    def to_representation(self, instance):
        return OrderDetailSerializer(instance).data

    def create(self, validated_data):
        total_price = Decimal(0)
        order_products = validated_data.pop('products')

        for order_product in order_products:
            product, quantity = order_product['product'], order_product['quantity']
            total_price += product.price * (1 - (product.discount / Decimal(100.0))) * quantity

        email, first_name, last_name = (validated_data.pop(key) for key in ('email', 'first_name', 'last_name'))

        try:
            customer = User.objects.get(email=email)
        except User.DoesNotExist:
            customer = User.objects.create_user(email=email, first_name=first_name, last_name=last_name)

        order = Order.objects.create(
            customer=customer, total_price=total_price,
            status=Order.OrderStatuses.PENDING, **validated_data,
        )

        order_product_list = []
        for order_product in order_products:
            order_product_list.append(
                OrderProduct(
                    order=order,
                    product=order_product['product'],
                    quantity=order_product['quantity']
                )
            )
            order_product['product'].quantity -= order_product['quantity']
            order_product['product'].save()
        OrderProduct.objects.bulk_create(order_product_list)

        return order


class ProductReviewSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

    class Meta:
        model = ProductReview
        fields = ['product', 'review', 'review_title', 'rating']

    def create(self, validated_data):
        customer = self.context['request'].user
        product_review = ProductReview.objects.create(
            customer=customer, **validated_data
        )
        return product_review


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['name']


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['name']


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']
