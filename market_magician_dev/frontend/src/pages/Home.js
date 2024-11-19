import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <main className="main-content">
            <section className="intro">
                <h1>Maginficent Seven Stocks</h1>
                <p>The Magnificent Seven are a group of seven of the most influential companies in the U.S. stock market:</p>
                <p><strong>Alphabet</strong>: The parent company of Google</p>
                <p><strong>Amazon</strong>: A leader in e-commerce and cloud computing</p>
                <p><strong>Apple</strong>: A company with a strong ecosystem of products and services</p>
                <p><strong>Meta</strong>: Formerly known as Facebook</p>
                <p><strong>Microsoft</strong>: A company with a strong ecosystem of products and services</p>
                <p><strong>Nvidia</strong>: A leader in AI chip development</p>
                <p><strong>Tesla</strong>: A leader in electric vehicles</p>

                <p>TEST</p>
                <button className="cta-button">Learn More About The Maginificent Seven Stocks</button>
            </section>

            <section className="stock-info">
                <h2>Top performing stocks of 2023</h2>
                <p>Coinbase</p>
                <p>Nvidia</p>
                <p>DraftKings DKNG</p>
                <p>Meta Platforms META</p>
                <p>Palantir Technologies PLTR</p>
            </section>
        </main>
    );
}

export default Home;