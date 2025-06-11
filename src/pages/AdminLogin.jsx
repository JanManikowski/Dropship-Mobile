import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import mainImage from '../assets/images/main.jpg'; // same as homepage bg

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin/manage');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="position-relative" style={{ height: '100vh', width: '100vw' }}>
      {/* Background */}
      <img
        src={mainImage}
        alt="Background"
        className="position-absolute w-100 h-100 object-fit-cover"
        style={{ top: 0, left: 0, zIndex: 0 }}
      />

      {/* Dark overlay */}
      <div
        className="position-absolute w-100 h-100 bg-dark bg-opacity-50"
        style={{ top: 0, left: 0, zIndex: 1 }}
      />

      {/* Centered login form */}
      <div
        className="position-relative d-flex justify-content-center align-items-center"
        style={{ height: '100vh', zIndex: 2 }}
      >
        <div className="bg-white p-4 rounded-4 shadow" style={{ width: '100%', maxWidth: '360px' }}>
          <h2 className="text-center fw-bold mb-4">Admin Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-danger w-100 fw-semibold rounded-pill" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
