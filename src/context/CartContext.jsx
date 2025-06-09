import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, customerInfo, setCustomerInfo }}>
      {children}
    </CartContext.Provider>
  );
};
