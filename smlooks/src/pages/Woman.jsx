import React, { useState, useEffect } from 'react'
import FilterBy from '../components/FilterBy'
import ProductCard from '../components/ProductCard'
import { API_URL } from '../data/Api'

function Woman() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}woman-product/`);
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


            <div className="separator p-4">
                <div className="line"></div>
                <h4 className="mb-0 fw-bold separator-title">Womens Items</h4>
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
    )
}

export default Woman