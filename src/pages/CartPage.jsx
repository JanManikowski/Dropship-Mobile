import React, { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  const handleRemove = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id, delta) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item
    ));
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) =>
      sum + (item.price * (item.quantity || 1)), 0).toFixed(2);
  };

  useEffect(() => {
    if (cart.length === 0) return;

    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=AQGUD0FFHTbSuuoKebh8E8Vshdi7lu-EWRFNpAcCPUuQcsX6rE0bnnt1c5SPDoYk3dFWfqOMk81Tvxol&currency=EUR";
    script.addEventListener("load", () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: { value: getSubtotal() }
              }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(() => {
              navigateRef.current('/thankyou');
              setTimeout(() => setCart([]), 100);
            });
          }
        }).render('#paypal-button-container');
      }
    });

    document.body.appendChild(script);
    return () => {
      const oldButton = document.getElementById('paypal-button-container');
      if (oldButton) oldButton.innerHTML = '';
    };
  }, [cart]);

  return (
    <div className="font-sans min-vh-100 d-flex flex-column">
      <Navbar />
      <div className="container flex-grow-1 py-5">
        <h2 className="mb-4">Your Cart</h2>

        {cart.length === 0 ? (
  <div className="d-flex flex-grow-1 justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
    <div className="alert alert-light text-center shadow-sm px-4 py-3">
      <h5 className="mb-0">Your cart is empty.</h5>
    </div>
  </div>
) : (

          <>
            {cart.map((item) => (
              <div className="card mb-3" key={item.id}>
                <div className="row g-0 align-items-center">
                  <div className="col-4 col-md-2">
                    <img src={item.image} alt={item.name} className="img-fluid rounded-start" />
                  </div>
                  <div className="col-8 col-md-10">
                    <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text text-danger">€{item.price.toFixed(2)}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                        <span>{item.quantity || 1}</span>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemove(item.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-end mt-4">
              <h4>Subtotal: €{getSubtotal()}</h4>
              <div id="paypal-button-container" className="mt-3" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
