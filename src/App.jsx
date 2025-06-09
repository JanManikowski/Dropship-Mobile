import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ThankYouPage from './pages/ThankYouPage';
import AddProductPage from './pages/AddProductPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import OfferPage from './pages/OfferPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart/" element={<CartPage />} />
        <Route path="/thankyou" element={<ThankYouPage />} />
        <Route path="/addproduct" element={<AddProductPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/returns" element={<ReturnPolicyPage />} />
        <Route path="/offer" element={<OfferPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;