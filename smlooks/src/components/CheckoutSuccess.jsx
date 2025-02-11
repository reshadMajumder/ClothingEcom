import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHome, faBox } from '@fortawesome/free-solid-svg-icons';

function CheckoutSuccess() {
  return (
    <div className="page-wrapper">
      <div className="checkout-success">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-0 shadow">
                <div className="card-body text-center p-5">
                  <div className="success-icon mb-4">
                    <FontAwesomeIcon icon={faCheckCircle} size="3x" className="text-success" />
                  </div>
                  <h2 className="mb-3">Thank You For Your Order!</h2>
                  <p className="mb-4">Your order has been placed and will be processed as soon as possible.</p>
                  <div className="order-info mb-4">
                    <h5>Order Information</h5>
                    <p className="mb-1">Order Number: #ORD-2024-001</p>
                    <p>You will receive an order confirmation email with details of your order.</p>
                  </div>
                  <div className="d-flex gap-3 justify-content-center">
                    <Link to="/" className="btn btn-light btn-ecomm">
                      <FontAwesomeIcon icon={faHome} className="me-2" />
                      Back to Home
                    </Link>
                    <Link to="/orders" className="btn btn-dark btn-ecomm">
                      <FontAwesomeIcon icon={faBox} className="me-2" />
                      Track Order
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess; 