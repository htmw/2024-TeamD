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
#router.register(r'stocks', views.StockView, basename='stock')
#router.register(r'predict', views.predict_view, basename='predict')

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', views.index, name='index'),
    path('api/watchlist/', views.AddToWatchlistView.as_view(), name='add_to_watchlist'),
    path('api/watchlist/', views.ViewWatchlistView.as_view(), name='view_watchlist'),
    # path('add_to_watchlist/', views.add_to_watchlist, name='add_to_watchlist'),
    # path('view_watchlist/', views.view_watchlist, name='view_watchlist'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path('api/logout/', views.LogoutView.as_view(), name='logout'),
    path('api/stocks/', views.StockView.as_view(), name='stock-list'),		
    path('accounts/', include('django.contrib.auth.urls')),
    path('api/predict/', views.predict_view, name='predict'),
    path('Stock/', views.StockView.as_view()),
    path('api/register/', views.UserRegistrationView.as_view(), name="user-registration"),
    path('api/', include(router.urls)),
    path('search/', views.display_prediction, name="search_results"),
    path('search/', views.display_prediction, name="start_year"),
    path('search/', views.display_prediction, name="start_month"),
    path('search/', views.display_prediction, name="start_day"),
    path('page_test/', views.page_test, name='page_test'),
    path('signup/', SignupView.as_view(), name='signup'),		
    path('api/current-price/<str:ticker>/', views.get_current_price, name='get_current_price'),

]

# if debug == True during development we can serve media files
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)