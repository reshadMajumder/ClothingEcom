from django.shortcuts import render
#rest framework imports
from rest_framework.decorators import api_view

from rest_framework.response import Response
from rest_framework import status
from .models import Product, Banner, Category, Order, OrderItem
from .serializers import ProductSerializer, BannerSerializer, CategorySerializer, OrderSerializer, ProductDetailSerializer
from django.db import transaction

# Create your views here.

@api_view(['GET'])
def TrandingProduct(request):
    if request.method == 'GET':
        tranding_products = Product.objects.filter(is_trending=True)
        serializer = ProductSerializer(tranding_products, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def banner(request):
    if request.method == 'GET':
        banners = Banner.objects.all()
        serializer = BannerSerializer(banners, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def category(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def product(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def man_product(request):
    if request.method == 'GET':
        products = Product.objects.filter(product_type='man')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def woman_product(request):
    if request.method == 'GET':
        products = Product.objects.filter(product_type='woman')
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
    if request.method == 'GET':
        product = Product.objects.get(id=pk)
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
