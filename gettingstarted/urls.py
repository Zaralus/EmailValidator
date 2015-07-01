from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

import hello.views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'gettingstarted.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', hello.views.index, name='index'),
    url(r'^db', hello.views.db, name='db'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^isvalidemail/', hello.views.isvalidemail, name='isvalidemail')
    url(r'^bulkprocess/', hello.views.bulkprocess, name='bulkprocess')
    url(r'^singleprocess/', hello.views.singleprocess, name='singleprocess')

)
