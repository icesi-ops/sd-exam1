from django.conf.urls import url
from filesystem import views

urlpatterns = [
    url(r'^file$', views.fileApi),
    url(r'file/([0-9]+)$', views.fileApi)
]
