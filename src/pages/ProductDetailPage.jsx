import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wish, setWish] = useState(false);
  const [watching, setWatching] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
        setWatching(5 + Math.floor(Math.random() * 25));
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.discountPrice || product.price,
      image: product.images?.[0],
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  if (loading) return <p className="text-center mt-5">Laden...</p>;
  if (!product) return <p className="text-center mt-5">Product niet gevonden.</p>;

  return (
    <div className="font-sans">
      <Navbar />

      {showPopup && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3 alert alert-success shadow" style={{ zIndex: 1050 }}>
          Item added to cart!
        </div>
      )}

<div className="container mt-4" style={{ paddingTop: '180px' }}>
        <div className="row g-4 align-items-center">
          <h1 className="fw-bold mb-2">{product.title}</h1>

          <div className="col-md-6 text-center">

            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.title}
                className="img-fluid rounded shadow mb-3"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            )}
            {/* Optional video:
            {product.video && (
              <video className="w-100 rounded" controls src={product.video} />
            )} */}
          </div>

          <div className="col-md-6 position-relative">
            <span className="badge bg-warning text-dark position-absolute" style={{ top: 0, right: 0 }}>Trending</span>
            <p className="text-muted mb-1">
              Only {product.stock} left in stock • {watching} people are viewing this
            </p>
            <p className="text-decoration-underline text-primary small mb-2" role="button">
              Notify me when back in stock
            </p>
            <p className="text-muted mb-2">Discount ends in {formatTime(timeLeft)}</p>
            <h3 className="text-danger mb-3">
              €{Number(product.discountPrice || product.price || 0).toFixed(2)}
              {product.discountPrice && (
                <small className="text-decoration-line-through text-muted ms-2">
                  €{Number(product.price || 0).toFixed(2)}
                </small>
              )}
            </h3>

            <button className="btn btn-outline-secondary mb-2" onClick={() => setWish(!wish)}>
              {wish ? 'Wishlisted' : 'Add to Wishlist'}
            </button>

            <button className="btn btn-danger btn-lg w-100 mb-3" onClick={handleAdd} id="add-to-cart">
              Add to Cart
            </button>

            <p className="text-success fw-semibold">In Stock – Ships within 24h</p>

            <div className="d-flex gap-3 my-3">
              <img src="https://www.cardgate.com/wp-content/uploads/iDEAL-302x266.png" alt="iDEAL" style={{ height: '28px' }} />
              <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" style={{ height: '28px' }} />
              <img src="https://docs.klarna.com/static/assets/Marketing%20Badge%20With%20Clear%20Space.png" alt="Klarna" style={{ height: '28px' }} />
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <h4 className="mb-3">Beschrijving</h4>
        <p>{product.description || 'Geen beschrijving beschikbaar.'}</p>

        <h4 className="mb-3">Customer Reviews</h4>
        <div className="mb-4">
          <div className="border rounded p-3 mb-2">
            <strong>Anna</strong>
            <p className="mb-0">Great quality! Came exactly as described.</p>
          </div>
          <div className="border rounded p-3">
            <strong>Peter</strong>
            <p className="mb-0">Fast shipping and my girlfriend loved it.</p>
          </div>
        </div>

        <h4 className="mb-3">Customers also bought</h4>
        <div id="carousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active text-center">
              <img src={product.images?.[1] || product.images?.[0]} className="d-block w-100" style={{ maxWidth: '300px', margin: '0 auto' }} alt="Item" />
            </div>
            <div className="carousel-item text-center">
              <img src={product.images?.[2] || product.images?.[0]} className="d-block w-100" style={{ maxWidth: '300px', margin: '0 auto' }} alt="Item" />
            </div>
          </div>
        </div>
      </div>

      <div className="d-md-none fixed-bottom bg-white p-2 shadow">
        <button className="btn btn-danger w-100" onClick={handleAdd}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
