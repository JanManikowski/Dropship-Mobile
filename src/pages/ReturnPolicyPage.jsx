import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ReturnPolicyPage = () => (
  <div className="font-sans">
    <Navbar />
    <div className="container py-5">
      <h1 className="mb-4">Return & Refund Policy</h1>
      <p>If you are not satisfied with your purchase, you can return the product within 30 days for a full refund.</p>
    </div>
    <Footer />
  </div>
);

export default ReturnPolicyPage;
