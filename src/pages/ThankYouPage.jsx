import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ThankYouPage = () => {
  return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      {/* Ensure navbar stays up top */}
      <header style={{ zIndex: 1050, position: 'relative' }}>
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center px-3 py-5 bg-light">
        <div className="bg-white shadow rounded-4 p-5 text-center" style={{ maxWidth: '500px' }}>
          <div className="text-success mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
              <path d="M15.854 7.646a.5.5 0 0 1 0 .708l-8 8a.5.5 0 0 1-.708 0l-4-4a.5.5 0 1 1 .708-.708L7.5 14.293l7.646-7.647a.5.5 0 0 1 .708 0z"/>
              <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
            </svg>
          </div>
          <h2 className="fw-bold mb-3">Thank you for your purchase!</h2>
          <p className="text-muted mb-4">Your order has been successfully processed. A confirmation email has been sent to you.</p>
          <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill">Continue Shopping</Link>
        </div>
      </main>
    </div>
  );
};

export default ThankYouPage;
