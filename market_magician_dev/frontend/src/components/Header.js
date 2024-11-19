import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header">
            <Link to="/" className="navbar-brand">Market Magician</Link>
            <nav className="nav">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/buyStocks" className="nav-link">Stocks</Link>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="nav-link">Sign Up</Link>
                <Link to="/searchTicker" className="nav-link">Search</Link>
            </nav>
        </header>
    );
};

export default Header;




