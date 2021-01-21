from rest_framework import serializers
from . import models
from .models import Media



class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = models.User
        fields = ['pk', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'pictures',
                  'password',
                  'password2', 'groups']

        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = models.User(
            email=self.validated_data['email'],
            username=self.validated_data['username'],
            first_name=self.validated_data['first_name'],
            last_name=self.validated_data['last_name'],
            is_active=self.validated_data['is_active'],
            is_staff=self.validated_data['is_staff'],
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords do not match!'})
        user.set_password(password)
        user.save()
        user.groups.add(2)
        user.save()

        userGroup = models.UserGroup(
            user=user,
            is_leader=False

        )
        userGroup.save()
        return user

#class AdminUserSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = models.User
#        fields = ['pk', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'pictures',
#                  'password', 'groups']

        extra_kwargs = {
            'password': {'write_only': True}
        }


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('pk', 'file')


class EventSerializer(serializers.ModelSerializer):
    angenommene_user = serializers.SerializerMethodField()

    def get_angenommene_user(self, obj):
        # ACHTUNG!! falls kein Status mit "Teilnehmen" existiert, wird dies nicht funktionieren!!!
        #  .all()  verwenden um alle anzeigen zu lassen
        return ", ".join([str(i["user__username"]) for i in
                          obj.user_relations.filter(state__description="Teilnehmen").values("user__username")])

    def validate(self, value):
        if (value['start_date'] > value['end_date']) | (
                (value['start_date'] == value['end_date']) & (value['start_time'] > value['end_time'])):
            raise serializers.ValidationError("Start date/time can not be larger than end date/time.")
        return value

    class Meta:
        model = models.Event
        fields = ['pk', 'name', 'start_date', 'start_time',
                  'end_date', 'end_time', 'active', 'group', 'ev_type', 'angenommene_user']


class GroupSerializer(serializers.ModelSerializer):
    leader = serializers.SerializerMethodField()

    def get_leader(self, obj):
        return ", ".join(
            [str(i["user__username"]) for i in obj.user_relations.filter(is_leader=True).values("user__username")])

    users_in_group = serializers.SerializerMethodField()

    def get_users_in_group(self, obj):
        return ", ".join([str(i["user__username"]) for i in obj.user_relations.values("user__username")])

    class Meta:
        model = models.Group
        fields = ['pk', 'name', 'leader', 'users_in_group']


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


class AllUserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserGroup
        fields = ['pk', 'user', 'group', 'is_leader']


class UserEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserEvent
        fields = ['pk', 'user', 'event', 'state']


