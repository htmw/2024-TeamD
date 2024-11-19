import React, { useState } from "react";

const SearchTicker = () => {

  const [formData, setFormData] = useState({
    ticker: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:8000/Stock/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(formData => console.log(formData));
  };

  return (
    <div className="search-form">
      <h2>Search</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Stock Ticker:
          <input 
            type='text' 
            name='ticker' 
            value={formData.ticker}
            onChange={handleChange}
          />
        </label>
        <button type='submit'>Submit</button>

      </form>
      <br />
      <br />
    </div>
    
  );
}

export default SearchTicker;
