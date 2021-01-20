from django.contrib.auth.models import AbstractUser
from django.db import models


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
    active = models.BooleanField(default=True)
    group = models.ManyToManyField(Group, blank=True, default=1)

    def __str__(self):
        return self.name


class Media(models.Model):
    file = models.FileField(upload_to='uploads/%Y-%m-%d-%H-%M-%S/', null=True)
    content_type = models.TextField()
    #null=True, blank=True, max_length=100

    def save(self, *args, **kwargs):
        self.content_type = self.file.file.content_type
        super().save(*args, **kwargs)


class User(AbstractUser):
    pictures = models.ManyToManyField('Media', blank=True)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.email


class UserGroup(models.Model):
    user = models.ForeignKey(User, null=False, on_delete=models.CASCADE, related_name="group_relations")
    group = models.ForeignKey(Group, null=False, on_delete=models.CASCADE, default=1, related_name="user_relations")
    is_leader = models.BooleanField(default=False)

    class Meta:
        unique_together = (("user", "group"),)

    def __str__(self):
        return self.user + '/' + self.group


class State(models.Model):
    description = models.TextField()

    def __str__(self):
        return self.description


class UserEvent(models.Model):
    user = models.ForeignKey(User, null=False, on_delete=models.CASCADE, related_name="event_relations")
    event = models.ForeignKey(Event, null=False, on_delete=models.CASCADE, related_name="user_relations")
    state = models.ForeignKey(State, null=False, on_delete=models.CASCADE, default=1)

    class Meta:
        unique_together = (("user", "event"),)

    def __str__(self):
        return self.state
