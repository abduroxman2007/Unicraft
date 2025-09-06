from django.contrib import admin

from .models import MentorProfile


@admin.register(MentorProfile)
class MentorProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "university", "program", "year", "price_per_hour", "is_verified")
    search_fields = ("user__username", "university", "program", "languages")
    list_filter = ("is_verified", "year")
    autocomplete_fields = ("user",)

# Register your models here.
