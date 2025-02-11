import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterBy from '../components/FilterBy';
import { API_URL, API_URL_MEDIA } from '../data/Api';

function Homepage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}tranding-product/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <section className="slider-section mb-4">
        <div className="first-slider p-0">
          <div className="banner-slider owl-carousel owl-theme">
            <div className="item">
              <div className="position-relative">
                <div className="position-absolute top-50 slider-content translate-middle">
                  <h3 className="h3 fw-bold d-none d-md-block">New Trending</h3>
                  <h1 className="h1 fw-bold">Women Fashion</h1>
                  <p className="fw-bold text-dark d-none d-md-block">
                    <i>Last call for upto 15%</i>
                  </p>
                  <div className="">
                    <Link to="/women" className="btn btn-dark btn-ecomm px-4">
                      Shop Now
                    </Link>
                  </div>
                </div>
                <img src="assets/images/banners/01.png" className="img-fluid" alt="banner" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="separator p-4">
        <div className="line"></div>
        <h4 className="mb-0 fw-bold separator-title">Featured Products</h4>
        <div className="line"></div>
      </div>

      <section className="py-4">
        <div className="container">
          <FilterBy />
          <div className="product-grid">
            <div className="row row-cols-2 row-cols-md-4 g-3 g-sm-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Homepage;