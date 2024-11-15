import React from 'react';
import { createRoot } from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'; //Import Provider
import './index.css';
import App from './App';
import store from './store'; // Import the Redux store

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap with Provider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

