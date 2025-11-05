import React, { useContext, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ShoesShopContext } from "../../context/ShoeShopContext";
import { useNotification } from "../../context/NotificationContext";
import { Clock, PackageCheck, Truck, XCircle } from "lucide-react";

const OrderHistory = () => {
  const {
    orders,
    setOrder,
    getCompleteUserData,
    handleCancelOrder,
    reloadOrders,
  } = useContext(ShoesShopContext);

  const { showSuccess, showError, showWarning } = useNotification();
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const orderRefs = useRef([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const user = getCompleteUserData();
        if (!user) {
          setLoading(false);
          return;
        }
        const data = await reloadOrders();
        setOrder(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("❌ reloadOrders error:", e);
        showError("Không thể tải danh sách đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

  const normalizeStatus = (s) => (s || "").toLowerCase();

  // 🟢 Mô tả trạng thái với màu + icon
  const getStatusInfo = (status) => {
    switch (normalizeStatus(status)) {
      case "pending":
        return {
          text: "Chờ xử lý",
          color: "bg-yellow-100 text-yellow-800 border-yellow-400",
          icon: <Clock className="w-4 h-4 text-yellow-600" />,
        };
      case "processing":
        return {
          text: "Đang xử lý",
          color: "bg-blue-100 text-blue-800 border-blue-400",
          icon: <PackageCheck className="w-4 h-4 text-blue-600" />,
        };
      case "delivered":
        return {
          text: "Đã giao hàng",
          color: "bg-green-100 text-green-800 border-green-400",
          icon: <Truck className="w-4 h-4 text-green-600" />,
        };
      case "canceled":
        return {
          text: "Đã hủy",
          color: "bg-red-100 text-red-800 border-red-400",
          icon: <XCircle className="w-4 h-4 text-red-600" />,
        };
      default:
        return {
          text: "Không xác định",
          color: "bg-gray-100 text-gray-800 border-gray-400",
          icon: <Clock className="w-4 h-4 text-gray-600" />,
        };
    }
  };

  const canCancel = (order) =>
    ["pending", "processing"].includes(normalizeStatus(order.status));

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
      setIsModalOpen(false);
    } catch (err) {
      console.error("Cancel order error:", err);
      showError("Không thể huỷ đơn hàng!");
    }
  };

  const user = getCompleteUserData();

  if (!user)
    return (
      <div className="text-center text-gray-500 mt-10">
        Vui lòng đăng nhập để xem lịch sử đơn hàng.
      </div>
    );

  if (loading)
    return (
      <div className="text-center text-gray-500 mt-10">
        <i className="ri-loader-4-line animate-spin text-3xl text-gray-400"></i>
        <p className="mt-2">Đang tải đơn hàng...</p>
      </div>
    );

  const userOrders = (orders || []).filter(
    (o) => !o.userId || o.userId === user.id
  );

  if (userOrders.length === 0)
    return (
      <div className="text-center text-gray-500 mt-10">
        <i className="ri-shopping-bag-line text-4xl text-gray-400"></i>
        <p className="mt-2">Bạn chưa có đơn hàng nào.</p>
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử đơn hàng</h2>

      {userOrders.slice(0, visibleCount).map((order, index) => {
        const st = getStatusInfo(order.status);
        return (
          <div
            key={order.id}
            ref={(el) => (orderRefs.current[index] = el)}
            className="border border-gray-200 bg-white rounded-lg p-5 mb-3 hover:shadow-lg transition cursor-pointer"
            onClick={() => {
              setSelectedOrder(order);
              setIsModalOpen(true);
            }}
          >
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {st.icon}
                  <span
                    className={`px-2 py-1 text-xs rounded-full border font-medium ${st.color}`}
                  >
                    {st.text}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Mã đơn: {order.id}
                </h3>
                <p className="text-sm text-gray-500">
                  Giao đến: {order.address || "—"}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  Thanh toán:{" "}
                  {order.paymentMethod === "cod"
                    ? "Thanh toán khi nhận hàng (COD)"
                    : order.paymentMethod}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-red-600">
                  {formatCurrency(order.total)}
                </p>
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
                  Chi tiết đơn hàng #{selectedOrder.id}
                </h3>
                <button onClick={() => setIsModalOpen(false)}>×</button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
                <div className="flex items-center gap-2">
                  {getStatusInfo(selectedOrder.status).icon}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusInfo(selectedOrder.status).color}`}
                  >
                    {getStatusInfo(selectedOrder.status).text}
                  </span>
                </div>
                <p>
                  <b>Địa chỉ giao hàng:</b> {selectedOrder.address || "—"}
                </p>
                <p>
                  <b>Phương thức thanh toán:</b>{" "}
                  {selectedOrder.paymentMethod || "—"}
                </p>
                <p>
                  <b>Tổng tiền:</b> {formatCurrency(selectedOrder.total)}
                </p>

                <h4 className="font-semibold mt-4 mb-2">Sản phẩm:</h4>
                <ul className="space-y-2">
                  {selectedOrder.items?.map((it, idx) => (
                    <li
                      key={idx}
                      className="border-b pb-2 text-sm flex justify-between"
                    >
                      <span>
                        • {it.productId} × {it.quantity}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(it.price * it.quantity)}
                      </span>
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
