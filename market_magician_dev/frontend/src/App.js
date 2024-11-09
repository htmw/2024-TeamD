import React from "react";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import StockInfo from "./components/StockInfo";
import SpecificStockInfo from "./components/SpecificStockInfo";
import Footer from "./components/Footer";
import Stocks from "./components/Stocks";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import './App.css';


function App() {
  return (
    <div className="App">
      <Header />
      <MainContent />
      <StockInfo />
      <SpecificStockInfo />
      <Home />
      <Login />
      <SignUp />
      <Stocks />
      <Footer />
    </div>
  );
}

export default App;

