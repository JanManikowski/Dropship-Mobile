import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  const getTotal = () => cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (cart.length === 0) return;
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AQGUD0FFHTbSuuoKebh8E8Vshdi7lu-EWRFNpAcCPUuQcsX6rE0bnnt1c5SPDoYk3dFWfqOMk81Tvxol&currency=EUR';
    script.addEventListener('load', () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: getTotal() } }] }),
          onApprove: (data, actions) => actions.order.capture().then(() => {
            navigateRef.current('/thankyou');
            setTimeout(() => setCart([]), 100);
          })
        }).render('#paypal-button');
      }
    });
    document.body.appendChild(script);
    return () => {
      const container = document.getElementById('paypal-button');
      if (container) container.innerHTML = '';
    };
  }, [cart]);

  return (
    <div className="font-sans min-vh-100 d-flex flex-column">
      <Navbar />
      <div className="container flex-grow-1 py-5">
        <h1 className="mb-4">Payment</h1>
        <div id="paypal-button" />
      </div>
    </div>
  );
};

export default PaymentPage;
