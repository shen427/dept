from django.db import models

# Create your models here.
MONTH_CHOICE = (
    (1, '01'),
    (2, '02'),
    (3, '03'),
    (4, '04'),
    (5, '05'),
    (6, '06'),
    (7, '07'),
    (8, '08'),
    (9, '09'),
    (10, '10'),
    (11, '11'),
    (12, '12'),
)

class Dept(models.Model):
    code = models.CharField(max_length=2, unique=True, db_index=True)
    name = models.CharField(max_length=50)
    parent = models.ForeignKey('self', null=True, db_index=True, blank=True, on_delete=models.CASCADE)
    def __str__(self):
        return self.name
    @classmethod
    def create(cls):
        u = cls()
        return u


class Staff(models.Model):
    SEX_CHOICES = (
        (1, u'男'),
        (0, u'女'),
    )
    STATUS_CHOICES = (
        (1, u'在职'),
        (0, u'离职'),
    )
    code = models.CharField(max_length=6, unique=True, db_index=True)
    name = models.CharField(max_length=50)
    sex = models.IntegerField(choices=SEX_CHOICES)
    status = models.IntegerField(choices=STATUS_CHOICES)
    dept = models.ForeignKey(Dept, on_delete=models.CASCADE)
    def __str__(self):
        return self.code + ':' + self.name


class SalesPlan(models.Model):
    plname = models.CharField(max_length=100, db_index=True)
    year = models.IntegerField()
    month = models.IntegerField(choices=MONTH_CHOICE)
    amount = models.FloatField()
    def __str__(self):
        return self.name


class PlanHistory(models.Model):
    name = models.CharField(max_length=100, db_index=True)
    saveTime = models.DateTimeField()
    plname = models.CharField(max_length=100, unique=True)
    year = models.IntegerField()
    month = models.IntegerField(choices=MONTH_CHOICE)
    amount = models.FloatField()
    def __str__(self):
        return self.name


class Project(models.Model):
    name = models.CharField(max_length=50)
    plan = models.ForeignKey(SalesPlan, on_delete=None)
    def __str__(self):
        return self.name


class Price(models.Model):
    year = models.IntegerField()
    month = models.IntegerField(choices=MONTH_CHOICE)
    price = models.FloatField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    def __str__(self):
        return self.price


class ActualResult(models.Model):
    TYPE_CHOICE = (
        (0, u'工数'),
        (1, u'产值'),
        (2, u'计划对应产值'),
    )
    type = models.IntegerField(choices=TYPE_CHOICE)
    project = models.ForeignKey(Project, on_delete=None)
    plan = models.ForeignKey(SalesPlan, on_delete=None)
    year = models.IntegerField()
    month = models.IntegerField(choices=MONTH_CHOICE)
