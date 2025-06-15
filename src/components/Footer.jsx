import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo2.png';

const Footer = () => (
  <footer className="bg-dark text-white mt-auto py-4">
    <div className="container text-center">
      <img src={logo} alt="Surprise of Love" style={{ height: '40px' }} className="mb-2" />
      <ul className="list-inline mb-3">
        <li className="list-inline-item">
          <Link to="/about" className="text-white text-decoration-none">About</Link>
        </li>
        <li className="list-inline-item">
          <Link to="/faq" className="text-white text-decoration-none">FAQ</Link>
        </li>
        <li className="list-inline-item">
          <Link to="/returns" className="text-white text-decoration-none">Returns</Link>
        </li>
        <li className="list-inline-item">
          <Link to="/contact" className="text-white text-decoration-none">Contact</Link>
        </li>
      </ul>
      <p className="mb-0 small">&copy; {new Date().getFullYear()} Surprise of Love</p>
    </div>
  </footer>
);

export default Footer;
