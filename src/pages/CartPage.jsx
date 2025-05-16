import React from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const CartPage = () => {
  const { cart, setCart } = useCart();

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

  return (
    <div className="font-sans">
      <Navbar />
      <div className="container py-5">
        <h2 className="mb-4">Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
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
                        <p className="card-text text-danger">€{item.price}</p>
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
            <div className="text-end">
              <h4>Subtotal: €{getSubtotal()}</h4>
              <button className="btn btn-danger mt-3">Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
