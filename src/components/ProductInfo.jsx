import { useState, useEffect } from 'react';
import { getProductStats } from '../service/reviews.js';

export default function ProductInfo({
  product,
  selectedSize,
  quantity,
  onSizeChange,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  selectedVariant,
}) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [productStats, setProductStats] = useState({
    averageRating: 0,
    reviewCount: 0,
    soldCount: 0,
  });

  // 🧠 Lấy thống kê đánh giá sản phẩm
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getProductStats(product.id);
        setProductStats(stats);
      } catch (error) {
        console.error('Error fetching product stats:', error);
        setProductStats({ averageRating: 0, reviewCount: 0, soldCount: 0 });
      }
    };
    if (product?.id) fetchStats();
  }, [product.id]);

  // 💫 Render
  return (
    <div className="space-y-6">
      {/* 🏷️ Tên sản phẩm + rating */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

        <div className="flex items-center space-x-4 mb-4">
          {/* ⭐ Đánh giá */}
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled =
                  star <= Math.floor(productStats.averageRating)
                    ? 'ri-star-fill'
                    : star === Math.ceil(productStats.averageRating) &&
                      productStats.averageRating % 1 > 0
                    ? 'ri-star-half-fill'
                    : 'ri-star-line';
                return (
                  <i
                    key={star}
                    className={`${filled} text-yellow-400 w-5 h-5 flex items-center justify-center`}
                  ></i>
                );
              })}
            </div>
            <span className="text-sm text-gray-600">
              {productStats.averageRating > 0
                ? `${productStats.averageRating} (${productStats.reviewCount} đánh giá)`
                : 'Chưa có đánh giá'}
            </span>
          </div>

          {productStats.soldCount > 0 && (
            <>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-600">
                Đã bán {productStats.soldCount}
              </span>
            </>
          )}

          {selectedVariant?.stock !== undefined && selectedVariant?.stock > 0 && (
            <>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-600">
                Còn lại {selectedVariant.stock} sản phẩm
              </span>
            </>
          )}
        </div>
      </div>

      {/* 💰 Giá */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-3xl font-bold text-red-600">
            {(selectedVariant?.price ?? product.price).toLocaleString('vi-VN')}₫
          </span>
          {product.originalPrice &&
            product.originalPrice > (selectedVariant?.price ?? product.price) && (
              <span className="text-lg text-gray-500 line-through">
                {product.originalPrice.toLocaleString('vi-VN')}₫
              </span>
            )}
        </div>
        {product.originalPrice &&
          product.originalPrice > (selectedVariant?.price ?? product.price) && (
            <p className="text-sm text-gray-600">
              Tiết kiệm{' '}
              {(
                product.originalPrice -
                (selectedVariant?.price ?? product.price)
              ).toLocaleString('vi-VN')}
              ₫
            </p>
          )}
      </div>

      {/* 🪻 Kích cỡ / loại hoa */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">
            Loại / Kích cỡ:{' '}
            <span className="font-normal">{selectedSize || 'Chưa chọn'}</span>
          </h3>
          {product.sizes?.length > 0 && (
            <button
              onClick={() => setShowSizeGuide(!showSizeGuide)}
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Bảng size
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {product.sizes?.length > 0 ? (
            product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`py-2 px-3 border rounded-lg text-sm transition-all whitespace-nowrap cursor-pointer ${
                  selectedSize === size
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))
          ) : (
            <div className="text-sm text-gray-500">
              Không có loại tùy chọn
            </div>
          )}
        </div>

        {/* Modal bảng size */}
        {showSizeGuide && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSizeGuide(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Bảng kích cỡ</h3>
                <button onClick={() => setShowSizeGuide(false)}>
                  <i className="ri-close-line w-5 h-5"></i>
                </button>
              </div>
              <div className="space-y-2">
                {product.sizes.map((s) => (
                  <div
                    key={s}
                    className="flex justify-between border-b py-2 text-sm"
                  >
                    <span>Loại {s}</span>
                    <span className="text-gray-600">Phù hợp nhiều dịp</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📦 Số lượng */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Số lượng:</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <i className="ri-subtract-line w-4 h-4"></i>
            </button>
            <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => {
                const max = selectedVariant?.stock || 1;
                if (selectedVariant?.stock > 0) {
                  onQuantityChange(Math.min(quantity + 1, max));
                }
              }}
              disabled={
                !selectedVariant ||
                selectedVariant?.stock === 0 ||
                quantity >= (selectedVariant?.stock || 1)
              }
              className="p-2 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="ri-add-line w-4 h-4"></i>
            </button>
          </div>
          {selectedVariant?.stock !== undefined && selectedVariant?.stock > 0 && (
            <span className="text-sm text-gray-600">
              Còn lại {selectedVariant.stock} sản phẩm
            </span>
          )}
        </div>
      </div>

      {/* 🛒 Nút hành động */}
      <div className="space-y-3">
        <div className="flex space-x-3">
          <button
            onClick={onAddToCart}
            disabled={!selectedVariant || selectedVariant?.stock === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-xl font-medium transition-all"
          >
            <i className="ri-shopping-cart-line mr-2"></i>
            Thêm vào giỏ
          </button>
          <button
            onClick={onBuyNow}
            disabled={!selectedVariant || selectedVariant?.stock === 0}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-xl font-medium transition-all"
          >
            Mua ngay
          </button>
        </div>
      </div>

      {/* 🌸 Đặc điểm nổi bật */}
      {product.features?.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 mb-3">Đặc điểm nổi bật:</h4>
          <ul className="space-y-2">
            {product.features.map((feature, i) => (
              <li key={i} className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
