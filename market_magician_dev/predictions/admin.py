from django.contrib import admin
from .models import Stock, Watchlist
# Register your models here.

class StockAdmin(admin.ModelAdmin):
    list_display = ('ticker','company_name','sector')


admin.site.register(Stock, StockAdmin)
admin.site.register(Watchlist)

