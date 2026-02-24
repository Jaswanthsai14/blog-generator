

from django.urls import path

from .signin import login,logout,signup,checker
urlpatterns = [
  path('signup/',signup),
   path('login/',login),
    path('logout/',logout),
    path('checker/',checker),


    
    
]