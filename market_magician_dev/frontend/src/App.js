import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
//import StockInfo from "./components/StockInfo";
import Footer from "./components/Footer";
import BuyStocks from "./pages/BuyStocks";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import './App.css';


function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buyStocks" element={<BuyStocks />} /> {/* Route for BuyStocks */}
        <Route path="/components/Login" element={<Login />} />
        <Route path="/components/SignUp" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;

