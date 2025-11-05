import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header1";
import { ShoesShopContext } from "../../context/ShoeShopContext";
import { getMyCart, updateCartItem, removeFromCart } from "../../service/cart";
import { Image } from "react-bootstrap";
import { fetchProduct } from "../../service/product";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    setCart,
    setProduct,
    products,
    selectedItems,
    setSelectedItems,
    handleCheckboxChange,
    getCurrentUser,
    getTotal,
    showSuccess,
    showError,
  } = useContext(ShoesShopContext);

  const [loading, setLoading] = useState(true);

  // 🧠 Load giỏ hàng khi vào trang
  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await getMyCart();
        setCart(data);
      } catch (error) {
        console.error("Error loading cart:", error);
        showError("Không thể tải giỏ hàng!");
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [setCart, showError]);

  const user = getCurrentUser();
  const total = getTotal();

  // 🔄 Tăng / giảm số lượng sản phẩm
  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartItem(itemId, quantity);
      const updated = await getMyCart();
      setCart(updated);
      showSuccess("Đã cập nhật số lượng!");
    } catch (err) {
      console.error("updateCartItem error:", err);
      showError("Không thể cập nhật giỏ hàng!");
    }
  };

  // 🗑️ Xóa sản phẩm khỏi giỏ
  const deleteItemFromCart = async (itemId) => {
    try {
      await removeFromCart(itemId);
      const updated = await getMyCart();
      setCart(updated);
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      showSuccess("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (error) {
      console.error("Error removing item:", error);
      showError("Không thể xóa sản phẩm!");
    }
  };
  useEffect(() => {
    const loadCartAndProducts = async () => {
      try {
        // tải cả giỏ hàng và sản phẩm song song
        const [cartData, productData] = await Promise.all([
          getMyCart(),
          fetchProduct()
        ]);
        setCart(cartData);
        if (Array.isArray(productData)) setProduct(productData);
      } catch (error) {
        console.error("Error loading cart or products:", error);
        showError("Không thể tải dữ liệu giỏ hàng hoặc sản phẩm!");
      } finally {
        setLoading(false);
      }
    };

    loadCartAndProducts();
  }, [setCart, setProduct, showError]);

  // ⏳ Loading
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full"></div>
      </div>
    );

  // 🛒 Nếu giỏ trống
  if (!user || !cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-gray-50 to-white px-4">
          <div className="w-28 h-28 flex items-center justify-center bg-red-100 rounded-full shadow-inner mb-6 animate-bounce">
            <i className="ri-shopping-cart-line text-6xl text-red-500"></i>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-3">
            Giỏ hàng của bạn đang trống
          </h3>
          <p className="text-gray-500 text-base max-w-sm text-center mb-8">
            Có vẻ như bạn chưa thêm gì vào giỏ hàng.
            Hãy bắt đầu khám phá và tìm sản phẩm bạn yêu thích!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition"
          >
            🛍️ Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  // 💡 Hiển thị danh sách giỏ hàng
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ===== DANH SÁCH SẢN PHẨM ===== */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
              <div className="px-8 py-6 bg-white border-b border-red-100">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-semibold text-gray-800">Giỏ hàng</h4>
                  <span className="text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-full font-medium">
                    {selectedItems.length} / {cart.items.length} được chọn
                  </span>
                </div>
              </div>

              {/* DANH SÁCH ITEMS */}
              <div>
                {cart.items.map((item, index) => {
                  const product = products.find((p) => String(p.id) === String(item.productId)) || {};
                  const isSelected = selectedItems.includes(item.id);

                  return (
                    <div
                      key={item.id || index}
                      className={`px-8 py-8 border-b border-red-100 transition-colors duration-200 ${isSelected ? "bg-red-50" : "bg-white"
                        }`}
                    >
                      <div className="flex items-center space-x-6">
                        {/* Checkbox */}
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange({ itemId: item.id })}
                            checked={isSelected}
                            className="w-5 h-5 accent-red-600 text-red-600 rounded"
                            style={{ transform: "scale(1.2)" }}
                          />
                        </div>

                        {/* Ảnh sản phẩm */}
                        <div
                          className="flex-shrink-0 cursor-pointer"
                          onClick={() => navigate(`/products/${item.productId}`)}
                        >
                          <div className="w-24 h-24 bg-red-50 rounded-xl overflow-hidden border border-red-200">
                            <Image
                              src={product?.images?.[0] || "/placeholder-image.jpg"}
                              alt={product?.name || "Sản phẩm"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-4">
                            <h5
                              className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-red-600 transition-colors"
                              onClick={() => navigate(`/products/${item.productId}`)}
                            >
                              {product?.name || "Sản phẩm không xác định"}
                            </h5>

                            <div className="text-sm text-gray-600 mb-3 space-x-4">
                              <span>Biến thể: {item.variantId || "Default"}</span>
                              <span>Size: {product.size || "Default"}</span>
                              <span>Số lượng: {item.quantity}</span>
                            </div>

                            <div className="text-lg font-bold text-red-600">
                              {item.price?.toLocaleString("vi-VN")} VND
                            </div>
                          </div>

                          {/* Số lượng + Xóa */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-300 bg-white text-red-600 font-semibold text-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                −
                              </button>

                              <span className="text-lg font-semibold text-gray-800 min-w-10 text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, item.quantity + 1)
                                }
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-300 bg-white text-red-600 font-semibold text-lg hover:bg-red-50 transition-colors"
                              >
                                +
                              </button>
                            </div>

                            {/* Tổng giá & Xóa */}
                            <div className="flex items-center space-x-6">
                              <div className="text-xl font-bold text-gray-800">
                                {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                              </div>

                              <button
                                onClick={() => deleteItemFromCart(item.id)}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-300 bg-red-500 text-white hover:bg-red-600 transition-colors"
                              >
                                <i className="bi bi-trash3-fill"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ===== TÓM TẮT ===== */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                <div className="bg-red-500 px-8 py-6">
                  <h5 className="text-xl font-semibold text-white text-center mb-0">
                    Tóm tắt đơn hàng
                  </h5>
                </div>

                <div className="p-8">
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-700">
                      <span>Tạm tính:</span>
                      <span className="font-semibold">
                        {total.toLocaleString()} VND
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Phí vận chuyển:</span>
                      <span className="font-semibold">
                        {selectedItems.length > 0 ? "30,000" : "0"} VND
                      </span>
                    </div>
                    <div className="border-t border-red-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-800">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-red-600">
                          {selectedItems.length > 0
                            ? (total + 30000).toLocaleString()
                            : "0"}{" "}
                          VND
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => navigate("/payment")}
                      disabled={selectedItems.length === 0}
                      className={`w-full py-4 px-6 rounded-xl text-base font-semibold transition-all duration-200 ${selectedItems.length > 0
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {selectedItems.length > 0
                        ? "🚀 Thanh toán"
                        : "Chọn sản phẩm để thanh toán"}
                    </button>

                    {selectedItems.length === 0 && (
                      <p className="text-sm text-gray-500 text-center">
                        Vui lòng chọn ít nhất một sản phẩm
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
