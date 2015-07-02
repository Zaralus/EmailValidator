from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

from .models import Greeting
from .models import APIKey

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
        pass

    keyObj = APIKey.objects.get(id=1)
    if (apiKey):
        keyObj.key = apiKey
        keyObj.save()
        parms['success_message'] = "API Key saved successfully."
    else:
        apiKey = keyObj.key

    parms['apiKey'] = apiKey
    
    return render(request, 'index.html', parms)
    

def bulkprocess(request):
    parms = {}
    
    keyObj = APIKey.objects.get(id=1)
    parms['apiKey'] = keyObj.key
    
    return render(request, 'bulkProcess.html', parms)

def singleprocess(request):
    parms = {}
    
    keyObj = APIKey.objects.get(id=1)
    parms['apiKey'] = keyObj.key
    
    return render(request, 'singleProcess.html', parms)

def isvalidemail(request):
    email = request.GET.get('email');
    apiKey = request.GET.get('apikey');

    url = "http://api.quickemailverification.com/v1/verify?email=" + email + "&apikey=" + apiKey
    try:
        jsonData = json.load(urllib2.urlopen( url ))
    except urllib2.URLError as e:
        jsonData = json.loads('{"success":"false","message":"' + e.reason + '"}')
    return JsonResponse(jsonData)

def db(request):

    greeting = Greeting()
    greeting.save()

    greetings = Greeting.objects.all()

    return render(request, 'db.html', {'greetings': greetings})

