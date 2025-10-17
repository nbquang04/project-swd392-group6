import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ProductTabs from '../components/ProductTabsProps';
import RelatedProducts from '../components/RelatedProduct';
import ProductReviews from '../components/ProductReviews';
import ReviewForm from '../components/ReviewForm';
import { fetchProductDetail, fetchProductsByCategory, fetchCategory, fetchProductReviews, submitProductReview } from '../service/product';
import { ShoesShopContext } from '../context/ShoeShopContext';
import { useNotification } from '../context/NotificationContext';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, buyProduct, carts, categories, orders, getCompleteUserData, getCurrentUser } = useContext(ShoesShopContext);
  const { showWarning, showSuccess } = useNotification();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const productData = await fetchProductDetail(id);

        if (!productData) {
          setError('Sản phẩm không tồn tại');
          return;
        }

        setProduct(productData);

        // Load related products from the same category
        if (productData.category_id) {
          const relatedData = await fetchProductsByCategory(productData.category_id);
          const filteredRelated = relatedData
            .filter(p => p.id !== id)
            .slice(0, 4);
          setRelatedProducts(filteredRelated);
        }

        // Set default selections
        if (productData.variants && productData.variants.length > 0) {
          const firstVariant = productData.variants[0];
          setSelectedSize(firstVariant.size?.toString() || '');
          setSelectedColor(firstVariant.color_code || '');
        }

        // Load reviews for this product
        const productReviews = await fetchProductReviews(productData.id);
        setReviews(productReviews);

      } catch (error) {
        console.error('Error loading product:', error);
        setError('Có lỗi xảy ra khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProductData();
    }
  }, [id]);
  console.log(product)

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const getSelectedVariant = () => {
    if (!product || !product.variants) return null;

    // First try to find exact match
    let variant = product.variants.find(v =>
      v.size?.toString() === selectedSize &&
      v.color_code === selectedColor
    );

    // If no exact match, try to find variant with same size
    if (!variant && selectedSize) {
      variant = product.variants.find(v => v.size?.toString() === selectedSize);
    }

    // If still no match, try to find variant with same color
    if (!variant && selectedColor) {
      variant = product.variants.find(v => v.color_code === selectedColor);
    }

    // If still no match, return first variant
    if (!variant && product.variants.length > 0) {
      variant = product.variants[0];
    }

    return variant;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  // SỬA ĐOẠN NÀY: truyền đúng object variant cho addToCart
  const handleAddToCart = () => {
    const variant = getSelectedVariant();
    if (!variant) {
      showWarning('Vui lòng chọn kích cỡ và màu sắc');
      return;
    }
    if (variant.stock_quantity < quantity) {
      showWarning('Số lượng vượt quá hàng tồn kho');
      return;
    }
    // Tạo object đúng dạng context yêu cầu
    const cartItem = {
      ...product,
      id: `${product.id}-${variant.sku}`,
      name: product.name,
      variant_sku: variant.sku,
      color_code: variant.color_code,
      size: variant.size,
      price: variant.price,
      stock_quantity: variant.stock_quantity,
      images: variant.images || product.images,
    };
    addToCart(cartItem, quantity);
  };

  // SỬA ĐOẠN NÀY: truyền đúng object variant cho buyProduct
  const handleBuyNow = () => {
    const variant = getSelectedVariant();
    const user = getCurrentUser();
    if (!variant) {
      showWarning('Vui lòng chọn kích cỡ và màu sắc');
      return;
    }
    if (variant.stock_quantity < quantity) {
      showWarning('Số lượng vượt quá hàng tồn kho');
      return;
    }
    const buyItem = {
      ...product,
      id: `${product.id}-${variant.sku}`,
      name: product.name,
      variant_sku: variant.sku,
      color_code: variant.color_code,
      size: variant.size,
      price: variant.price,
      stock_quantity: variant.stock_quantity,
      images: variant.images || product.images,
    };
    // Thêm vào giỏ hàng trước
    addToCart(buyItem, quantity);
    // Hiển thị thông báo thành công
    // showSuccess('Đã thêm sản phẩm vào giỏ hàng!');
    // Sau đó chuyển đến trang giỏ hàng
    if (user) {

      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">{error || 'Sản phẩm không tồn tại'}</h3>
          <div className="mt-6">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Quay lại trang sản phẩm
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Clone để tránh ảnh hưởng mảng gốc
  let productImages = [...(product.images || [])];

  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      if (variant.images && variant.images.length > 0) {
        productImages.push(...variant.images);
      }
    });
  }

  // Loại bỏ ảnh trùng
  productImages = [...new Set(productImages)];


  const uniqueSizes = [...new Set(product.variants?.map(v => v.size?.toString()).filter(Boolean) || [])];
  const uniqueColors = [...new Set(product.variants?.map(v => v.color_code).filter(Boolean) || [])];

  const selectedVariant = getSelectedVariant();
  const currentPrice = selectedVariant?.price || 0;
  const originalPrice = selectedVariant?.cost_price || 0;
  const hasDiscount = originalPrice > currentPrice;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  // Kiểm tra xem người dùng đã mua sản phẩm này chưa
  const user = getCompleteUserData();
  const userHasPurchased = user && orders.some(order =>
    order.user_id === user.id &&
    order.status === 'delivered' &&
    order.items?.some(item => item.product_id && item.product_id.startsWith(product.id))
  );

  const productDataForComponents = {
    ...product,
    price: currentPrice,
    originalPrice: originalPrice,
    discount: discountPercentage,
    rating: 4.8,
    reviewCount: 256,
    sold: 1250,
    brand: 'Brand',
    sku: selectedVariant?.sku || '',
    availability: selectedVariant?.stock_quantity > 0 ? 'Còn hàng' : 'Hết hàng',
    images: productImages,
    colors: uniqueColors.map(colorCode => ({
      name: colorCode,
      value: colorCode,
      hex: colorCode
    })),
    sizes: uniqueSizes,
    features: [
      'Chất liệu cao cấp',
      'Thiết kế hiện đại',
      'Phù hợp nhiều hoạt động',
      'Bảo hành 12 tháng'
    ],
    userHasPurchased
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      // Thêm thông tin user vào review
      const completeReviewData = {
        ...reviewData,
        user_id: user.id,
        user_name: user.name,
        verified_purchase: true,
        helpful_count: 0,
        id: `REV-${Date.now()}`
      };

      // Gọi API để lưu review
      await submitProductReview(completeReviewData);

      // Reload reviews
      const updatedReviews = await fetchProductReviews(product.id);
      setReviews(updatedReviews);

      setShowReviewForm(false);
      setSelectedProductForReview(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div >
        <div className="max-w-7xl mx-auto pr-4 pt-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-gray-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link to="/products" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Sản phẩm
                  </Link>
                </div>
              </li>
              {product.category_id && (
                <li>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link
                      to={`/products?category=${product.category_id}`}
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      {getCategoryName(product.category_id)}
                    </Link>
                  </div>
                </li>
              )}
              <li>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-900 truncate max-w-xs">
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Gallery */}
          <ProductGallery
            images={productImages}
            productName={product.name}
          />

          {/* Product Info */}
          <ProductInfo
            product={productDataForComponents}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            quantity={quantity}
            onSizeChange={setSelectedSize}
            onColorChange={setSelectedColor}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            selectedVariant={selectedVariant}
          />
        </div>

        {/* Product Tabs */}
        <ProductTabs
          product={productDataForComponents}
          reviews={reviews}
          onWriteReview={() => {
            // Tìm đơn hàng đã giao hàng của sản phẩm này
            const userOrder = orders.find(order =>
              order.user_id === user?.id &&
              order.status === 'delivered' &&
              order.items?.some(item => item.product_id && item.product_id.startsWith(product.id))
            );

            if (userOrder) {
              const orderItem = userOrder.items.find(item => item.product_id && item.product_id.startsWith(product.id));
              const productForReview = {
                id: product.id,
                name: product.name,
                images: product.images,
                color: orderItem?.color,
                size: orderItem?.size
              };

              // Mở modal đánh giá
              setShowReviewForm(true);
              setSelectedProductForReview({ product: productForReview, order: userOrder });
            }
          }}
        />

        {/* Product Reviews */}
        <div className="mb-12">
          <ProductReviews product={product} reviews={reviews} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && selectedProductForReview && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ReviewForm
              product={selectedProductForReview.product}
              order={selectedProductForReview.order}
              onSubmit={handleSubmitReview}
              onCancel={() => {
                setShowReviewForm(false);
                setSelectedProductForReview(null);
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
