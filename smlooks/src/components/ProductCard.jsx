import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faEye } from '@fortawesome/free-solid-svg-icons';
import { API_URL_MEDIA } from '../data/Api';
import ProductSelectionModal from './ProductSelectionModal';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = () => {
    if (window.innerWidth <= 768) {
      setShowActions(!showActions);
    }
  };

  // Calculate discount percentage if discount exists
  const discountPercentage = product.original_price !== product.selling_price
    ? Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)
    : null;

  return (
    <>
      <div className="col">
        <div 
          className="card product-card" 
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
          onClick={handleCardClick}
        >
          <div className="position-relative product-img-container">
            {discountPercentage && (
              <div className="discount-badge">-{discountPercentage}%</div>
            )}
            <img 
              src={`${API_URL_MEDIA}${product.images[0]?.image}`}
              className="img-fluid product-image" 
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'assets/images/products/default.png';
              }}
            />
            <div className={`product-actions-overlay ${showActions ? 'show-mobile' : ''}`}>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-light flex-grow-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                >
                  <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                  Buy Now
                </button>
                <button 
                  className="btn btn-light"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${product.id}`);
                  }}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </div>
            </div>
          </div>
          <div className="card-body text-center">
            <h6 className="product-title mb-2">{product.name}</h6>
            <div className="product-category mb-2 text-muted small">{product.category.name}</div>
            <div className="product-price-wrapper">
              <span className="selling-price">৳{product.selling_price}</span>
              {discountPercentage && (
                <span className="original-price ms-2">৳{product.original_price}</span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <div className="stock-warning mt-1">Only {product.stock} left!</div>
            )}
            {product.stock === 0 && (
              <div className="out-of-stock mt-1">Out of Stock</div>
            )}
          </div>
        </div>
      </div>

      <ProductSelectionModal 
        product={product}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

export default ProductCard;