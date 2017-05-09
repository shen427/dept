from django.conf.urls import url

from dept.deptViews import dashboardView, deptsView
from . import views


app_name = 'dept'
urlpatterns = [
    # index
    url(r'^$', views.index, name='index'),
    # dashboard
    url(r'^dashboard/index$', dashboardView.index, name='dashboardIndex'),
    # depts
    url(r'^depts/index$', deptsView.index, name='deptsIndex'),
]