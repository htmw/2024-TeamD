from rest_framework import serializers
from .models import Stock
from django.contrib.auth.models import User

# import yfinance as yf
import pandas as pd

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ("ticker", "company_name", "sector")

    def validate_ticker(self, value):
        df = pd.read_csv("data/nyse_listed.csv")
        validSet = df[df.columns[0]].to_list()

        if value.upper() not in validSet:
            raise serializers.ValidationError("Error occured")
        return value
    
        # try:
        #     test_info = yf.ticker(value)
        # except:
        #     raise serializers.ValidationError("Error occured")
        # return value


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )
    password_confirm = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )
    class Meta:
        model = User
        fields = ["username", "password", "password_confirm"]
    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data
    def create(self, validated_data):
        validated_data.pop("password_confirm")
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"]
        )
        return user