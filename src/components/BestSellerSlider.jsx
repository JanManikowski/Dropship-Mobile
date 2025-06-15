import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard'; // or '../components/ProductCard' depending on file location


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
        <div key={product.id} style={{ minWidth: '200px' }}>
          <ProductCard {...product} />
        </div>
      ))}

      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minWidth: '200px' }}
      >
        <Link to="/products" className="btn btn-light border fw-semibold">
          Bekijk alle producten
        </Link>
      </div>
    </div>
  );
};

export default BestSellerSlider;
