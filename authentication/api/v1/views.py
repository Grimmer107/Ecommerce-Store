from allauth.account.utils import has_verified_email, send_email_confirmation
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from authentication.api.v1.serializers import (
    ResendEmailConfirmationSerializer,
    UserCreateSerializer,
    UserDetailSerializer,
    UserLoginSerializer
)
from authentication.models import User


class SignupAPIView(APIView):
    serializer_class = UserCreateSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(request)
        return Response(user, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    serializer_class = UserLoginSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')

        user = authenticate(email=email, password=password)

        if not user:
            raise AuthenticationFailed('Invalid email or password!')

        if not has_verified_email(user, email) and email != settings.TESTING_EMAIL:
            raise AuthenticationFailed('User email not verified!')

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                'user': UserDetailSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        )


class ResendEmailConfirmationView(APIView):
    serializer_class = ResendEmailConfirmationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        try:
            user = User.objects.get(email=email)
            send_email_confirmation(request, user)
            return Response({'detail': 'Confirmation email sent.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'detail': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)


class GoogleLoginAPIView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.GOOGLE_CALLBACK_URL
    client_class = OAuth2Client
