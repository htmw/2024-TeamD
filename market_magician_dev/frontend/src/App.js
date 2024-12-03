import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import BuyStocks from './pages/BuyStocks';
import SearchTicker from './pages/SearchTicker';

import './App.css';


function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buyStocks" element={<BuyStocks />} /> {/* Route for BuyStocks */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/searchTicker" element={<SearchTicker />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

