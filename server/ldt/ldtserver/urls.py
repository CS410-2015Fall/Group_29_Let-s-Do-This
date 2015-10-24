"""
All url mappings for ldtserver (within /api subdir)
e.g. http://.../api/...
"""
from django.conf.urls import url, include
from views.event import event_detail, event_list, event_hosts_remove
from views.user import user_detail, user_list, user_events, user_search, user_friends_remove
    # user_hosting, user_invited, user_attending, user_declined

# Includes login URLs for the browsable API.
urlpatterns = [
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    url(r'^events/$', event_list, name='event_list'),
    url(r'^events/(?P<pk>[0-9]+)/$', event_detail, name='event_detail'),
    url(r'^events/(?P<pk>[0-9]+)/hosts/remove/$', event_hosts_remove, name='event_hosts_remove'),

    url(r'^users/$', user_list, name='user_list'),
    url(r'^users/search/$', user_search, name='user_search'),
    url(r'^users/(?P<pk>[0-9]+)/$', user_detail, name='user_detail'),
    url(r'^users/(?P<pk>[0-9]+)/events/$', user_events, name='user_events'),
    url(r'^users/(?P<pk>[0-9]+)/friends/remove/$', user_friends_remove, name='user_friends_remove'),

    # url(r'^users/(?P<pk>[0-9]+)/hosting/$', user_hosting, name='user_hosting'),
    # url(r'^users/(?P<pk>[0-9]+)/invited/$', user_invited, name='user_invited'),
    # url(r'^users/(?P<pk>[0-9]+)/attending/$', user_attending, name='user_attending'),
    # url(r'^users/(?P<pk>[0-9]+)/declined/$', user_declined, name='user_declined'),
]
