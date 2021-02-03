import os

from django.http import HttpResponse
from django.views import View
from rest_framework import viewsets, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.permissions import DjangoModelPermissions
from . import serializers
from . import models


class CustomPermission(DjangoModelPermissions):

    def has_permission(self, request, view, *args, **kwargs):
        permission = super(CustomPermission, self).has_permission(request, view)
        if request.method == 'POST':
            permission = True
        elif request.user.is_authenticated:
            permission = True
        elif request.method == 'GET':
            permission = True
        return permission


class CustomPermissionAdmin(DjangoModelPermissions):

    def has_permission(self, request, view, *args, **kwargs):
        permission = super(CustomPermissionAdmin, self).has_permission(request, view)
        if request.method == 'POST':
            permission = True
        return permission


class AllUserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all().order_by('pk')
    permission_classes = (CustomPermission,)
    serializer_class = serializers.UserSerializer

    def list(self, request):
        search = request.GET.get("search")
        queryset = self.queryset.all()
        if search is not None:
            queryset = self.queryset.filter(email__contains=search)
            queryset |= self.queryset.filter(username__contains=search)
            queryset |= self.queryset.filter(first_name__contains=search)
            queryset |= self.queryset.filter(last_name__contains=search)
        return Response(self.serializer_class(queryset, many=True).data)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise NotFound("Not enough Permissions")
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all().order_by('pk')
    permission_classes = (CustomPermission,)
    serializer_class = serializers.UserSerializer

    def list(self, request):
        user = request.user.pk
        if user is None:
            serializer = self.serializer_class(self.queryset.all(), many=True)
        else:
            serializer = self.serializer_class(self.queryset.filter(pk=user), many=True)
        return Response(serializer.data)

    # holt user der im backend angemeldet ist
    def partial_update(self, request, *args, **kwargs):
        instance = models.User.objects.get(pk=kwargs.get('pk'))
        # checks permissions of current user
        if not request.user.is_staff:
            if request.user.pk != int(kwargs.get('pk')):
                raise NotFound('Not enough Permissions')
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class MediaViewSet(viewsets.ModelViewSet):
    queryset = models.Media.objects.all()
    serializer_class = serializers.MediaSerializer

    def pre_save(self, obj):
        obj.file = self.request.FILES.get('file')


class MediaDownloadView(View):

    def get(self, request, pk):
        media = models.Media.objects.get(pk=pk)
        content_type = media.content_type
        response = HttpResponse(media.file.file, content_type=content_type)
        original_file_name = os.path.basename(media.file.name)
        response['Content-Disposition'] = 'inline;filename=' + original_file_name
        return response


class EventViewSet(viewsets.ModelViewSet):
    permission_classes = (CustomPermission,)
    queryset = models.Event.objects.all().order_by('start_date')
    userGroups = models.UserGroup.objects.all()
    serializer_classUG = serializers.UserGroupSerializer
    serializer_class = serializers.EventSerializer

    def list(self, request):
        if request.user.pk is None:
            raise NotFound('No User ID found!')
        group = request.GET.get("group")
        ev_type = request.GET.get("evtype")
        sdate = request.GET.get("sdate")
        edate = request.GET.get("edate")
        search = request.GET.get("search")
        null = 'null'
        groupsOfUser = models.UserGroup.objects.filter(user=request.user.pk).values_list('group_id', flat=True)
        queryset = self.queryset.filter(group__in=groupsOfUser)
        if search is not None and search != null:
            queryset = queryset.filter(name__contains=search)
        if group is not None and group != null:
            queryset = queryset.filter(group=int(group))
        if ev_type is not None and ev_type != null:
            queryset = queryset.filter(ev_type=int(ev_type))
        if sdate is not None and sdate != null:
            queryset = queryset.filter(start_date__gte=sdate)
        if edate is not None and edate != null:
            queryset = queryset.filter(end_date__lte=edate)
        return Response(self.serializer_class(list(dict.fromkeys(queryset)), context= {'request': self.request},  many=True).data)

    def create(self, request, *args, **kwargs):
        group = request.data['group']
        # checks if no group was selected
        if group == 0:
            raise NotFound('No Group was selected!')
        groupsOfUserLeader = models.UserGroup.objects.filter(user=request.user.pk, group__in=group, is_leader=True).values_list('group_id', flat=True)
        # checks if user has permissions to create the event
        if not request.user.is_staff:
            if not groupsOfUserLeader:
                raise NotFound('Not enough Permissions')
        serializer = self.get_serializer(data=request.data, context= {'request': self.request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        instance = models.Event.objects.get(pk=kwargs.get('pk'))
        user = request.user.pk
        group = request.data['group']
        if group == 0:
            raise NotFound('No Group was selected!')
        groupsOfUserLeader = models.UserGroup.objects.filter(user=user, group__in=group, is_leader=True).values_list('group_id', flat=True)
        eventsOfUser = self.queryset.filter(group__in=groupsOfUserLeader).values_list('pk', flat=True)
        if not request.user.is_staff:
            if not instance.pk in eventsOfUser:
                raise NotFound('Not enough Permissions')
        serializer = self.serializer_class(instance, data=request.data, context= {'request': self.request}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class NewEventsViewSet(viewsets.ModelViewSet):
    queryset = models.Event.objects.all()
    permission_classes = (CustomPermissionAdmin,)
    serializer_class = serializers.EventSerializer

    def list(self, request):
        groupsOfUser = models.UserGroup.objects.filter(user=request.user.pk).values_list('group_id', flat=True)
        evetnsOfUser = models.UserEvent.objects.filter(user=request.user.pk).values_list('event_id', flat=True)
        allEventsOfUser = models.Event.objects.filter(group__in=groupsOfUser).values_list('pk', flat=True)
        difference = set(allEventsOfUser).difference(set(evetnsOfUser))
        queryset = self.queryset.filter(pk__in=difference)
        group = request.GET.get("group")
        ev_type = request.GET.get("evtype")
        sdate = request.GET.get("sdate")
        edate = request.GET.get("edate")
        search = request.GET.get("search")
        null = 'null'
        if search is not None and search != null:
            queryset = queryset.filter(name__contains=search)
        if group is not None and group != null:
            queryset = queryset.filter(group=int(group))
        if ev_type is not None and ev_type != null:
            queryset = queryset.filter(ev_type=int(ev_type))
        if sdate is not None and sdate != null:
            queryset = queryset.filter(start_date__gte=sdate)
        if edate is not None and edate != null:
            queryset = queryset.filter(end_date__lte=edate)
        return Response(self.serializer_class(list(dict.fromkeys(queryset)),context= {'request': self.request}, many=True).data)


class AllEventsViewSet(viewsets.ModelViewSet):
    queryset = models.Event.objects.all()
    serializer_class = serializers.EventSerializer
    fields = ['pk', 'name', 'start_date', 'start_time',
              'end_date', 'end_time', 'active', '-pk',
              '-name', '-start_date', '-start_time',
              '-end_date', '-end_time', '-active',
              'group', '-group', 'ev_type', '-ev_type']

    def list(self, request):
        if not request.user.is_staff:
            raise NotFound('You are not allowed to see this page')
        group = request.GET.get("group")
        ev_type = request.GET.get("evtype")
        sdate = request.GET.get("sdate")
        edate = request.GET.get("edate")
        search = request.GET.get("search")
        sort = request.GET.get("sort")
        null = 'null'
        queryset = self.queryset
        fields = self.fields
        if fields.__contains__(sort):
            queryset = queryset.order_by(sort)
        if search is not None and search != null:
            queryset = queryset.filter(name__contains=search)
        if group is not None and group != null:
            queryset = queryset.filter(group=int(group))
        if ev_type is not None and ev_type != null:
            queryset = queryset.filter(ev_type=int(ev_type))
        if sdate is not None and sdate != null:
            queryset = queryset.filter(start_date__gte=sdate)
        if edate is not None and edate != null:
            queryset = queryset.filter(end_date__lte=edate)
        return Response(self.serializer_class(list(dict.fromkeys(queryset)), context= {'request': self.request},many=True).data)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise NotFound("Not enough Permissions")
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class LeaderEventsViewSet(viewsets.ModelViewSet):
    queryset = models.Event.objects.all()
    serializer_class = serializers.EventSerializer


    def list(self, request):
        user = request.user.pk
        groupsOfLeader= models.UserGroup.objects.filter(user = user, is_leader = True).values_list('group_id', flat=True)
        eventsOfLeader = self.queryset.filter(group__in=groupsOfLeader).values_list('pk', flat=True)
        queryset = self.queryset.filter(pk__in = eventsOfLeader)
        return Response(self.serializer_class(list(dict.fromkeys(queryset)), context= {'request': self.request},many=True).data)


class GroupViewSet(viewsets.ModelViewSet):
    permission_classes = (CustomPermissionAdmin,)
    queryset = models.Group.objects.all()
    serializer_class = serializers.GroupSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = models.Group.objects.get(pk=kwargs.get('pk'))
        # checks permissions of current user
        if not request.user.is_staff:
            raise NotFound('Not enough Permissions')
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise NotFound("Not enough Permissions")
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class EventTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (CustomPermissionAdmin,)
    queryset = models.EventType.objects.all()
    serializer_class = serializers.EventTypeSerializer

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise NotFound("Not enough Permissions")
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class StateViewSet(viewsets.ModelViewSet):
    permission_classes = (CustomPermissionAdmin,)
    queryset = models.State.objects.all()
    serializer_class = serializers.StateSerializer


class UserEventViewSet(viewsets.ModelViewSet):
    permission_classes = (CustomPermission,)
    queryset = models.UserEvent.objects.all()
    serializer_class = serializers.UserEventSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request):
        user = request.user.pk
        if user is None:
            serializer = self.serializer_class(self.queryset.all(), many=True)
        else:
            serializer = self.serializer_class(self.queryset.filter(user=user, ), many=True)
        return Response(serializer.data)



class AllUserEventViewSet(viewsets.ModelViewSet):
    permission_classes = (CustomPermissionAdmin,)
    queryset = models.UserEvent.objects.all().order_by('user')
    serializer_class = serializers.AllUserEventSerializer

    def list(self, request):
        user = request.GET.get("user")
        if user is None:
            serializer = self.serializer_class(self.queryset.all(), many=True)
        else:
            serializer = self.serializer_class(self.queryset.filter(user=user), many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise NotFound("Not enough Permissions")
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserGroupViewSet(viewsets.ModelViewSet):
    permission_classes = (CustomPermissionAdmin,)
    queryset = models.UserGroup.objects.all().order_by('user')
    serializer_class = serializers.UserGroupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request):
        user = request.user.pk
        leader = request.GET.get("leader")
        if user is None and leader is None:
            serializer = self.serializer_class(self.queryset.all(), many=True)
        elif leader:
            serializer = self.serializer_class(self.queryset.filter(user=user, is_leader=True), many=True)
        else:
            serializer = self.serializer_class(self.queryset.filter(user=user), many=True)
        return Response(serializer.data)


class AllUserGroupViewSet(viewsets.ModelViewSet):
    # persmissions create/update
    permission_classes = (CustomPermissionAdmin,)
    queryset = models.UserGroup.objects.all().order_by('user')
    serializer_class = serializers.AllUserGroupSerializer

    def list(self, request):
        user = request.GET.get("user")
        if user is None:
            serializer = self.serializer_class(self.queryset.all(), many=True)
        else:
            serializer = self.serializer_class(self.queryset.filter(user=user), many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise NotFound("Not enough Permissions")
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
