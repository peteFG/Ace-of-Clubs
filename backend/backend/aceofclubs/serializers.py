from rest_framework import serializers
from . import models

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        field = ['pk', 'email', 'first_name', 'last_name', 'active',
                 'permission', 'group', 'event']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Event
        field = ['pk', 'name', 'description', 'start_date', 'start_time',
                 'end_date', 'end_time', 'active', 'group', 'eventType']

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Event
        field = ['pk', 'description']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Group
        field = ['pk', 'name', 'description']

class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EventType
        field = ['pk', 'description']

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.State
        field = ['pk', 'description']
