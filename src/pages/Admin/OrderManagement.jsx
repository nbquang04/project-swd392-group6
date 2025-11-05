import { useState, useMemo, useContext, useEffect } from "react";
import SideBarAdmin from "../../components/SideBarAdmin";
import { Check, ArrowUpDown, Calendar, User } from "lucide-react";
import { ShoesShopContext } from "../../context/ShoeShopContext";
import { getAllOrders, updateOrderStatus } from "../../service/order.js";

const toLocalYMD = (d) => {
  if (!d) return "";
  const dt = d instanceof Date ? d : new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};
const toNumber = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const normalizeStatus = (s) => {
  const v = String(s || "pending").toLowerCase();
  return v === "cancelled" ? "canceled" : v;
};

const STATUS_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "delivered", label: "Delivered" },
  { key: "canceled", label: "Canceled" },
];

export default function OrderHistory() {
  const { adminOrder, setAdminOrder } = useContext(ShoesShopContext);
  const [statusFilter, setStatusFilter] = useState("all");
  const [userIdSearch, setUserIdSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧾 Load tất cả đơn hàng khi trang mở
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getAllOrders();
        setAdminOrder(data);
        console.log("✅ Loaded all orders:", data.length);
      } catch (err) {
        console.error("❌ [OrderHistory] Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [setAdminOrder]);

  // ⚙️ Xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (order) => {
    const current = (order.status || "").toLowerCase();
    const next =
      current === "pending"
        ? "processing"
        : current === "processing"
          ? "delivered"
          : null;

    if (!next) {
      alert("⚠️ Không thể cập nhật đơn hàng này!");
      return;
    }

    if (!window.confirm(`Xác nhận chuyển trạng thái từ "${current}" → "${next}"?`)) return;

    try {
      const updated = await updateOrderStatus(order.id, next);
      if (updated) {
        alert(`✅ Cập nhật đơn hàng #${order.id} thành "${next}" thành công!`);
        setAdminOrder((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, status: next } : o))
        );
      }
    } catch (err) {
      console.error("❌ [handleUpdateStatus]", err);
      alert("❌ Lỗi khi cập nhật trạng thái!");
    }
  };
  // 🧮 Bộ lọc theo người dùng / ngày / giá
  const filteredForCounts = useMemo(() => {
    const base = Array.isArray(adminOrder) ? adminOrder : [];
    const map = new Map();
    for (const o of base) map.set(o.id, o);
    let arr = Array.from(map.values());

    arr = arr.filter((order) => {
      if (userIdSearch && String(order.user_id) !== String(userIdSearch)) return false;
      if (dateSearch) {
        const orderDay = toLocalYMD(order.created_at);
        if (orderDay !== dateSearch) return false;
      }
      const total = toNumber(order.total);
      const minOk = priceMin === "" || total >= toNumber(priceMin);
      const maxOk = priceMax === "" || total <= toNumber(priceMax);
      return minOk && maxOk;
    });
    return arr;
  }, [adminOrder, userIdSearch, dateSearch, priceMin, priceMax]);

  // 🧮 Áp dụng lọc theo trạng thái
  const visibleOrders = useMemo(() => {
    let arr = [...filteredForCounts];
    if (statusFilter !== "all")
      arr = arr.filter((o) => normalizeStatus(o.status) === statusFilter);
    return arr;
  }, [filteredForCounts, statusFilter]);

  return (
    <div className="flex">
      <SideBarAdmin />
      <div className="flex-1 max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Quản lý đơn hàng</h1>

        {/* Bộ lọc trạng thái */}
        <div className="flex flex-wrap gap-2 mb-4">
          {STATUS_TABS.map((tab) => {
            const selected = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={[
                  "px-3 py-1.5 rounded-full text-sm border transition",
                  selected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ⚙️ Bảng đơn hàng */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Người dùng</th>
                <th className="px-4 py-3">Ngày đặt</th>
                <th className="px-4 py-3">Tổng tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => {
                const st = normalizeStatus(order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border">{order.id}</td>
                    <td className="px-4 py-3 border">{order.user_id}</td>
                    <td className="px-4 py-3 border">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString("vi-VN")
                        : ""}
                    </td>
                    <td className="px-4 py-3 border font-medium">
                      {toNumber(order.total).toLocaleString()} VND
                    </td>
                    <td className="px-4 py-3 border capitalize">{st}</td>
                    <td className="px-4 py-3 border text-center">
                      {(st === "pending" || st === "processing") && (
                        <button
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                          onClick={() => handleUpdateStatus(order)}
                          disabled={loading}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          {loading ? "Đang cập nhật..." : "Cập nhật"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {visibleOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    {loading ? "Đang tải dữ liệu..." : "Không có đơn hàng phù hợp."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
