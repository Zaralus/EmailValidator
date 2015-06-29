from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

from .models import Greeting
import urllib2

# Create your views here.
def index(request):
    # return HttpResponse('Hello from Python!')
    return render(request, 'index.html')

def isValidEmail(request):
    email = request.GET.get('email');
    apiKey = request.GET.get('apiKey');

    url = "http://api.quickemailverification.com/v1/verify?email=" + email + "&apikey=" + self.apiKey
    jsonData = json.load(urllib2.urlopen( url ))
    return JsonResponse(jsonData)

def db(request):

    greeting = Greeting()
    greeting.save()

    greetings = Greeting.objects.all()

    return render(request, 'db.html', {'greetings': greetings})

