import os

from django.http import HttpResponse
from django.views import View
from rest_framework import viewsets, status
from rest_framework.authentication import BasicAuthentication
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.permissions import DjangoModelPermissions, AllowAny
from rest_framework.views import APIView
from rest_framework.permissions import DjangoModelPermissions, AllowAny, BasePermission
from . import serializers
from . import models
from .models import CsrfExemptSessionAuthentication
from .serializers import UserSerializer


# AdminUserViewset  --> admin should be able to see all users


# class AdminUserViewSet(viewsets.ModelViewSet):
#    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
#    queryset = models.User.objects.all().order_by('username')
#    serializer_class = serializers.AdminUserSerializer
#
#    def list(self, request):
#        userid = request.GET.get("pk")
#        if userid is None:
#            serializer = self.serializer_class(self.queryset.all(), many=True)
#        else:
#            serializer = self.serializer_class(self.queryset.filter(id=userid), many=True)
#        return Response(serializer.data)


# UserViewset --> only gets current user --> not important for common user to see all other users
# now shows all user  because .id do not give correct user back
class CustomPermission(DjangoModelPermissions):

    def has_permission(self, request, view, *args, **kwargs):
        permission = super(CustomPermission, self).has_permission(request, view)
        if request.method == 'POST':
            permission = True
        elif request.user.is_authenticated:
            permission = True
        return permission


class CustomPermissionAdmin(DjangoModelPermissions):

    def has_permission(self, request, view, *args, **kwargs):
        permission = super(CustomPermissionAdmin, self).has_permission(request, view)
        if request.method == 'POST':
            permission = True
        return permission


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all().order_by('pk')
    permission_classes = (CustomPermission,)
    serializer_class = serializers.UserSerializer

    def list(self, request):
        queryset = []
        username = request.GET.get("username")
        search = request.GET.get("search")
        if username is None:
            serializer = self.serializer_class(self.queryset.all(), many=True)
        else:
            serializer = self.serializer_class(self.queryset.filter(username=username), many=True)
        """ zukunftsmusik
        if search is not None:
            queryset = self.queryset.filter(email__contains=search)
            queryset |= self.queryset.filter(username__contains=search)
            queryset |= self.queryset.filter(first_name__contains=search)
            queryset |= self.queryset.filter(last_name__contains=search)"""

        return Response(serializer.data)  # Response(self.serializer_class(queryset, many=True).data)

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
    queryset = models.Event.objects.all().order_by('start_date')
    userGroups = models.UserGroup.objects.all().order_by('user')
    serializer_classUG = serializers.UserGroupSerializer
    serializer_class = serializers.EventSerializer

    """def list(self, request):
        group = request.GET.get("group")
        if group is None:
            serializer = self.serializer_class(self.queryset.all(), many=True)
        else:
            serializer = self.serializer_class(self.queryset.filter(group=group), many=True)
        return Response(serializer.data)"""

    """filter events"""

    def list(self, request):
        queryset = self.queryset
        group = request.GET.get("group")
        ev_type = request.GET.get("evtype")
        sdate = request.GET.get("sdate")
        edate = request.GET.get("edate")
        if group is not None:
            queryset = queryset.filter(group=group)
        if ev_type is not None:
            queryset = queryset.filter(ev_type=ev_type)
        if sdate is not None:
            queryset = queryset.filter(start_date__gte=sdate)
        if edate is not None:
            queryset = queryset.filter(end_date__lte=edate)

        """ first try (it worked, tho!)
        if group is None and ev_type is None:
            serializer = self.serializer_class(self.queryset.all(), many=True)
        elif group is None and ev_type is not None:
            serializer = self.serializer_class(
                self.queryset.filter(ev_type=ev_type, start_date__gte=sdate, end_date__lte=edate), many=True)
        elif group is not None and ev_type is None:
            serializer = self.serializer_class(
                self.queryset.filter(group=group, start_date__gte=sdate, end_date__lte=edate), many=True)
        else:
            serializer = self.serializer_class(
                self.queryset.filter(group=group, ev_type=ev_type, start_date__gte=sdate, end_date__lte=edate),
                many=True)"""
        return Response(self.serializer_class(queryset, many=True).data)

    def create(self, request, *args, **kwargs):
        group = request.data['group'][0]
        # checks if no group was selected
        if group == 0:
            raise NotFound('No Group was selected!')
        serializerCustom = self.serializer_classUG(
            self.userGroups.filter(user=request.user.pk, group=group, is_leader=True), many=True)
        # checks if user has permissions to create the event
        if not request.user.is_staff:
            if not serializerCustom.data:
                raise NotFound('Not enough Permissions')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        instance = models.Event.objects.get(pk=kwargs.get('pk'))
        user = request.user.pk
        group = request.data['group'][0]
        if group == 0:
            raise NotFound('No Group was selected!')
        serializerCustom = self.serializer_classUG(self.userGroups.filter(user=user, group=group, is_leader=True),
                                                   many=True)
        if not request.user.is_staff:
            if not serializerCustom.data:
                raise NotFound('Not enough Permissions')
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class GroupViewSet(viewsets.ModelViewSet):
    permission_classes = (CustomPermissionAdmin,)
    queryset = models.Group.objects.all()
    serializer_class = serializers.GroupSerializer


class EventTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (CustomPermissionAdmin,)
    queryset = models.EventType.objects.all()
    serializer_class = serializers.EventTypeSerializer


class StateViewSet(viewsets.ModelViewSet):
    permission_classes = (CustomPermissionAdmin,)
    queryset = models.State.objects.all()
    serializer_class = serializers.StateSerializer


class UserEventViewSet(viewsets.ModelViewSet):
    permission_classes = (CustomPermissionAdmin,)
    queryset = models.UserEvent.objects.all()
    serializer_class = serializers.UserEventSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request):
        # user = request.GET.get("user")
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
