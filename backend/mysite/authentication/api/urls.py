from django.urls import include, path

urlpatterns = [
    path('v1/', include('authentication.api.v1.urls')),
]
