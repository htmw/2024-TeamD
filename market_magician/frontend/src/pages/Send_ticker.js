import React, { useState } from "react";
import axios from 'axios';

const Send_ticker = () => {
  // const [formData, setFormData] = useState('');

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   // Send data to Django view (see step 2)
  //   fetch('/api/save_text/', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ text }),
  //   })
  //   .then(response => {
  //     // Handle response from Django view
  //   })
  //   .catch(error => {
  //     // Handle error
  //   });
  // };

  // return (
  //   <form onSubmit={handleSubmit}>
  //     <label>
  //       Stock Ticker: 
  //       <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
  //     </label>    
  //     <button type="submit">Submit</button>
  //   </form>

   // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //       const response = await axios.post('http://localhost:8000/api/Stock/', formData);
  //       console.log('Data submitted:', response.data);
  //   } catch (error) {
  //       console.error('Error submitting data:', error);
  //   }
  // };

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleChange = (event) => {
  //   const {name, value} = event.target;
  //   setFormData((prevState) => ({ ...prevState, [name]:value}));
  // };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(formData);
  // };

  const [formData, setFormData] = useState({
    ticker: "",
    // company_name: "",
    // sector: "",
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

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   axios.post('http://localhost:8000/Stock/', formData)
  //     .then(response => {
  //       console.log(response);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // };

  return (
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
      <br />
      {/* <label>
        Company Name:
        <input 
          type='text' 
          name='company_name' 
          value={formData.company_name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Stock Ticker:
        <input 
          type='text' 
          name='sector' 
          value={formData.sector}
          onChange={handleChange}
        />
      </label> */}

      <button type='submit'>Submit</button>
    </form>




    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    
  );
}

export default Send_ticker;
