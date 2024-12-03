from django.http import HttpResponse
from django.db.models.query import QuerySet
from django.template import loader

from django.views.generic import ListView
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from django.conf import settings 
from django.db.models import Q

from .serializers import StockSerializer, UserRegistrationSerializer
from .models import Stock, Watchlist, TrainedModel

import os
import yfinance as yf
import numpy as np
import pandas as pd
import datetime as dt

from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error

# import pandas_datareader as pdr
import matplotlib
# matplotlib.use('Agg')
import matplotlib.pyplot as plt
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential, load_model
from keras.layers import LSTM, Dense

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response


# landing page
def index(request):
    return render(request, 'index.html')


def classify_prediction(risk, low_threshold, high_threshold):
    if risk < low_threshold:
        return "Low"
    elif risk > high_threshold:
        return "High"
    else:
        return "Medium"

@api_view(['POST'])
def predict_view(request):
    ticker = request.data.get("ticker", "AAPL")

    # Check if the model exists for the given ticker
    model = load_trained_model(ticker)

    if model is None:
        # If the model is not trained, train it
        start_year = 2010
        start_month = 1
        start_day = 1
        start = dt.date(start_year, start_month, start_day)
        now = dt.datetime.now()

        df = yf.download(ticker, start, now)
        df.ffill(inplace=True)

        scaler = MinMaxScaler(feature_range=(0, 1))
        df_scaled = scaler.fit_transform(df['Close'].values.reshape(-1, 1))

        X, y = [], []
        for i in range(90, len(df_scaled)):
            X.append(df_scaled[i-90:i, 0])
            y.append(df_scaled[i, 0])

        train_size = int(len(X) * 0.8)
        test_size = len(X) - train_size

        X_train, X_test = X[:train_size], X[test_size:]
        y_train, y_test = y[:train_size], y[test_size:]

        X_train, y_train = np.array(X_train), np.array(y_train)
        X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))

        # Create and train the model
        model = Sequential()
        model.add(LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
        model.add(LSTM(units=50, return_sequences=True))
        model.add(LSTM(units=50, return_sequences=False))
        model.add(Dense(1))
        model.compile(optimizer='adam', loss='mean_squared_error')

        model.fit(X_train, y_train, epochs=50, batch_size=25, validation_split=0.2)

        # Save the trained model
        save_trained_model(ticker, model)

        # After model is trained (or loaded), use it to predict the next stock prices
        df = yf.download(ticker, period="3mo", interval="1d")

        if df.empty:
            return Response({"error": f"Data not available for {ticker}."}, status=404)

        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(df['Close'].values.reshape(-1, 1))
        X_latest = np.array([scaled_data[-60:].reshape(60, 1)])
        X_latest = np.reshape(X_latest, (X_latest.shape[0], X_latest.shape[1], 1))

        # Predict the stock price
        predicted_price = model.predict(X_latest)
        predicted_price = scaler.inverse_transform(predicted_price)[0, 0]

        # Calculate risk and classification
        risk = predicted_price
        low_threshold = np.percentile(df['Close'], 33)
        high_threshold = np.percentile(df['Close'], 66)
        predicted_risk = classify_prediction(risk, low_threshold, high_threshold)

        return Response({
            "ticker": ticker,
            "predicted_risk": predicted_risk,
            "classification": predicted_risk,
            "low_threshold": low_threshold,
            "high_threshold": high_threshold
        })
    else:
        # Model already trained, proceed with prediction logic
        df = yf.download(ticker, period="3mo", interval="1d")

        if df.empty:
            return Response({"error": f"Data not available for {ticker}."}, status=404)

        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(df['Close'].values.reshape(-1, 1))
        X_latest = np.array([scaled_data[-60:].reshape(60, 1)])
        X_latest = np.reshape(X_latest, (X_latest.shape[0], X_latest.shape[1], 1))

        # Predict the stock price
        predicted_price = model.predict(X_latest)
        predicted_price = scaler.inverse_transform(predicted_price)[0, 0]

        # Calculate risk and classification
        risk = predicted_price
        low_threshold = np.percentile(df['Close'], 33)
        high_threshold = np.percentile(df['Close'], 66)
        predicted_risk = classify_prediction(risk, low_threshold, high_threshold)

        return Response({
            "ticker": ticker,
            "predicted_risk": predicted_risk,
            "classification": predicted_risk,
            "low_threshold": low_threshold,
            "high_threshold": high_threshold
        })


def save_trained_model(ticker, model):
    # ensure the directory exists
    model_dir = os.path.join(settings.MEDIA_ROOT, "models")
    os.makedirs(model_dir, exist_ok=True)

    # file path to save the model
    model_file_name = f"{ticker}_model.h5"
    model_file_path = os.path.join(model_dir, model_file_name)

    # save the model to the local files at the specified model_file_path
    model.save(model_file_path)

    # get or create the Stock instance
    stock, stock_created = Stock.objects.get_or_create(ticker=ticker)

    # Save the model record to the database
    trained_model, created = TrainedModel.objects.get_or_create(ticker=stock)
    trained_model.model_file.name = f'models/{model_file_name}'
    trained_model.save()  # saves the .name in the line above must be called  to save changes


def load_trained_model(ticker):
    try:
        stock = Stock.objects.get(ticker=ticker)
        trained_model = TrainedModel.objects.get(ticker=stock)
        model_file_path = trained_model.model_file.path
        model = load_model(model_file_path)
        return model
    except (Stock.DoesNotExist, TrainedModel.DoesNotExist, Exception) as e:
        return None

@login_required
def add_to_watchlist(request):
    if request.method == "POST":
        ticker = request.POST.get("ticker").upper()
        # Validate the ticker symbol here need to add API to Yfiniance to check if the ticker is valid other option is to use a list with predefined 
        # tickers this will make the list static and not dynamic like the API approach
        stock, created = Stock.objects.get_or_create(ticker=ticker)
        if created:
            # Fetch and save additional stock data if needed
            stock.company_name = "Company Name Placeholder"
            stock.sector = "Sector Placeholder"
            stock.save()
        # Add the stock to the user's watchlist
        watchlist_entry, created = Watchlist.objects.get_or_create(user=request.user, stock=stock)
        if created:
            messages.success(request, f"{stock.ticker} has been added to your watchlist.")
        else:
            messages.info(request, f"{stock.ticker} is already in your watchlist.")
        return redirect("view_watchlist")
    else:
        return render(request, "add_stock.html")
    

@login_required
def view_watchlist(request):
    watchlist_entries = Watchlist.objects.filter(user=request.user).select_related("stock")
    return render(request, "watchlist.html", {"watchlist_entries": watchlist_entries})
		

class StockView(APIView):
    def get(self, request):
        stocks = Stock.objects.all()
        serializer = StockSerializer(stocks, many=True)
        return Response(serializer.data)
    
    # def post(self,  request):
    #     serializer = StockSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        data = request.data 
        df = pd.read_csv('data/nasdaq_nyse_listing.csv')
        validSet = df[df.columns[0]].to_list()

        if data['ticker'].upper() not in validSet:
            print(f"\nTicker Symbol: \"{data['ticker'].upper()}\" is not valid")
            return Response({"message": "Ticker not found"}, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"\nTicker Symbol: \"{data['ticker'].upper()}\" received successfully")
        # Process the data (e.g., save to database, send email, etc.)
        return Response({"message": "Data received successfully"}, status=status.HTTP_200_OK)

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "User created successfully.",
                    "user": {
                        "username": user.username,
                    }
                },
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# class StockView(viewsets.ModelViewSet):
#     serializer_class = StockSerializer
#     queryset = Stock.objects.all()


# get stock, potentially a non hardcoded way to train stock
def display_prediction(request):
    stock = request.GET.get('stock', 'SPY')

    #Choose the start year, month, and day to begin collecting data from.
    #This directly affects the amount of data the AI can potentially train on
    start_year = 2010
    start_month = 1
    start_day = 1
    start = dt.date(start_year, start_month, start_day)
    now = dt.datetime.now()

    df = yf.download(stock, start, now)

    #preprocess data
    df.isnull().sum()
    df.ffill(inplace=True) 

    #Looks at only Close for predictions
    scaler = MinMaxScaler(feature_range=(0,1))
    df_scaled = scaler.fit_transform(df['Close'].values.reshape(-1,1))
    
    #Chooses sequence length. For now we will use 90 days
    X = []
    y = []

    for i in range(90, len(df_scaled)):
        X.append(df_scaled[i-90:i, 0])
        y.append(df_scaled[i, 0])

    #splittiing the data into training and test sets
    train_size = int(len(X) * 0.8)
    test_size = len(X) - train_size

    X_train, X_test = X[:train_size], X[test_size:]
    y_train, y_test = y[:train_size], y[test_size:]

    X_train, y_train = np.array(X_train), np.array(y_train)
    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))
        

    #creating the model
    model = Sequential()

    # Adding LSTM layers
    model.add(LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
    model.add(LSTM(units=50, return_sequences=True))
    model.add(LSTM(units=50, return_sequences=False))  # Only the last time step

    # Adding a Dense layer to match the output shape with y_train
    model.add(Dense(1))

    # Compiling the model
    model.compile(optimizer='adam', loss='mean_squared_error')

    # Training the model
    history = model.fit(X_train, y_train, epochs=50, batch_size=25, validation_split=0.2)
    
    # Convert X_test and y_test to Numpy arrays if they are not already
    X_test = np.array(X_test)
    y_test = np.array(y_test)

    # Ensure X_test is reshaped similarly to how X_train was reshaped
    # This depends on how you preprocessed the training data
    X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

    # Now evaluate the model on the test data
    test_loss = model.evaluate(X_test, y_test)
    # print("Test Loss: ", test_loss)
    # Making predictions
    y_pred = model.predict(X_test)

    # Calculating MAE and RMSE
    mae = mean_absolute_error(y_test, y_pred)
    rmse = mean_squared_error(y_test, y_pred, squared=False)

    # Fetching the latest 90 days of a stock's data
    data = yf.download(stock, period='3mo', interval='1d')

    # Selecting the 'Close' price and converting to numpy array
    if data.empty:
        pass
    # print(f"Error: Could not fetch data for {stock}. Check the stock symbol.")
    else:
        closing_prices = data['Close'].values
        # Scaling the data
        scaler = MinMaxScaler(feature_range=(0,1))
        scaled_data = scaler.fit_transform(closing_prices.reshape(-1,1))

        #length of Data so we can dynamically call for the data
        data_len = len(scaled_data)

        # Since we need the last 60 days to predict the next day, we reshape the data accordingly
        X_latest = np.array([scaled_data[-data_len:].reshape(data_len)])

        # Reshaping the data for the model (adding batch dimension)
        X_latest = np.reshape(X_latest, (X_latest.shape[0], X_latest.shape[1], 1))

        # Making predictions for the next 4 candles
        predicted_stock_price = model.predict(X_latest)
        predicted_stock_price = scaler.inverse_transform(predicted_stock_price)

        scaler_for_prediction = MinMaxScaler(feature_range=(0, 1))
        scaler_for_prediction.fit(closing_prices.reshape(-1, 1))  # Fit to original closing prices


    # Predict the next 30 days iteratively
    predicted_prices = []
    current_batch = scaled_data[-60:].reshape(1, 60, 1)  # Most recent 60 days

    for i in range(30):  # Predicting 30 days
        next_prediction = model.predict(current_batch)
        next_prediction_reshaped = next_prediction.reshape(1, 1, 1)
        current_batch = np.append(current_batch[:, 1:, :], next_prediction_reshaped, axis=1)
        predicted_prices.append(scaler_for_prediction.inverse_transform(next_prediction)[0, 0])


    #Creating a list of dates for prediction
    last_date = data.index[-1]
    next_day = last_date + pd.Timedelta(days=1)
    prediction_dates = pd.date_range(start=next_day, periods=30)

    # Plotting the actual data
    fig = plt.figure(figsize=(10,6))
    plt.plot(data.index[-90:], data['Close'][-90:], linestyle='-', marker='o', color='blue', label='Actual Data')

    # Plotting the predicted data
    plt.plot(prediction_dates, predicted_prices, linestyle='-', marker='o', color='red', label='Predicted Data')

    plt.title("{stock} Stock Price: Last 60 Days and Next 30 Days Predicted")
    plt.xlabel('Date')
    plt.ylabel('Price')
    plt.legend()
    # plt.show()
    
    from matplotlib.backends.backend_agg import FigureCanvasAgg
    canvas = FigureCanvasAgg(fig)
    response = HttpResponse(content_type='image/png')
    canvas.print_png(response)
    return response


def page_test(request):

    def get_queryset(self):
        query = self.request.get('q')

        return query