import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) return;

    if (!user) {
      navigate('/admin');
    } else {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const prodSnap = await getDocs(collection(db, 'products'));
      const prods = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const orderSnap = await getDocs(collection(db, 'orders'));
      const orders = orderSnap.docs.map(d => d.data());

      const counts = {};
      orders.forEach(o => {
        (o.cart || []).forEach(item => {
          counts[item.id] = (counts[item.id] || 0) + (item.quantity || 1);
        });
      });

      prods.forEach(p => {
        p.purchased = counts[p.id] || 0;
      });

      setProducts(prods);
    } catch (err) {
      console.error("Product ophalen mislukt:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-3 mb-md-0">Productbeheer</h2>
        <div className="d-flex gap-2">
          <Link to="/admin/add" className="btn btn-danger fw-semibold rounded-pill">
            + Nieuw Product
          </Link>
          <button onClick={handleLogout} className="btn btn-outline-secondary rounded-pill">
            Uitloggen
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-muted">Geen producten gevonden.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {products.map(p => (
            <div key={p.id} className="col">
              <div className="card h-100 shadow-sm border-0 rounded-4">
                <div className="row g-0">
                  <div className="col-4">
                    <img
                      src={p.images?.[0] || 'https://via.placeholder.com/200x200?text=Geen+Afbeelding'}
                      alt={p.title}
                      className="img-fluid rounded-start h-100 object-fit-cover"
                      style={{ minHeight: '100%' }}
                    />
                  </div>
                  <div className="col-8">
                    <div className="card-body d-flex flex-column h-100">
                      <h6 className="fw-bold mb-2">{p.title}</h6>
                      <p className="text-muted small mb-1">
                        Prijs: €{Number(p.price).toFixed(2)}{' '}
                        {p.discountPrice && (
                          <>
                            <del className="ms-2 text-muted small">€{Number(p.discountPrice).toFixed(2)}</del>
                          </>
                        )}
                      </p>
                      <div className="d-flex flex-wrap gap-2 small text-secondary mb-2">
                        <span>Voorraad: {p.stock ?? 0}</span>
                        <span>Verkocht: {p.purchased}</span>
                        <span>Bestseller: {p.bestseller ? '✅' : '—'}</span>
                      </div>
                      <a
                        href={p.aliexpress?.main}
                        target="_blank"
                        rel="noreferrer"
                        className="text-decoration-none small text-primary mb-3"
                      >
                        AliExpress Link
                      </a>
                      <div className="mt-auto d-flex gap-2 flex-wrap">
                        <Link
                          to={`/admin/edit/${p.id}`}
                          className="btn btn-sm btn-outline-primary rounded-pill"
                        >
                          Bewerken
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn btn-sm btn-outline-danger rounded-pill"
                        >
                          Verwijderen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
