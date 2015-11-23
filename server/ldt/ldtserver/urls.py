"""
All url mappings for ldtserver (within /api subdir)
e.g. http://.../api/...
"""
from django.conf.urls import url, include
from views.event import event_detail, event_list, event_hosts_remove, event_changed_remove, event_invites_remove
from views.poll import poll_list, poll_detail, poll_choice_vote
from views.shoppinglistitem import shoppinglistitem_detail, shoppinglistitem_list
from views.shoppinglist import shoppinglist_put, shoppinglist_delete
from views.user import user_detail, user_new, user_list, user_events, user_search, user_friends_remove
from views.comment import comment_list, comment_detail

# Includes login URLs for the browsable API.
urlpatterns = [
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    url(r'^events/$', event_list, name='event_list'),
    url(r'^events/(?P<pk>[0-9]+)/$', event_detail, name='event_detail'),
    url(r'^events/(?P<pk>[0-9]+)/comments/$', comment_list, name='comment_list'),
    url(r'^events/(?P<pk>[0-9]+)/comments/(?P<comment_id>[0-9]+)/$', comment_detail, name='comment_detail'),

    url(r'^events/(?P<pk>[0-9]+)/hosts/remove/$', event_hosts_remove, name='event_hosts_remove'),
    url(r'^events/(?P<pk>[0-9]+)/changed/remove/$', event_changed_remove, name='event_changed_remove'),
    url(r'^events/(?P<pk>[0-9]+)/invites/remove/$', event_invites_remove, name='event_invites_remove'),

    url(r'^events/(?P<pk>[0-9]+)/polls/$', poll_list, name='poll_list'),
    url(r'^events/(?P<pk>[0-9]+)/polls/(?P<poll_id>[0-9]+)/$', poll_detail, name='poll_detail'),
    url(r'^events/(?P<pk>[0-9]+)/polls/(?P<poll_id>[0-9]+)/vote/$', poll_choice_vote, name='poll_choice_vote'),

    url(r'^events/(?P<pk>[0-9]+)/shoppinglist/$', shoppinglistitem_list, name='shoppinglistitem_list'),
    url(r'^events/(?P<pk>[0-9]+)/shoppinglist/(?P<item_id>[0-9]+)/$', shoppinglistitem_detail, name='shoppinglistitem_detail'),
    url(r'^events/(?P<pk>[0-9]+)/shoppinglist/edit/', shoppinglist_put, name='shoppinglist_put'),
    url(r'^events/(?P<pk>[0-9]+)/shoppinglist/remove/', shoppinglist_delete, name='shoppinglist_delete'),

    url(r'^users/new/$', user_new, name='user_new'),
    url(r'^users/$', user_list, name='user_list'),
    url(r'^users/search/$', user_search, name='user_search'),
    url(r'^users/(?P<pk>[0-9]+)/$', user_detail, name='user_detail'),
    url(r'^users/(?P<pk>[0-9]+)/events/$', user_events, name='user_events'),
    url(r'^users/(?P<pk>[0-9]+)/friends/remove/$', user_friends_remove, name='user_friends_remove'),
]
