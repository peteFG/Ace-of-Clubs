from rest_framework import viewsets
from rest_framework.response import Response
from . import serializers
from . import models


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all().order_by('pk')

    serializer_class = serializers.UserSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = models.Event.objects.all().order_by('pk')

    serializer_class = serializers.EventSerializer

class PermissionViewSet(viewsets.ModelViewSet):
    queryset = models.Permission.objects.all()

    serializer_class = serializers.PermissionSerializer

class GroupViewSet(viewsets.ModelViewSet):
    queryset = models.Group.objects.all()

    serializer_class = serializers.GroupSerializer

class EventTypeViewSet(viewsets.ModelViewSet):
    queryset = models.EventType.objects.all()

    serializer_class = serializers.EventTypeSerializer

class StateViewSet(viewsets.ModelViewSet):
    queryset = models.State.objects.all()

    serializer_class = serializers.StateSerializer
