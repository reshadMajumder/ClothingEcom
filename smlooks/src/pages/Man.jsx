import React from 'react'
import FilterBy from '../components/FilterBy'
import ProductCard from '../components/ProductCard'

function Man() {
    const products = [
        {

          id: 1,
          name: "White Polo Shirt",
          price: "48.00",
          image: "assets/images/products/02.jpg"
        },
        {
          id: 2,
          name: "White Polo Shirt",
          price: "48.00",
          image: "assets/images/products/01.jpg"
        },
        {
          id: 3,
          name: "White Polo Shirt",
          price: "48.00",
          image: "assets/images/products/04.jpg"
        },
        {
          id: 4,
          name: "White Polo Shirt",
          price: "48.00",
          image: "assets/images/products/01.jpg"
        },
    
        // Add more products as needed
      ];
    return (
        
        <>


            <div className="separator p-4">
                <div className="line"></div>
                <h4 className="mb-0 fw-bold separator-title">Mens Items</h4>
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

export default Man