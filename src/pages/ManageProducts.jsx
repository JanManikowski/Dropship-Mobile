import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/admin');
      return;
    }
    const fetchData = async () => {
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
      prods.forEach(p => { p.purchased = counts[p.id] || 0; });
      setProducts(prods);
    };
    fetchData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Manage Products</h2>
        <div>
          <Link to="/admin/add" className="btn btn-success me-2">Add Product</Link>
          <button onClick={handleLogout} className="btn btn-outline-secondary">Logout</button>
        </div>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>AliExpress Link</th>
            <th>Purchased</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td><a href={p.link} target="_blank" rel="noreferrer">{p.link}</a></td>
              <td>{p.purchased}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProducts;
