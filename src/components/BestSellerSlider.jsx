import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const BestSellerSlider = () => {
  const [bestsellers, setBestsellers] = useState([]);

  useEffect(() => {
    const fetchBestsellers = async () => {
      const q = query(collection(db, 'products'), where('bestseller', '==', true));
      const snap = await getDocs(q);
      const prods = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBestsellers(prods);
    };

    fetchBestsellers();
  }, []);

  return (
    <div className="d-flex overflow-auto px-2 gap-3">
      {bestsellers.map(product => (
        <div key={product.id} className="card" style={{ minWidth: '200px' }}>
          <img
            src={product.images?.[0] || ''}
            className="card-img-top"
            alt={product.title}
            style={{ objectFit: 'cover', height: '150px' }}
          />
          <div className="card-body">
            <h6 className="card-title small">{product.title}</h6>
            <p className="mb-1">
              {product.discountPrice && (
                <del className="text-muted small me-2">€{Number(product.price).toFixed(2)}</del>
              )}
              <span className="text-danger fw-bold">
                €{Number(product.discountPrice || product.price).toFixed(2)}
              </span>
            </p>
            <Link to={`/product/${product.id}`} className="btn btn-outline-danger btn-sm w-100">
              Bekijk
            </Link>
          </div>
        </div>
      ))}
      <div className="d-flex align-items-center justify-content-center" style={{ minWidth: '200px' }}>
        <Link to="/products" className="btn btn-light border fw-semibold">
          Bekijk alle producten
        </Link>
      </div>
    </div>
  );
};

export default BestSellerSlider;
