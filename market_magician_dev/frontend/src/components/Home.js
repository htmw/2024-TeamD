import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home">
            <div className="headerContainer">
                <h1> Market Magician </h1>
                <p> Description </p>
                <Link to="/Stocks">
                    <button></button>
                </Link>
            </div>
        </div>
    )
}

export default Home;