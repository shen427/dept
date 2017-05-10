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
    url(r'^depts/deptsData$', deptsView.deptsData, name='deptsData'),
    url(r'^depts/deptInit', deptsView.deptInit, name='deptInit'),
    url(r'^depts/deptSave', deptsView.deptSave, name='deptSave'),
    url(r'^depts/deptDelete', deptsView.deptDelete, name='deptDelete'),
    url(r'^depts/all$', deptsView.all, name='deptAll'),
]