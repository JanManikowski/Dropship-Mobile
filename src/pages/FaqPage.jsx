import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FaqPage = () => (
  <div className="font-sans">
    <Navbar />
    <div className="container py-5">
      <h1 className="mb-4">FAQ</h1>
      <div className="accordion" id="faq">
        <div className="accordion-item">
          <h2 className="accordion-header" id="q1">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#a1">
              How long does shipping take?
            </button>
          </h2>
          <div id="a1" className="accordion-collapse collapse show" data-bs-parent="#faq">
            <div className="accordion-body">Orders are processed within 24h and delivered within 2-5 business days.</div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="q2">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#a2">
              Can I return a product?
            </button>
          </h2>
          <div id="a2" className="accordion-collapse collapse" data-bs-parent="#faq">
            <div className="accordion-body">Yes, you can return your product within 30 days of purchase.</div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default FaqPage;
