"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import include,path
from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token

from .aceofclubs import views
from .aceofclubs.views import MediaDownloadView

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
#router.register(r'users', views.AdminUserViewSet)
router.register(r'events', views.EventViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'eventTypes', views.EventTypeViewSet)
router.register(r'states', views.StateViewSet)
router.register(r'userEvent', views.UserEventViewSet)
router.register(r'userGroup', views.UserGroupViewSet)
router.register(r'allUserGroups', views.AllUserGroupViewSet)
router.register(r'media', views.MediaViewSet)

urlpatterns = [
    path('media/download/<int:pk>/', MediaDownloadView.as_view()),
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    url(r'^api-token-auth/', obtain_jwt_token)
]
