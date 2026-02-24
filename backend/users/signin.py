from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.authentication import BaseAuthentication
from users.models import Post
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, throttle_classes
class LoginUserThrottle(UserRateThrottle):
    rate = '10/min'

class LoginAnonThrottle(AnonRateThrottle):
    rate = '10/min'
@api_view(["POST"])
@permission_classes([AllowAny])

@throttle_classes([LoginUserThrottle, LoginAnonThrottle])
def signup(request):
  username=request.data.get("username")
  password=request.data.get("password")
  p=Post()
  if not username or not password :
    return Response({"message":"Invalid credentials"},status=400)
  
  
  if User.objects.filter(username=username).exists():
    return Response({"message":"username already exsits"},status=409)
  user=User.objects.create_user(username=username,password=password)
  userr= User.objects.filter(username=username).first()
  id=userr.id
  
 

 
  post, created = Post.objects.get_or_create(
    user_id=id,
    
)



 
  response=Response({"message":"signup sucessfull"},status=201)
  
  refresh_token=RefreshToken.for_user(user)
  response.set_cookie( key="refresh_token",
        value=str(refresh_token),
        httponly=True,
        secure=False,        
        samesite="Lax",      
        max_age=60 * 60 * 24 )
 
  

  

  return response
@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([LoginUserThrottle, LoginAnonThrottle])
def login(request):
   username=request.data.get("username")
   password=request.data.get("password")
   if not username or not password :
    return Response({"message":"Invalid credentials"},status=400)
   user=authenticate(username=username,password=password)
   if(not user):
     return Response({"message":"worng credentials"},status=401)
   refresh=RefreshToken.for_user(user)
   response=Response({"message":"login sucessfull"},status=200)
   response.set_cookie(
     key="refresh_token",
     value=str(refresh),
     httponly=True,
      secure=False,        
      samesite="Lax",      
      max_age=60 * 60 * 24
   )
   return response
@api_view(["GET"])

def logout(request):
  try:
    refresh=request.COOKIES.get("refresh_token")
    if refresh is None:
      return Response({"message":"token not found"},status=400)
    refresh_token=RefreshToken(refresh)
    refresh_token.blacklist() 
    res=Response(status=204)
    res.delete_cookie("refresh_token")
    return res
  except TokenError:
    return Response({"message":"token error"},status=400)
@api_view(["GET"])
def checker(request):
  try:
    refresh=request.COOKIES.get("refresh_token")
    if refresh is None:
      print("1 err")
      return Response({"message":"token not found"},status=401)
    refresh_token=RefreshToken(refresh)
   
    userid=refresh_token["user_id"]
    user=User.objects.get(id=userid)
    res=Response({"username":user.username},status=200)
    
    return res
  except TokenError:
    print("2 err")
    return Response({"message":"token error"},status=401)
class refreshAuth(BaseAuthentication):
  def authenticate(self,request):
    try:
      refresh=request.COOKIES.get("refresh_token")
      if refresh is None:
        return None
      
      refresh_token=RefreshToken(refresh)
      
      userid=refresh_token["user_id"]
      user=User.objects.get(id=userid)
      
      return (user,refresh)
    except User.DoesNotExist:
            raise AuthenticationFailed("User not found")
      
    except TokenError:
      raise AuthenticationFailed("Invalid or expired refresh token")




    
    

