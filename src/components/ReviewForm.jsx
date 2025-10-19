import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';



const ReviewForm = ({ product, order, onSubmit, onCancel }) => {
  const { showSuccess, showError } = useNotification();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showError('Vui lòng nhập tiêu đề đánh giá');
      return;
    }
    
    if (!comment.trim()) {
      showError('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Đảm bảo product_id chỉ là ID sản phẩm cơ bản (không bao gồm SKU)
      const baseProductId = product.id.split('-')[0]; // Lấy phần trước dấu gạch ngang
      
      const reviewData = {
        product_id: baseProductId,
        order_id: order.id,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await onSubmit(reviewData);
      showSuccess('Đánh giá đã được gửi thành công!');
      onCancel();
    } catch (error) {
      showError('Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setRating(5);
    setTitle('');
    setComment('');
    onCancel();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Đánh giá sản phẩm
        </h3>
        <button
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <img 
            src={product.images?.[0] || '/placeholder-product.jpg'} 
            alt={product.name}
            className="w-12 h-12 object-cover rounded"
          />
          <div>
            <h4 className="font-medium text-gray-900">{product.name}</h4>
            <p className="text-sm text-gray-500">Đơn hàng #{order.id}</p>
            {(product.color || product.size) && (
              <div className="flex gap-2 mt-1">
                {product.color && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                    Màu: {product.color}
                  </span>
                )}
                {product.size && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                    Size: {product.size}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá của bạn
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating}/5 sao
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề đánh giá *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Nhập tiêu đề đánh giá..."
            maxLength={100}
          />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung đánh giá *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {comment.length}/500 ký tự
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
