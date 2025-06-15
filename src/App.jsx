import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ThankYouPage from './pages/ThankYouPage';
import AddProductPage from './pages/AddProductPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import ManageProducts from './pages/ManageProducts';
import AdminLogin from './pages/AdminLogin';
import CheckoutPage from './pages/CheckoutPage';
import ProductsPage from './pages/ProductsPage';
import EditProductPage from './pages/EditProductPage';
import PaymentMethodPage from './pages/PaymentMethodPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/thankyou" element={<ThankYouPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/returns" element={<ReturnPolicyPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/payment-method" element={<PaymentMethodPage />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/add" element={<AddProductPage />} />
        <Route path="/admin/manage" element={<ManageProducts />} />
        <Route path="/admin/edit/:id" element={<EditProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;
