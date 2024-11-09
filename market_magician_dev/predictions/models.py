from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Stock(models.Model):
    ticker = models.CharField(max_length=10, primary_key=True)
    company_name = models.CharField(max_length=100)
    sector = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.ticker} - {self.company_name}"

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='watchlisted_by')
    added_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "stock")

    def __str__(self):
        return f"{self.user.username} watches {self.stock.ticker}"