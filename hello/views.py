from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

from .models import Greeting
import urllib2
import json

# Create your views here.
def index(request):

    parms = {}
    
    apiKey = None

    # Check if we are saving api key
    try:
        apiKey = request.POST['apiKey']
    except KeyError:
        # Ignore, means we are not saving apiKey at this time.
        
    if (apiKey):
        with open('apiKey.txt','w') as f:
            f.write(apiKey)
            parms['success_message'] = "API Key saved successfully."
    else:
        with open('apiKey.txt','r') as f:
            apiKey = f.read(apiKey)

    parms['apiKey'] = apiKey
    
    return render(request, 'index.html', parms)
    

def bulkprocess(request):
    return render(request, 'bulkProcess.html')

def singleprocess(request):
    return render(request, 'singleProcess.html')

def isvalidemail(request):
    email = request.GET.get('email');
    apiKey = request.GET.get('apikey');

    url = "http://api.quickemailverification.com/v1/verify?email=" + email + "&apikey=" + apiKey
    jsonData = json.load(urllib2.urlopen( url ))
    return JsonResponse(jsonData)

def db(request):

    greeting = Greeting()
    greeting.save()

    greetings = Greeting.objects.all()

    return render(request, 'db.html', {'greetings': greetings})

