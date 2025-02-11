import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faHeart, faMinus, faPlus, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { API_URL, API_URL_MEDIA } from '../data/Api';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`${API_URL}product-detail/${id}/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Failed to load product details. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.selling_price,
      image: product.images[0]?.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      total: quantity * product.selling_price
    };

    // Get existing cart items
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item with same id, size and color exists
    const existingItemIndex = cartItems.findIndex(item => 
      item.id === product.id && 
      item.size === selectedSize && 
      item.color === selectedColor
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cartItems[existingItemIndex].quantity += quantity;
      cartItems[existingItemIndex].total = cartItems[existingItemIndex].quantity * product.selling_price;
    } else {
      // Add new item if it doesn't exist
      cartItems.push(cartItem);
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Show success message
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (!product) return null;

  return (
    <div className="page-wrapper">
      <div className="product-details-wrapper py-4">
        <div className="container">
          <div className="row g-4">
            {/* Product Images */}
            <div className="col-md-6">
              <div className="product-gallery card border-0">
                <div className="card-body">
                  <div className="main-image mb-4">
                    <img
                      src={`${API_URL_MEDIA}${product.images[activeImage]?.image}`}
                      className="img-fluid rounded"
                      alt={product.name}
                    />
                  </div>
                  <div className="thumbnail-images">
                    <div className="row g-2">
                      {product.images.map((image, index) => (
                        <div key={image.id} className="col-3">
                          <img
                            src={`${API_URL_MEDIA}${image.image}`}
                            className={`img-fluid thumbnail rounded cursor-pointer ${activeImage === index ? 'border border-primary' : ''}`}
                            alt={`${product.name} thumbnail`}
                            onClick={() => setActiveImage(index)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="col-md-6">
              <div className="product-info card border-0">
                <div className="card-body">
                  <div className="mb-3">
                    <span className="badge bg-primary">{product.product_type}</span>
                    <span className="badge bg-secondary ms-2">{product.category.name}</span>
                  </div>

                  <h2 className="product-title h3 mb-3">{product.name}</h2>

                  <div className="product-price-wrapper mb-4">
                    <span className="selling-price h4 mb-0">৳{product.selling_price}</span>
                    {product.original_price !== product.selling_price && (
                      <span className="original-price h5 mb-0 ms-2">৳{product.original_price}</span>
                    )}
                  </div>

                  <div className="product-description mb-4">
                    <h6 className="fw-bold">Description</h6>
                    <p className="text-muted">{product.description}</p>
                  </div>

                  {/* Colors Selection */}
                  <div className="colors-selection mb-4">
                    <h6 className="fw-bold">Available Colors</h6>
                    <div className="d-flex gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color.id}
                          className={`btn ${selectedColor === color.color ? 'btn-dark' : 'btn-outline-dark'}`}
                          onClick={() => setSelectedColor(color.color)}
                        >
                          {color.color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="size-selection mb-4">
                    <h6 className="fw-bold">Select Size</h6>
                    <div className="d-flex gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size.id}
                          className={`btn ${selectedSize === size.size ? 'btn-dark' : 'btn-outline-dark'}`}
                          onClick={() => setSelectedSize(size.size)}
                        >
                          {size.size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selection */}
                  <div className="quantity-selection mb-4">
                    <h6 className="fw-bold">Quantity</h6>
                    <div className="input-group" style={{ width: '140px' }}>
                      <button 
                        className="btn btn-outline-dark"
                        onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <input 
                        type="text" 
                        className="form-control text-center" 
                        value={quantity}
                        readOnly
                      />
                      <button 
                        className="btn btn-outline-dark"
                        onClick={() => setQuantity(q => q + 1)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-dark"
                      onClick={() => navigate('/checkout')}
                      disabled={!selectedSize || !selectedColor}
                    >
                      <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                      Buy Now
                    </button>
                    <div className="d-flex gap-2">
                      <button 
                        className={`btn ${addedToCart ? 'btn-success' : 'btn-outline-dark'} flex-grow-1`}
                        onClick={handleAddToCart}
                        disabled={!selectedSize || !selectedColor || addedToCart}
                      >
                        <FontAwesomeIcon icon={faCartPlus} className="me-2" />
                        {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                      </button>
                      <button className="btn btn-outline-danger">
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                    </div>
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

export default ProductDetails;
