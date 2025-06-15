import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, title, images, price, discountPrice }) => {
  const imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : null;
  const finalPrice = Number(discountPrice || price || 0).toFixed(2);
  const oldPrice = Number(price || 0).toFixed(2);

  return (
    <Link to={`/product/${id}`} className="card h-100 text-decoration-none text-dark">
      {imageUrl && (
        <div style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
          <img
            src={imageUrl}
            alt={title || 'Product'}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              display: 'block'
            }}
            loading="lazy"
          />
        </div>
      )}

      <div className="card-body p-2 d-flex flex-column">
        <h6 className="card-title mb-1 text-truncate" style={{lineHeight:'1.3'}}>{title || 'Product zonder titel'}</h6>
        <p className="card-text text-danger fw-bold mb-1">
          €{finalPrice}
          <small className='text-decoration-line-through text-muted ms-2'>
            €{oldPrice}
          </small>
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
