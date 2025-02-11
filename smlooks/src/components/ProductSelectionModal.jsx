import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { API_URL_MEDIA } from '../data/Api';

function ProductSelectionModal({ product, show, onClose }) {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCartAndCheckout = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select both size and color');
      return;
    }

    const item = {
      id: product.id,
      name: product.name,
      price: product.selling_price,
      image: product.images[0]?.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      total: quantity * product.selling_price
    };

    // Add to cart
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    cartItems.push(item);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Notify other components about cart update
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Close modal and navigate to checkout
    onClose();
    navigate('/checkout');
  };

  const isSelectionComplete = selectedSize && selectedColor;

  if (!show) return null;

  return (
    <div className="product-selection-overlay" onClick={onClose}>
      <div className="product-selection-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="mb-0">Select Options</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          {/* Product Info */}
          <div className="product-info d-flex gap-3 mb-4">
            <img 
              src={`${API_URL_MEDIA}${product.images[0]?.image}`}
              alt={product.name}
              className="product-thumbnail"
            />
            <div>
              <h6 className="product-title mb-2">{product.name}</h6>
              <div className="product-price">৳{product.selling_price}</div>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-4">
            <label className="form-label">Size</label>
            <div className="size-options d-flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  className={`btn btn-outline-dark ${selectedSize === size.size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size.size)}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-4">
            <label className="form-label">Color</label>
            <div className="color-options d-flex gap-2 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  className={`btn btn-outline-dark ${selectedColor === color.color ? 'active' : ''}`}
                  onClick={() => setSelectedColor(color.color)}
                >
                  {color.color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mb-4">
            <label className="form-label">Quantity</label>
            <div className="quantity-selector d-flex align-items-center gap-3">
              <button 
                className="btn btn-outline-dark"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span className="quantity">{quantity}</span>
              <button 
                className="btn btn-outline-dark"
                onClick={() => handleQuantityChange(1)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          {isSelectionComplete ? (
            <button 
              className="btn btn-dark w-100"
              onClick={handleAddToCartAndCheckout}
            >
              Proceed to Checkout
            </button>
          ) : (
            <div className="text-center text-muted w-100">
              Please select size and color to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductSelectionModal; 