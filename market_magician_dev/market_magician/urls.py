"""
URL configuration for market_magician project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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

from django.contrib import admin
from django.urls import path, include
from django.conf import settings  
from django.conf.urls.static import static 

from rest_framework import routers

from predictions import views

router = routers.DefaultRouter()
# router.register(r'Stock', views.StockView, 'Stock')

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', views.index, name='index'),
    path('add_to_watchlist/', views.add_to_watchlist, name='add_to_watchlist'),
    path('view_watchlist/', views.view_watchlist, name='view_watchlist'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('api/predict/', views.predict_view, name='predict'),
    path('Stock/', views.StockView.as_view()),
    path('api/', include(router.urls)),
    path('search/', views.display_prediction, name="search_results"),
    path('page_test/', views.page_test, name='page_test'),
]

# if debug == True during development we can serve media files
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)