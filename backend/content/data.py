from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from agents import agent
from users.models import Post
from rest_framework_simplejwt.tokens import RefreshToken
import asyncio
from django.contrib.auth.models import User
@api_view(["GET"])
def get_all(request):
  refresh=request.COOKIES.get("refresh_token")
  refresh_token=RefreshToken(refresh)
  userid=refresh_token["user_id"]
  p=Post.objects.get(user_id=userid)

  history=p.blog
  if not history:
    return Response({"message":"history not found"},status=404)

  return Response({"history":history},status=200)
@api_view(["DELETE"])
def dele(request,index):
  refresh=request.COOKIES.get("refresh_token")
  refresh_token=RefreshToken(refresh)
  userid=refresh_token["user_id"]
  p=Post.objects.get(user_id=userid)
  
  history=p.blog
  history.pop(index)
  p.blog=history
  p.save()
  return Response(
            {"message": "Blog deleted successfully"},
            status=status.HTTP_200_OK
        )


