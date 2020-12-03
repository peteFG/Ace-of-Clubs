from django.db import models


class Permission(models.Model):
    description = models.TextField()

    def __str__(self):
        return self.description


class Group(models.Model):
    name = models.TextField()
    description = models.TextField()

    def __str__(self):
        return self.name


class EventType(models.Model):
    description = models.TextField()

    def __str__(self):
        return self.description


class User(models.Model):
    email = models.TextField()
    first_name = models.TextField()
    last_name = models.TextField()
    pwhash = models.TextField()
    active = models.BooleanField()
    permission = models.ForeignKey(Permission, null=False, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.first_name + ' ' + self.last_name


class Event(models.Model):
    name = models.TextField()
    description = models.TextField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    start_date = models.DateField()
    end_date = models.DateField()
    active = models.BooleanField()
    group = models.ManyToManyField(Group, blank=False)
    eventType = models.ManyToManyField(EventType, blank=False)
    participants = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return self.name


class State(models.Model):
    description = models.TextField()

    def __str__(self):
        return self.description
#TODO: Foreign key with state
