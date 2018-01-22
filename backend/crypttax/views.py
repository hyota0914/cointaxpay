from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your views here.
def index(request):
    return HttpResponse("hello")

def login(request):
    return HttpResponse("please login")
