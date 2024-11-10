from django import forms
from django.forms import inlineformset_factory

from store.models import Product, ProductImage


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'price', 'discount', 'category', 'description', 'quantity']


class ProductImageForm(forms.ModelForm):
    class Meta:
        model = ProductImage
        fields = ['image']


ProductImageFormSet = inlineformset_factory(
    Product, ProductImage, form=ProductImageForm, extra=3, can_delete=True
)
