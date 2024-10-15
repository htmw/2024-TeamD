from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

import pandas as pd
import numpy as np
import yfinance as yf
import tensorflow as tf


# landing page
def index(request):
    data_df = yf.download("GOOG", period='1mo') 
    data_html = data_df.to_html()

    return HttpResponse(data_html)