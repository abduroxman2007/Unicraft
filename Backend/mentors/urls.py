from rest_framework.routers import DefaultRouter
from .views import MentorProfileViewSet

router = DefaultRouter()
router.register(r'mentors', MentorProfileViewSet, basename='mentor')

urlpatterns = router.urls


