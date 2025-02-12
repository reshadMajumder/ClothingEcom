from django.contrib import admin
from django.urls import path
from .views import TrandingProduct, banner, category, product, order, man_product, woman_product, accessories_product, others_product, product_detail, shop_details

urlpatterns = [
    path('tranding-product/', TrandingProduct, name='tranding-product'),
    path('banner/', banner, name='banner'),
    path('category/', category, name='category'),
    path('product/', product, name='product'),
    path('order/', order, name='order'),
    path('man-product/', man_product, name='man-product'),
    path('woman-product/', woman_product, name='woman-product'),
    path('accessories-product/', accessories_product, name='accessories-product'),
    path('others-product/', others_product, name='others-product'),
    path('product-detail/<int:pk>/', product_detail, name='product-detail'),
    path('shop-details/', shop_details, name='shop-details'),
]