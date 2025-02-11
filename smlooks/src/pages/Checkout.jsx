import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../data/Api';

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [location, setLocation] = useState('inside_dhaka');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    state: '',
    address: '',
    bkashNumber: '',
    transactionId: '',
  });
  
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const shippingCost = location === 'inside_dhaka' ? 60 : 120;
  const total = subtotal + shippingCost;

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate bKash fields if bKash is selected
    if (paymentMethod === 'bkash' && (!formData.bkashNumber || !formData.transactionId)) {
      alert('Please fill in all bKash payment details');
      return;
    }

    try {
      const orderData = {
        products: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price
        })),
        total_price: total,
        order_status: false,
        order_address: formData.address,
        order_phone: formData.phone,
        order_name: formData.fullName,
        order_state: formData.state,
        order_payment_method: paymentMethod,
        order_payment_phone: formData.bkashNumber || '',
        order_payment_id: formData.transactionId || ''
      };

      const response = await fetch(`${API_URL}order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Insufficient stock') {
          // Handle stock issues
          const stockIssues = data.stock_issues;
          let errorMessage = 'Some items in your cart are no longer available in the requested quantity:\n\n';
          stockIssues.forEach(issue => {
            errorMessage += `${issue.product_name}: ${issue.available_quantity} available (you requested ${issue.requested_quantity})\n`;
          });
          alert(errorMessage);
          return;
        }
        throw new Error(data.error || 'Failed to create order');
      }

      // Clear cart and redirect on success
      localStorage.removeItem('cart');
      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/checkout-success');

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleConfirmOrder = () => {
    // Add your order processing logic here
    navigate('/checkout-success');
  };

  return (
    <div className="page-wrapper">
      <div className="separator p-4">
        <div className="line"></div>
        <h5 className="mb-0 fw-bold separator-title">Secure Checkout</h5>
        <div className="line"></div>
      </div>

      <section className="checkout-section py-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="checkout-details">
                <div className="checkout-progress mb-4">
                  <div className="progress-steps">
                    <div className="step active">
                      <span className="step-number">1</span>
                      <span className="step-title">Shipping</span>
                    </div>
                    <div className="step">
                      <span className="step-number">2</span>
                      <span className="step-title">Payment</span>
                    </div>
                    <div className="step">
                      <span className="step-number">3</span>
                      <span className="step-title">Confirmation</span>
                    </div>
                  </div>
                </div>

                <form id="checkout-form" onSubmit={handleSubmit} className="checkout-form">
                  {/* Shipping Information */}
                  <div className="checkout-card mb-4">
                    <div className="card-header">
                      <h4 className="mb-0">Shipping Information</h4>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input 
                              type="text" 
                              className="form-control" 
                              id="fullName" 
                              value={formData.fullName}
                              onChange={handleInputChange}
                              required 
                              placeholder=" " 
                            />
                            <label htmlFor="fullName">Full Name</label>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input 
                              type="tel" 
                              className="form-control" 
                              id="phone" 
                              value={formData.phone}
                              onChange={handleInputChange}
                              required 
                              placeholder=" " 
                            />
                            <label htmlFor="phone">Phone Number</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating">
                            <select className="form-select" id="state" value={formData.state} onChange={handleInputChange} required>
                              <option value="">Select State/Province</option>
                              <option value="Dhaka">Dhaka</option>
                              <option value="Barisal">Barisal</option>
                              <option value="Chittagong">Chittagong</option>
                              <option value="Khulna">Khulna</option>
                              <option value="Mymensingh">Mymensingh</option>
                              <option value="Rajshahi">Rajshahi</option>
                              <option value="Rangpur">Rangpur</option>
                              <option value="Sylhet">Sylhet</option>
                            </select>
                            <label htmlFor="state">State/Province</label>
                          </div>
                        </div>
                        
                        <div className="col-12">
                          <div className="form-floating">
                            <textarea className="form-control" id="address" value={formData.address} onChange={handleInputChange} required placeholder=" " rows="3"></textarea>
                            <label htmlFor="address">Address</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                name="location"
                                value="inside_dhaka"
                                checked={location === 'inside_dhaka'}
                                onChange={(e) => setLocation(e.target.value)}
                                id="insideDhaka"
                              />
                              <label className="form-check-label" htmlFor="insideDhaka">
                                <div className="option-content">
                                  <span className="option-title">Inside Dhaka</span>
                                  <span className="option-price"> ৳60</span>
                                </div>
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                name="location"
                                value="outside_dhaka"
                                checked={location === 'outside_dhaka'}
                                onChange={(e) => setLocation(e.target.value)}
                                id="outsideDhaka"
                              />
                              <label className="form-check-label" htmlFor="outsideDhaka">
                                <div className="option-content">
                                  <span className="option-title">Outside Dhaka</span>
                                  <span className="option-price"> ৳120</span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="checkout-card mb-4">
                    <div className="card-header">
                      <h4 className="mb-0">Payment Method</h4>
                    </div>
                    <div className="card-body">
                      <div className="payment-methods">
                        <div className="form-check mb-3">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            id="cod"
                          />
                          <label className="form-check-label" htmlFor="cod">
                            Cash on Delivery
                          </label>
                        </div>
                        
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="paymentMethod"
                            value="bkash"
                            checked={paymentMethod === 'bkash'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            id="bkash"
                          />
                          <label className="form-check-label" htmlFor="bkash">
                            bKash Payment
                          </label>
                        </div>

                        {paymentMethod === 'bkash' && (
                          <div className="bkash-fields mt-3">
                            <div className="form-floating mb-3">
                              <input
                                type="tel"
                                className="form-control"
                                id="bkashNumber"
                                value={formData.bkashNumber}
                                onChange={handleInputChange}
                                required
                                placeholder=" "
                              />
                              <label htmlFor="bkashNumber">bKash Number</label>
                            </div>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="transactionId"
                                value={formData.transactionId}
                                onChange={handleInputChange}
                                required
                                placeholder=" "
                              />
                              <label htmlFor="transactionId">Transaction ID</label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary for Mobile */}
                  <div className="d-block d-lg-none">
                    <div className="checkout-card">
                      <div className="card-header">
                        <h4 className="mb-0">Order Summary</h4>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Subtotal</span>
                          <span>৳{subtotal}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                          <span>Shipping</span>
                          <span>৳{shippingCost}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mb-4">
                          <span className="fw-bold">Total</span>
                          <span className="fw-bold">৳{total}</span>
                        </div>
                        <button 
                          type="submit"
                          className="btn btn-dark w-100"
                        >
                          Place Order
                        </button>
                        <Link to="/cart" className="btn btn-outline-dark w-100 mt-2">
                          Back to Cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary for Desktop */}
            <div className="col-lg-4 d-none d-lg-block">
              <div className="order-summary sticky-top">
                <div className="card">
                  <div className="card-header">
                    <h4 className="mb-0">Order Summary</h4>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal</span>
                      <span>৳{subtotal}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Shipping</span>
                      <span>৳{shippingCost}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-4">
                      <span className="fw-bold">Total</span>
                      <span className="fw-bold">৳{total}</span>
                    </div>
                    <button 
                      type="submit"
                      form="checkout-form"
                      className="btn btn-dark w-100"
                    >
                      Place Order
                    </button>
                    <Link to="/cart" className="btn btn-outline-dark w-100 mt-2">
                      Back to Cart
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ConfirmationModal 
        show={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmOrder}
      />
    </div>
  );
}

export default Checkout;
