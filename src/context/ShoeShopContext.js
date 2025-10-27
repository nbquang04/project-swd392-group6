import React, { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useNotification } from "./NotificationContext";

// ===== SERVICE IMPORTS =====
import {
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStockBatch,
} from "../service/product";

import { fetchCategories as fetchCategory } from "../service/categories";

import {
  fetchOrders,
  placeOrder as createOrder,
  updateOrderStatus as updateOrder,
  cancelOrder,
} from "../service/order";

import {
  getMyCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../service/cart";

import { loginUser as login, registerUser as register } from "../service/auth";
import { fetchUsers, updateUser } from "../service/users";
// import { getReviewsByProductId } from "../service/reviews"; // (chưa dùng, có thể bật lại khi cần)

export const ShoesShopContext = createContext();
export { ShoesShopContext as ShoeShopContext };

const ShoesProvider = ({ children }) => {
  // ====================== STATE MANAGEMENT ======================
  const [products, setProduct] = useState([]);          // danh sách hiển thị (có thể đã flatten)
  const [productsRoot, setProductsRoot] = useState([]); // dữ liệu gốc từ BE
  const [productsVersion, setProductsVersion] = useState(0);

  const [categories, setCategory] = useState([]);
  const [users, setUser] = useState([]);
  const [orders, setOrder] = useState([]);
  const [adminOrder, setAdminOrder] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [selectedItems, setSelectedItems] = useState([]); // mảng id cart item đã chọn

  // Bộ lọc / UI
  const [search, setSearch] = useState("");
  const [category, setCat] = useState(0); // id danh mục đang filter
  const [size, setSize] = useState(0);
  const [priceF, setPriceFilter] = useState(true);

  // Phân trang
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pagingProducts, setPagingProducts] = useState([]);
  const PRODUCT_PER_PAGE = 4;

  // Form/others
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Auth
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // ✅ báo hiệu đã kiểm tra xong token

  // Users (admin edit)
  const [editingUserId, setEditingUserId] = useState(null);
  const [editData, setEditData] = useState({ role: "", status: "" });
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Product detail
  const [proDetail, setProDetail] = useState(null);
  const [numDetail, setNumDetail] = useState(1);
  const [totalOrder, setTotalOrder] = useState(0);

  const navigate = useNavigate();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  // ====================== TOKEN / USER HELPERS ======================
  const getToken = () => localStorage.getItem("accessToken");
  const setToken = (token) => localStorage.setItem("accessToken", token);
  const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };
  const getCurrentUser = () => {
    const data = localStorage.getItem("user");
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  };

  const getCompleteUserData = () => {
    const localUser = getCurrentUser();
    if (!localUser) return null;
    if (Array.isArray(users) && users.length > 0) {
      const fullUser = users.find((u) => String(u.id) === String(localUser.id));
      return fullUser || localUser;
    }
    return localUser;
  };

  // ====================== AUTH ======================
  const handleSubmitLogin = async (payload) => {
    try {
      const res = await login(payload);
      const { token, user } = res || {};
      if (!token || !user) throw new Error("Invalid login response");
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
      showSuccess("Đăng nhập thành công!");
      return { status: true };
    } catch (err) {
      console.error("Login error:", err);
      showError("Sai tài khoản hoặc mật khẩu!");
      return { status: false };
    }
  };

  const handleSubmitSignup = async (payload) => {
    try {
      const res = await register(payload);
      const { token, user } = res || {};
      if (!token || !user) throw new Error("Invalid register response");
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
      showSuccess("Tạo tài khoản thành công!");
      return { status: true };
    } catch (err) {
      console.error("Register error:", err);
      showError("Không thể đăng ký. Vui lòng thử lại!");
      return { status: false };
    }
  };

  const logout = () => {
    clearTokens();
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate("/auth", { replace: true });
  };

  // ====================== LOAD DATA (SERVICES) ======================
  const reloadProducts = async () => {
    try {
      const data = await fetchProduct();
      setProductsRoot(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      showError("Không thể tải danh sách sản phẩm!");
    }
  };

  const reloadCategories = async () => {
    try {
      const data = await fetchCategory();
      setCategory(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      showError("Không thể tải danh mục!");
    }
  };

  const reloadOrders = async () => {
  try {
    const user = getCurrentUser();
    if (!user) return;
    const data = await fetchOrders();
    console.log("📦 [reloadOrders] user orders:", data); // 👈 Thêm dòng này
    setOrder(Array.isArray(data) ? data : []);
  } catch (e) {
    console.error("❌ reloadOrders error:", e);
    showError("Không thể tải danh sách đơn hàng!");
  }
};


  const reloadCarts = async () => {
    try {
      const data = await getMyCart();
      if (data && Array.isArray(data.items)) {
        setCart(data);
      } else {
        setCart({ items: [] });
      }
    } catch (error) {
      console.error("❌ Lỗi tải giỏ hàng:", error);
      setCart({ items: [] });
    }
  };

  const reloadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUser(Array.isArray(data) ? data : []);
      setFilteredUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      showError("Không thể tải danh sách người dùng!");
    }
  };

  // ====================== AUTH CHECK + LOAD DATA ======================
  // Chỉ check auth 1 lần khi app mount
  useEffect(() => {
    const u = getCurrentUser();
    if (u) {
      setCurrentUser(u);
      setIsAuthenticated(true);
    }
    setAuthChecked(true); // ✅ báo đã check xong
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sau khi check xong: load public data, và nếu đã đăng nhập thì load private data
  useEffect(() => {
    if (!authChecked) return;
    // public
    reloadProducts();
    reloadCategories();
    // private
    if (isAuthenticated) {
      reloadOrders();
      reloadCarts();
      reloadUsers();
    } else {
      // nếu chưa login, dọn các state private để tránh hiển thị nhầm
      setOrdersSafe();
      setCart({ items: [] });
      setUser([]);
      setFilteredUsers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked, isAuthenticated]);

  const setOrdersSafe = () => {
    setOrder([]);
    setAdminOrder([]);
  };

  // ====================== DERIVATIONS: FLATTEN + FILTER + PAGINATION ======================
  const flattenProducts = useCallback((rawList) => {
    if (!Array.isArray(rawList)) return [];
    const anyVariants = rawList.some((p) => Array.isArray(p?.variants) && p.variants.length);
    if (!anyVariants) return rawList;

    const flattened = rawList
      .map((product) =>
        (product.variants || []).map((variant) => ({
          ...product,
          id: `${product.id}-${variant.sku}`,
          sku: variant.sku,
          color_code: variant.color_code,
          size: variant.size,
          price: variant.price,
          cost_price: variant.cost_price,
          stock_quantity: variant.stock_quantity,
          images: variant.images || product.images,
          variant_sku: variant.sku,
        }))
      )
      .flat();

    return flattened;
  }, []);

  const handleSetPagingProducts = useCallback((data, page) => {
    const totalPages = Math.ceil((data?.length || 0) / PRODUCT_PER_PAGE);
    setPages([...Array(totalPages).keys()]);
    const start = page * PRODUCT_PER_PAGE;
    const end = start + PRODUCT_PER_PAGE;
    setPagingProducts((data || []).slice(start, end));
  }, []);

  useEffect(() => {
    const raw = Array.isArray(productsRoot) ? productsRoot : [];
    let list = flattenProducts(raw);

    list.sort((a, b) => (priceF ? a.price - b.price : b.price - a.price));

    if (search.trim() !== "") {
      const kw = search.toLowerCase();
      list = list.filter((p) => (p.name || "").toLowerCase().includes(kw));
    }

    if (Number(category) !== 0) {
      list = list.filter((p) => Number(p.category_id) === Number(category));
    }

    if (Number(size) !== 0) {
      list = list.filter((p) => Number(p.size) === Number(size));
    }

    setProduct(list);
    handleSetPagingProducts(list, 0);
    setCurrentPage(0);
  }, [productsRoot, search, category, size, priceF, flattenProducts, handleSetPagingProducts]);

  // ====================== CART FUNCTIONS ======================
  const handleAddToCart = async (product, quantity = 1, selectedVariant = null) => {
    const user = getCurrentUser();
    if (!user) {
      showWarning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    try {
      const productId = product.id;
      const variantId = selectedVariant?.id || product.variant_sku || null;
      const price = selectedVariant?.price || product.price || 0;

      await addToCart({ productId, variantId, quantity, price });
      await reloadCarts();
      showSuccess("✅ Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err) {
      console.error("❌ addToCart error:", err);
      showError("Không thể thêm sản phẩm vào giỏ hàng!");
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeFromCart(itemId);
      await reloadCarts();
      showSuccess("🗑️ Đã xoá sản phẩm khỏi giỏ hàng!");
    } catch (err) {
      console.error("❌ removeFromCart error:", err);
      showError("Không thể xoá sản phẩm khỏi giỏ hàng!");
    }
  };

  const handleUpdateCartItem = async (itemId, quantity) => {
    try {
      await updateCartItem(itemId, quantity);
      await reloadCarts();
      showSuccess("Đã cập nhật số lượng sản phẩm!");
    } catch (err) {
      console.error("❌ updateCartItem error:", err);
      showError("Không thể cập nhật giỏ hàng!");
    }
  };

  const handleClearCart = async (silent = false) => {
    try {
      await clearCart();
      setCart({ items: [] });
      setSelectedItems([]);
      if (!silent) showSuccess("🧹 Đã xoá toàn bộ giỏ hàng!");
    } catch (err) {
      console.error("❌ clearCart error:", err);
      if (!silent) showError("Không thể xoá giỏ hàng!");
    }
  };

  const handleCheckboxChange = ({ itemId }) => {
    setSelectedItems((prev) => {
      const exists = prev.includes(itemId);
      return exists ? prev.filter((id) => id !== itemId) : [...prev, itemId];
    });
  };

  const getTotal = () => {
    if (!cart || !Array.isArray(cart.items)) return 0;
    return cart.items
      .filter((i) => selectedItems.includes(i.id))
      .reduce((sum, i) => sum + Number(i.price || 0) * i.quantity, 0);
  };

  // ====================== ORDER FUNCTIONS ======================
  const buildOrderItemsFromSelection = () => {
    if (!cart || !Array.isArray(cart.items)) return [];
    return cart.items
      .filter((i) => selectedItems.includes(i.id))
      .map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
        price: Number(i.price) || 0, // ✅ đảm bảo số, backend sẽ parse BigDecimal
      }));
  };

  const handleCreateOrder = async (paymentMethod = "cod", addressInput) => {
    let items = [];
    try {
      items = buildOrderItemsFromSelection();
      const payload = { address: addressInput, paymentMethod, items };

      const res = await createOrder(payload);

      if (res && (res.id || res === true)) {
        showSuccess(" Đã thanh toán thành công!");
        await updateProductStockBatch(items);
        await handleClearCart();
        await reloadOrders();
        setSelectedItems([]);
        return true;
      }

      return false;
    } catch (err) {
      console.error("❌ createOrder error:", err.message);
      return false;
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      await reloadOrders();
      showSuccess("🛑 Đơn hàng đã được huỷ!");
    } catch {
      showError("Không thể huỷ đơn hàng!");
    }
  };

  const handleClickConfirm = async (order) => {
    try {
      let newStatus = order.status;
      if (order.status === "Pending") newStatus = "Paid";
      else if (order.status === "Paid") newStatus = "Shipped";
      else if (order.status === "Shipped") newStatus = "Done";

      await updateOrder(order.id, { status: newStatus });
      await reloadOrders();
      showSuccess("Đã cập nhật trạng thái đơn hàng!");
    } catch (err) {
      console.error("Update order error:", err);
      showError("Không thể cập nhật trạng thái đơn hàng!");
    }
  };

  // ====================== PRODUCT DETAIL & UTILS ======================
  const clickDetailProduct = (id) => {
    try {
      const proChoose = products.find((p) => String(p.id) === String(id));
      setProDetail(proChoose || null);
    } catch (err) {
      console.error("clickDetailProduct error:", err);
    }
  };

  const getProductDetails = (productId) =>
    products.find((p) => String(p.id) === String(productId));

  const increaseQuan = (num, setQuan, max) => {
    if (num < Number(max)) setQuan(num + 1);
  };
  const decreaPro = (num, setQuan) => {
    if (num > 1) setQuan(num - 1);
  };

  // ====================== PRODUCT MANAGEMENT (ADMIN) ======================
  const handleAddProduct = async () => {
    if (
      !formData.name ||
      !formData.category_id ||
      !Array.isArray(formData.images) ||
      formData.images.length === 0
    ) {
      showError("Vui lòng điền đầy đủ thông tin bắt buộc (tên, danh mục, ảnh)!");
      return;
    }
    if (!Array.isArray(formData.variants) || formData.variants.length === 0) {
      showError("Phải có ít nhất 1 biến thể!");
      return;
    }

    try {
      await createProduct(formData);
      showSuccess("✅ Sản phẩm đã được thêm!");
      await reloadProducts();
      navigate("/admin/products");
    } catch (err) {
      console.error("createProduct error:", err);
      showError("Không thể thêm sản phẩm!");
    }
  };

  const handleEditProduct = async (id, data) => {
    try {
      await updateProduct(id, data);
      showSuccess("Đã cập nhật sản phẩm!");
      await reloadProducts();
    } catch {
      showError("Không thể cập nhật sản phẩm!");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      await reloadProducts();
      showSuccess("Đã xoá sản phẩm!");
    } catch {
      showError("Không thể xoá sản phẩm!");
    }
  };

  // ====================== ANALYTICS & HELPERS ======================
  const calculateSales = () => {
    const salesCount = {};
    (orders || []).forEach((order) => {
      (order.items || []).forEach((item) => {
        const baseId = String(item.product_id).split("-")[0];
        salesCount[baseId] = (salesCount[baseId] || 0) + Number(item.quantity);
      });
    });
    return salesCount;
  };

  const getBestSellingProducts = () => {
    const sales = calculateSales();
    return (products || []).filter((p) => {
      const baseId = String(p.id).split("-")[0];
      return (sales[baseId] || 0) >= 10;
    });
  };

  const generateQRCode = (orderId, amount) => {
    const qrData = `Order: ${orderId}\nAmount: ${Number(amount).toLocaleString(
      "vi-VN"
    )} VND\nPayment: QR Code`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      qrData
    )}`;
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(amount));

  const handleGoTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ====================== USER MANAGEMENT (ADMIN) ======================
  const searchUserByName = (name) => {
    if (!name) {
      setFilteredUsers(users);
    } else {
      const keyword = name.toLowerCase();
      setFilteredUsers(
        (users || []).filter((u) => (u?.name || "").toLowerCase().includes(keyword))
      );
    }
  };

  const sortUsersByNameAsc = () => {
    const sorted = [...(users || [])].sort((a, b) =>
      (a?.name || "")
        .toString()
        .localeCompare((b?.name || "").toString(), "en", { sensitivity: "base" })
    );
    setUser(sorted);
    setFilteredUsers(sorted);
  };

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditData({ role: user.role, status: user.status });
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditData({ role: "", status: "" });
  };

  const saveEdit = async (id) => {
    try {
      const userToUpdate = (users || []).find((u) => String(u.id) === String(id));
      if (!userToUpdate) return;
      const updatedUser = { ...userToUpdate, ...editData };
      await updateUser(id, updatedUser);
      await reloadUsers();
      showSuccess("Đã cập nhật thông tin người dùng!");
      cancelEdit();
    } catch (err) {
      showError("Không thể lưu chỉnh sửa người dùng!");
    }
  };

  const softDeleteUser = async (id) => {
    try {
      const u = (users || []).find((x) => String(x.id) === String(id));
      if (!u) return;
      const updated = { ...u, status: "Deleted" };
      await updateUser(id, updated);
      await reloadUsers();
      showSuccess("Đã ẩn người dùng!");
    } catch (err) {
      showError("Không thể ẩn người dùng!");
    }
  };

  const restoreUser = async (id) => {
    try {
      const u = (users || []).find((x) => String(x.id) === String(id));
      if (!u) return;
      const updated = { ...u, status: "Active" };
      await updateUser(id, updated);
      await reloadUsers();
      showSuccess("Đã khôi phục người dùng!");
    } catch (err) {
      showError("Không thể khôi phục người dùng!");
    }
  };

  const exportUsersToExcel = () => {
    try {
      const sheet = XLSX.utils.json_to_sheet(users || []);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, "Users");
      XLSX.writeFile(wb, "users.xlsx");
      showSuccess("✅ Đã xuất danh sách người dùng!");
    } catch (err) {
      console.error("Excel export error:", err);
      showError("Không thể xuất file Excel!");
    }
  };

  // ====================== CONTEXT PROVIDER ======================
  return (
    <ShoesShopContext.Provider
      value={{
        // ===== STATE =====
        products,
        productsRoot,
        productsVersion,
        categories,
        cart,
        orders,
        adminOrder,
        users,
        filteredUsers,
        currentUser,
        isAuthenticated,
        authChecked,
        search,
        category,
        size,
        priceF,
        pages,
        currentPage,
        pagingProducts,
        formData,
        proDetail,
        numDetail,
        totalOrder,
        loading,
        editData,
        editingUserId,
        selectedItems,

        // ===== SETTERS =====
        setProduct,
        setProductsRoot,
        setProductsVersion,
        setCategory,
        setCart,
        setOrder,
        setAdminOrder,
        setUser,
        setFilteredUsers,
        setSearch,
        setCat,
        setSize,
        setPriceFilter,
        setPages,
        setCurrentPage,
        setPagingProducts,
        setFormData,
        setProDetail,
        setNumDetail,
        setTotalOrder,
        setEditData,
        setEditingUserId,
        setSelectedItems,
        setLoading,

        // ===== AUTH =====
        handleSubmitLogin,
        handleSubmitSignup,
        logout,
        getCurrentUser,
        getCompleteUserData,

        // ===== LOADERS =====
        reloadProducts,
        reloadCategories,
        reloadOrders,
        reloadCarts,
        reloadUsers,

        // ===== PRODUCT =====
        handleAddProduct,
        handleEditProduct,
        handleDeleteProduct,
        clickDetailProduct,
        getProductDetails,
        increaseQuan,
        decreaPro,
        calculateSales,
        getBestSellingProducts,
        updateProductStockBatch,
        formatCurrency,
        handleGoTop,

        // ===== CART =====
        handleAddToCart,
        handleRemoveFromCart,
        handleUpdateCartItem,
        handleClearCart,
        handleCheckboxChange,
        getTotal,

        // ===== ORDER =====
        handleCreateOrder,
        handleCancelOrder,
        handleClickConfirm,

        // ===== USER =====
        searchUserByName,
        sortUsersByNameAsc,
        startEdit,
        cancelEdit,
        saveEdit,
        softDeleteUser,
        restoreUser,
        exportUsersToExcel,
        updateUser,

        // ===== MISC =====
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </ShoesShopContext.Provider>
  );
};

export default ShoesProvider;
