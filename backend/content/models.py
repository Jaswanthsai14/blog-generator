from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Post(models.Model):
    title = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    blog = models.JSONField(default=list, blank=True)


    def __str__(self):
        return self.title
    def get_blog(self):
        return self.blog