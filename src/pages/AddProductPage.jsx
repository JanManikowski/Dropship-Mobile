// AddProductPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AddProductPage = () => {
  const [url, setUrl] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setProduct(null);

    try {
      const { data } = await axios.post('http://localhost:3001/api/product/fetch', { url });
      setProduct(data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error
          ? `${err.response.data.error}`
          : 'Failed to fetch product data.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: 600, margin: '0 auto' }}>
      <h2>Add Product from AliExpress</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter AliExpress product URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            fontSize: '1rem',
          }}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Fetching…' : 'Fetch Product'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {product && (
        <div style={{ marginTop: '2rem' }}>
          <h3>{product.title}</h3>

          <div
            style={{ margin: '1rem 0', border: '1px solid #ccc', padding: '1rem' }}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          {product.images.length ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '1rem',
              }}
            >
              {product.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Slide ${i + 1}`}
                  style={{ width: '100%', objectFit: 'cover' }}
                />
              ))}
            </div>
          ) : (
            <p>No slide images found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddProductPage;
