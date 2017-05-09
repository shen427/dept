from django.shortcuts import render
from django_ajax.decorators import ajax


@ajax
def index(request):
    return render(request, "dept/dashboard/index.html")