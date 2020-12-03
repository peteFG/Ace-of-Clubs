from django.db import models


class Permission(models.Model):
    description = models.TextField()

    def __str__(self):
        return self.description


class Group(models.Model):
    name = models.TextField()

    def __str__(self):
        return self.name


class EventType(models.Model):
    description = models.TextField()

    def __str__(self):
        return self.description


class Event(models.Model):
    ev_type = models.ForeignKey(EventType, null=False, on_delete=models.CASCADE)
    name = models.TextField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    start_date = models.DateField()
    end_date = models.DateField()
    active = models.BooleanField()
    group = models.ManyToManyField(Group, blank=True)

    def __str__(self):
        return self.name


class User(models.Model):
    email = models.TextField()
    first_name = models.TextField()
    last_name = models.TextField()
    pwhash = models.TextField()
    active = models.BooleanField()
    permission = models.ForeignKey(Permission, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return self.email


class UserGroup(models.Model):
    user = models.ForeignKey(User, null=False, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, null=False, on_delete=models.CASCADE)
    is_leader = models.BooleanField()

    def __str__(self):
        return self.user + '/' + self.group


class State(models.Model):
    description = models.TextField()

    def __str__(self):
        return self.description


class UserEvent(models.Model):
    user = models.ForeignKey(User, null=False, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, null=False, on_delete=models.CASCADE)
    state = models.ForeignKey(State, null=False, on_delete=models.CASCADE)


    def __str__(self):
        return self.state
