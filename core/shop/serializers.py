from rest_framework import serializers
from .models import Product, Banner, Category, ProductImages, ProductSize, ProductColor, Order, OrderItem, BannerImage, ShopDetails




class BannerImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BannerImage
        fields = '__all__'
class BannerSerializer(serializers.ModelSerializer):
    image = BannerImageSerializer(many=True)
    class Meta:
        model = Banner
        fields = '__all__'
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
class ProductImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImages
        fields = '__all__'
class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = '__all__'
class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = '__all__'
class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    images = ProductImagesSerializer(many=True)
    sizes = ProductSizeSerializer(many=True)
    colors = ProductColorSerializer(many=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'product_type', 'stock',
            'images', 'sizes', 'colors', 'selling_price', 'original_price',
            'is_trending', 'description'
        ]

class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImagesSerializer(many=True)
    sizes = ProductSizeSerializer(many=True)
    colors = ProductColorSerializer(many=True)
    category = CategorySerializer()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'original_price', 
            'selling_price', 'discount', 'images', 'sizes', 
            'colors', 'category', 'product_type'
        ]
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price']
class OrderSerializer(serializers.ModelSerializer):
    products = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        products_data = validated_data.pop('products')
        order = Order.objects.create(**validated_data)
        
        for product_data in products_data:
            OrderItem.objects.create(**product_data)
            order.products.add(OrderItem.objects.latest('id'))
        
        return order
class ShopDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopDetails
        fields = '__all__'