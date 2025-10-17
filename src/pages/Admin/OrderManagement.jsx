import { useState, useMemo, useContext } from "react";
import SideBarAdmin from "../../components/SideBarAdmin";
import { Check, ArrowUpDown, Calendar, User } from "lucide-react";
import { ShoesShopContext } from "../../context/ShoeShopContext";

// Định dạng ngày theo local timezone thành "YYYY-MM-DD"
const toLocalYMD = (d) => {
  if (!d) return "";
  const dt = d instanceof Date ? d : new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// Chuẩn hoá status (gộp "cancelled" -> "canceled")
const normalizeStatus = (s) => {
  const v = String(s || "pending").toLowerCase();
  if (v === "cancelled") return "canceled";
  return v;
};

const STATUS_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "delivered", label: "Delivered" },
  { key: "canceled", label: "Canceled" },
];

export default function OrderHistory() {
  const { adminOrder, handleClickConfirm } = useContext(ShoesShopContext);

  // State cục bộ cho filter (tránh side-effects từ Context)
  const [userIdSearch, setUserIdSearch] = useState("");
  const [dateSearch, setDateSearch] = useState(""); // "YYYY-MM-DD"
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // Trạng thái tab status đang chọn
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | 'processing' | 'delivered' | 'canceled'

  const [sortConfig, setSortConfig] = useState({
    key: null,        // 'total' | 'created_at' | null
    direction: "asc", // 'asc' | 'desc'
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      const nextDirection =
        prev.key === key && prev.direction === "asc" ? "desc" : "asc";
      return { key, direction: nextDirection };
    });
  };

  const getSortValue = (order, key) => {
    switch (key) {
      case "total":
        return toNumber(order.total);
      case "created_at": {
        const t = new Date(order.created_at).getTime();
        return Number.isFinite(t) ? t : 0;
      }
      default:
        return 0;
    }
  };

  // 1) Dedupe + áp dụng các filter KHÔNG liên quan đến trạng thái (để tính counts chính xác)
  const filteredForCounts = useMemo(() => {
    const base = Array.isArray(adminOrder) ? adminOrder : [];

    // Khử trùng lặp theo id (nếu upstream có append trùng)
    const map = new Map();
    for (const o of base) {
      map.set(o.id, o); // giữ record cuối cùng theo id
    }
    let arr = Array.from(map.values());

    // Filters (userId/date/price)
    arr = arr.filter((order) => {
      if (userIdSearch.trim()) {
        if (String(order.user_id) !== String(userIdSearch.trim())) return false;
      }
      if (dateSearch.trim()) {
        const orderDayYMD = toLocalYMD(order.created_at);
        if (orderDayYMD !== dateSearch) return false;
      }
      const total = toNumber(order.total);
      const minOk = priceMin === "" ? true : total >= toNumber(priceMin);
      const maxOk = priceMax === "" ? true : total <= toNumber(priceMax);
      if (!minOk || !maxOk) return false;

      return true;
    });

    return arr;
  }, [adminOrder, userIdSearch, dateSearch, priceMin, priceMax]);

  // 2) Đếm số lượng theo trạng thái dựa trên filteredForCounts
  const statusCounts = useMemo(() => {
    const counts = {
      all: filteredForCounts.length,
      pending: 0,
      processing: 0,
      delivered: 0,
      canceled: 0,
    };
    for (const o of filteredForCounts) {
      const st = normalizeStatus(o.status);
      if (st === "pending" || st === "processing" || st === "delivered" || st === "canceled") {
        counts[st] += 1;
      } else {
        // nếu có trạng thái lạ thì bạn có thể gộp vào pending hoặc tạo tab riêng
        counts.pending += 1;
      }
    }
    return counts;
  }, [filteredForCounts]);

  // 3) Áp dụng lọc theo trạng thái + sort (không mutate)
  const visibleOrders = useMemo(() => {
    let arr = [...filteredForCounts];

    if (statusFilter !== "all") {
      arr = arr.filter((o) => normalizeStatus(o.status) === statusFilter);
    }

    if (sortConfig.key) {
      const dir = sortConfig.direction === "asc" ? 1 : -1;
      arr.sort((a, b) => {
        const va = getSortValue(a, sortConfig.key);
        const vb = getSortValue(b, sortConfig.key);
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
      });
    }

    return arr;
  }, [filteredForCounts, sortConfig, statusFilter]);

  const sortLabel = (key, base) => {
    if (sortConfig.key !== key) return base;
    return sortConfig.direction === "asc" ? `${base} ↑` : `${base} ↓`;
  };

  return (
    <div className="flex">
      <SideBarAdmin />
      <div className="flex-1 max-w-7xl mx-auto p-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-4">Quản lý đơn hàng</h1>

        {/* Filters cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              placeholder="Search by User ID..."
              className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={userIdSearch}
              onChange={(e) => setUserIdSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dateSearch}
              onChange={(e) => setDateSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Segmented by Status */}
        <div className="mb-6 bg-white p-3 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => {
              const selected = statusFilter === tab.key;
              const count =
                tab.key === "all" ? statusCounts.all : statusCounts[tab.key] ?? 0;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  aria-pressed={selected}
                  className={[
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition",
                    selected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <span>{tab.label}</span>
                  <span
                    className={
                      "text-xs px-2 py-0.5 rounded-full " +
                      (selected ? "bg-white/20" : "bg-gray-100 text-gray-700")
                    }
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort group */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
            onClick={() => handleSort("total")}
            title="Sắp xếp theo tổng tiền"
            type="button"
          >
            <ArrowUpDown className="h-5 w-5" />
            {sortLabel("total", "Sort by Price")}
          </button>
          <button
            className="flex-1 md:flex-none px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
            onClick={() => handleSort("created_at")}
            title="Sắp xếp theo ngày đặt"
            type="button"
          >
            <Calendar className="h-5 w-5" />
            {sortLabel("created_at", "Sort by Date")}
          </button>
          <button
            className="px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            onClick={() => {
              setUserIdSearch("");
              setDateSearch("");
              setPriceMin("");
              setPriceMax("");
              setStatusFilter("all");
              setSortConfig({ key: null, direction: "asc" });
            }}
            type="button"
          >
            Reset
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng đặt hàng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt hàng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr
                  key={`${order.id}-${order.created_at}`} // phòng id trùng
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 border">{order.id}</td>
                  <td className="px-4 py-3 border text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                    <div className="flex flex-col">
                      <span>{order.customer_name}</span>
                      <span className="text-sm text-gray-500">ID: {order.user_id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 border whitespace-nowrap">
                    {order.created_at ? new Date(order.created_at).toLocaleString("vi-VN") : ""}
                  </td>
                  <td className="px-4 py-3 border whitespace-nowrap font-medium">
                    {toNumber(order.total).toLocaleString()} VND
                  </td>
                  <td className="px-4 py-3 border">
                    {normalizeStatus(order.status) === "delivered" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 mr-2 rounded-full bg-green-400"></span>
                        Completed
                      </span>
                    ) : normalizeStatus(order.status) === "processing" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <span className="w-2 h-2 mr-2 rounded-full bg-yellow-400"></span>
                        Processing
                      </span>
                    ) : normalizeStatus(order.status) === "canceled" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <span className="w-2 h-2 mr-2 rounded-full bg-red-400"></span>
                        Canceled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        <span className="w-2 h-2 mr-2 rounded-full bg-gray-400"></span>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 border">
                    <div className="space-y-2">
                      {order.items?.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded-lg">
                          <p className="font-medium text-gray-800">{item.product_name}</p>
                          <div className="text-sm text-gray-500 mt-1">
                            <span className="inline-block mr-3">
                              <span className="font-medium">Số lượng:</span> {item.quantity}
                            </span>
                            <span className="inline-block">
                              <span className="font-medium">Size:</span> {item.size}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 border text-center">
                    {/* Không cho cập nhật nếu đã canceled hoặc delivered */}
                    {(normalizeStatus(order.status) === "processing" ||
                      normalizeStatus(order.status) === "pending") && (
                      <button
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                        onClick={() => handleClickConfirm(order)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Cập nhật
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {visibleOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    Không có đơn hàng phù hợp.
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
