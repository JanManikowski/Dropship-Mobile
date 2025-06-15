// PaymentMethodPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentMethodPage = () => {
  const navigate = useNavigate();

  const handleSelect = (method) => {
    navigate(`/checkout?method=${method}`);
  };

  return (
    <>
      <Navbar />
      <div className="container py-5" style={{ maxWidth: 700 }}>
        <div className="bg-white p-4 rounded-4 shadow">
          <h2 className="text-center fw-bold mb-4">Kies je Betaalmethode</h2>
          <div className="d-grid gap-3">
            <button className="btn btn-outline-dark p-3 rounded-pill" onClick={() => handleSelect('paypal')}>
              <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" height="24" className="me-2" />
              Betaal met PayPal
            </button>
            <button className="btn btn-outline-dark p-3 rounded-pill" onClick={() => handleSelect('ideal')} disabled>
              <img src="https://www.cardgate.com/wp-content/uploads/iDEAL-302x266.png" alt="iDEAL" height="24" className="me-2" />
              iDEAL (binnenkort beschikbaar)
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentMethodPage;
