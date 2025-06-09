import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import testImage from '../assets/images/test.jpg';
import item1 from '../assets/images/item1.jpg';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { addToCart } = useCart();
  const [wish, setWish] = useState(false);
  const [watching, setWatching] = useState(0);
  const [stock] = useState(5);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setWatching(5 + Math.floor(Math.random() * 25));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAdd = () => {
    addToCart({ id: 1, name: 'Custom Love Necklace', price: 29.99, image: testImage });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  return (
    <div className="font-sans">
      <Navbar />
      {showPopup && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3 alert alert-success shadow" style={{ zIndex: 1050 }}>
          Item added to cart!
        </div>
      )}
      <div className="container mt-4">
        <div className="row g-4 align-items-center">
          <h1 className="fw-bold mb-2">Custom Love Necklace</h1>
          <div className="col-md-6 text-center">
            <img src={testImage} alt="Product" className="img-fluid rounded shadow mb-3" style={{ maxHeight: '500px', objectFit: 'cover' }} />
            {/* <video className="w-100 rounded" controls src="https://www.w3schools.com/html/mov_bbb.mp4" /> */}
          </div>
          <div className="col-md-6 position-relative">
            <span className="badge bg-warning text-dark position-absolute" style={{ top: 0, right: 0 }}>Trending</span>
            <p className="text-muted mb-1">Only {stock} left in stock • {watching} people are viewing this</p>
            <p className="text-decoration-underline text-primary small mb-2" role="button">Notify me when back in stock</p>
            <p className="text-muted mb-2">Discount ends in {formatTime(timeLeft)}</p>
            <h3 className="text-danger mb-3">
              €29,99 <small className="text-decoration-line-through text-muted ms-2">€39,99</small>
            </h3>
            <button className="btn btn-outline-secondary mb-2" onClick={() => setWish(!wish)}>
              {wish ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
            <button className="btn btn-danger btn-lg w-100 mb-3" onClick={handleAdd} id="add-to-cart">
              Add to Cart
            </button>
            <p className="text-success fw-semibold">In Stock – Ships within 24h</p>
            <div className="d-flex gap-3 my-3">
              <img src="https://www.cardgate.com/wp-content/uploads/iDEAL-302x266.png" alt="iDEAL" style={{ height: '28px' }} />
              <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" style={{ height: '28px' }} />
              <img src="https://docs.klarna.com/static/assets/Marketing%20Badge%20With%20Clear%20Space.png" alt="Klarna" style={{ height: '28px' }} />
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <h4 className="mb-3">Customer Reviews</h4>
        <div className="mb-4">
          <div className="border rounded p-3 mb-2">
            <strong>Anna</strong>
            <p className="mb-0">Great quality! Came exactly as described.</p>
          </div>
          <div className="border rounded p-3">
            <strong>Peter</strong>
            <p className="mb-0">Fast shipping and my girlfriend loved it.</p>
          </div>
        </div>

        <h4 className="mb-3">Customers also bought</h4>
        <div id="carousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active text-center">
              <img src={item1} className="d-block w-100" style={{ maxWidth: '300px', margin: '0 auto' }} alt="Item" />
            </div>
            <div className="carousel-item text-center">
              <img src={testImage} className="d-block w-100" style={{ maxWidth: '300px', margin: '0 auto' }} alt="Item" />
            </div>
          </div>
        </div>
      </div>

      <div className="d-md-none fixed-bottom bg-white p-2 shadow">
        <button className="btn btn-danger w-100" onClick={handleAdd}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductPage;
