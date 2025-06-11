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
    if (user === null) return; // wait for auth check

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

      <div className="table-responsive rounded shadow-sm">
        <table className="table table-hover align-middle mb-0 bg-white rounded overflow-hidden">
          <thead className="bg-light">
            <tr>
              <th>Titel</th>
              <th>Prijs (€)</th>
              <th>AliExpress Link</th>
              <th>Verkocht</th>
              <th>Bestseller</th>
              <th style={{ minWidth: '130px' }}>Acties</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className="fw-semibold">{p.title}</td>
                <td>{p.price ? `€${Number(p.price).toFixed(2)}` : '—'}</td>
                <td>
                  <a
                    href={p.aliexpress?.main}
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-none text-primary"
                  >
                    Bekijk
                  </a>
                </td>
                <td>{p.purchased}</td>
                <td>{p.bestseller ? '✅' : '—'}</td>
                <td>
                  <div className="d-flex gap-2 flex-wrap">
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
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  Geen producten gevonden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
