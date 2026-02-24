from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from agents import agent
from users.models import Post
from users.models1 import Post1
from rest_framework_simplejwt.tokens import RefreshToken
import asyncio
from django.contrib.auth.models import User
from users.tasks import notify_admin_new_post
from django.core.cache import cache
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from rest_framework.decorators import permission_classes, throttle_classes

class BlogGenerationThrottle(UserRateThrottle):
    rate = '3/day'
@permission_classes([IsAuthenticated])
@throttle_classes([BlogGenerationThrottle])
@api_view(["POST"])
def generate(request):
  link=request.data.get("link")
  if not link:
    return Response({"messages":"link not found"},status=404)
  cache_key = f"blog_cache:{link}"
  counter_key = f"counter:{link}"
  count=cache.get(counter_key,0)
  count=count+1
  cache.set(counter_key,count,timeout=3600)
  c_result=cache.get(cache_key)
  if c_result:
    title=c_result["title"]
    content=c_result["content"]
    print("from cache")
    return Response({"title":title,"content":content},status=200)
  if Post1.objects.filter(url=link).exists():
    p1=Post1.objects.filter(url=link).first()
    result={}
    result["title"]=p1.title
    result["content"]=p1.content
    print("from db")
  else:
    result = asyncio.run(agent(link=link))
    post1, created1 = Post1.objects.get_or_create(
    url=link)
    post1.title=result["title"]
    post1.content=result["content"]
    post1.save()

    
    

    print("from ai")
  if not result:
    return Response({"messages":"generation failed"},status=404)
  title=result["title"]
  content=result["content"]
  refresh=request.COOKIES.get("refresh_token")
  refresh=RefreshToken(refresh)
  userid=refresh["user_id"]
  user=User.objects.get(id=userid)
 

 
  post, created = Post.objects.get_or_create(
    user_id=userid,
    
)
  
  if not post.blog:
    post.blog = []


  post.blog = post.blog + [{"title": title, "content": content}]
  post.save()



  if count>=3:
    cache.set(cache_key,{"title": title, "content": content},timeout=60*60)

  notify_admin_new_post.delay(title, content, user.username,userid)


  
  return Response({"title":title,"content":content},status=200)




