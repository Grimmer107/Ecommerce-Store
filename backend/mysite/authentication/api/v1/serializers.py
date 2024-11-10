from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import PasswordResetSerializer as _PasswordResetSerializer
from rest_framework import serializers

from authentication.allauth.forms import CustomAllAuthPasswordResetForm
from authentication.models import User


class UserCreateSerializer(RegisterSerializer):
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    password1 = None
    password2 = None

    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'password': self.validated_data.get('password', ''),
            'email': self.validated_data.get('email', ''),
        }

    def validate(self, data):
        return data

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        user = adapter.save_user(request, user, self, commit=False)
        user.set_password(self.cleaned_data['password'])
        user.save()
        self.custom_signup(request, user)
        setup_user_email(request, user, [])
        return user

    def to_representation(self, instance):
        return UserDetailSerializer(instance).data


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']


class PasswordResetSerializer(_PasswordResetSerializer):

    def validate_email(self, value):
        self.reset_form = CustomAllAuthPasswordResetForm(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(self.reset_form.errors)

        return value


class ResendEmailConfirmationSerializer(serializers.Serializer):
    email = serializers.EmailField()


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
