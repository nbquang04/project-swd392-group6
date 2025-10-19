import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header1";
import { ShoesShopContext } from "../../context/ShoeShopContext";
import { fetchCart } from '../../service/cart.js';


import {
  Container,
  Image,
  Button,
  Row,
  Col,
  Form,
  Card,
} from "react-bootstrap";





const CartPage = () => {
  const navigate = useNavigate();
  const {
    getTotal,
    carts,
    setCart,
    products,
    deleteFromCart,
    setSelectedItems,
    increCart,
    decreCart,
    selectedItems,
    handleCheckboxChange,
    handleCheckout,
    getCurrentUser,
  } = useContext(ShoesShopContext);

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  const getProductById = (productId) => {
    return products.find((p) => String(p.id) === String(productId));
  };

  // Lọc giỏ hàng cho người dùng hiện tại (phải lọc cả status === "active")
  const user = getCurrentUser();
  const userCarts = carts.filter(
    (cart) => String(cart.user_id) === String(user?.id)
  );

  // Tính tổng tiền
  const total = getTotal()

  const deleteItemFromCart = (cartId, itemIndex) => {
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) return;

    const item = cart.items[itemIndex];
    const updatedItems = cart.items.filter((_, idx) => idx !== itemIndex);

    setSelectedItems((prev) =>
      prev.filter(
        (sel) =>
          !(sel.cartId === cartId && sel.variantSku === item.variant_sku)
      )
    );

    if (updatedItems.length === 0) {
      deleteFromCart(cartId);
      setSelectedItems((prev) => prev.filter((sel) => sel.cartId !== cartId));
    } else {
      axios
        .put(`http://localhost:8080/cart/${cartId}`, {
          ...cart,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          updated_at: new Date().toISOString(),
        })
        .then((response) => {
          setCart((prev) =>
            prev.map((c) => (c.id === cartId ? response.data : c))
          );
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userCarts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-gray-50 to-white px-4">
            {/* Icon + Vòng tròn nền */}
            <div className="w-28 h-28 flex items-center justify-center bg-red-100 rounded-full shadow-inner mb-6 animate-bounce">
              <i className="ri-shopping-cart-line text-6xl text-red-500"></i>
            </div>


            {/* Tiêu đề */}
            <h3 className="text-3xl font-bold text-gray-800 mb-3">
              Giỏ hàng của bạn đang trống
            </h3>

            {/* Phụ đề */}
            <p className="text-gray-500 text-base max-w-sm text-center mb-8">
              Có vẻ như bạn chưa thêm gì vào giỏ hàng.
              Hãy bắt đầu khám phá và tìm sản phẩm bạn yêu thích!
            </p>

            {/* Nút hành động */}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sản phẩm trong giỏ hàng */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                <div className="px-8 py-6 bg-white border-b border-red-100">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl font-semibold text-gray-800">
                      Giỏ hàng
                    </h4>
                    <span className="text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-full font-medium">
                      {selectedItems.length} / {userCarts.reduce((total, cart) => total + cart.items.length, 0)} được chọn
                    </span>
                  </div>
                </div>

                <div>
                  {userCarts.map((cartItem) => (
                    <div key={cartItem.id}>
                      {cartItem.items &&
                        cartItem.items.map((item, itemIndex) => {
                          const product = getProductById(item.product_id);
                          const isSelected = selectedItems.some(
                            (sel) =>
                              sel.cartId === cartItem.id &&
                              sel.variantSku === item.variant_sku
                          );

                          if (!product) {
                            return (
                              <div
                                key={itemIndex}
                                className="px-8 py-8 border-b border-red-100 text-red-500"
                              >
                                Không tìm thấy sản phẩm (ID: {item.product_id})
                              </div>
                            );
                          }

                          return (
                            <div
                              key={itemIndex}
                              className={`px-8 py-8 border-b border-red-100 transition-colors duration-200 ${isSelected ? "bg-red-50" : "bg-white"
                                }`}
                            >
                              <div className="flex items-center space-x-6">
                                {/* Hộp kiểm */}
                                <div className="flex-shrink-0">
                                  <input
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxChange({
                                        cartId: cartItem.id,
                                        variantSku: item.variant_sku,
                                      })
                                    }
                                    checked={isSelected}
                                    className="w-5 h-5 accent-red-600 text-red-600 rounded"
                                    style={{ transform: "scale(1.2)" }}
                                  />
                                </div>

                                {/* Hình ảnh sản phẩm */}
                                <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate(`/products/${product.id.split('-')[0]}`)}>
                                  <div className="w-24 h-24 bg-red-50 rounded-xl overflow-hidden border border-red-200">
                                    <Image
                                      src={
                                        product.images && product.images[0]
                                          ? product.images[0]
                                          : "/placeholder-image.jpg"
                                      }
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>

                                {/* Thông tin sản phẩm */}
                                <div className="flex-1 min-w-0">
                                  <div className="mb-4">
                                    <h5
                                      className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-red-600 transition-colors"
                                      onClick={() => navigate(`/products/${product.id.split('-')[0]}`)}
                                    >
                                      {product.name}
                                    </h5>

                                    <div className="text-sm text-gray-600 mb-3 space-x-4">
                                      <span>Kích cỡ: {product.size || "Tiêu chuẩn"}</span>
                                      <span>Màu sắc: {product.color_code || "Mặc định"}</span>
                                      <span>Mã SKU: {item.variant_sku}</span>
                                    </div>

                                    <div className="text-lg font-bold text-red-600">
                                      {item.price.toLocaleString()} VND
                                    </div>
                                  </div>

                                  {/* Điều khiển số lượng */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <button
                                        onClick={() => decreCart(cartItem, itemIndex)}
                                        disabled={item.quantity <= 1}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-300 bg-white text-red-600 font-semibold text-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      >
                                        −
                                      </button>

                                      <span className="text-lg font-semibold text-gray-800 min-w-10 text-center">
                                        {item.quantity}
                                      </span>

                                      <button
                                        onClick={() => increCart(cartItem, itemIndex)}
                                        disabled={item.quantity >= product.stock_quantity}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-300 bg-white text-red-600 font-semibold text-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      >
                                        +
                                      </button>

                                      <span className="text-sm text-gray-500 ml-4">
                                        Tồn kho: {product.stock_quantity}
                                      </span>
                                    </div>

                                    {/* Tổng giá & Xóa */}
                                    <div className="flex items-center space-x-6">
                                      <div className="text-xl font-bold text-gray-800">
                                        {(item.price * item.quantity).toLocaleString()} VND
                                      </div>

                                      <button
                                        onClick={() =>
                                          deleteItemFromCart(cartItem.id, itemIndex)
                                        }
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
                  ))}
                </div>
              </div>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="lg:col-span-4">
              <div className="sticky top-32">
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                  <div className="bg-red-500 px-8 py-6">
                    <h5 className="text-xl font-semibold text-white text-center mb-0">
                      Tóm tắt đơn hàng
                    </h5>
                  </div>

                  <div className="p-8">
                    {/* Tóm tắt đơn hàng */}
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-gray-700">
                        <span>Tạm tính:</span>
                        <span className="font-semibold">{total.toLocaleString()} VND</span>
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
                              : "0"} VND
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Nút thanh toán */}
                    <div className="space-y-4">
                      <button
                        onClick={() => { navigate("/payment") }}
                        disabled={selectedItems.length === 0}
                        className={`w-full py-4 px-6 rounded-xl text-base font-semibold transition-all duration-200 ${selectedItems.length > 0
                          ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                      >
                        {selectedItems.length > 0
                          ? `🚀 Thanh toán `
                          : "Chọn sản phẩm để thanh toán"
                        }
                      </button>

                      {selectedItems.length === 0 && (
                        <p className="text-sm text-gray-500 text-center">
                          Vui lòng chọn ít nhất một sản phẩm
                        </p>
                      )}

                      {/* Tiếp tục mua sắm */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;