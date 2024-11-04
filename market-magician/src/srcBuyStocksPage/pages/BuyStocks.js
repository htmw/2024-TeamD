import React from 'react';
import { StockList } from '../helpers/StockList';
import StockItem from '../components/StockItem';

function BuyStocks() {
  return (
    <>{/*<div className="buy-stocks-container">*/}
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
              />
             ); 
        })} 
      </div>
    {/*</div>*/} </>
  );
}

export default BuyStocks
