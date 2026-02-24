from django.http import HttpResponse
from django.http import JsonResponse
def home(request):
  return HttpResponse("hello") 