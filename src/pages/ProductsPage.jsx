import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom'; 

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const prods = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(prods);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="" style={{ minHeight: '100vh' }}>
      <Navbar />

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Onze Producten</h2>

          {loading ? (
            <p className="text-center text-muted">Laden...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-muted">Geen producten gevonden.</p>
          ) : (
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {products.map(product => (
                <div key={product.id} className="col">
                  <div className="card h-100" >
                    <Link to={`/product/${product.id}`} className="card h-100 text-decoration-none text-dark">
  {Array.isArray(product.images) && product.images.length > 0 && (
    <div style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
      <img
        src={product.images[0]}
        alt={product.title || 'Product'}
        style={{ objectFit: 'contain', height: '100%', width: '100%' }}
      />
    </div>
  )}
  <div className="card-body d-flex flex-column">
    <h5 className="card-title">{product.title || 'Product zonder titel'}</h5>
    <p className="card-text text-danger fw-bold mb-2">
      €{Number(product.discountPrice || product.price || 0).toFixed(2)}
    </p>
    <span className="badge bg-secondary mt-auto align-self-start">
      {product.stock ?? 0} op voorraad
    </span>
  </div>
</Link>

                  </div>
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
