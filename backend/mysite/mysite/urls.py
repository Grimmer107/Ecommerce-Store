from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('store/', include('store.urls')),
    path('account/', include('allauth.urls')),
    path('authentication/', include('authentication.urls')),
]

if settings.DEBUG:
    urlpatterns.append(path('__debug__/', include('debug_toolbar.urls')))
    urlpatterns.append(path('api/schema/', SpectacularAPIView.as_view(), name='schema'))
    urlpatterns.append(path('api/schema/docs/', SpectacularSwaggerView.as_view(url_name='schema')))
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
