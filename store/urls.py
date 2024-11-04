from django.urls import include, path

from store.views import AddProductView

app_name = 'store'

urlpatterns = [
    path('api/', include('store.api.urls')),
    path('add-product/', AddProductView.as_view(), name='add_product'),
]
