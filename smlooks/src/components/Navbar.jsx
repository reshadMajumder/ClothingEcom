import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faBars, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { API_URL_MEDIA } from '../data/Api';
import logoIcon from '/assets/images/logo-icon.png';

function Navbar() {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    if (showCart) {
      loadCartItems();
    }
  }, [showCart]);

  useEffect(() => {
    // Load cart items initially
    loadCartItems();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartItems();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    // Prevent body scroll when cart modal is open
    if (showCart) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showCart]);

  const loadCartItems = () => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
    const total = items.reduce((sum, item) => sum + item.total, 0);
    setCartTotal(total);
  };

  const removeFromCart = (index) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
    const total = newItems.reduce((sum, item) => sum + item.total, 0);
    setCartTotal(total);
  };

  return (
    <div className="header-wrapper">
      <div className="header-content bg-dark">
        <div className="container">
          <div className="row align-items-center gx-4">
            <div className="col-auto">
              <div className="d-flex align-items-center gap-3">
                <div className="mobile-toggle-menu d-inline d-xl-none d-lg-none">
                  <FontAwesomeIcon icon={faBars} className="text-white" />
                </div>
                <div className="logo">
                  <Link to="/">
                    <img src={logoIcon} className="logo-icon" alt="logo" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12 col-xl order-4 order-xl-0">
              <div className="display-flex align-items-center justify-content-end gap-3 d-none d-sm-block">
                <ul className="flex-container ulmenu">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/man">Man</Link></li>
                  <li><Link to="/women">Women</Link></li>
                  <li><Link to="/accessories">Accessories</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-auto ms-auto">
              <div className="top-cart-icons">
                <nav className="navbar navbar-expand">
                  <ul className="navbar-nav">
                    <li className="nav-item dropdown dropdown-large">
                      <button
                        className="nav-link cart-link bg-transparent border-0"
                        onClick={() => setShowCart(true)}
                      >
                        {cartItems.length > 0 && (
                          <span className="alert-count">{cartItems.length}</span>
                        )}
                        <FontAwesomeIcon icon={faShoppingCart} className="text-white" />
                      </button>

                      {/* Cart Modal */}
                      {showCart && (
                        <div className="cart-modal-overlay" onClick={() => setShowCart(false)}>
                          <div className="cart-modal" onClick={e => e.stopPropagation()}>
                            <div className="cart-header">
                              <h5 className="mb-0">Shopping Cart ({cartItems.length} items)</h5>
                              <button className="btn-close" onClick={() => setShowCart(false)}></button>
                            </div>
                            
                            <div className="cart-body">
                              {cartItems.length === 0 ? (
                                <div className="text-center py-4">
                                  <p className="mb-0">Your cart is empty</p>
                                </div>
                              ) : (
                                cartItems.map((item, index) => (
                                  <div key={index} className="cart-item">
                                    <img 
                                      src={`${API_URL_MEDIA}${item.image}`} 
                                      alt={item.name}
                                      className="cart-item-img"
                                    />
                                    <div className="cart-item-info">
                                      <h6 className="cart-item-title">{item.name}</h6>
                                      <div className="cart-item-details">
                                        <span className="text-muted">
                                          Size: {item.size} | Color: {item.color}
                                        </span>
                                      </div>
                                      <div className="d-flex justify-content-between align-items-center mt-2">
                                        <span className="cart-item-price">৳{item.price} × {item.quantity}</span>
                                        <button 
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => removeFromCart(index)}
                                        >
                                          <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>

                            {cartItems.length > 0 && (
                              <div className="cart-footer">
                                <div className="d-flex justify-content-between mb-3">
                                  <span className="fw-bold">Total:</span>
                                  <span className="fw-bold">৳{cartTotal}</span>
                                </div>
                                <div className="d-grid gap-2">
                                  <Link 
                                    to="/checkout" 
                                    className="btn btn-dark"
                                    onClick={() => setShowCart(false)}
                                  >
                                    Proceed to Checkout
                                  </Link>
                                  <Link 
                                    to="/cart" 
                                    className="btn btn-outline-dark"
                                    onClick={() => setShowCart(false)}
                                  >
                                    View Cart
                                    </Link>
                                  
                                  
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                    <li className="nav-item">
                      <Link to="/login" className="nav-link cart-link">
                        <FontAwesomeIcon icon={faUser} className="text-white" />
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;