"""
All url mappings for ldtserver (within /api subdir)
e.g. http://.../api/...
"""
from django.conf.urls import url, include
from views import event_detail, event_list, user_detail, user_list

# Includes login URLs for the browsable API.
urlpatterns = [
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^events/$', event_list, name='event_list'),
    url(r'^events/(?P<pk>[0-9]+)/$', event_detail, name='event_detail'),
    url(r'^users/$', user_list, name='user_list'),
    url(r'^users/(?P<pk>[0-9]+)/$', user_detail, name='user_detail'),
]
