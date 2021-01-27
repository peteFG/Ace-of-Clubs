from datetime import timedelta

from django.utils.datetime_safe import datetime
from rest_framework import serializers
from . import models
from .models import Media


class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    group_names = serializers.SerializerMethodField()

    class Meta:
        model = models.User
        fields = ['pk', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'pictures',
                  'password',
                  'password2', 'groups', 'group_names']

    def get_group_names(self, obj):
        return ", ".join([str(i["group__name"]) for i in obj.group_relations.values("group__name")])


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
        user.groups.set(validated_data['groups'])
        user.save()
        userGroup = models.UserGroup(
            user=user,
            is_leader=False
        )
        userGroup.save()
        return user

    def validate_password(self, data):
        if len(data) < 8:
            raise serializers.ValidationError({'password': 'Password is not secure! (At least, 8 Characters!)'})
        return data

    def update(self, instance, validated_data):
        password = validated_data['password']
        password2 = validated_data['password2']
        if not "pbkdf2_sha256$216000$" in password:
            if password != password2:
                raise serializers.ValidationError({'password': 'Passwords do not match!'})
            instance.set_password(validated_data['password'])
        instance.username = validated_data['username']
        instance.first_name = validated_data['first_name']
        instance.last_name = validated_data['last_name']
        instance.email = validated_data['email']
        if instance.pictures.count() > 1:
            raise serializers.ValidationError({'You can have only one picture at time!'})
        instance.pictures.set(validated_data['pictures'])
        instance.is_active = validated_data['is_active']
        instance.is_staff = validated_data['is_staff']
        instance.save()
        return instance


# class AdminUserSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = models.User
#        fields = ['pk', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'pictures',
#                  'password', 'groups']


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ('pk', 'file')


class EventSerializer(serializers.ModelSerializer):
    state_one = serializers.SerializerMethodField()
    state_two = serializers.SerializerMethodField()
    state_three = serializers.SerializerMethodField()
    count_state_one = serializers.SerializerMethodField()
    count_state_two = serializers.SerializerMethodField()
    count_state_three = serializers.SerializerMethodField()
    group_names = serializers.SerializerMethodField()
    event_type_name = serializers.SerializerMethodField()

    def get_count_state_one(self, obj):
        listofstateone = []

        for x in obj.user_relations.filter(state__pk=1).values("user__username"):
            listofstateone.append(x)
        return len(listofstateone)

    def get_count_state_two(self, obj):
        listofstatetwo = []

        for x in obj.user_relations.filter(state__pk=2).values("user__username"):
            listofstatetwo.append(x)
        return len(listofstatetwo)

    def get_count_state_three(self, obj):
        listofstatethree = []

        for x in obj.user_relations.filter(state__pk=3).values("user__username"):
            listofstatethree.append(x)
        return len(listofstatethree)

    def get_state_one(self, obj):

        return ", ".join([str(i["user__username"]) for i in
                          obj.user_relations.filter(state__pk=1).values("user__username")])

    def get_state_two(self, obj):

        return ", ".join([str(i["user__username"]) for i in
                          obj.user_relations.filter(state__pk=2).values("user__username")])

    def get_state_three(self, obj):

        return ", ".join([str(i["user__username"]) for i in
                          obj.user_relations.filter(state__pk=3).values("user__username")])

    """def validate_start_date(self, data):
        if data < datetime.now().date():
            raise serializers.ValidationError(
                "Start date can not be in the past. Unless you are a magician. \n But we all know there is no magic in programming!")
        return data

    def validate_end_date(self, data):
        print(data > datetime.now().date() + timedelta(weeks=5))
        if data > datetime.now().date() + timedelta(weeks=5):
            raise serializers.ValidationError("Please choose a realistic end date! Event can not last longer than 5 weeks!")
        return data"""

    def validate(self, value):
        if (value['start_date'] > value['end_date']) | (
                (value['start_date'] == value['end_date']) & (value['start_time'] > value['end_time'])):
            raise serializers.ValidationError("Start date/time can not be larger than end date/time.")
        return value

    class Meta:
        model = models.Event
        fields = ['pk', 'name', 'start_date', 'start_time',
                  'end_date', 'end_time', 'active', 'group',
                  'group_names', 'ev_type', 'event_type_name',
                  'state_one', 'state_two', 'state_three',
                  'count_state_one', 'count_state_two', 'count_state_three']

    def get_group_names(self, obj):
        listofnames = []
        for x in (obj.group.all()):
            listofnames.append(x.name)
        return listofnames

    def get_event_type_name(self, obj):
        return obj.ev_type.description if obj.ev_type else ""


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
    group_name = serializers.SerializerMethodField()

    class Meta:
        model = models.UserGroup
        fields = ['pk', 'user', 'group', 'is_leader', 'group_name']

    def get_group_name(self, obj):
        return obj.group.name if obj.group else ""


class AllUserGroupSerializer(serializers.ModelSerializer):
    group_name = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = models.UserGroup
        fields = ['pk', 'user', 'group', 'is_leader', 'group_name', 'user_name']

    def get_group_name(self, obj):
        return obj.group.name if obj.group else ""

    def get_user_name(self, obj):
        return obj.user.username if obj.group else ""

    def create(self, validated_data):
        userGroup = models.UserGroup(
            user=self.validated_data['user'],
            group=self.validated_data['group'],
            is_leader=self.validated_data['is_leader'],
        )
        userGroup.save()
        if userGroup.is_leader:
            model = self.validated_data['user']
            user = models.User.objects.get(email=str(model))
            user.groups.set([1])
            user.save()
        return userGroup

    """def update(self, instance, validated_data):
        instance.is_leader = validated_data['is_leader']
        instance.save()
        if instance.is_leader:
            model = self.validated_data['user']
            user = models.User.objects.get(email=str(model))
            user.groups.set(validated_data['groups'])
            user.save()
        return instance"""


class UserEventSerializer(serializers.ModelSerializer):
    # event_name = serializers.SerializerMethodField()
    # user_name = serializers.SerializerMethodField()

    class Meta:
        model = models.UserEvent
        fields = ['pk', 'user', 'event', 'state']

    # def get_event_name(self, obj):
    #    return obj.event.name if obj.event else ""

    # def get_user_name(self, obj):
    #    return obj.user.username if obj.event else ""


class AllUserEventSerializer(serializers.ModelSerializer):
    event_name = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    state_name = serializers.SerializerMethodField()

    class Meta:
        model = models.UserEvent
        fields = ['pk', 'user', 'event', 'state', 'event_name', 'user_name', 'state_name']

    def get_event_name(self, obj):
        return obj.event.name if obj.event else ""

    def get_user_name(self, obj):
        return obj.user.username if obj.event else ""

    def get_state_name(self, obj):
        return obj.state.description if obj.event else ""
