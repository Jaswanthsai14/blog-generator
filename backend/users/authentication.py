from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model

User = get_user_model()

class RefreshTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        refresh = request.COOKIES.get("refresh_token")
        

        if not refresh:
            return None

        try:
            token = RefreshToken(refresh)
            user = User.objects.get(id=token["user_id"])

            if not user.is_active:
                raise AuthenticationFailed("User inactive")

            return (user, token)

        except (TokenError, User.DoesNotExist):
            raise AuthenticationFailed("Invalid or expired token")
