import React, { useState } from 'react';
import Logo from "../assets/logo.jpg";
import { Link } from "react-router-dom";
import ReorderIcon from '@mui/icons-material/Reorder';
import "../styles/Navbar.css";

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };

  return (
    <div className="Navbar">
      <div className="leftSide" id={openLinks ? "open" : "close"}>
        <img src= {Logo} alt="App logo" />
        <div className="hiddenLinks">
          <Link to="/"> Home </Link>
          <Link to="/buyStocks"> Buy Stocks </Link>
          <Link to="/logIn"> Log In </Link>
          </div>
      </div> 
  
      <div className="rightSide">
        <Link to="/">Home</Link>
        <Link to="/BuyStocks">Buy Stocks</Link>
        <Link to="/logIn">Log In</Link>
        <button onClick={toggleNavbar}>
          <ReorderIcon />
        </button>
      </div>
    </div> 
  );
}

export default Navbar;
