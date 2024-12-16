import { Route, Routes, Navigate, Link } from "react-router-dom"; // Corrected import
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import BuyStocks from "./pages/BuyStocks";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchTicker from "./pages/SearchTicker";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="App">
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Signup setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/buyStocks"
            element={
              isAuthenticated ? (
                <BuyStocks />
              ) : (
                <div>
                  <h2>You need to log in to access this page.</h2>
                  <p>
                    Please <Link to="/login">login</Link> to access the Stocks
                    section.
                  </p>
                </div>
              )
            }
          />
          <Route
            path="/searchTicker"
            element={
              isAuthenticated ? (
                <SearchTicker />
              ) : (
                <div>
                  <h2>You need to log in to access this page.</h2>
                  <p>
                    Please <Link to="/login">login</Link> to use the Search
                    functionality.
                  </p>
                </div>
              )
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
