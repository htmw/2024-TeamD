
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function StockItem({ image: Icon, name, Buy, icon, onClick, prediction }) {
  return (
    <div className='stockItem'>
        <h1>{name}</h1> 
        <div className='iconWrapper'> 
            {icon ? (
             <FontAwesomeIcon 
             icon={icon} 
             style={{ width: '100px', height: '100px', cursor: 'pointer' }} 
             onClick={onClick} //Set onClick directly on the icon
             />
            ) : (
            <Icon 
            style={{ width: '100px', height: '100px', cursor: 'pointer' }}
            onClick={onClick} //Set onClick directly on the icon
            />
         )}
        </div>
        {/* Prediction and Risk Level */}
        <div className="predictionSection">
            <h2>Prediction for {name}:</h2>
            {/* Show the risk level or the placeholder */}
            <p>Risk Level: {prediction.predicted_risk || "Risk Level"}</p>
            {/* Show the price or the placeholder */}
            <p>Predicted Price: ${prediction.Predicted_price || "--"}</p>
        </div> 
    </div>
  );
}

export default StockItem
