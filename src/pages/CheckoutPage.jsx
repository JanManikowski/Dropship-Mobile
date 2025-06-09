import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { setCustomerInfo } = useCart();
  const navigate = useNavigate();
  const [info, setInfo] = useState({ name: '', address: '', email: '' });

  const handleChange = (e) => setInfo({ ...info, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setCustomerInfo(info);
    navigate('/payment');
  };

  return (
    <div className="font-sans">
      <Navbar />
      <div className="container py-5" style={{ maxWidth: '500px' }}>
        <h1 className="mb-4">Shipping Details</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" name="name" value={info.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input className="form-control" name="address" value={info.address} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={info.email} onChange={handleChange} required />
          </div>
          <button className="btn btn-primary w-100" type="submit">Proceed to Payment</button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
