from rest_framework import serializers
from .models import Stock

import yfinance as yf
import pandas as pd

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ('ticker', 'company_name', 'sector')

    def validate_ticker(self, value):
        df = pd.read_csv('data/nyse_listed.csv')
        validSet = df[df.columns[0]].to_list()

        if value.upper() not in validSet:
            raise serializers.ValidationError("Error occured")
        return value
    
        # try:
        #     test_info = yf.ticker(value)
        # except:
        #     raise serializers.ValidationError("Error occured")
        # return value