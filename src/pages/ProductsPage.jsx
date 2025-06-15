import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const prods = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(prods);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Onze Producten</h2>

          {loading ? (
            <p className="text-center text-muted">Laden...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-muted">Geen producten gevonden.</p>
          ) : (
            <div className="row row-cols-2 row-cols-md-3 g-4">
              {products.map(product => (
                <div key={product.id} className="col">
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
