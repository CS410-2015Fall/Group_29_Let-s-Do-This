"""
ldt URL Configuration. All url mappings for top-level ldt project
e.g. http://<domain>/<name as below>

:TODO:
- pattern for polls app, when implmented
"""
# New
from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include('ldtserver.urls')),
    url(r'^login/', 'rest_framework_jwt.views.obtain_jwt_token'),
]
