import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL, API_URL_MEDIA } from '../data/Api';

function Banner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${API_URL}banner/`);
        const data = await response.json();
        setBanners(data[0]?.image || []); // Get the image array directly
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return; // Don't start interval if there's only one banner

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <section className="slider-section mb-4">
      <div className="first-slider p-0">
        <div className="banner-slider">
          <div className="item">
            <div className="position-relative">
              <div className="position-absolute top-50 slider-content translate-middle">
                <h3 className="h3 fw-bold d-none d-md-block">
                  {banners[currentIndex].heading}
                </h3>
                <h1 className="h1 fw-bold">
                  {banners[currentIndex].sub_heading}
                </h1>
                {/* <div className="">
                  <Link to="/women" className="btn btn-dark btn-ecomm px-4">
                    Shop Now
                  </Link>
                </div> */}
              </div>
              <img 
                src={`${API_URL_MEDIA}${banners[currentIndex].image}`} 
                className="img-fluid w-100" 
                alt={banners[currentIndex].heading || 'Banner'} 
                style={{ transition: 'opacity 0.5s ease-in-out' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;