from django.urls import include, path

urlpatterns = [
    path('v1/', include('store.api.v1.urls')),
]
