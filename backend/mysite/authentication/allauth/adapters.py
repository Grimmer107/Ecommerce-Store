from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

from authentication.models import User


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):

    def pre_social_login(self, request, sociallogin):
        user = sociallogin.user
        user.registration_method = User.RegistrationChoices.GOOGLE
