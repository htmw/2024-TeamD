from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Stock(models.Model):
    ticker = models.CharField(max_length=10, primary_key=True)
    company_name = models.CharField(max_length=100, blank=True)
    sector = models.CharField(max_length=50, blank=True)

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

class TrainedModel(models.Model):
    ticker = models.OneToOneField(Stock, on_delete=models.CASCADE)
    model_file = models.FileField(upload_to="models/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Model for {self.ticker.ticker}"