import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchShopDetails } from '../data/Api';

function Footer() {
  const [shopDetails, setShopDetails] = useState(null);

  useEffect(() => {
    fetchShopDetails().then(setShopDetails);
  }, []);

  return (
    <footer>
      <section className="py-5 border-top bg-light">
        <div className="container">
          <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
            <div className="col">
              <div className="footer-section1">
                <h5 className="mb-4 text-uppercase fw-bold">Contact Info</h5>
                <div className="address mb-3">
                  <h6 className="mb-0 text-uppercase fw-bold">Address</h6>
                  <p className="mb-0">{shopDetails?.shop_address}</p>
                </div>
                <div className="phone mb-3">
                  <h6 className="mb-0 text-uppercase fw-bold">Phone</h6>
                  <p className="mb-0">{shopDetails?.shop_phone}</p>
                </div>
                <div className="email mb-3">
                  <h6 className="mb-0 text-uppercase fw-bold">Email</h6>
                  <p className="mb-0">{shopDetails?.shop_email}</p>
                </div>
                <div className="working-days mb-3">
                  <h6 className="mb-0 text-uppercase fw-bold">WORKING DAYS</h6>
                  <p className="mb-0">{shopDetails?.working_hours}</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="footer-section2">
                <h5 className="mb-4 text-uppercase fw-bold">Categories</h5>
                <ul className="list-unstyled">
                  <li className="mb-1">
                    <Link to="/man"><i className="bx bx-chevron-right"></i> Man</Link>
                  </li>
                  <li className="mb-1">
                    <Link to="/women"><i className="bx bx-chevron-right"></i> Women</Link>
                  </li>
                  <li className="mb-1">
                    <Link to="/accessories"><i className="bx bx-chevron-right"></i> Accessories</Link>
                  </li>
                  <li className="mb-1">
                    <Link to="/others"><i className="bx bx-chevron-right"></i> Others</Link>
                  </li>

                </ul>
              </div>
            </div>
            {/* <div className="col">
              <div className="footer-section4">
                <h5 className="mb-4 text-uppercase fw-bold">Stay informed</h5>
                <div className="subscribe">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Your Email"
                  />
                  <div className="mt-3 d-grid">
                    <button className="btn btn-dark btn-ecomm">Subscribe</button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>
      <section className="footer-strip text-center py-3 border-top">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-center gap-3 justify-content-between">
            <p className="mb-0">Copyright © 2024. All right reserved.</p>
            <div className="payment-icon">
              <div className="row row-cols-auto g-2 justify-content-end">
                <div className="col">
                  <img src="assets/images/icons/bkash.png" alt="bkash" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;