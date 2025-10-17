
import { useState, useEffect } from 'react';
import { getProductStats } from '../service/reviews';

export default function ProductInfo({
    product,
    selectedSize,
    selectedColor,
    quantity,
    onSizeChange,
    onColorChange,
    onQuantityChange,
    onAddToCart,
    onBuyNow,
    selectedVariant
}) {
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [showNotification, setShowNotification] = useState('');
    const [productStats, setProductStats] = useState({
        averageRating: 0,
        reviewCount: 0,
        soldCount: 0
    });

    // Tính toán rating và review count từ backend
    useEffect(() => {
        const fetchProductStats = async () => {
            try {
                const stats = await getProductStats(product.id);
                setProductStats(stats);
            } catch (error) {
                console.error('Error fetching product stats:', error);
                setProductStats({
                    averageRating: 0,
                    reviewCount: 0,
                    soldCount: 0
                });
            }
        };

        fetchProductStats();
    }, [product.id]);

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart();
        } else {
            setShowNotification('Đã thêm sản phẩm vào giỏ hàng!');
            setTimeout(() => setShowNotification(''), 3000);
        }
    };

    const handleBuyNow = () => {
        if (onBuyNow) {
            onBuyNow();
        } else {
            setShowNotification('Đang chuyển đến trang giỏ hàng...');
            setTimeout(() => setShowNotification(''), 3000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

                {/* Product Statistics */}
                <div className="flex items-center space-x-4 mb-4">
                    {/* Rating Stars */}
                    <div className="flex items-center space-x-1">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const starClass = star <= Math.floor(productStats.averageRating) 
                                    ? 'fill' 
                                    : star === Math.ceil(productStats.averageRating) && productStats.averageRating % 1 > 0
                                        ? 'half-fill'
                                        : 'line';
                                
                                return (
                                    <i
                                        key={star}
                                        className={`ri-star-${starClass} text-yellow-400 w-5 h-5 flex items-center justify-center`}
                                    ></i>
                                );
                            })}
                        </div>
                        <span className="text-sm text-gray-600">
                            {productStats.averageRating > 0 ? `${productStats.averageRating} (${productStats.reviewCount} đánh giá)` : 'Chưa có đánh giá'}
                        </span>
                        

                    </div>
                    
                    {/* Divider */}
                    {productStats.reviewCount > 0 && (
                        <div className="h-4 w-px bg-gray-300"></div>
                    )}
                    
                    {/* Sold Count */}
                    {productStats.soldCount > 0 && (
                        <span className="text-sm text-gray-600">Đã bán {productStats.soldCount}</span>
                    )}
                    
                    {/* Stock Status */}
                    {selectedVariant?.stock_quantity !== undefined && (
                        <>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <span className="text-sm text-gray-600">
                                Còn lại {selectedVariant.stock_quantity} sản phẩm
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl font-bold text-red-600">
                        {selectedVariant ? selectedVariant.price.toLocaleString('vi-VN') : product.price.toLocaleString('vi-VN')}₫
                    </span>
                    {selectedVariant?.cost_price && selectedVariant.cost_price > selectedVariant.price && (
                        <span className="text-lg text-gray-500 line-through">
                            {selectedVariant.cost_price.toLocaleString('vi-VN')}₫
                        </span>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-lg text-gray-500 line-through">
                            {product.originalPrice.toLocaleString('vi-VN')}₫
                        </span>
                    )}
                </div>
                {(selectedVariant?.cost_price && selectedVariant.cost_price > selectedVariant.price) || 
                 (product.originalPrice && product.originalPrice > product.price) ? (
                    <p className="text-sm text-gray-600">
                        Tiết kiệm {selectedVariant 
                            ? (selectedVariant.cost_price - selectedVariant.price).toLocaleString('vi-VN')
                            : (product.originalPrice - product.price).toLocaleString('vi-VN')
                        }₫
                    </p>
                ) : null}
            </div>

            {/* Colors */}
            <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Màu sắc: <span className="font-normal">{product.colors?.find(c => c.value === selectedColor)?.name || 'Chưa chọn'}</span>
                </h3>
                <div className="flex space-x-3">
                    {product.colors?.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => onColorChange(color.value)}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color.value
                                    ? 'border-blue-500 shadow-md scale-110'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                        >
                            {selectedColor === color.value && (
                                <i className="ri-check-line text-white w-4 h-4 flex items-center justify-center mx-auto"></i>
                            )}
                        </button>
                    )) || (
                        <div className="text-sm text-gray-500">Không có thông tin màu sắc</div>
                    )}
                </div>
            </div>

            {/* Sizes */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">
                        Kích cỡ: <span className="font-normal">{selectedSize || 'Chưa chọn'}</span>
                    </h3>
                    <button
                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                        className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                        Bảng size
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {product.sizes?.map((size) => (
                        <button
                            key={size}
                            onClick={() => onSizeChange(size)}
                            className={`py-2 px-3 border rounded-lg text-sm transition-all whitespace-nowrap cursor-pointer ${selectedSize === size
                                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            {size}
                        </button>
                    )) || (
                        <div className="text-sm text-gray-500">Không có thông tin kích cỡ</div>
                    )}
                </div>

                {/* Size Guide Modal */}
                {showSizeGuide && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSizeGuide(false)}>
                        <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Bảng kích cỡ giày</h3>
                                <button onClick={() => setShowSizeGuide(false)}>
                                    <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
                                </button>
                            </div>
                            <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-4 py-2 border-b font-medium">
                                    <span>Size</span>
                                    <span>Độ dài (cm)</span>
                                    <span>Phù hợp</span>
                                </div>
                                {[
                                    ['38', '24.5', 'Chân nhỏ'],
                                    ['39', '25.0', 'Chân vừa'],
                                    ['40', '25.5', 'Chân vừa'],
                                    ['41', '26.0', 'Chân to'],
                                    ['42', '26.5', 'Chân to'],
                                    ['43', '27.0', 'Chân rất to'],
                                    ['44', '27.5', 'Chân rất to']
                                ].map(([size, length, fit]) => (
                                    <div key={size} className="grid grid-cols-3 gap-4 py-2 text-sm border-b last:border-0">
                                        <span>{size}</span>
                                        <span>{length}</span>
                                        <span className="text-gray-600">{fit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quantity */}
            <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Số lượng:</h3>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                            className="p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <i className="ri-subtract-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                            {quantity}
                        </span>
                        <button
                            onClick={() => {
                                const maxQuantity = selectedVariant?.stock_quantity || 1;
                                onQuantityChange(Math.min(quantity + 1, maxQuantity));
                            }}
                            disabled={quantity >= (selectedVariant?.stock_quantity || 1)}
                            className="p-2 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                    </div>
                    <span className="text-sm text-gray-600">
                        Còn lại {selectedVariant?.stock_quantity || 0} sản phẩm
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <div className="flex space-x-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedSize || !selectedColor || !selectedVariant}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-colors whitespace-nowrap cursor-pointer"
                    >
                        <i className="ri-shopping-cart-line w-5 h-5 flex items-center justify-center mr-2 inline-flex"></i>
                        {!selectedSize || !selectedColor ? 'Chọn kích cỡ và màu sắc' : 'Thêm vào giỏ'}
                    </button>
                    <button
                        onClick={handleBuyNow}
                        disabled={!selectedSize || !selectedColor || !selectedVariant}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-colors whitespace-nowrap cursor-pointer"
                    >
                        {!selectedSize || !selectedColor ? 'Chọn kích cỡ và màu sắc' : 'Mua ngay'}
                    </button>
                </div>
            </div>

            {/* Product Features - Chỉ hiển thị nếu có */}
            {product.features && product.features.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Đặc điểm nổi bật:</h4>
                    <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-700">
                                <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center mr-2 flex-shrink-0"></i>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Notification */}
            {showNotification && (
                <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-pulse">
                    <div className="flex items-center">
                        <i className="ri-check-line w-5 h-5 flex items-center justify-center mr-2"></i>
                        {showNotification}
                    </div>
                </div>
            )}
        </div>
    );
}
