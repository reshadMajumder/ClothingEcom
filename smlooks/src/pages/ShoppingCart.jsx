import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { API_URL_MEDIA } from '../data/Api';

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping] = useState(60); // Fixed shipping cost
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCartItems();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  const loadCartItems = () => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
  };

  const calculateTotals = () => {
    const itemsSubtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    setSubtotal(itemsSubtotal);
    setTotal(itemsSubtotal + shipping);
  };

  const updateQuantity = (index, change) => {
    const updatedItems = cartItems.map((item, i) => {
      if (i === index) {
        const newQuantity = Math.max(1, item.quantity + change);
        return {
          ...item,
          quantity: newQuantity,
          total: newQuantity * item.price
        };
      }
      return item;
    });
    
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const removeItem = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  return (
    <div className="page-wrapper">
      <div className="cart-page-wrapper py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Link to="/" className="btn btn-outline-dark mb-4">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Continue Shopping
              </Link>
              <h2 className="mb-4">Shopping Cart</h2>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <h4>Your cart is empty</h4>
              <Link to="/" className="btn btn-dark mt-3">Start Shopping</Link>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="cart-items card">
                  <div className="card-body">
                    {cartItems.map((item, index) => (
                      <div key={index} className="cart-item-row">
                        <div className="d-flex gap-3 align-items-center">
                          <img 
                            src={`${API_URL_MEDIA}${item.image}`}
                            alt={item.name}
                            className="cart-item-image"
                          />
                          <div className="cart-item-details flex-grow-1">
                            <h5 className="cart-item-title">{item.name}</h5>
                            <div className="text-muted mb-2">
                              Size: {item.size} | Color: {item.color}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="quantity-controls">
                                <button 
                                  className="btn btn-sm btn-outline-dark"
                                  onClick={() => updateQuantity(index, -1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <FontAwesomeIcon icon={faMinus} />
                                </button>
                                <span className="quantity-display">{item.quantity}</span>
                                <button 
                                  className="btn btn-sm btn-outline-dark"
                                  onClick={() => updateQuantity(index, 1)}
                                >
                                  <FontAwesomeIcon icon={faPlus} />
                                </button>
                              </div>
                              <div className="d-flex align-items-center gap-3">
                                <span className="cart-item-price">৳{item.total}</span>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeItem(index)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="cart-summary card">
                  <div className="card-body">
                    <h5 className="card-title mb-4">Order Summary</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal</span>
                      <span>৳{subtotal}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Shipping</span>
                      <span>৳{shipping}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-4">
                      <span className="fw-bold">Total</span>
                      <span className="fw-bold">৳{total}</span>
                    </div>
                    <Link 
                      to="/checkout" 
                      className="btn btn-dark w-100"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
