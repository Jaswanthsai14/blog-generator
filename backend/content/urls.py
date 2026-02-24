from django.contrib import admin
from django.urls import path,include
from .views import generate
from .data import get_all,dele



urlpatterns = [
    path('agent/', generate),
    path('history/',get_all),
     path('history/delete/<int:index>/',dele)
    
    
]