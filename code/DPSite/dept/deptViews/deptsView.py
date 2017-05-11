from django.shortcuts import render
from django_ajax.decorators import ajax
from ..models import Dept, Staff


def getIndexData(request):
    parentId = request.POST['parentId']
    if parentId:
        depts = Dept.objects.filter(parent_id=parentId)
    else:
        depts = Dept.objects.all()
    items = []
    for indx, dept in enumerate(depts):
        staffCount = Staff.objects.filter(dept_id=dept.id).count()
        item = {
            'indx': indx + 1,
            'dept': dept,
            'cont': staffCount,
        }
        items.append(item)
    return items


@ajax
def index(request):
    return render(request, 'dept/staff/depts.html')


@ajax
def deptsTree(request):
    allDepts = Dept.objects.all()
    items = []
    for dept in allDepts:
        item = {
            'id': dept.id,
            'pid': dept.parent.id if dept.parent else '',
            'text': dept.name
        }
        items.append(item)

    return {'contents': items}


@ajax
def deptsData(request):
    parentId = request.POST['parentId']
    items = getIndexData(request)
    depts = []
    for item in items:
        dept = {
            'indx': item['indx'],
            'id': item['dept'].id,
            'code': item['dept'].code,
            'name': item['dept'].name,
            'parent': {
                'id': item['dept'].parent.id if item['dept'].parent else '',
                'name': item['dept'].parent.name if item['dept'].parent else '',
            },
            'cont': item['cont'],
        }
        depts.append(dept)
    return {'depts': depts}


@ajax
def all(request):
    depts = Dept.objects.all()
    result = []
    for dept in depts:
        parentId = ''
        parentName = ''
        if dept.parent:
            parentId = dept.parent.id
            parentName = dept.parent.name
        result.append({
            'id': dept.id,
            'code': dept.code,
            'name': dept.name,
            'parentId': parentId,
            'parentName': parentName,
        });
    return {'depts': result}


@ajax
def deptInit(request):
    if "deptId" in request.POST.keys():
        deptId = request.POST["deptId"]
        dept = Dept.objects.get(pk=deptId)
    else:
        dept = Dept.create()
    context = {'dept': dept}
    return render(request, 'dept/staff/createDept.html', context)


@ajax
def deptSave(request):
    id = request.POST["id"]
    code = request.POST["code"]
    name = request.POST["name"]
    parentId = request.POST["parentId"]

    if id:
        dept = Dept.objects.get(pk=id)
    else:
        dept = Dept.create()

    if parentId:
        parentDept = Dept.objects.get(pk=parentId)
    else:
        parentDept = None

    dept.code = code
    dept.name = name
    dept.parent = parentDept

    dept.save()

    return {'deptId': dept.id}


@ajax
def deptDelete(request):
    count = 0;
    if "deptId" in request.POST.keys():
        deptId = request.POST["deptId"]
        dept = Dept.objects.get(pk=deptId)
        count = dept.delete()
    return {'count': count}
