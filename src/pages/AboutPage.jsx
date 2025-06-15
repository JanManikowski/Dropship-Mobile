import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => (
  <div className="font-sans">
    <Navbar />
    <div className="container py-5">
      <h1 className="mb-4">About Us</h1>
      <p>We are passionate about offering unique gifts that create lasting memories. Our products are carefully selected and handcrafted with love.</p>
    </div>
    <Footer />
  </div>
);

export default AboutPage;
