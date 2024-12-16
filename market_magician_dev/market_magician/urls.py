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
from predictions.views import SignupView 

# Define the router
router = routers.DefaultRouter()

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', views.index, name='index'),
    path('api/watchlist/', views.AddToWatchlistView.as_view(), name='add_to_watchlist'),
    path('api/watchlist/', views.ViewWatchlistView.as_view(), name='view_watchlist'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path('api/logout/', views.LogoutView.as_view(), name='logout'),
    path('api/stocks/', views.StockView.as_view(), name='stock-list'),
    path('api/predict/', views.predict_view, name='predict'),
    path('api/', include(router.urls)),  # Include registered router URLs
    path('search/', views.display_prediction, name="search_results"),
    path('page_test/', views.page_test, name='page_test'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('api/current-price/<str:ticker>/', views.get_current_price, name='get_current_price'),
    path('api/predict/', views.predict_view, name='predict_view'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
