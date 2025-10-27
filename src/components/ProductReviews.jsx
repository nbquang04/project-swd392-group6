import React, { useState } from 'react';

const ProductReviews = ({ product, reviews: propReviews = [] }) => {
  // ✅ Dữ liệu review giả (fix cứng)
  const fakeReviews = [
    {
      id: 1,
      user_name: 'Nguyễn Văn A',
      rating: 5,
      title: 'Rất hài lòng!',
      comment: 'Hoa tươi đẹp, giao hàng nhanh và đóng gói cẩn thận. Rất đáng tiền!',
      created_at: '2025-10-10',
      verified_purchase: true,
      images: ['/images/review1.jpg', '/images/review2.jpg'],
    },
    {
      id: 2,
      user_name: 'Trần Thị B',
      rating: 4,
      title: 'Ổn trong tầm giá',
      comment: 'Màu sắc tươi tắn, đúng mô tả. Giao hàng hơi chậm một chút.',
      created_at: '2025-09-25',
      verified_purchase: true,
      images: [],
    },
    {
      id: 3,
      user_name: 'Lê Cường',
      rating: 5,
      title: 'Sẽ ủng hộ lần sau',
      comment: 'Sản phẩm giống hình, nhân viên tư vấn nhiệt tình, 10 điểm!',
      created_at: '2025-09-05',
      verified_purchase: true,
      images: ['/images/review3.jpg'],
    },
    {
      id: 4,
      user_name: 'Phạm Thảo',
      rating: 3,
      title: 'Bình thường',
      comment: 'Hoa hơi nhỏ hơn hình, nhưng vẫn tạm ổn với giá này.',
      created_at: '2025-08-22',
      verified_purchase: false,
      images: [],
    },
  ];

  // Ưu tiên review được truyền từ props (nếu có), nếu không thì dùng fake
  const reviews = propReviews.length > 0 ? propReviews : fakeReviews;

  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Tính toán thống kê đánh giá
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  // Sắp xếp đánh giá
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  );

  if (totalReviews === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá sản phẩm</h3>
        <div className="text-center py-8 text-gray-500">Chưa có đánh giá nào cho sản phẩm này</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Đánh giá sản phẩm ({totalReviews})
        </h3>
        {totalReviews > 3 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="highest">Đánh giá cao nhất</option>
            <option value="lowest">Đánh giá thấp nhất</option>
          </select>
        )}
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {renderStars(Math.round(averageRating))}
          </div>
          <p className="text-sm text-gray-600">{totalReviews} đánh giá</p>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingCounts[rating];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm text-gray-600">{rating}</span>
                    <span className="text-yellow-400">★</span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {review.user_name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{review.user_name}</h4>
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                    {review.verified_purchase && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Đã mua
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-13">
              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.comment}</p>

              {review.images && review.images.length > 0 && (
                <div className="flex space-x-2 mb-3">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border border-gray-200"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Less Button */}
      {totalReviews > 3 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            {showAllReviews ? 'Ẩn bớt đánh giá' : `Xem tất cả ${totalReviews} đánh giá`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
