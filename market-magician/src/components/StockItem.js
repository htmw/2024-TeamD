import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function StockItem({ image: Icon, name, Risk, Buy, icon, ticker, onClick }) {
  return (
        <div className='stockItem' onClick={() => onClick(ticker)}>  {/* Pass ticker to onClick */}
        <h1>{name}</h1>
        <div className='iconWrapper'> 
            {icon ? (
             <FontAwesomeIcon icon={icon} style={{ width: '100px', height: '100px' }} />
            ) : (
                <Icon style={{ width: '100px', height: '100px' }} />
         )}
        </div>
        <h2>{Risk}</h2> 
        <p>{Buy}</p> 
    </div>
  );
}

export default StockItem
