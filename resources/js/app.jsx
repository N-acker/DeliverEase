import './bootstrap';
import '../css/app.css'; //added
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderForm from "./components/OrderForm";
import CustomerInfoPage from './components/CustomerInfoPage';
import { CheckoutProvider } from './context/CheckoutContext';

function App(){
    return (
       <Router>
          <CheckoutProvider>
            <Routes>
                <Route path="/" element={<OrderForm />}></Route>
                <Route path="/info" element={<CustomerInfoPage />}></Route>
            </Routes>
          </CheckoutProvider>    
       </Router>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
