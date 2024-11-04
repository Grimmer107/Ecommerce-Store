from allauth.account import app_settings
from allauth.account.adapter import get_adapter
from allauth.account.forms import default_token_generator
from allauth.account.utils import filter_users_by_email, user_pk_to_url_str, user_username
from dj_rest_auth.forms import AllAuthPasswordResetForm
from django.conf import settings as base_settings
from django.contrib.sites.shortcuts import get_current_site


class CustomAllAuthPasswordResetForm(AllAuthPasswordResetForm):

    def clean_email(self):
        email = self.cleaned_data["email"]
        email = get_adapter().clean_email(email)
        self.users = filter_users_by_email(email, is_active=True)
        return self.cleaned_data["email"]

    def save(self, request, **kwargs):
        current_site = get_current_site(request)
        email = self.cleaned_data['email']
        token_generator = kwargs.get('token_generator', default_token_generator)

        for user in self.users:
            temp_key = token_generator.make_token(user)

            path = f"{base_settings.BASE_FRONTEND_URL}password/reset/{user_pk_to_url_str(user)}/{temp_key}/"

            context = {
                "current_site": current_site,
                "user": user,
                "password_reset_url": path,
                "request": request,
                "path": path,
            }

            if app_settings.AUTHENTICATION_METHOD != app_settings.AuthenticationMethod.EMAIL:
                context['username'] = user_username(user)

            get_adapter(request).send_mail(
                'account/email/password_reset_email', email, context
            )

        return self.cleaned_data['email']
