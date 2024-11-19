<<<<<<< HEAD
from django.test import TestCase

# Create your tests here.
=======
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Stock, TrainedModel
from django.conf import settings
from .views import save_trained_model, load_trained_model
import os
import shutil
import tempfile
from unittest import mock
# Create your tests here.

class SaveTrainedModelTest(TestCase):
    def setUp(self):
        self.media_root = tempfile.mkdtemp()
        settings.MEDIA_ROOT = self.media_root
        return super().setUp()
    
    def tearDown(self):
        shutil.rmtree(self.media_root)
        return super().tearDown()
    

    def test_save_trained_model(self):

        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import LSTM, Dense

        # sample model
        model = Sequential()
        model.add(LSTM(10, input_shape=(90, 1)))
        model.add(Dense(1))
        model.compile(optimizer="adam", loss="mean_squared_error")

        
        self.ticker = "TEST"
        save_trained_model(self.ticker, model)

        # Check if the model file exists
        model_path = os.path.join(settings.MEDIA_ROOT, "models", f"{self.ticker}_model.h5")
        self.assertTrue(os.path.exists(model_path))


class LoadTrainedModelTest(TestCase):
    def setUp(self):
        # create temporary directory for media files
        self.media_root = tempfile.mkdtemp()
        settings.MEDIA_ROOT = self.media_root

        # create test model file and models dir
        self.ticker = "TEST"
        model_dir = os.path.join(settings.MEDIA_ROOT, "models")
        os.makedirs(model_dir, exist_ok=True)
        self.model_file_name = f"{self.ticker}_model.h5"
        self.model_file_path = os.path.join(model_dir, self.model_file_name)

        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import LSTM, Dense

        model = Sequential()
        model.add(LSTM(10, input_shape=(90, 1)))
        model.add(Dense(1))
        model.compile(optimizer='adam', loss='mean_squared_error')
        # save model to local files
        model.save(self.model_file_path)

        # create Stock and TrainedModel instances
        stock = Stock.objects.create(ticker=self.ticker)
        TrainedModel.objects.create(
            ticker=stock,
            model_file=f'models/{self.model_file_name}'
        )

    def tearDown(self):
        shutil.rmtree(self.media_root)

    def test_load_trained_model(self):
        # call load_trained_model function
        model = load_trained_model(self.ticker)

        # assert that the model is loaded
        self.assertIsNotNone(model)
        self.assertEqual(model.input_shape, (None, 90, 1))

class UserExistenceTest(TestCase):
    def setUp(self):
        # create test client
        self.client = Client()
        # create a test user
        self.user = User.objects.create_user(username="test_user", password="test_password")

    def test_user_exists(self):
        # check if the user exists in the database
        user_exists = User.objects.filter(username="test_user").exists()
        self.assertTrue(user_exists)

class PredictViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username="testuser", password="test_password")
        # Log in user
        self.client.login(username="test_user", password="test_password")

    def test_display_prediction_view(self):
        # Make a GET request to the predict url
        response = self.client.get(reverse("predict"))
        # Check if the response status code is 200
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.content) > 0)
>>>>>>> origin/integ
