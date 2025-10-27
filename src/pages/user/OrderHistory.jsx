import React, { useContext, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ShoesShopContext } from "../../context/ShoeShopContext";
import { useNotification } from "../../context/NotificationContext";
import ReviewForm from "../../components/ReviewForm";

const OrderHistory = () => {
  const {
    orders,
    setOrder, // cập nhật danh sách đơn hàng trong context
    getCompleteUserData,
    handleCancelOrder,
    fetchOrders, // hàm gọi API từ context
  } = useContext(ShoesShopContext);

  const { showSuccess, showError, showWarning } = useNotification();
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const orderRefs = useRef([]);

  /** 🧩 Chỉ gọi API 1 lần khi trang mở */
  useEffect(() => {
    const reloadOrders = async () => {
      try {
        const user = getCompleteUserData();
        if (!user) {
          setLoading(false);
          return;
        }
        const data = await fetchOrders();
        console.log("📦 [OrderHistory] user orders:", data);
        setOrder(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("❌ reloadOrders error:", e);
        showError("Không thể tải danh sách đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    reloadOrders();
    // ⚠️ không để [user] vào dependency để tránh lặp vô hạn
  }, []);

  /** ========== Helper functions ========== */
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Chưa có thông tin";
    }
  };

  const getStatusInfo = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return { text: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" };
      case "paid":
        return { text: "Đã thanh toán", color: "bg-blue-100 text-blue-800" };
      case "shipped":
        return { text: "Đang giao hàng", color: "bg-purple-100 text-purple-800" };
      case "done":
        return { text: "Hoàn tất", color: "bg-green-100 text-green-800" };
      case "cancelled":
        return { text: "Đã hủy", color: "bg-red-100 text-red-800" };
      default:
        return { text: "Không xác định", color: "bg-gray-100 text-gray-800" };
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount) || 0);

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const canCancel = (order) =>
    ["pending", "paid"].includes((order.status || "").toLowerCase());

  const handleCancelOrderClick = async (order, e) => {
    e.stopPropagation();
    if (!canCancel(order)) {
      showWarning("Không thể huỷ đơn hàng này!");
      return;
    }

    const confirmCancel = window.confirm(`Xác nhận huỷ đơn hàng #${order.id}?`);
    if (!confirmCancel) return;

    try {
      await handleCancelOrder(order.id);
      showSuccess(`Đơn hàng #${order.id} đã được huỷ!`);
      closeModal();
    } catch (err) {
      console.error("Cancel order error:", err);
      showError("Không thể huỷ đơn hàng!");
    }
  };

  /** ========== UI Rendering ========== */
  const user = getCompleteUserData();

  if (!user) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Vui lòng đăng nhập để xem lịch sử đơn hàng.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <i className="ri-loader-4-line animate-spin text-3xl text-gray-400"></i>
        <p className="mt-2">Đang tải đơn hàng...</p>
      </div>
    );
  }

  const userOrders = (orders || [])
    .filter((o) => o.userId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (userOrders.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <i className="ri-shopping-bag-line text-4xl text-gray-400"></i>
        <p className="mt-2">Bạn chưa có đơn hàng nào.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử đơn hàng</h2>

      {userOrders.slice(0, visibleCount).map((order, index) => {
        const statusInfo = getStatusInfo(order.status);
        return (
          <div
            key={order.id}
            ref={(el) => (orderRefs.current[index] = el)}
            className="border border-gray-200 bg-white rounded-lg p-4 mb-3 hover:shadow transition cursor-pointer"
            onClick={() => openModal(order)}
          >
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-800">Đơn hàng #{order.id}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.text}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                <p className="text-sm text-gray-500 capitalize">
                  Phương thức: {order.paymentMethod}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-red-600">{formatCurrency(order.total)}</p>
                {canCancel(order) && (
                  <button
                    onClick={(e) => handleCancelOrderClick(order, e)}
                    className="text-xs px-3 py-1 mt-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Hủy đơn
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {userOrders.length > visibleCount && (
        <div className="text-center mt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Hiển thị thêm
          </button>
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      {isModalOpen &&
        selectedOrder &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden">
              <div className="bg-red-600 text-white p-4 flex justify-between items-center">
                <h3 className="font-semibold text-lg">
                  Đơn hàng #{selectedOrder.id}
                </h3>
                <button onClick={closeModal} className="text-white text-xl">
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
                <p><b>Địa chỉ giao hàng:</b> {selectedOrder.address}</p>
                <p><b>Phương thức thanh toán:</b> {selectedOrder.paymentMethod}</p>
                <p><b>Tổng tiền:</b> {formatCurrency(selectedOrder.total)}</p>

                <h4 className="font-semibold mt-4 mb-2">Sản phẩm:</h4>
                <ul className="space-y-2">
                  {selectedOrder.items?.map((it, idx) => (
                    <li key={idx} className="border-b pb-2 text-sm">
                      • {it.productId} × {it.quantity} —{" "}
                      {formatCurrency(it.price * it.quantity)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default OrderHistory;
