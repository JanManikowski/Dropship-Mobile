import React from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import testImage from '../assets/images/test.jpg';

const OfferPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAdd = () => {
    addToCart({ id: 'offer', name: 'Special Item', price: 9.99, image: testImage });
    navigate('/checkout');
  };

  return (
    <div className="font-sans">
      <Navbar />
      <div className="container py-5 text-center" style={{ maxWidth: '500px' }}>
        <h1 className="mb-3">Special Offer!</h1>
        <p className="mb-4">This time only, get 50% off this item.</p>
        <img src={testImage} className="img-fluid rounded mb-3" alt="Offer" />
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-success" onClick={handleAdd}>Add to Order</button>
          <button className="btn btn-secondary" onClick={() => navigate('/checkout')}>No Thanks</button>
        </div>
      </div>
    </div>
  );
};

export default OfferPage;
