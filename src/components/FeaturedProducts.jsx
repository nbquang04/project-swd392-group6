import { useState } from "react";
import { Link } from "react-router-dom";

const FeaturedProducts = ({ products = [] }) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((fav) => fav !== id)
        : [...prev, id]
    );
  };

  const formatPrice = (price) =>
    price.toLocaleString("vi-VN") + "đ";

  const getLowestPrice = (variants) =>
    !variants?.length ? 0 : Math.min(...variants.map((v) => v.price));

  const getHighestPrice = (variants) =>
    !variants?.length ? 0 : Math.max(...variants.map((v) => v.price));

  const getMainImage = (product) => {
    if (product.images?.length) return product.images[0];
    if (product.variants?.length && product.variants[0].images?.length)
      return product.variants[0].images[0];
    return "https://via.placeholder.com/400x500?text=No+Image";
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🔹 Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            🌸 Sản phẩm nổi bật
          </h2>
          <p className="text-lg text-gray-600">
            Những món đồ được yêu thích nhất từ cửa hàng của chúng tôi
          </p>
        </div>

        {/* 🔹 Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => {
            const lowest = getLowestPrice(product.variants);
            const highest = getHighestPrice(product.variants);
            const hasDiscount = highest > lowest;
            const discountPercent = hasDiscount
              ? Math.round(((highest - lowest) / highest) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                {/* 🖼 Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={getMainImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* 🔻 Discount badge */}
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
                      -{discountPercent}%
                    </div>
                  )}

                  {/* ❤️ Favorite */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-50 shadow-sm transition-all"
                  >
                    <svg
                      className={`w-4 h-4 ${favorites.includes(product.id)
                          ? "text-red-500 fill-current"
                          : "text-gray-400"
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>

                {/* 📝 Info */}
                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2 hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-2 flex flex-col">
                    <span className="text-lg font-bold text-red-600">
                      {formatPrice(lowest)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(highest)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🔹 Button */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3 rounded-full text-base font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all"
          >
            Xem tất cả sản phẩm
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
