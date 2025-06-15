import React, { useState } from 'react';
import { Menu, ShoppingCart, Heart } from 'lucide-react';
import logo from '../assets/images/logo2.png';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import TopBanner from '../components/TopBanner';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header style={{ position: 'relative', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
    <TopBanner/>
      <nav className="bg-white shadow px-4 py-4 position-relative">
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn p-0 border-0" onClick={toggleMenu}>
            <Menu className="w-6 h-6" />
          </button> 

          <Link to="/" className="text-dark fw-bold fs-4">
          <img src={logo} alt="Surprise of Love" style={{ height: '64px' }} />
<<<<<<< HEAD
          </Link>
          
          <Link to="/cart" className="text-dark position-relative">
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.length}
              </span>
            )}
          </Link>
=======
          <div className="d-flex align-items-center gap-3">
            <span className="position-relative">
              <Heart />
              {wishlist.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {wishlist.length}
                </span>
              )}
            </span>
            <Link to="/cart" className="text-dark position-relative">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
>>>>>>> 0e8b2ef5d51f4bb321b8644b67bee51c8cf0be4f
        </div>

        {isOpen && (
          <div className="bg-light position-absolute start-0 top-100 w-100 py-3 shadow-sm text-center">
            <Link to="/" className="d-block py-2 text-dark fw-semibold" onClick={toggleMenu}>Home</Link>
            <Link to="/products" className="d-block py-2 text-dark fw-semibold" onClick={toggleMenu}>Products</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
