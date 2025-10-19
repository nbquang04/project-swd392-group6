import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoeShopContext } from '../context/ShoeShopContext';
import { getProductStats } from '../service/reviews.js';





export default function RelatedProducts({ products = [] }) {
  const [productRatings, setProductRatings] = useState({});

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const getLowestPrice = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map(variant => variant.price));
  };

  const getHighestPrice = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return Math.max(...variants.map(variant => variant.price));
  };

  const getMainImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.variants && product.variants.length > 0 && product.variants[0].images) {
      return product.variants[0].images[0];
    }
    return 'https://via.placeholder.com/300x300?text=No+Image';
  };

  // Tính toán rating cho tất cả sản phẩm
  useEffect(() => {
    const fetchProductRatings = async () => {
      const ratings = {};
      
      for (const product of products) {
        try {
          const stats = await getProductStats(product.id);
          ratings[product.id] = {
            averageRating: stats.averageRating,
            reviewCount: stats.reviewCount
          };
        } catch (error) {
          console.error(`Error fetching stats for product ${product.id}:`, error);
          ratings[product.id] = {
            averageRating: 0,
            reviewCount: 0
          };
        }
      }
      
      setProductRatings(ratings);
    };

    if (products.length > 0) {
      fetchProductRatings();
    }
  }, [products]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Sản phẩm liên quan</h2>
        <Link to="/products" className="text-red-600 hover:text-red-700 font-medium cursor-pointer">
          Xem tất cả
          <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const lowestPrice = getLowestPrice(product.variants);
          const highestPrice = getHighestPrice(product.variants);
          const hasDiscount = highestPrice > lowestPrice;
          const discountPercentage = hasDiscount
            ? Math.round(((highestPrice - lowestPrice) / highestPrice) * 100)
            : 0;
          
          const productRating = productRatings[product.id] || { averageRating: 0, reviewCount: 0 };

          return (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link to={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={getMainImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  {hasDiscount && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                        -{discountPercentage}%
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors">
                      <svg className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-tight hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center space-x-1 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-3 h-3 ${star <= Math.floor(productRating.averageRating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {productRating.averageRating > 0 
                      ? `${productRating.averageRating} (${productRating.reviewCount})`
                      : 'Chưa có đánh giá'
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-red-600">
                      {formatPrice(lowestPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(highestPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
