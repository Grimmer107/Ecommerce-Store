from django.contrib import admin

from store.models import City, Country, Order, OrderProduct, Product, ProductCategory, ProductImage, ProductReview


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'discount', 'category', 'description', 'quantity', 'created_at']
    inlines = [ProductImageInline]


class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'created_at', 'total_price']


class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


class OrderProductsAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'product', 'quantity']


class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'product', 'review', 'review_title', 'rating', 'created_at']


class CountryAdmin(admin.ModelAdmin):
    list_display = ['name']


class CityAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'country']


admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(ProductCategory, ProductCategoryAdmin)
admin.site.register(OrderProduct, OrderProductsAdmin)
admin.site.register(ProductReview, ProductReviewAdmin)
admin.site.register(Country, CountryAdmin)
admin.site.register(City, CityAdmin)
