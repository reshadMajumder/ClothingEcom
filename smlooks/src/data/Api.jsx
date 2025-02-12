const BASE_URL = 'http://127.0.0.1:8000';
export const API_URL = `${BASE_URL}/api/`;
export const API_URL_MEDIA = BASE_URL;  // Remove /media since it's included in the image path
export const API_URL_SHOP_DETAILS = `${BASE_URL}/api/shop-details/`;

//fetch shop details
export const fetchShopDetails = async () => {
    const response = await fetch(API_URL_SHOP_DETAILS);
    const data = await response.json();
    return data;
}



