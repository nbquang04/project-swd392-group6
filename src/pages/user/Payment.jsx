import { useState, useEffect, useContext } from "react";
import { CreditCard, MapPin, Phone, User, ShieldCheck, ArrowLeft } from "lucide-react";
import { ShoesShopContext } from "../../context/ShoeShopContext";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();

  const {
    handleCreateOrder,
    getTotal,
    selectedItems,
    getCompleteUserData,
    isAuthenticated,
    showWarning,
  } = useContext(ShoesShopContext);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod"); // chữ thường đúng chuẩn với backend
  const total = getTotal();

  // 🧠 Load thông tin người dùng sau khi đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    const user = getCompleteUserData();
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [isAuthenticated, getCompleteUserData, navigate]);

  // 🧩 Cập nhật input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔙 Quay lại giỏ hàng
  const handleBackToCart = () => {
    navigate("/cart");
  };

  // 🧾 Xử lý thanh toán / đặt hàng
  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      showWarning("⚠️ Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    if (selectedItems.length === 0) {
      showWarning("⚠️ Vui lòng chọn ít nhất 1 sản phẩm trong giỏ hàng!");
      navigate("/cart");
      return;
    }

    const success = await handleCreateOrder(paymentMethod, formData.address);
    if (success) {
      navigate("/profile"); // ✅ chỉ navigate — không hiện lại thông báo trùng
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">

          {/* Nút quay lại */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={handleBackToCart}
              className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              Quay lại giỏ hàng
            </button>
          </div>

          {/* Bố cục chính */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cột Form chính */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-6">
                  <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <CreditCard className="h-6 w-6" />
                    Chi tiết thanh toán
                  </h1>
                  <p className="text-red-100 mt-1">Hoàn tất thông tin đơn hàng của bạn</p>
                </div>

                {/* Nội dung */}
                <div className="p-6 space-y-6">
                  {/* Thông tin người nhận */}
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-3">
                      <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        Thông tin người nhận
                      </h2>
                      <p className="text-gray-600 text-sm">Vui lòng cung cấp thông tin giao hàng</p>
                    </div>

                    <div className="space-y-4">
                      {/* Họ và tên */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Họ và tên *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nhập họ và tên"
                            className="w-full pl-10 pr-3 py-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Số điện thoại */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Số điện thoại *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Nhập số điện thoại"
                            className="w-full pl-10 pr-3 py-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Địa chỉ */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Địa chỉ giao hàng *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <textarea
                            name="address"
                            rows={3}
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Nhập địa chỉ đầy đủ"
                            className="w-full pl-10 pr-3 py-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phương thức thanh toán */}
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-3">
                      <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        Phương thức thanh toán
                      </h2>
                      <p className="text-gray-600 text-sm">Chọn phương thức thanh toán phù hợp</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="w-4 h-4 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          💰 Thanh toán khi nhận hàng (COD)
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="bank"
                          checked={paymentMethod === "bank"}
                          onChange={() => setPaymentMethod("bank")}
                          className="w-4 h-4 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          🏧 Chuyển khoản ngân hàng (VietQR)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Nút hoàn tất */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-900 focus:ring-4 focus:ring-red-200 transition-all duration-200 shadow-md"
                    >
                      Hoàn tất đơn hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar tổng tiền */}
            <div className="hidden lg:block lg:col-span-1 mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-red-500" />
                  Tóm tắt đơn hàng
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-semibold">{total.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-semibold">
                      {selectedItems.length > 0 ? "30,000" : "0"} VND
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-gray-50 px-4 rounded-lg">
                    <span className="text-lg font-semibold text-gray-800">Tổng cộng</span>
                    <span className="text-xl font-bold text-red-600">
                      {selectedItems.length > 0
                        ? (total + 30000).toLocaleString()
                        : "0"}{" "}
                      VND
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Summary */}
          <div className="lg:hidden mt-6">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-red-500" />
                Tóm tắt đơn hàng
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 text-sm">Tạm tính</span>
                  <span className="font-semibold text-sm">{total.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600 text-sm">Phí vận chuyển</span>
                  <span className="font-semibold text-sm">
                    {selectedItems.length > 0 ? "30,000" : "0"} VND
                  </span>
                </div>
                <div className="flex justify-between py-3 bg-gray-50 px-4 rounded-lg">
                  <span className="text-base font-semibold text-gray-800">Tổng cộng</span>
                  <span className="text-lg font-bold text-red-600">
                    {selectedItems.length > 0
                      ? (total + 30000).toLocaleString()
                      : "0"}{" "}
                    VND
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Payment;
