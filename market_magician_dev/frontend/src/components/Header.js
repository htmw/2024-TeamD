import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  // Check for a stored token on initial load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true); // If token exists, mark the user as authenticated
    }
  }, [setIsAuthenticated]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('auth_token'); // Remove the token
    setIsAuthenticated(false); // Set authentication state to false
    navigate('/login'); // Redirect to login page
  };

  return (
    <header className="header">
      <Link to="/" className="navbar-brand">Market Magician</Link>
      <nav className="nav">
        {/* Always show Home link */}
        <Link to="/" className="nav-link">Home</Link>

        {!isAuthenticated ? (
          // Show Login and Sign Up links if not authenticated
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        ) : (
          // Show Stocks, Search, and Logout links if authenticated
          <>
            <Link to="/buyStocks" className="nav-link">Stocks</Link>
            <Link to="/searchTicker" className="nav-link">Search</Link>
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation
                handleLogout();
              }}
              className="nav-link"
            >
              Logout
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
