from django.contrib import admin
from .models import Product, Banner, Category, Order, OrderItem, BannerImage, ProductImages, ProductSize, ProductColor, ShopDetails
# Register your models here.
admin.site.register(Product)
admin.site.register(Banner)
admin.site.register(Category)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(BannerImage)
admin.site.register(ProductImages)
admin.site.register(ProductSize)
admin.site.register(ProductColor)
admin.site.register(ShopDetails)
