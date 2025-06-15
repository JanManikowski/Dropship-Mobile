import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
  const { cart, setCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [showOffer, setShowOffer] = useState(false);
  const [offerItem, setOfferItem] = useState(null);

  const handleRemove = (id) => {
    removeFromCart(id);
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

  const handleCheckoutClick = async () => {
    try {
      const snap = await getDocs(collection(db, 'products'));
      const allItems = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const cartIds = cart.map(item => item.id);
      const filteredItems = allItems.filter(item => !cartIds.includes(item.id));

      if (filteredItems.length > 0) {
        const random = filteredItems[Math.floor(Math.random() * filteredItems.length)];
        setOfferItem(random);
        setShowOffer(true);
      } else {
        navigate('/checkout');
      }
    } catch (err) {
      console.error("Failed to fetch offer item:", err);
      navigate('/checkout');
    }
  };

  const acceptOffer = () => {
    if (offerItem) {
      const discounted = offerItem.discountPrice ? offerItem.discountPrice * 0.9 : offerItem.price * 0.9;
      setCart([
        ...cart,
        {
          id: offerItem.id,
          name: offerItem.title,
          image: offerItem.images?.[0] || '',
          price: parseFloat(discounted.toFixed(2)),
          quantity: 1,
        },
      ]);
    }
    navigate('/checkout');
  };

  return (
    <div className="font-sans min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      <div className="container flex-grow-1 py-5">
        <h2 className="mb-4 fw-bold border-bottom pb-2">🛒 Jouw Winkelwagen</h2>

        {cart.length === 0 ? (
          <div className="d-flex flex-grow-1 justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="alert alert-light text-center shadow-sm px-4 py-3">
              <h5 className="mb-0">Je winkelwagen is leeg.</h5>
            </div>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div className="card mb-3 shadow-sm border-0 rounded-4" key={item.id}>
                <div className="row g-0 align-items-center">
                  <div className="col-4 col-md-2">
                    <img src={item.image} alt={item.name} className="img-fluid rounded-start" />
                  </div>
                  <div className="col-8 col-md-10">
                    <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
                      <div className="me-auto">
                        <h5 className="card-title mb-1 fw-bold" style={{ fontSize: '1.15rem' }}>{item.name}</h5>
                        <p className="card-text text-danger fw-semibold mb-0" style={{ fontSize: '1.05rem' }}>€{item.price.toFixed(2)}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2 ms-md-4 mt-3 mt-md-0">
                        <button className="btn btn-light border border-secondary-subtle rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }} onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                        <span className="fw-bold px-2">{item.quantity || 1}</span>
                        <button className="btn btn-light border border-secondary-subtle rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }} onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                        <button className="btn btn-danger rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }} onClick={() => handleRemove(item.id)}>
                          <Trash2 size={16} color="white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {parseFloat(getSubtotal()) >= 30 && (
              <div className="alert alert-success text-center fw-semibold mt-3 rounded-pill shadow-sm">
                🎉 Gratis verzending vanaf €30! Goed bezig!
              </div>
            )}

            <div className="text-end mt-4">
              <h4 className="fw-bold">Totaal: €{getSubtotal()}</h4>
              <button className="btn btn-dark mt-3 px-5 py-2 rounded-pill fw-semibold shadow-sm" onClick={handleCheckoutClick}>
                Doorgaan naar Afrekenen
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />

      {showOffer && offerItem && (() => {
        const original = offerItem.price;
        const baseDiscount = offerItem.discountPrice || original;
        const specialPrice = parseFloat((baseDiscount * 0.9).toFixed(2));

        return (
          <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow border-0 rounded-4">
                <div className="modal-header border-0">
                  <h5 className="modal-title fs-4">✨ Speciale Aanbieding</h5>
                  <button type="button" className="btn-close" onClick={() => navigate('/checkout')}></button>
                </div>
                <div className="modal-body text-center">
                  <img src={offerItem.images?.[0]} alt={offerItem.title} className="img-fluid mb-4 rounded shadow-sm" style={{ maxHeight: '240px' }} />
                  <h4 className="fw-bold mb-2">{offerItem.title}</h4>
                  <div className="mb-3">
                    <span className="badge bg-danger fs-6 px-3 py-2 mb-2">Nu met extra 10% korting!</span>
                    <div>
                      <span className="text-muted text-decoration-line-through me-2">€{original.toFixed(2)}</span>
                      <span className="text-danger fs-5 fw-semibold">€{specialPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-muted">Wil je dit item toevoegen aan je bestelling?</p>
                </div>
                <div className="modal-footer d-flex justify-content-center border-0 pb-4">
                  <button className="btn btn-success px-4 rounded-pill shadow-sm" onClick={acceptOffer}>Hell yeah!</button>
                  <button className="btn btn-outline-secondary px-4 rounded-pill shadow-sm" onClick={() => navigate('/checkout')}>Nee, doorgaan</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default CartPage;
