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
    angenommene_user = serializers.SerializerMethodField()

    def get_angenommene_user(self, obj):
        #ACHTUNG!! falls kein Status mit "Teilnehmen" existiert, wird diees nicht funktionieren!!!
        #  .all()  verwenden um alle anzeigen zu lassen
        return ", ".join([str(i["user__username"]) for i in obj.user_relations.filter(state__description="Teilnehmen").values("user__username")])

    def validate(self, value):
        if (value['start_date'] > value['end_date']) | ((value['start_date'] == value['end_date']) & (value['start_time'] > value['end_time'])):
            raise serializers.ValidationError("Start date/time can not be larger than end date/time.")
        return value

    class Meta:
        model = models.Event
        fields = ['pk', 'name', 'start_date', 'start_time',
                  'end_date', 'end_time', 'active', 'group', 'ev_type', 'angenommene_user']


class GroupSerializer(serializers.ModelSerializer):
    leader = serializers.SerializerMethodField()

    def get_leader(self, obj):
        return ", ".join([str(i["user__username"]) for i in obj.user_relations.filter(is_leader=True).values("user__username")])

    class Meta:
        model = models.Group
        fields = ['pk', 'name', 'leader']


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
