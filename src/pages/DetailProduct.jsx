import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ProductTabs from '../components/ProductTabsProps';
import RelatedProducts from '../components/RelatedProduct';
import ProductReviews from '../components/ProductReviews';
import { fetchProductDetail, fetchProductsByCategory } from '../service/product.js';
import { ShoesShopContext } from '../context/ShoeShopContext';
import { useNotification } from '../context/NotificationContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleAddToCart, categories, getCurrentUser } = useContext(ShoesShopContext);
  const { showWarning, showSuccess } = useNotification();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  // 🧠 Load dữ liệu sản phẩm
  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductDetail(id);

        if (!productData) {
          setError('Sản phẩm không tồn tại');
          return;
        }

        setProduct(productData);

        // 🔗 Lấy sản phẩm liên quan theo categoryId
        if (productData.categoryId) {
          const relatedData = await fetchProductsByCategory(productData.categoryId);
          const filteredRelated = relatedData.filter((p) => p.id !== id).slice(0, 4);
          setRelatedProducts(filteredRelated);
        }

        // 🧩 Set variant mặc định
        if (productData.variants?.length > 0) {
          const firstVariant = productData.variants[0];
          setSelectedSize(firstVariant.size?.toString() || '');
          setSelectedColor(firstVariant.color || '');
        }

        // 🌟 Review mẫu (giả lập)
        setReviews([
          {
            id: 1,
            user: 'Nguyễn Văn A',
            rating: 5,
            comment: 'Bó hoa rất đẹp, đóng gói cẩn thận, giao hàng nhanh!',
            date: '2025-10-10',
          },
          {
            id: 2,
            user: 'Trần Thị B',
            rating: 4,
            comment: 'Hoa tươi, mùi hương dễ chịu, dịch vụ chu đáo.',
            date: '2025-09-25',
          },
          {
            id: 3,
            user: 'Lê Cường',
            rating: 5,
            comment: 'Hoa được thiết kế tinh tế, đúng mẫu trong hình.',
            date: '2025-09-05',
          },
        ]);
      } catch (error) {
        console.error('Error loading product:', error);
        setError('Có lỗi xảy ra khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProductData();
  }, [id]);

  // 🔍 Lấy variant được chọn
  const getSelectedVariant = () => {
    if (!product?.variants) return null;

    let variant = product.variants.find(
      (v) => v.size?.toString() === selectedSize && v.color === selectedColor
    );
    if (!variant && selectedSize)
      variant = product.variants.find((v) => v.size?.toString() === selectedSize);
    if (!variant && selectedColor)
      variant = product.variants.find((v) => v.color === selectedColor);
    if (!variant && product.variants.length > 0) variant = product.variants[0];
    return variant;
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : '';
  };

  // 🛒 Thêm vào giỏ hàng (dùng context)
  const handleAddToCartClick = async () => {
    const variant = getSelectedVariant();
    const user = getCurrentUser();

    if (!variant) return showWarning('Vui lòng chọn loại hoa hoặc kích cỡ!');
    if (variant.stock < quantity)
      return showWarning('Số lượng vượt quá hàng tồn kho!');
    if (!user)
      return showWarning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');

    try {
      // Gọi hàm context (đã khớp với API addItem)
      await handleAddToCart(product, quantity, variant);
    } catch (err) {
      console.error('Add to cart error:', err);
      showWarning('Không thể thêm sản phẩm vào giỏ hàng!');
    }
  };

  // 💳 Mua ngay
  const handleBuyNow = async () => {
    const variant = getSelectedVariant();
    const user = getCurrentUser();

    if (!variant) return showWarning('Vui lòng chọn loại hoa hoặc kích cỡ!');
    if (variant.stock < quantity)
      return showWarning('Số lượng vượt quá hàng tồn kho!');

    try {
      await handleAddToCart(product, quantity, variant);
      if (user) navigate('/cart');
      else showWarning('Vui lòng đăng nhập để mua hàng!');
    } catch (err) {
      console.error('Buy now error:', err);
      showWarning('Không thể xử lý đơn hàng!');
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Lỗi / không tìm thấy
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <h3 className="text-gray-700">{error || 'Không tìm thấy sản phẩm'}</h3>
      </div>
    );
  }

  // Chuẩn bị dữ liệu hiển thị
  const selectedVariant = getSelectedVariant();
  const currentPrice = selectedVariant?.price || product.price || 0;
  const originalPrice = product.originalPrice || currentPrice;
  const discount =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const images = [
    ...(product.images || []),
    ...(product.variants?.flatMap((v) => v.images || []) || []),
  ];

  const productDataForComponents = {
    ...product,
    price: currentPrice,
    originalPrice,
    discount,
    rating: 4.8,
    reviewCount: reviews.length,
    sold: 120,
    images,
    sizes: [...new Set(product.variants?.map((v) => v.size?.toString()).filter(Boolean))],
    colors: [...new Set(product.variants?.map((v) => v.color).filter(Boolean))],
  };

  // 🌸 Render
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <ProductGallery images={images} name={product.name} />
          <ProductInfo
            product={productDataForComponents}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            quantity={quantity}
            onSizeChange={setSelectedSize}
            onColorChange={setSelectedColor}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCartClick}
            onBuyNow={handleBuyNow}
            selectedVariant={selectedVariant}
          />
        </div>

        <ProductTabs product={productDataForComponents} reviews={reviews} />
        <ProductReviews product={product} reviews={reviews} />
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </div>
  );
}
