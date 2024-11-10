from django.shortcuts import redirect, render
from django.views import View

from store.forms import ProductForm, ProductImageFormSet
from store.models import ProductImage


class AddProductView(View):
    template_name = 'store/create_product.html'

    def get(self, request):
        if not request.user.is_staff:
            return redirect('/admin/login/')

        form = ProductForm()
        formset = ProductImageFormSet()
        return render(request, self.template_name, {'form': form, 'formset': formset})

    def post(self, request):
        if not request.user.is_staff:
            return redirect('/admin/login/')

        form = ProductForm(request.POST)
        formset = ProductImageFormSet(request.POST, request.FILES)

        if form.is_valid() and formset.is_valid():
            product = form.save()
            images = formset.save(commit=False)
            for image in images:
                image.product = product
            ProductImage.objects.bulk_create(images)
            return redirect('/store/add-product/')

        return render(request, self.template_name, {'form': form, 'formset': formset})
