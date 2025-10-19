import React, { useContext, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ShoesShopContext } from '../../context/ShoeShopContext';
import { useNotification } from '../../context/NotificationContext';
import ReviewForm from '../../components/ReviewForm';
import { submitProductReview } from '../../service/product.js';







const OrderHistory = () => {
  const {
    orders,
    getCompleteUserData,
    cancelOrder,
    handleCancelOrder,
    canCancelOrder
  } = useContext(ShoesShopContext);
  const { showSuccess, showError, showWarning } = useNotification();
  const user = getCompleteUserData();
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const orderRefs = useRef([]);

  // Thêm function xử lý hủy đơn hàng trong component:
  const handleCancelOrderClick = async (order, e) => {
    e.stopPropagation(); // Ngăn không cho mở modal khi click nút hủy

    // Hiển thị xác nhận trước khi hủy
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn hủy đơn hàng #${order.id}?\n\n` +
      `Tổng tiền: ${formatCurrency(order.total)}\n` +
      `Số sản phẩm: ${order.items?.length || 0}\n\n` +
      `Lưu ý: Hành động này không thể hoàn tác.`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const result = await handleCancelOrder(order);
      if (result.success) {
        showSuccess(`Đã hủy đơn hàng #${order.id} thành công!`);
        // Có thể đóng modal nếu đang mở
        if (selectedOrder && selectedOrder.id === order.id) {
          closeModal();
        }
      } else {
        showError('Không thể hủy đơn hàng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      showError('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Chưa có thông tin';
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Chưa có thông tin';
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' };
      case 'processing':
        return { text: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' };
      case 'shipped':
        return { text: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' };
      case 'delivered':
        return { text: 'Đã giao hàng', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { text: 'Đã hủy', color: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Không xác định', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleReviewProduct = (product, order) => {
    setSelectedProductForReview({ product, order });
    setShowReviewForm(true);
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

      // Gọi API để lưu review (sẽ implement sau)
      await submitReview(completeReviewData);
      
      setShowReviewForm(false);
      setSelectedProductForReview(null);
    } catch (error) {
      throw error;
    }
  };

  const submitReview = async (reviewData) => {
    try {
      await submitProductReview(reviewData);
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  const handleShowMore = () => {
    const currentVisibleCount = visibleCount;
    setVisibleCount(prev => prev + 3);

    // Scroll to the first new order after state update
    setTimeout(() => {
      if (orderRefs.current[currentVisibleCount]) {
        // Tính toán để đảm bảo 3 đơn hàng mới + nút vừa trong viewport
        const element = orderRefs.current[currentVisibleCount];
        const headerHeight = 100;
        const buttonAreaHeight = 120; // Khoảng trống cho nút ở dưới
        const viewportHeight = window.innerHeight;
        const availableHeight = viewportHeight - headerHeight - buttonAreaHeight;

        // Tính toán vị trí scroll để hiển thị tối ưu
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20; // Thêm 20px margin

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleShowLess = () => {
    setVisibleCount(3);

    // Scroll về đầu danh sách với tính toán tương tự
    setTimeout(() => {
      if (orderRefs.current[0]) {
        const element = orderRefs.current[0];
        const headerHeight = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  if (!user) {
    return (
      <div className="w-full text-center">
        <p className="text-gray-500">Vui lòng đăng nhập để xem lịch sử đơn hàng</p>
      </div>
    );
  }

  // Sắp xếp giảm dần theo thời gian tạo
  const userOrders = orders
    .filter(order => order.user_id === user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (userOrders.length === 0) {
    return (
      <div className="w-full  text-center">
        <div className="mb-4">
          <i className="ri-shopping-bag-line text-4xl text-gray-400"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
        <p className="text-gray-500">Bạn chưa có đơn hàng nào. Hãy mua sắm để tạo đơn hàng đầu tiên!</p>
      </div>
    );
  }

  return (
    <div className="w-full ">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Lịch sử đơn hàng</h2>

      <div className="space-y-3">
        {userOrders.slice(0, visibleCount).map((order, index) => {
          const statusInfo = getStatusInfo(order.status);

          return (
            <div
              key={order.id}
              ref={el => orderRefs.current[index] = el}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md cursor-pointer transition-shadow"
              onClick={() => openModal(order)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      Đơn hàng #{order.id}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    {formatDate(order.created_at)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Thanh toán: <span className="font-medium capitalize">{order.payment_method}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(order.total)}
                  </p>
                  <p className="text-sm text-red-400 font-medium hover:text-red-600">
                    Xem chi tiết →
                  </p>
                  <div className="flex space-x-2 mt-2">
                    {canCancelOrder(order) && (
                      <button
                        onClick={(e) => handleCancelOrderClick(order, e)}
                        className="text-xs px-2 py-1 bg-red-400 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Hủy
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <div className="flex flex-wrap gap-1">
                        {order.items?.map((item, itemIndex) => (
                          <button
                            key={itemIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Đảm bảo product.id chỉ là ID sản phẩm cơ bản (không bao gồm SKU)
                              const baseProductId = item.product_id.split('-')[0];
                              const product = {
                                id: baseProductId,
                                name: item.product_name,
                                images: [item.image || '/placeholder-product.jpg'],
                                color: item.color,
                                size: item.size
                              };
                              handleReviewProduct(product, order);
                            }}
                            className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            title={`Đánh giá ${item.product_name}`}
                          >
                            Đánh giá {itemIndex + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {userOrders.length > 3 && (
        <div className="text-center mt-4 pb-4 space-y-2">
          {visibleCount < userOrders.length && (
            <button
              onClick={handleShowMore}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mr-3 text-sm"
            >
              Hiển thị thêm ({Math.min(3, userOrders.length - visibleCount)})
            </button>
          )}

          {visibleCount > 3 && (
            <button
              onClick={handleShowLess}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
            >
              Ẩn bớt
            </button>
          )}
        </div>
      )}

      {/* Modal Chi tiết đơn hàng */}
      {isModalOpen && selectedOrder && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    Đơn hàng #{selectedOrder.id}
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedOrder.status).color}`}>
                      {getStatusInfo(selectedOrder.status).text}
                    </span>

                    <span className="text-red-100 text-xs">
                      {formatDate(selectedOrder.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {canCancelOrder(selectedOrder) && (
                    <button
                      onClick={() => handleCancelOrderClick(selectedOrder, { stopPropagation: () => {} })}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      <i className="ri-close-line mr-1"></i>
                      Hủy đơn hàng
                    </button>
                  )}
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-red-200 text-2xl font-light leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              <div className="p-6">
                {/* Order Summary Card */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 mb-6 border-l-4 border-red-500">
                  <h3 className="text-base font-semibold text-gray-800 mb-4">Tóm tắt đơn hàng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Tổng tiền</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(selectedOrder.total)}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Phương thức thanh toán</p>
                        <p className="text-lg font-semibold text-gray-800 capitalize">{selectedOrder.payment_method}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">Số sản phẩm</p>
                        <p className="text-lg font-bold text-green-600">{selectedOrder.items?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Section */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <i className="ri-shopping-bag-line text-red-600"></i>
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">Sản phẩm đặt mua</h3>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b">
                      <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wide">
                        <div className="col-span-5">Sản phẩm</div>
                        <div className="col-span-2 text-center">Số lượng</div>
                        <div className="col-span-2 text-center">Đơn giá</div>
                        <div className="col-span-2 text-right">Thành tiền</div>
                        <div className="col-span-1 text-center">Thao tác</div>
                      </div>
                    </div>

                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-5">
                            <h4 className="font-medium text-gray-900 mb-1 text-sm">{item.product_name}</h4>
                            <div className="flex gap-2 text-xs text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded">Màu: {item.color}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded">Size: {item.size}</span>
                            </div>
                          </div>
                          <div className="col-span-2 text-center">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="col-span-2 text-center font-medium text-gray-700 text-sm">
                            {formatCurrency(item.price)}
                          </div>
                          <div className="col-span-2 text-right font-bold text-gray-900 text-sm">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                          <div className="col-span-1 text-right">
                            {selectedOrder.status === 'delivered' && (
                              <button
                                onClick={() => {
                                  // Đảm bảo product.id chỉ là ID sản phẩm cơ bản (không bao gồm SKU)
                                  const baseProductId = item.product_id.split('-')[0];
                                  const product = {
                                    id: baseProductId,
                                    name: item.product_name,
                                    images: [item.image || '/placeholder-product.jpg'],
                                    color: item.color,
                                    size: item.size
                                  };
                                  handleReviewProduct(product, selectedOrder);
                                  closeModal();
                                }}
                                className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                title={`Đánh giá ${item.product_name}`}
                              >
                                <i className="ri-star-line"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <i className="ri-money-dollar-circle-line text-green-600"></i>
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">Chi tiết thanh toán</h3>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 text-sm">Tạm tính:</span>
                        <span className="font-medium text-gray-800 text-sm">{formatCurrency(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 text-sm">Phí vận chuyển:</span>
                        <span className="font-medium text-gray-800 text-sm">{formatCurrency(selectedOrder.shipping_fee)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-bold text-gray-900">Tổng cộng:</span>
                          <span className="text-lg font-bold text-red-600">{formatCurrency(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <i className="ri-truck-line text-purple-600"></i>
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">Thông tin giao hàng</h3>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Người nhận</label>
                          <p className="mt-1 text-sm font-semibold text-gray-900">{selectedOrder.customer_name}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Số điện thoại</label>
                          <p className="mt-1 text-sm font-semibold text-gray-900">{selectedOrder.phone}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Địa chỉ giao hàng</label>
                        <p className="mt-1 text-sm font-medium text-gray-900 leading-relaxed">{selectedOrder.shipping_address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

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
};

export default OrderHistory;