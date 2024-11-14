import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Send_ticker from './pages/Send_ticker';
import axios from 'axios';

function App() {
  return (
    <Router>
        <Routes>
            <Route exact path="/" element={<Send_ticker />} />
        </Routes>
    </Router>

  );
}

export default App;
