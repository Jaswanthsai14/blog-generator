from django.db import models

class Post(models.Model):
    title = models.TextField()
    
    user_id=models.IntegerField()
    
    blog = models.JSONField(null=True, blank=True) 

    def get_data(self):
        return self.blog




