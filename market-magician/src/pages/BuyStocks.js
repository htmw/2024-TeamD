import React, {useState } from 'react';
import { StockList } from '../helpers/StockList';
import StockItem from '../components/StockItem';
import axios from 'axios';  // You need to install axios to make HTTP requests

function BuyStocks() {
    /** ####here is the code to manage the selected ticker and pass it to the backend for predictions#####
    const [selectedTicker, setSelectedTicker] = useState(null);  // State to manage selected stock ticker
      const [prediction, setPrediction] = useState(null);  // State to store the prediction

      // Function to handle icon click
      const handleStockClick = (ticker) => {
        setSelectedTicker(ticker);  // Set the selected ticker

        // Call the backend API to get the prediction
        axios.post('http://localhost:8000/api/predict/', { ticker })
          .then(response => {
            setPrediction(response.data);  // Store the prediction data
          })
          .catch(error => {
            console.error("Error fetching prediction", error);
          });
      }; **/
    
  return (
    <div>
        <h1 className='stockTitle'> Stocks Available </h1>
        <div className='stockList'> 
          { StockList.map ((stockItem, key) => {
            return ( 
              <StockItem 
                key={key}
                image={stockItem.image} 
                name={stockItem.name} 
                Risk={stockItem.Risk} 
                Buy={stockItem.Buy} 
                icon={stockItem.icon}
                ticker={stockItem.ticker}  // Pass stock name as the ticker
                onClick={() => handleStockClick(stockItem.ticker)}
              />
             ); 
        })} 
    </div>
    {/* Display the prediction result */}
    {prediction && (
        <div className="predictionResult">
                <h2>Prediction for {selectedTicker}:</h2>
                    <p>Predicted Price: ${prediction.Predicted_price}</p>
                    <p> Risk Classification: {prediction.predicted_risk}</p>
                    )}
  );
}

export default BuyStocks
