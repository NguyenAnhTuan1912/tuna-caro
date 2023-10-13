import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import reportWebVitals from './reportWebVitals';

// Import state
import { store } from './state';

// Import App
import App from './App';

// Import styles
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render components
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
