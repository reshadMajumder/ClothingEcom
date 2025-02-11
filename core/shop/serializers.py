from rest_framework import serializers
from .models import Product, Banner, Category, ProductImages, ProductSize, ProductColor, Order, OrderItem, BannerImage, Banner




class BannerImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BannerImage
        fields = '__all__'
class BannerSerializer(serializers.ModelSerializer):
    banner_image = BannerImageSerializer(many=True)
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
    images = ProductImagesSerializer(many=True)
    sizes = ProductSizeSerializer(many=True)
    colors = ProductColorSerializer(many=True)
    category = CategorySerializer()
    class Meta:
        model = Product
        fields = '__all__'
class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImagesSerializer(many=True)
    sizes = ProductSizeSerializer(many=True)
    colors = ProductColorSerializer(many=True)
    category = CategorySerializer()
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'original_price', 'selling_price', 'discount', 'images', 'sizes', 'colors', 'category','product_type']
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
