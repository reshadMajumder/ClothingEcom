from django.shortcuts import render
#rest framework imports
from rest_framework.decorators import api_view

from rest_framework.response import Response
from rest_framework import status
from .models import Product, Banner, Category, Order, ShopDetails
from .serializers import ProductSerializer, BannerSerializer, CategorySerializer, OrderSerializer, ProductDetailSerializer, ShopDetailsSerializer   
from django.db import transaction
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.db.models import Prefetch

# Create your views here.

@api_view(['GET'])
def TrandingProduct(request):
    products = Product.objects.select_related('category').prefetch_related(
        'images',
        'sizes',
        'colors'
    ).filter(is_trending=True, is_active=True)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@cache_page(60 * 60)
@api_view(['GET'])
def banner(request):
    banners = Banner.objects.prefetch_related('image').all()
    serializer = BannerSerializer(banners, many=True)
    return Response(serializer.data)

@cache_page(60 * 60 * 6)
@api_view(['GET'])
def category(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def product(request):
    products = Product.objects.select_related('category').prefetch_related(
        'images',
        'sizes',
        'colors'
    ).filter(is_active=True)
    
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def man_product(request):
    products = Product.objects.select_related('category').prefetch_related(
        'images',
        'sizes',
        'colors'
    ).filter(product_type='man', is_active=True)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def woman_product(request):
    products = Product.objects.select_related('category').prefetch_related(
        'images',
        'sizes',
        'colors'
    ).filter(product_type='woman', is_active=True)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])  
def accessories_product(request):
    if request.method == 'GET':
        products = Product.objects.filter(product_type='accessories')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def others_product(request):
    if request.method == 'GET':
        products = Product.objects.filter(product_type='others')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def product_detail(request, pk):
    cache_key = f'product_detail_{pk}'
    product = cache.get(cache_key)
    
    if product is None:
        product = Product.objects.select_related('category').prefetch_related(
            'images',
            'sizes',
            'colors'
        ).get(id=pk)
        cache.set(cache_key, product, timeout=60*30)  # Cache for 30 minutes
    
    serializer = ProductDetailSerializer(product)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def order(request):
    if request.method == 'GET':
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # First validate stock availability for all products
        products_data = request.data.get('products', [])
        stock_issues = []
        
        for item in products_data:
            try:
                product = Product.objects.get(id=item['product'])
                if product.stock < item['quantity']:
                    stock_issues.append({
                        'product_id': product.id,
                        'product_name': product.name,
                        'requested_quantity': item['quantity'],
                        'available_quantity': product.stock
                    })
            except Product.DoesNotExist:
                return Response(
                    {'error': f'Product with id {item["product"]} does not exist'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # If there are stock issues, return them
        if stock_issues:
            return Response({
                'error': 'Insufficient stock',
                'stock_issues': stock_issues
            }, status=status.HTTP_400_BAD_REQUEST)

        # If stock is available, proceed with order creation
        try:
            with transaction.atomic():  # Use transaction to ensure data consistency
                serializer = OrderSerializer(data=request.data)
                if serializer.is_valid():
                    order = serializer.save()
                    
                    # Update product stock
                    for item in products_data:
                        product = Product.objects.get(id=item['product'])
                        product.stock -= item['quantity']
                        product.save()
                    
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response(
                {'error': 'Failed to create order', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
@api_view(['GET'])
def shop_details(request):
    shop_details = ShopDetails.objects.first()
    serializer = ShopDetailsSerializer(shop_details)
    return Response(serializer.data)

