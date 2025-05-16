import React from 'react';
import Navbar from '../components/Navbar';
import testImage from '../assets/images/test.jpg';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      id: 1,
      name: 'Custom Love Necklace',
      price: 39.99,
      image: testImage,
    });
  };

  return (
    <div className="font-sans">
      <Navbar />
      <div className="container mt-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-6 text-center">
            <img
              src={testImage}
              alt="Product"
              className="img-fluid rounded shadow"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-6">
            <h1 className="fw-bold mb-3">Custom Love Necklace</h1>
            <p className="text-muted mb-4">
              This personalized necklace makes the perfect gift. Handcrafted with care and fully waterproof.
            </p>
            <h3 className="text-danger mb-4">€39,99</h3>
            <button className="btn btn-danger btn-lg w-100 mb-3" onClick={handleAdd}>
              Add to Cart
            </button>
            <p className="text-success fw-semibold">In Stock – Ships within 24h</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
