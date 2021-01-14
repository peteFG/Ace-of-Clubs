import os

from django.http import HttpResponse
from django.views import View
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import DjangoModelPermissions
from . import serializers
from . import models


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all().order_by('pk')
    permission_classes = (DjangoModelPermissions,)
    serializer_class = serializers.UserSerializer

    def list(self, request):
        username = request.GET.get("username")
        if username is None:
            serializer = self.serializer_class(self.queryset.all(), many=True)
        else:
            serializer = self.serializer_class(self.queryset.filter(username=username), many=True)
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
    queryset = models.Event.objects.all().order_by('pk')

    serializer_class = serializers.EventSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = models.Group.objects.all()

    serializer_class = serializers.GroupSerializer


class EventTypeViewSet(viewsets.ModelViewSet):
    queryset = models.EventType.objects.all()

    serializer_class = serializers.EventTypeSerializer


class StateViewSet(viewsets.ModelViewSet):
    queryset = models.State.objects.all()

    serializer_class = serializers.StateSerializer


class UserEventViewSet(viewsets.ModelViewSet):
    queryset = models.UserEvent.objects.all()

    serializer_class = serializers.UserEventSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class UserGroupViewSet(viewsets.ModelViewSet):
    queryset = models.UserGroup.objects.all()

    serializer_class = serializers.UserGroupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
