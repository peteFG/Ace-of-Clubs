from rest_framework import serializers
from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ['pk', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff']


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Media
        fields = ['id', 'file', 'content_type']


class EventSerializer(serializers.ModelSerializer):
    def validate(self, value):
        if (value['start_date'] > value['end_date']) | (value['start_time'] > value['end_time']):
            raise serializers.ValidationError("Start date/time can not be larger than end date/time.")
        return value

    class Meta:
        model = models.Event
        fields = ['pk', 'name', 'start_date', 'start_time',
                  'end_date', 'end_time', 'active', 'group', 'ev_type']


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Group
        fields = ['pk', 'name']


class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EventType
        fields = ['pk', 'description']


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.State
        fields = ['pk', 'description']


class UserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserGroup
        fields = ['pk', 'user', 'group', 'is_leader']


class UserEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserEvent
        fields = ['pk', 'user', 'event', 'state']
