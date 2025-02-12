from django.db import models

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    def __str__(self):
        return self.name

class ProductImages(models.Model):
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    def __str__(self):
        return self.image.url

class ProductSize(models.Model):
    size = models.CharField(max_length=200, null=True, blank=True)
    def __str__(self):  
        return self.size

class ProductColor(models.Model):
    color = models.CharField(max_length=200, null=True, blank=True)
    def __str__(self):
        return self.color
    

class Product(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True, db_index=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    PRODUCT_TYPE_CHOICES = (
        ('man', 'Man'),
        ('woman', 'Woman'),
        ('accessories', 'Accessories'),
        ('others', 'Others'),
    )
    product_type = models.CharField(max_length=200, choices=PRODUCT_TYPE_CHOICES, null=True, blank=True, db_index=True)
    stock = models.IntegerField(null=True, blank=True)
    images = models.ManyToManyField(ProductImages)
    sizes = models.ManyToManyField(ProductSize)
    colors = models.ManyToManyField(ProductColor)
    description = models.TextField(null=True, blank=True)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, db_index=True)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_trending = models.BooleanField(default=False, db_index=True)

    def __str__(self):
        return f'{self.name} - {self.category.name} - {self.product_type} - {self.stock}'

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product_type', 'is_active']),
            models.Index(fields=['is_trending', 'is_active']),
        ]

class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.IntegerField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'{self.product.name} - {self.quantity}'

class Order(models.Model):
    products = models.ManyToManyField(OrderItem)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    order_status = models.BooleanField(default=False)
    order_date = models.DateTimeField(auto_now_add=True)
    order_address = models.TextField(null=True, blank=True)
    order_phone = models.CharField(max_length=200, null=True, blank=True)
    order_name = models.CharField(max_length=200, null=True, blank=True)
    order_city = models.CharField(max_length=200, null=True, blank=True)
    order_state = models.CharField(max_length=200, null=True, blank=True)
    order_payment_method = models.CharField(max_length=200, null=True, blank=True)
    order_payment_id = models.CharField(max_length=200, null=True, blank=True)
    order_payment_phone = models.CharField(max_length=200, null=True, blank=True)    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Order #{self.id} - {self.order_name}'

class BannerImage(models.Model):
    image = models.ImageField(upload_to='banners/', null=True, blank=True)
    heading = models.CharField(max_length=200, null=True, blank=True)
    sub_heading = models.CharField(max_length=200, null=True, blank=True)

    
class Banner(models.Model):
    image = models.ManyToManyField(BannerImage)

class ShopDetails(models.Model):
    shop_name = models.CharField(max_length=200, null=True, blank=True)
    shop_address = models.TextField(null=True, blank=True)
    shop_phone = models.CharField(max_length=200, null=True, blank=True)
    shop_email = models.EmailField(null=True, blank=True)
    shop_logo = models.ImageField(upload_to='shop_logo/', null=True, blank=True)
    working_hours = models.CharField(max_length=200, null=True, blank=True)
