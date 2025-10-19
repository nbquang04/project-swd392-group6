import { useState, useEffect, useContext } from 'react';
import { CreditCard, MapPin, Phone, User, Building2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { ShoesShopContext } from '../../context/ShoeShopContext';
import { useNavigate } from 'react-router-dom';





const Payment = () => {
  const navigate = useNavigate()
  const { handleCheckout, getTotal, selectedItems, getUserData, isAuthenticated } = useContext(ShoesShopContext)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const total = getTotal()

  // Load user data from token-based authentication on component mount
  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const user = getUserData();
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [isAuthenticated, getUserData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Mobile: Full width with padding, Tablet: Centered with max width, Desktop: Large centered container */}
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">

          {/* Back to Cart Button - Mobile: Full width, Desktop: Positioned at top */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={handleBackToCart}
              className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              Quay lại giỏ hàng
            </button>
          </div>

          {/* Desktop: Two column layout, Mobile/Tablet: Single column */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">

            {/* Main Payment Form - Mobile: full width, Desktop: 2/3 width */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">

                {/* Header - Responsive text sizes and padding */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                    <CreditCard className="h-6 w-6 sm:h-8 sm:w-8" />
                    Chi tiết thanh toán
                  </h1>
                  <p className="text-red-100 mt-1 sm:mt-2 text-sm sm:text-base">Hoàn tất thông tin đơn hàng của bạn</p>
                </div>

                <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

                  {/* Receiver Information Section */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="border-l-4 border-red-500 pl-3 sm:pl-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">Thông tin người nhận</h2>
                      <p className="text-gray-600 text-xs sm:text-sm">Vui lòng cung cấp thông tin giao hàng</p>
                    </div>

                    {/* Mobile: Single column, Tablet+: Grid layout for some fields */}
                    <div className="space-y-4 sm:space-y-6">

                      {/* Name Field */}
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Họ và tên *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                            placeholder="Nhập họ và tên người nhận"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone Field */}
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Số điện thoại *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                            placeholder="Nhập số điện thoại"
                            required
                          />
                        </div>
                      </div>

                      {/* Address Field */}
                      <div className="space-y-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Địa chỉ giao hàng *
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 pointer-events-none">
                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          </div>
                          <textarea
                            id="address"
                            name="address"
                            rows={3}
                            value={formData.address}
                            onChange={handleInputChange}
                            className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none text-sm sm:text-base"
                            placeholder="Nhập địa chỉ giao hàng đầy đủ bao gồm đường, quận, thành phố"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Section */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="border-l-4 border-red-500 pl-3 sm:pl-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">Phương thức thanh toán</h2>
                      <p className="text-gray-600 text-xs sm:text-sm">Chọn phương thức thanh toán phù hợp</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="cod"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                        />
                        <label htmlFor="cod" className="ml-3 text-sm font-medium text-gray-900">
                          💰 Thanh toán khi nhận hàng (COD)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="bank"
                          name="paymentMethod"
                          value="bank"
                          checked={paymentMethod === "bank"}
                          onChange={() => setPaymentMethod("bank")}
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                        />
                        <label htmlFor="bank" className="ml-3 text-sm font-medium text-gray-900">
                          🏧 Chuyển khoản ngân hàng (VietQR)
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button - Mobile: Full width, responsive padding */}
                  <div className="pt-4 sm:pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        if (!formData.name || !formData.phone || !formData.address) {
                          alert("Vui lòng điền đầy đủ các trường bắt buộc!");
                          return;
                        }

                        if (paymentMethod === "cod") {
                          handleCheckout("cod", formData.name, formData.phone, formData.address);
                        } else if (paymentMethod === "bank") {
                          handleCheckout("bank", formData.name, formData.phone, formData.address);
                        }
                      }}
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base lg:text-lg hover:from-red-700 hover:to-red-900 focus:ring-4 focus:ring-red-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Hoàn tất đơn hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Desktop only, hidden on mobile/tablet */}
            <div className="hidden lg:block lg:col-span-1 mt-8 lg:mt-0">

              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 sticky top-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-red-500" />
                  Tóm tắt đơn hàng
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-semibold">{total} VND</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-semibold">{selectedItems.length > 0 ? "30,000" : "0"} VND</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-gray-50 -mx-6 px-6 rounded-lg">
                    <span className="text-lg font-semibold text-gray-800">Tổng cộng</span>
                    <span className="text-xl font-bold text-red-600">{selectedItems.length > 0
                      ? (total + 30000).toLocaleString()
                      : "0"} VND</span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
            </div>
          </div>

          {/* Mobile/Tablet Order Summary - Shows below form on smaller screens */}
          <div className="lg:hidden mt-6">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                Tóm tắt đơn hàng
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm sm:text-base">Tạm tính</span>
                  <span className="font-semibold text-sm sm:text-base">{total} VND</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm sm:text-base">Phí vận chuyển</span>
                  <span className="font-semibold text-sm sm:text-base">{selectedItems.length > 0 ? "30,000" : "0"} VND</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-gray-50 -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-lg">
                  <span className="text-base sm:text-lg font-semibold text-gray-800">Tổng cộng</span>
                  <span className="text-lg sm:text-xl font-bold text-red-600">{selectedItems.length > 0
                    ? (total + 30000).toLocaleString()
                    : "0"} VND</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Note - All screen sizes */}
        </div>
      </div>
    </div>
  );
}

export default Payment