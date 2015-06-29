from django.db import models

# Create your models here.
class Person(models.Model):
    fn = models.CharField(max_length=100)
    fi = models.CharField(max_length=1)
    mn = models.CharField(max_length=100)
    mi = models.CharField(max_length=1)
    ln = models.CharField(max_length=100)
    li = models.CharField(max_length=1)

class Greeting(models.Model):
    when = models.DateTimeField('date created', auto_now_add=True)
