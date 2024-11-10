from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import PasswordResetConfirmView, PasswordResetView
from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from authentication.api.v1 import views

urlpatterns = [
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('signup/', RegisterView.as_view(), name='register'),
    path('password/reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password/reset/confirm/<str:uidb64>/<str:token>/',
         PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('google/login/', views.GoogleLoginAPIView.as_view(), name='google_login'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('email/verify/', views.ResendEmailConfirmationView.as_view(), name='resend_email_verify'),
]
