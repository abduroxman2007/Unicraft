from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from .oauth_views import google_auth, google_auth_url, google_auth_callback

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('auth/google/', google_auth, name='google_auth'),
    path('auth/google/callback/', google_auth_callback, name='google_auth_callback'),
    path('auth/google/url/', google_auth_url, name='google_auth_url'),
] + router.urls


