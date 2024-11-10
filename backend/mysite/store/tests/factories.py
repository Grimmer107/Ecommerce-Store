import django
import factory
from faker import Faker
fake = Faker()

# This ensures that Django is set up for pytest to run
django.setup()

from store.models import Product, City, Country, ProductCategory, Order, OrderProduct
from authentication.models import User


class CountryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Country

    name = factory.LazyAttribute(lambda o: fake.unique.country())


class CityFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = City

    name = factory.LazyAttribute(lambda o: fake.unique.city())
    country = factory.SubFactory(CountryFactory)


class ProductCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ProductCategory

    name = factory.LazyAttribute(lambda o: fake.unique.name())


class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Product

    name = factory.Faker('word')
    price = factory.Faker('pydecimal', left_digits=7, right_digits=2, positive=True)
    discount = factory.Faker('pydecimal', left_digits=3, right_digits=2, min_value=0, max_value=100)
    category = factory.SubFactory(ProductCategoryFactory)
    description = factory.Faker('paragraph')
    quantity = factory.Faker('random_int', min=1, max=100)


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save = True

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    email = 'testuser@example.com'

    @factory.post_generation
    def set_hashed_password(self, create, extracted, **kwargs):
        self.set_password('test_password')
        if create:
            self.save()


class OrderFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Order

    customer = factory.SubFactory(UserFactory)
    total_price = factory.Faker('pydecimal', left_digits=9, right_digits=2, positive=True)
    status = factory.Faker('random_element', elements=[status.value for status in Order.OrderStatuses])
    country = factory.SubFactory(CountryFactory)
    city = factory.SubFactory(CityFactory)
    address = factory.Faker('address')
    postal_code = factory.Faker('postcode')
    phone_number = factory.Faker('phone_number')
    payment_method = factory.Faker('random_element', elements=[method.value for method in Order.PaymentMethods])


class OrderProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrderProduct

    quantity = factory.Faker('random_int', min=1, max=100)
    product = factory.SubFactory(ProductFactory)
    order = factory.SubFactory(OrderFactory)
