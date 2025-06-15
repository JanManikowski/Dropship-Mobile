import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  const [userData, setUserData] = useState({ name: '', email: '', address: '' });

  const getTotal = () => cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'orders'), { ...userData, cart });
    loadPayPal();
  };

  const loadPayPal = () => {
    if (document.getElementById('paypal-script')) return;
    const script = document.createElement('script');
    script.id = 'paypal-script';
    script.src = 'https://www.paypal.com/sdk/js?client-id=AQGUD0FFHTbSuuoKebh8E8Vshdi7lu-EWRFNpAcCPUuQcsX6rE0bnnt1c5SPDoYk3dFWfqOMk81Tvxol&currency=EUR';
    script.addEventListener('load', () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => actions.order.create({
          purchase_units: [{ amount: { value: getTotal() } }]
        }),
        onApprove: (data, actions) => actions.order.capture().then(() => {
          navigateRef.current('/thankyou');
          setTimeout(() => clearCart(), 100);
        })
      }).render('#paypal-button-container');
    });
    document.body.appendChild(script);
  };

  useEffect(() => {
    return () => {
      const oldButton = document.getElementById('paypal-button-container');
      if (oldButton) oldButton.innerHTML = '';
    };
  }, []);

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" name="name" value={userData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={userData.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea className="form-control" name="address" value={userData.address} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Continue to PayPal</button>
      </form>
      <div id="paypal-button-container" className="mt-4"></div>
    </div>
  );
};

export default CheckoutPage;
