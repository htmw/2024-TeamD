from django.http import HttpResponse

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Stock, Watchlist, TrainedModel
from django.contrib import messages
import os
from django.conf import settings 

import yfinance as yf
import numpy as np
import pandas as pd
import datetime as dt

from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error

# import pandas_datareader as pdr
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential, load_model
from keras.layers import LSTM, Dense

from rest_framework.decorators import api_view
from rest_framework.response import Response

# landing page
def index(request):
    return render(request, 'index.html')


def page_test(request):
    # Input ticker from frontend (this can be dynamic from a form or URL param)
    stock = request.GET.get('ticker', 'AAPL')  # You can use a GET or POST method to pass the ticker

    # Check if the model is already trained
    model = load_trained_model(stock)
    
    if model is None:
        # If model does not exist, train it
        start_year = 2010
        start_month = 1
        start_day = 1
        start = dt.date(start_year, start_month, start_day)
        now = dt.datetime.now()

        df = yf.download(stock, start, now)
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
        save_trained_model(stock, model)

    # After model is trained (or loaded), use it to predict the next stock prices
    data = yf.download(stock, period='3mo', interval='1d')

    # Scale and prepare the data for prediction
    if data.empty:
        pass  # Handle error as needed
    else:
        closing_prices = data['Close'].values
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(closing_prices.reshape(-1, 1))

        X_latest = np.array([scaled_data[-60:].reshape(60)])
        X_latest = np.reshape(X_latest, (X_latest.shape[0], X_latest.shape[1], 1))

        # Making predictions
        predicted_stock_price = model.predict(X_latest)
        predicted_stock_price = scaler.inverse_transform(predicted_stock_price)

        # For next 30 days prediction
        predicted_prices = []
        current_batch = scaled_data[-60:].reshape(1, 60, 1)
        for _ in range(30):
            next_prediction = model.predict(current_batch)
            next_prediction_reshaped = next_prediction.reshape(1, 1, 1)
            current_batch = np.append(current_batch[:, 1:, :], next_prediction_reshaped, axis=1)
            predicted_prices.append(scaler.inverse_transform(next_prediction)[0, 0])

    # Plotting the results
    fig = plt.figure(figsize=(10, 6))
    plt.plot(data.index[-90:], data['Close'][-90:], linestyle='-', marker='o', color='blue', label='Actual Data')
    prediction_dates = pd.date_range(start=data.index[-1] + pd.Timedelta(days=1), periods=30)
    plt.plot(prediction_dates, predicted_prices, linestyle='-', marker='o', color='red', label='Predicted Data')
    plt.title(f"{stock} Stock Price: Last 60 Days and Next 30 Days Predicted")
    plt.xlabel('Date')
    plt.ylabel('Price')
    plt.legend()

    from matplotlib.backends.backend_agg import FigureCanvasAgg
    canvas = FigureCanvasAgg(fig)
    response = HttpResponse(content_type='image/png')
    canvas.print_png(response)
    return response


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