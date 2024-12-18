import React, { useState } from 'react';
import { StockList } from '../helpers/StockList';
import StockItem from '../components/StockItem';
import axios from 'axios';
import '../App.css';

function BuyStocks() {
  const [predictions, setPredictions] = useState({});
  const [currentPrices, setCurrentPrices] = useState({});  // To store current prices
  const [loading, setLoading] = useState({});  // Track loading state per stock

  // Function to handle icon click
  const handleStockClick = async (ticker) => {
    if (loading[ticker]) return;  // Prevent duplicate clicks during loading

    setLoading((prev) => ({
      ...prev,
      [ticker]: true, // Mark as loading
    }));

    try {
      const response = await axios.post('http://localhost:8000/api/predict/', { ticker });
      console.log("Full Prediction Response Data:", response.data); // Log the entire response to check structure
      // Store both the predicted and current prices
      setPredictions((prev) => ({
        ...prev,
        [ticker]: response.data,
      }));

      // Fetch current price from an API or backend 
      const currentPriceResponse = await axios.get(`http://localhost:8000/api/current-price/${ticker}/`);
      console.log('Current Price Response:', currentPriceResponse.data); // Log the current price response
      setCurrentPrices((prev) => ({
        ...prev,
        [ticker]: currentPriceResponse.data.current_price,
      }));
    } catch (error) {
      console.error("Error fetching prediction", error);
      setPredictions((prev) => ({
        ...prev,
        [ticker]: { Predicted_price: "--", predicted_risk: "Error" },
      }));
      setCurrentPrices((prev) => ({
        ...prev,
        [ticker]: "Error Loading", // Show placeholder for current price on error
      }));
    } finally {
      setLoading((prev) => ({
        ...prev,
        [ticker]: false, // Mark loading as complete
      }));
    }
  };

  return (
    <div>
      <h1 className='stockTitle'> Stocks Available </h1>
      <div className='stockList'>
        {StockList.map((stockItem, key) => (
          <StockItem
            key={key}
            image={stockItem.image}
            name={stockItem.name}
            Buy={stockItem.Buy}
            icon={stockItem.icon}
            ticker={stockItem.ticker}
            onClick={() => handleStockClick(stockItem.ticker)}
            prediction={predictions[stockItem.ticker] || { Predicted_price: "--", predicted_risk: loading[stockItem.ticker] ? "Fetching results..." : "Risk Level" }}
            currentPrice={currentPrices[stockItem.ticker] || "--"}  // Pass current price as a prop
          />
        ))}
      </div>
    </div>
  );
}

export default BuyStocks;
