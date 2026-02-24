from django.db import models

class Post1(models.Model):
    title = models.TextField()
    
    url = models.TextField(unique=True)   
    
    content=models.TextField()
