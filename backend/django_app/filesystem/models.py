from django.db import models

# Create your models here.

class File(models.Model):
    Id = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=255)
    Path = models.CharField(max_length=255)
    Type = models.CharField(max_length=255)