from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import UniqueConstraint

from authentication.models import User


class ProductCategory(models.Model):
    class Meta:
        verbose_name_plural = 'Product Categories'

    name = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=9, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='products')
    description = models.TextField()
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='uploads/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Image for {self.product.name}'


class OrderProduct(models.Model):
    class Meta:
        verbose_name_plural = 'Order Products'

    quantity = models.PositiveIntegerField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='order_products')
    order = models.ForeignKey('store.Order', on_delete=models.CASCADE, related_name='order_products')

    def __str__(self):
        return f'{self.product.__str__()}_{self.quantity}'


class Country(models.Model):
    class Meta:
        verbose_name_plural = 'Countries'

    name = models.CharField(max_length=32, primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class City(models.Model):
    class Meta:
        verbose_name_plural = 'Cities'
        constraints = [UniqueConstraint(fields=['name', 'country'], name='unique_city_in_country')]

    name = models.CharField(max_length=32)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name}, {self.country.name}'


class Order(models.Model):
    class OrderStatuses(models.TextChoices):
        PENDING = 'Pending'
        PROCESSING = 'Processing'
        SHIPPED = 'Shipped'
        DELIVERED = 'Delivered'
        COMPLETED = 'Completed'
        CANCELLED = 'Cancelled'
        RETURNED = 'Returned'
        REFUNDED = 'Refunded'

    class PaymentMethods(models.TextChoices):
        PAYFAST = 'PAYFAST',
        COD = 'Cash On Delivery'

    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    products = models.ManyToManyField(Product, through=OrderProduct)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=12, choices=OrderStatuses.choices)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='orders')
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='orders')
    address = models.CharField(max_length=120)
    postal_code = models.CharField(max_length=16, blank=True)
    phone_number = models.CharField(max_length=16)
    payment_method = models.CharField(max_length=32, choices=PaymentMethods.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return str(self.id)


class ProductReview(models.Model):
    class Meta:
        verbose_name_plural = 'Product Reviews'

    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_reviews')
    review_title = models.CharField(max_length=120)
    review = models.TextField()
    rating = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.customer.__str__()}_{self.product.__str__()}_{self.review_title}'
