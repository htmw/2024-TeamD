import React, { useState, useEffect } from 'react';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Utility function to round numbers to two decimal places
const roundToTwo = (value) => {
  return value !== null && !isNaN(value) ? Math.round(value * 100) / 100 : "--";
};

function StockItem({ image: Icon, name, icon, onClick, prediction, currentPrice }) {
  console.log('Prediction:', prediction);  
  console.log("Predicted Price:", prediction?.predicted_price);

  const [predictedPrice, setPredictedPrice] = useState(null);  

  useEffect(() => {
    if (!prediction?.predicted_price) {
      const fetchPrediction = async () => {
        try {
          const response = await fetch(`/api/prediction/${name}/`);
          const data = await response.json();  
          setPredictedPrice(data.predicted_price);  
        } catch (error) {
          console.error('Error fetching predicted price:', error);
        }
      };

      fetchPrediction();  
    } else {
      setPredictedPrice(prediction.predicted_price);  
    }
  }, [name, prediction]);  

  return (
    <div className='stockItem'>
      <h1>{name}</h1> 
      <div className='iconWrapper'> 
        {icon ? (
          <FontAwesomeIcon 
            icon={icon} 
            style={{ width: '100px', height: '100px', cursor: 'pointer' }} 
            onClick={onClick} 
          />
        ) : (
          <Icon 
            style={{ width: '100px', height: '100px', cursor: 'pointer' }}
            onClick={onClick} 
          />
        )}
      </div>

      {/* Prediction and Risk Level */}
      <div className="predictionSection">
        <h2>Prediction for {name}:</h2>
        <p>Risk Level: {prediction?.predicted_risk || "Risk Level"}</p>
        <p>Predicted Price: ${roundToTwo(predictedPrice)}</p> {/* Apply rounding */}
        <p>Current Price: ${roundToTwo(currentPrice)}</p> {/* Apply rounding */}
      </div> 
    </div>
  );
}

export default StockItem;
