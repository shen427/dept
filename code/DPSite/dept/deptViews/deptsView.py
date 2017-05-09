from django.shortcuts import render
from django_ajax.decorators import ajax
from ..models import Dept, Staff


@ajax
def index(request):
    depts = Dept.objects.all()
    items = []
    for indx, dept in enumerate(depts):
        staffCount = Staff.objects.filter(dept_id=dept.id).count()
        item = {
            'index': indx,
            'dept': dept,
            'count': staffCount,
        }
        items.append(item);
    context = {
        'items': items
    }

    return render(request, 'dept/staff/depts.html', context)