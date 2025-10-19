import React, { useContext, useEffect, useState } from "react";
import { ArrowLeft } from 'lucide-react';
import { ShoesShopContext } from "../../context/ShoeShopContext";
import { useNavigate, useLocation } from "react-router-dom";





const vietQRUrl = (
  amount,
  accountName = "Tên Chủ TK",
  accountNo = "SỐ_TÀI_KHOẢN",
  bankCode = "VCB"
) => {
  return `https://img.vietqr.io/image/${bankCode}-${accountNo}-compact2.png?amount=${amount}&accountName=${encodeURIComponent(
    accountName
  )}`;
};

const QRPayment = () => {
  const {
    selectedItems,
    setProduct,
    getTotal,
    removeItemsFromCart,
    carts,
    setSelectedItems,
    createOrder,
    updateProductStock
  } = useContext(ShoesShopContext);

  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu từ location state
  const locationState = location.state;
  const orderID = locationState?.orderID;
  const totalFromState = locationState?.total;
  const { name, phone, address, orderItems } = locationState || {};

  // Debug log
  useEffect(() => {
    console.log("Location state:", locationState);
    console.log("OrderID:", orderID);
    console.log("Total from state:", totalFromState);

    // Nếu không có orderID, redirect về payment page
    if (!orderID) {
      console.warn("No orderID found in location state!");
      navigate('/payment', { replace: true });
    }
  }, [orderID, totalFromState, locationState, navigate]);

  const [total, setTotal] = useState(totalFromState || 0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!totalFromState) {
      const computedTotal = getTotal() + (selectedItems.length > 0 ? 30000 : 0);
      setTotal(computedTotal);
    }
  }, [totalFromState, selectedItems, getTotal]);

  const handleBankSuccess = async () => {
    if (isProcessing) return; // Prevent double click

    setIsProcessing(true);

    try {
      // Tạo order với payment method là "bank"
      const orderResult = await createOrder("bank", name, phone, address, orderID);

      if (orderResult.success) {
        // Cập nhật stock
        const orderItemsToUpdate = orderItems || selectedItems.map(sel => {
          const cart = carts.find(c => c.id === sel.cartId);
          const item = cart?.items.find(i => i.variant_sku === sel.variantSku);
          return item;
        }).filter(Boolean);

        await updateProductStock(orderItemsToUpdate, setProduct);

        // Xóa items từ cart
        await removeItemsFromCart(selectedItems, carts);

        // Reset selected items
        setSelectedItems([]);

        alert(`✅ Cảm ơn bạn! Đơn hàng #${orderID} sẽ được xác nhận sau khi shop kiểm tra giao dịch.`);
        navigate("/products");
      }
    } catch (error) {
      console.error("❌ Lỗi khi xử lý thanh toán:", error);
      alert("⚠️ Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToPayment = () => {
    navigate('/payment');
  };

  // Loading state nếu chưa có dữ liệu
  if (!locationState || !orderID) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
            <p className="text-gray-600">Đang tải thông tin thanh toán...</p>
            <button
              onClick={() => navigate('/payment')}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Quay lại trang thanh toán
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back to Payment Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={handleBackToPayment}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            Quay lại thanh toán
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán đơn hàng</h1>
          <p className="text-gray-600">Hoàn tất thanh toán để xác nhận đơn hàng của bạn</p>
        </div>

        {/* Form + QR code section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - QR code */}
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white p-3 rounded-xl shadow-md border-2 border-dashed border-gray-300">
              <img
                src={vietQRUrl(total, "LE NGOC MINH", "00000120877", "TPB")}
                alt="VietQR Payment"
                className="w-64 h-64 object-contain"
                onError={(e) => {
                  console.error("QR code failed to load");
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Hiển thị thông tin order */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Mã đơn hàng: <span className="font-mono font-semibold">{orderID}</span></p>
              <p className="text-lg font-bold text-red-600 mt-1">
                {total.toLocaleString()} VND
              </p>
            </div>
          </div>

          {/* Right side - Instructions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Thực hiện theo hướng dẫn sau để thanh toán:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
              <li>Mở ứng dụng <span className="font-medium">Mobile Banking</span> của ngân hàng</li>
              <li>Chọn <span className="font-medium">"Thanh Toán"</span> và quét mã QR ở bên trái</li>
              <li>
                Nhập số tiền cần chuyển là{" "}
                <span className="font-semibold text-red-600">
                  {total.toLocaleString()} VND
                </span>
              </li>
              <li>
                Nội dung chuyển tiền:{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                  Thanh toan don hang {orderID}
                </span>
              </li>
              <li>Hoàn thành các bước thanh toán theo hướng dẫn và chờ xác nhận</li>
            </ol>

            {/* Warning */}
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-800 leading-relaxed">
                Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh chóng.
              </p>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleBankSuccess}
              disabled={isProcessing}
              className={`mt-6 w-full px-6 py-3 rounded-lg font-semibold transition ${isProcessing
                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
            >
              {isProcessing ? "Đang xử lý..." : "Tôi đã chuyển khoản thành công"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPayment;