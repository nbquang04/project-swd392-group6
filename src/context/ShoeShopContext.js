import React, { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "./NotificationContext";
import * as XLSX from "xlsx";
export const ShoesShopContext = createContext();
export { ShoesShopContext as ShoeShopContext };

const API_BASE = "http://localhost:8080";

const ShoesProvider = ({ children }) => {

  // ===== STATE MANAGEMENT =====
  const [products, setProduct] = useState([]);
  const [productsRoot, setProductsRoot] = useState([]);
  const [productsVersion, setProductsVersion] = useState(0);
  // Lưu user data từ localStorage để tương thích ngược (sẽ được migrate dần)
  const [localUserData, setLocalUserData] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [categories, setCategory] = useState([]);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pagingProducts, setPagingProducts] = useState([]);
  const PRODUCT_PER_PAGE = 4;
  const [search, setSearch] = useState("");
  const [category, setCat] = useState(0);
  const [size, setSize] = useState(0);
  const [priceF, setPriceFilter] = useState(true);
  const [users, setUser] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [msgs, setMsgs] = useState({ text: "", status: false });
  const [carts, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // Lưu sản phẩm được chọn
  const [orders, setOrder] = useState([]);
  const [formData, setFormData] = useState({});
  const [adminOrder, setAdminOrder] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editData, setEditData] = useState({ role: "", status: "" });
  const [loading, setLoading] = useState(false);


  // từ Incoming
  const [proDetail, setProDetail] = useState();
  const [numDetail, setNumDetail] = useState(1);
  const [totalOrder, setTotalOrder] = useState(0);

  // ===== TOKEN MANAGEMENT ===== (giữ từ Current)
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ===== NOTIFICATION SYSTEM =====
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  // Token helpers
  const utf8ToBase64 = (str) => {
    try {
      const utf8 = new TextEncoder().encode(str);
      let binary = "";
      utf8.forEach((b) => (binary += String.fromCharCode(b)));
      return btoa(binary);
    } catch (_) {
      // Fallback (deprecated APIs but widely supported)
      // eslint-disable-next-line no-undef
      return btoa(unescape(encodeURIComponent(str)));
    }
  };

  const base64ToUtf8 = (b64) => {
    try {
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return new TextDecoder().decode(bytes);
    } catch (_) {
      // Fallback (deprecated APIs but widely supported)
      // eslint-disable-next-line no-undef
      return decodeURIComponent(escape(atob(b64)));
    }
  };

  const getToken = () => localStorage.getItem("accessToken");
  const getRefreshToken = () => localStorage.getItem("refreshToken");
  const setToken = (token) => localStorage.setItem("accessToken", token);
  const setRefreshToken = (refreshToken) =>
    localStorage.setItem("refreshToken", refreshToken);
  const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setLocalUserData(null);
  };

  // Helper function để lấy user data (ưu tiên token, fallback localStorage)
  const getUserData = () => {
    const tokenUser = getCurrentUser();
    if (tokenUser) {
      return tokenUser;
    }
    return localUserData;
  };

  // Simple demo token (giữ nguyên logic demo)
  const generateToken = (user) => {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
      address: user.address,
      iat: Math.floor(Date.now() / 1000),
      exp:
        Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60, // 15 ngày
    };
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payloadEncoded = utf8ToBase64(JSON.stringify(payload));
    const secret =
      process.env.REACT_APP_JWT_SECRET ||
      "your-super-secret-jwt-key-change-in-production";
    const signature = utf8ToBase64(secret + JSON.stringify(payload));
    return `${header}.${payloadEncoded}.${signature}`;
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return true;
      const payload = JSON.parse(base64ToUtf8(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  };

  const getCurrentUser = () => {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      clearTokens();
      return null;
    }
    try {
      const parts = token.split(".");
      const payload = JSON.parse(base64ToUtf8(parts[1]));
      return {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        name: payload.name,
        phone: payload.phone,
        address: payload.address,
      };
    } catch {
      clearTokens();
      return null;
    }
  };

  const getCompleteUserData = () => {
    const tokenUser = getCurrentUser();
    if (!tokenUser) return null;
    const completeUser = users.find(
      (u) => String(u.id) === String(tokenUser.id)
    );
    return completeUser || tokenUser;
  };

  const refreshUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user");
      setUser(response.data);
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const generateRefreshToken = () =>
    "refresh_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();

  // init auth
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  // axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token && !isTokenExpired(token)) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 401) {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            clearTokens();
            setCurrentUser(null);
            setIsAuthenticated(false);
            navigate("/auth");
          } else {
            clearTokens();
            setCurrentUser(null);
            setIsAuthenticated(false);
            navigate("/auth");
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  // ===== DATA FETCHING EFFECTS =====
  // Fetch root products once and on explicit reloads
  useEffect(() => {
    axios.get("http://localhost:8080/products", { params: { _t: Date.now() } }).then((result) => {
      const raw = result.data || [];
      setProductsRoot(raw);
    });
  }, [productsVersion]);

  // Derive storefront listing from root + filters
  useEffect(() => {
    const raw = productsRoot || [];
    let flattened = raw
      .map((product) =>
        product.variants.map((variant) => ({
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

    flattened.sort((a, b) => a.price - b.price);
    flattened = flattened.filter((p) => Number(p.stock_quantity) > 0);

    if (priceF !== true) {
      flattened.sort((a, b) => b.price - a.price);
    }
    if (search !== "") {
      flattened = flattened.filter((p) =>
        (p.name || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== 0) {
      flattened = flattened.filter((p) => p.category_id === Number(category));
    }
    if (size !== 0) {
      flattened = flattened.filter((p) => p.size === size);
    }

    handleSetPagingProducts(flattened, 0);
    setProduct(flattened);
    setCurrentProducts(flattened);
  }, [productsRoot, search, category, size, priceF]);

  // Force reload products and refresh both admin and storefront datasets
  const reloadProducts = async () => {
    setProductsVersion((v) => v + 1);
  };

  useEffect(() => {
    axios.get("http://localhost:8080/category").then((result) => {
      setCategory(result.data);
    });
  }, []);

  useEffect(() => {
    handleSetPagingProducts(currentProducts, currentPage);
  }, [currentPage, currentProducts]);

  useEffect(() => {
    axios.get("http://localhost:8080/user").then((result) => {
      let filteredData = result.data;
      if (search.trim() !== "") {
        filteredData = filteredData.filter((u) =>
          u.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (msg.trim() !== "") {
        filteredData = filteredData.filter((order) => {
          const d = new Date(order.created_at);
          const formatted = `${d.getFullYear()}-${String(
            d.getMonth() + 1
          ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          return formatted === msg;
        });
      }
      setUser(filteredData);
    });
  }, [search, msg]);

  useEffect(() => {
    axios.get("http://localhost:8080/cart").then((result) => {
      setCart(result.data);
    });
  }, [priceF]);

  // Fetch orders + admin view
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/orders");
        let allOrders = response.data;

        const user = getCurrentUser();
        if (!user || !user.id) {
          // Không chặn, chỉ không set user-specific orders
        } else {
          const userOrders = allOrders.filter(
            (o) => String(o.user_id) === String(user.id)
          );
          setOrder(userOrders);
        }

        let filteredOrders = [...allOrders];
        const sizeNumber = parseInt(size);
        if (!isNaN(sizeNumber) && sizeNumber !== 0) {
          filteredOrders = filteredOrders.filter(
            (o) => Number(o.user_id) === sizeNumber
          );
        }
        if (search.trim() !== "") {
          filteredOrders = filteredOrders.filter((order) => {
            const od = new Date(order.created_at);
            const formatted = `${od.getFullYear()}-${String(
              od.getMonth() + 1
            ).padStart(2, "0")}-${String(od.getDate()).padStart(2, "0")}`;
            return formatted === search;
          });
        }

        filteredOrders.sort((a, b) => (priceF ? a.total - b.total : b.total - a.total));
        setAdminOrder(filteredOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [size, priceF, search]);

  // ===== PAGINATION =====
  const handleSetPagingProducts = (data, page) => {
    const totalPages = Math.ceil(data.length / PRODUCT_PER_PAGE);
    setPages([...Array(totalPages).keys()]);
    const start = page * PRODUCT_PER_PAGE;
    const end = start + PRODUCT_PER_PAGE;
    setPagingProducts(data.slice(start, end));
  };

  // ===== AUTH (RHF + Yup compatible) =====
  async function handleSubmitLogin(payload) {
    // payload từ RHF: { email, password, rememberMe? }
    let email = (payload?.email || "").trim();
    let password = (payload?.password || "").trim();
    const rememberMe = !!payload?.rememberMe;

    if (!email || !password) {
      setMsg("Please complete all fields", false);
      return { status: false, text: "Please complete all fields" };
    }
    if (password.includes(" ")) {
      setMsg("Password must not include space", false);
      return { status: false, text: "Password must not include space" };
    }
    if (password.length < 3) {
      // (Frontend đang check >=6 bằng Yup; backend vẫn giữ >=3 để an toàn)
      setMsg("Password must be at least 3 characters", false);
      return { status: false, text: "Password must be at least 3 characters" };
    }

    try {
      const response = await fetch("http://localhost:8080/user");
      if (!response.ok) {
        setMsg("Error fetching user data", false);
        return { status: false, text: "Error fetching user data" };
      }
      const users = await response.json();
      if (!Array.isArray(users)) {
        setMsg("Error fetching user data", false);
        return { status: false, text: "Error fetching user data" };
      }

      const user = users.find((u) => u.email === email && u.password === password);
      if (!user) {
        setMsg("Wrong email or password", false);
        return { status: false, text: "Wrong email or password" };
      }

      // Kiểm tra status của user - không cho phép user bị disable đăng nhập
      if (user.role === "user" && user.status === "Disabled") {
        setMsg("Tài khoản của bạn đã bị vô hiệu hóa bởi admin", false);
        return { status: false, text: "Tài khoản của bạn đã bị vô hiệu hóa bởi admin. Vui lòng liên hệ admin để được hỗ trợ." };
      }

      // Auth success
      const accessToken = generateToken(user);
      const refreshToken = generateRefreshToken();

      setToken(accessToken);
      setRefreshToken(refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser({ id: user.id, email: user.email, role: user.role });
      setIsAuthenticated(true);

      // token TTL: 15 phút (nếu muốn rememberMe lâu hơn, tăng TTL ở đây)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      try {
        await axios.post("http://localhost:8080/tokens", {
          id: Date.now().toString(),
          user_id: user.id,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
          created_at: new Date().toISOString(),
          remember_me: rememberMe,
        });
      } catch (_) { }

      // KHÔNG navigate ở đây (Auth.jsx sẽ navigate sau khi nhận status true)
      return { status: true };
    } catch (error) {
      console.error("Login error:", error);
      setMsg("Server error, please try again", false);
      return { status: false, text: "Server error, please try again" };
    }
  }

  async function handleSubmitSignup(payload) {
    // payload từ RHF: { username, phone, email, address, password, confirmPassword }
    const name = (payload?.username || "").trim();
    const phone = (payload?.phone || "").trim();
    const email = (payload?.email || "").trim();
    const address = (payload?.address || "").trim();
    const password = (payload?.password || "").trim();
    const repassword = (payload?.confirmPassword || "").trim();

    if (name.includes(" ")) {
      return { text: "Username must not include space", status: false };
    }
    if (repassword !== password) {
      return { text: "Password mismatch", status: false };
    }
    if (password.length < 3) {
      // (Frontend đang check >=6 bằng Yup; backend vẫn giữ >=3 để an toàn)
      return { text: "Password must be at least 3 characters", status: false };
    }

    try {
      const usersResponse = await fetch("http://localhost:8080/user");
      if (!usersResponse.ok) {
        return { text: "Error fetching user data", status: false };
      }
      const users = await usersResponse.json();

      const existingUser = users.find((u) => u.name === name || u.email === email);
      if (existingUser) {
        return { text: "User already exists", status: false };
      }

      // Tạo id numeric an toàn
      const existingIds = users.map((u) => parseInt(u.id)).filter((id) => !isNaN(id));
      const newId = existingIds.length ? Math.max(...existingIds) + 1 : 1;

      const newUser = {
        id: String(newId),
        name,
        phone,
        email,
        password,
        address,
        role: "customer",
        created_at: new Date().toISOString().split("T")[0],
      };

      await fetch("http://localhost:8080/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      return { text: "User registered successfully!", status: true };
    } catch (error) {
      console.error("Error during registration:", error);
      return { text: "Error occurred, please try again", status: false };
    }
  }

  const logout = () => {
    clearTokens();
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigate("/auth");
  };

  // ===== CART =====
  const handleCheckboxChange = ({ cartId, variantSku }) => {
    setSelectedItems((prevSelected) => {
      const exists = prevSelected.some(
        (item) => item.cartId === cartId && item.variantSku === variantSku
      );
      if (exists) {
        return prevSelected.filter(
          (item) => !(item.cartId === cartId && item.variantSku === variantSku)
        );
      } else {
        return [...prevSelected, { cartId, variantSku }];
      }
    });
  };

  const addToCart = async (pro, number) => {
    const user = getCurrentUser();
    if (!user) {
      showWarning("Vui lòng đăng nhập để thêm vào giỏ hàng.");
      return;
    }
    const idU = user.id;

    try {
      const activeCart = carts.find(
        (cart) => String(cart.user_id) === String(idU) && cart.status === "active"
      );

      const newItem = {
        product_id: pro.id,
        variant_sku: pro.variant_sku,
        quantity: number,
        price: pro.price,
        added_at: new Date().toISOString(),
      };

      if (activeCart) {
        const existingItemIndex = activeCart.items.findIndex(
          (item) =>
            item.product_id === pro.id &&
            item.variant_sku === pro.variant_sku
        );
        const updatedItems = [...activeCart.items];
        if (existingItemIndex !== -1) {
          const currentQuantity = updatedItems[existingItemIndex].quantity;
          const newQuantity = currentQuantity + number;
          if (newQuantity > pro.stock_quantity) {
            showWarning("Không đủ hàng trong kho!");
            return;
          }
          updatedItems[existingItemIndex].quantity = newQuantity;
        } else {
          updatedItems.push(newItem);
        }

        const updatedCart = {
          ...activeCart,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          updated_at: new Date().toISOString(),
        };

        const response = await axios.put(
          `http://localhost:8080/cart/${activeCart.id}`,
          updatedCart
        );
        setCart((prev) =>
          prev.map((c) => (c.id === activeCart.id ? response.data : c))
        );
        showSuccess("Đã cập nhật giỏ hàng!");
      } else {
        const newCart = {
          user_id: idU,
          status: "active",
          items: [newItem],
          total: pro.price * number,
          updated_at: new Date().toISOString(),
        };
        const response = await axios.post(
          "http://localhost:8080/cart",
          newCart
        );
        setCart((prev) => [...prev, response.data]);
        showSuccess("Đã thêm sản phẩm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      showError("Đã xảy ra lỗi khi thêm vào giỏ hàng.");
    }
  };

  const buyProduct = async (pro, number) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        showWarning("Bạn cần đăng nhập để mua hàng!");
        return;
      }

      const idU = parseInt(user.id);
      const a = new Date();
      const order_id =
        orders.length > 0 ? Math.max(...orders.map((c) => c.id)) + 1 : 1;
      const totalBuying = pro.price * number;

      axios
        .post("http://localhost:8080/orders", {
          id: `ORD-${new Date().getFullYear()}-${String(order_id).padStart(
            3,
            "0"
          )}`,
          user_id: idU,
          items: [
            {
              product_id: pro.id,
              product_name: pro.name,
              variant_sku: pro.variant_sku,
              quantity: number,
              price: pro.price,
              color: pro.color_code || "#000000",
              size: pro.size || "Standard",
            },
          ],
          subtotal: totalBuying,
          shipping_fee: 30000,
          total: totalBuying + 30000,
          status: "pending",
          payment_method: "qr_code",
          shipping_address: user.address,
          phone: user.phone,
          customer_name: user.name,
          created_at: a.toISOString(),
          updated_at: a.toISOString(),
          notes: "",
        })
        .then(() => {
          const productId = pro.id.split("-")[0];
          const product = products.find((p) => p.id === pro.id);
          if (product) {
            return axios.put(`http://localhost:8080/products/${productId}`, {
              ...product,
              stock_quantity: product.stock_quantity - number,
            });
          }
        })
        .then(() => {
          setPriceFilter(false);
          showSuccess(
            "✅ Order created successfully! Please scan QR code to complete payment."
          );
          navigate("/orders");
        })
        .catch((error) => {
          console.error("❌ Lỗi khi thanh toán:", error);
          showError("⚠️ Có lỗi xảy ra, vui lòng thử lại!");
        });
    } catch (error) {
      console.error("Lỗi:", error);
      showError("Lỗi khi tạo đơn hàng");
    }
  };

  const deleteFromCart = (id) => {
    axios
      .delete(`http://localhost:8080/cart/${id}`)
      .then(() => {
        setCart((prevCarts) => prevCarts.filter((cart) => cart.id !== id));
        setSelectedItems((prev) => prev.filter((item) => item.cartId !== id));
      })
      .catch((error) => console.error("Error deleting cart item:", error));
  };

  const increCart = (userCart, itemIndex) => {
    const updatedItems = [...userCart.items];
    updatedItems[itemIndex].quantity += 1;

    axios
      .put(`http://localhost:8080/cart/${userCart.id}`, {
        ...userCart,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        updated_at: new Date().toISOString(),
      })
      .then(() => {
        setCart((prevCarts) =>
          prevCarts.map((cart) =>
            cart.id === userCart.id
              ? {
                ...cart,
                items: updatedItems,
                total: updatedItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                ),
                updated_at: new Date().toISOString(),
              }
              : cart
          )
        );
      })
      .catch((error) => console.error("Error updating cart:", error));
  };

  const decreCart = (userCart, itemIndex) => {
    const updatedItems = [...userCart.items];
    if (updatedItems[itemIndex].quantity > 1) {
      updatedItems[itemIndex].quantity -= 1;

      axios
        .put(`http://localhost:8080/cart/${userCart.id}`, {
          ...userCart,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          updated_at: new Date().toISOString(),
        })
        .then(() => {
          setCart((prevCarts) =>
            prevCarts.map((cart) =>
              cart.id === userCart.id
                ? {
                  ...cart,
                  items: updatedItems,
                  total: updatedItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  ),
                  updated_at: new Date().toISOString(),
                }
                : cart
            )
          );
        })
        .catch((error) => console.error("Error updating cart:", error));
    }
  };

  // ===== PRODUCT DETAIL HELPERS (from Incoming, chỉnh cho ID dạng string) =====
  const getProductDetails = (productId) =>
    products.find((product) => String(product.id) === String(productId));

  const clickDetailProduct = (id) => {
    try {
      const proChoose = products.find((pro) => String(pro.id) === String(id));
      setProDetail(proChoose);
    } catch (err) {
      console.log(err);
    }
  };

  const increaseQuan = (num, setQuan, quanofP) => {
    if (num < quanofP) setQuan(num + 1);
  };

  const decreaPro = (num, setQuan) => {
    if (num > 1) setQuan(num - 1);
  };

  // ===== ANALYTICS (Incoming) =====
  const calculateSales = () => {
    const salesCount = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = String(item.product_id).split("-")[0];
        salesCount[productId] = (salesCount[productId] || 0) + item.quantity;
      });
    });
    return salesCount;
  };

  const getBestSellingProducts = () => {
    const salesCount = calculateSales();
    return products.filter((product) => {
      const baseId = String(product.id).split("-")[0];
      return (salesCount[baseId] || 0) >= 10;
    });
  };

  // ===== CHECKOUT UTILITIES (Incoming, chuyển sang dùng notifications + token user) =====
  const getTotal = () => {
    let total = 0;
    selectedItems.forEach(({ cartId, variantSku }) => {
      const cart = carts.find((c) => String(c.id) === String(cartId));
      if (cart) {
        const item = cart.items.find((i) => i.variant_sku === variantSku);
        if (item) total += item.price * item.quantity;
      }
    });
    return total;
  };

  const removeItemsFromCart = async (selectedItems, carts) => {
    if (!Array.isArray(selectedItems) || !Array.isArray(carts)) {
      console.error("Dữ liệu đầu vào không hợp lệ");
      return;
    }
    const cartIds = [...new Set(selectedItems.map((sel) => sel.cartId))];

    const updateOrDeleteRequests = cartIds
      .map((cartId) => {
        const cart = carts.find((c) => String(c.id) === String(cartId));
        if (!cart) return null;

        const remainingItems = cart.items.filter(
          (item) =>
            !selectedItems.some(
              (sel) =>
                String(sel.cartId) === String(cartId) &&
                String(sel.variantSku || sel.variant_sku) ===
                String(item.variant_sku)
            )
        );

        if (remainingItems.length === 0) {
          return axios.delete(`http://localhost:8080/cart/${cartId}`);
        } else {
          return axios.put(`http://localhost:8080/cart/${cartId}`, {
            ...cart,
            items: remainingItems,
            total: remainingItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ),
            updated_at: new Date().toISOString(),
          });
        }
      })
      .filter(Boolean);

    try {
      await Promise.all(updateOrDeleteRequests);
    } catch (err) {
      console.error("Lỗi khi xoá/cập nhật giỏ hàng:", err);
    }
  };

  const updateProductStock = async (allOrderItems, setProductCb) => {
    try {
      const productRes = await axios.get("http://localhost:8080/products");
      const allProducts = productRes.data;

      const itemsByProduct = {};
      allOrderItems.forEach((item) => {
        const productId = String(item.product_id).split("-")[0];
        if (!itemsByProduct[productId]) itemsByProduct[productId] = [];
        itemsByProduct[productId].push(item);
      });

      const updateRequests = Object.entries(itemsByProduct)
        .map(([productId, items]) => {
          const productRoot = allProducts.find(
            (p) => String(p.id) === productId
          );
          if (!productRoot) return null;

          const updatedVariants = productRoot.variants.map((variant) => {
            const matchedItem = items.find(
              (i) => i.variant_sku === variant.sku
            );
            if (matchedItem) {
              return {
                ...variant,
                stock_quantity: Math.max(
                  0,
                  variant.stock_quantity - matchedItem.quantity
                ),
              };
            }
            return variant;
          });

          return axios.put(`http://localhost:8080/products/${productId}`, {
            ...productRoot,
            variants: updatedVariants,
          });
        })
        .filter(Boolean);

      await Promise.all(updateRequests);

      // reload flattened
      const updatedProductsRes = await axios.get(
        "http://localhost:8080/products"
      );
      setProductCb(
        updatedProductsRes.data
          .map((product) =>
            product.variants.map((variant) => ({
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
          .flat()
      );
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật stock:", error);
      throw error;
    }
  };

  const generateCustomOrderId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 9999) + 1;
    return `ORD${year}${month}${day}${String(random).padStart(4, "0")}`;
  };

  const fetchOrders = async () => {
    const res = await fetch('http://localhost:8080/orders');
    const data = await res.json();
    setOrder(data);
  };

  const createOrder = async (
    paymentMethod,
    name,
    phone,
    address,
    orderID = null
  ) => {
    const userToken = getCurrentUser();
    if (!userToken) {
      showWarning("Bạn cần đăng nhập để đặt hàng!");
      throw new Error("User not found");
    }
    const allOrderItems = selectedItems
      .map((sel) => {
        const cart = carts.find((c) => String(c.id) === String(sel.cartId));
        if (!cart) return null;
        const item = cart.items.find((i) => i.variant_sku === sel.variantSku);
        const product = products.find(
          (p) => String(p.id) === String(item?.product_id)
        );
        if (!item || !product) return null;
        return {
          product_id: item.product_id,
          product_name: product.name || "Unknown Product",
          variant_sku: item.variant_sku,
          quantity: item.quantity,
          price: item.price,
          color: product.color_code || "#000000",
          size: product.size || "Standard",
        };
      })
      .filter(Boolean);

    const subtotal = allOrderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping_fee = 30000;
    const total = subtotal + shipping_fee;
    const finalOrderID = orderID || generateCustomOrderId();
    const idU = userToken.id;
    const currentTime = new Date();

    await axios.post("http://localhost:8080/orders", {
      id: finalOrderID,
      user_id: idU,
      items: allOrderItems,
      subtotal,
      shipping_fee,
      total,
      status: "pending",
      payment_method: paymentMethod,
      shipping_address: address,
      phone,
      customer_name: name,
      created_at: currentTime.toISOString(),
      updated_at: currentTime.toISOString(),
      notes: "",
    });

    await fetchOrders();

    return { success: true, orderID: finalOrderID, total, allOrderItems };
  };

  const handleCheckout = async (paymentMethod = "cod", name, phone, address) => {
    if (selectedItems.length === 0) {
      showWarning("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }

    const allOrderItems = selectedItems
      .map((sel) => {
        const cart = carts.find((c) => String(c.id) === String(sel.cartId));
        if (!cart) return null;
        const item = cart.items.find((i) => i.variant_sku === sel.variantSku);
        const product = products.find(
          (p) => String(p.id) === String(item?.product_id)
        );
        if (!item || !product) return null;
        return {
          product_id: item.product_id,
          product_name: product.name || "Unknown Product",
          variant_sku: item.variant_sku,
          quantity: item.quantity,
          price: item.price,
          color: product.color_code || "#000000",
          size: product.size || "Standard",
        };
      })
      .filter(Boolean);

    if (!allOrderItems.length) {
      showWarning("Không có sản phẩm hợp lệ để đặt hàng!");
      return;
    }

    try {
      if (paymentMethod === "cod") {
        const orderResult = await createOrder(
          paymentMethod,
          name,
          phone,
          address
        );
        if (orderResult.success) {
          await removeItemsFromCart(selectedItems, carts);
          await updateProductStock(orderResult.allOrderItems, setProduct);
          setPriceFilter(false);
          setSelectedItems([]);
          showSuccess(`✅ Đặt hàng thành công! Mã đơn hàng: ${orderResult.orderID}`);
          navigate("/products");
        }
      } else if (paymentMethod === "bank") {
        const orderID = generateCustomOrderId();
        const subtotal = allOrderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const shipping_fee = 30000;
        const total = subtotal + shipping_fee;

        navigate("/payment/bank", {
          state: {
            orderID,
            total,
            name,
            phone,
            address,
            orderItems: allOrderItems,
          },
        });
      }
    } catch (error) {
      console.error("❌ Lỗi khi thanh toán:", error);
      showError("⚠️ Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // ===== ADMIN PRODUCT MANAGEMENT =====
  const handleAddProduct = async () => {
    // No e.preventDefault() here, as it's called from RHF's handleSubmit

    // Kiểm tra bắt buộc: tên, danh mục, ảnh, variants
    if (!formData.name || !formData.category_id || !formData.images || formData.images.length === 0) {
      showError("⚠️ Vui lòng điền đầy đủ các trường bắt buộc: tên, danh mục, ảnh!");
      return;
    }

    // Kiểm tra variants
    if (!formData.variants || formData.variants.length === 0) {
      showError("⚠️ Phải có ít nhất 1 biến thể sản phẩm!");
      return;
    }

    // Kiểm tra từng variant có đầy đủ thông tin
    for (let i = 0; i < formData.variants.length; i++) {
      const variant = formData.variants[i];
      if (!variant.sku || !variant.color_code || !variant.size || variant.price < 0 || variant.cost_price < 0 || variant.stock_quantity < 0) {
        showError(`⚠️ Biến thể ${i + 1} thiếu thông tin bắt buộc!`);
        return;
      }
    }

    // Kiểm tra tồn kho từ variants
    const totalStock = formData.variants.reduce(
      (sum, v) => sum + (Number(v.stock_quantity) || 0),
      0
    );
    if (totalStock === 0) {
      showWarning("⚠️ Vui lòng đặt số lượng tồn kho cho ít nhất một biến thể!");
      return;
    }

    console.log("🆕 Adding New Product - formData received in context:", formData);

    try {
      // Create product with variants structure
      const newProduct = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: formData.name,
        description: formData.description || "",
        category_id: formData.category_id || "1",
        images: formData.images || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        variants: formData.variants.map((v, idx) => ({
          sku: v.sku || `${formData.name.substring(0, 3).toUpperCase()}-${idx + 1}-${Date.now()}`,
          price: Number(v.price) || 0,
          cost_price: Number(v.cost_price) || 0,
          stock_quantity: Number(v.stock_quantity) || 0,
          images: v.images || [],
          ...Object.fromEntries(
            Object.entries(v).filter(
              ([key]) => !["key", "sku", "price", "cost_price", "stock_quantity", "images"].includes(key)
            )
          )
        }))
      };

      console.log("New product object being sent to API:", newProduct);

      setLoading(true);
      const response = await axios.post(
        `http://localhost:8080/products`,
        newProduct,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Server Response:", response);

      if (response.status === 201) {
        showSuccess("✅ Sản phẩm đã được thêm thành công!");
        setPriceFilter(!priceF); // Trigger product list refresh
        navigate("/admin/products"); // Navigate to product management page
        
        // Return success result for the calling component
        return { success: true, productId: newProduct.id };
      } else {
        showError(`⚠️ Thêm sản phẩm thất bại. Mã lỗi: ${response.status}. Vui lòng thử lại.`);
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      console.error("❌ Lỗi khi thêm sản phẩm:", error);
      showError("⚠️ Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng kiểm tra console để biết chi tiết.");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  // Thêm state loading

  // Handle image upload to Cloudinary
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true); // Bắt đầu loading

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "product_shoes_image");
          data.append("cloud_name", "dbqb8zw82");

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dbqb8zw82/image/upload",
            {
              method: "POST",
              body: data,
            }
          );

          const uploadResponse = await res.json();
          return uploadResponse.secure_url;
        })
      );

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    } catch (error) {
      console.error("❌ Lỗi khi upload ảnh:", error);
      alert("⚠️ Không thể upload ảnh. Vui lòng thử lại.");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  // Remove image from form data
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index), // Xóa ảnh tại vị trí index
    }));
  };

  // ===== ADMIN PRODUCT EDITING =====

  // Handle form field changes for product editing
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Kiểm tra xem có phải trường số không
    const newValue = ["price", "size", "stock_quantity", "cost_price", "category_id"].includes(name)
      ? value === "" ? "" : Number(value)
      : value;

    console.log(`Updating ${name}:`, newValue); // Debug log

    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };
  // Fetch root product (non-flattened) by base id
  const fetchProductRootById = useCallback(async (baseId) => {
    const res = await axios.get(`http://localhost:8080/products/${baseId}`);
    return res.data;
  }, []);

  // Submit product updates (Admin function)
  const handleSubmit = async (e, overridePayload) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Determine base id (data.id may be base or flattened id)
      const data = overridePayload || formData;
      const baseId = String(data.id).split('-')[0];

      // Load current root product to merge unchanged fields safely
      const productRoot = await fetchProductRootById(baseId);
      if (!productRoot) {
        alert("Không tìm thấy sản phẩm!");
        return;
      }

      // Build variants: if provided in formData use them, else keep existing
      const normalizedVariants = Array.isArray(data.variants) && data.variants.length
        ? data.variants.map((v) => {
          const {
            sku,
            variant_sku,
            price,
            cost_price,
            cost,
            stock_quantity,
            stock,
            images,
            ...rest
          } = v;
          return {
            sku: sku || variant_sku,
            price: Number(price ?? 0),
            cost_price: Number((cost_price ?? cost) ?? 0),
            stock_quantity: Number((stock_quantity ?? stock) ?? 0),
            images: images || [],
            ...rest,
          };
        })
        : (productRoot.variants || []);

      const updatedProduct = {
        ...productRoot,
        name: data.name ?? productRoot.name,
        description: data.description ?? productRoot.description,
        category_id: data.category_id ?? productRoot.category_id,
        images: Array.isArray(data.images) && data.images.length ? data.images : (productRoot.images || []),
        updated_at: new Date().toISOString(),
        variants: normalizedVariants,
      };

      const response = await axios.put(
        `http://localhost:8080/products/${baseId}`,
        updatedProduct
      );

      if (response.status === 200) {
        alert("Cập nhật sản phẩm thành công!");
        // Trigger product list refresh
        await reloadProducts();
        setTimeout(() => navigate("/admin/products"), 300);
      } else {
        alert("Cập nhật thất bại! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Đã xảy ra lỗi khi cập nhật sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  // ===== ADMIN ORDER MANAGEMENT =====

  // Confirm order delivery (Admin function)
  const handleClickConfirm = async (order) => {
    try {

      let newStatus = order.status;
      if (order.status === "pending") {
        newStatus = "processing";
      } else if (order.status === "processing") {
        newStatus = "delivered";
      }

      const updatedOrder = { ...order, status: newStatus };


      await axios.put(`http://localhost:8080/orders/${order.id}`, updatedOrder);


      setAdminOrder((prevOrders) =>
        prevOrders.map((o) => (o.id === order.id ? updatedOrder : o))
      );


    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng!", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau!");
    }
  };


  // ===== USER PROFILE =====
  const updateUser = async (updatedUser) => {
    try {
      let existingUser = users.find((u) => String(u.id) === String(updatedUser.id));
      if (!existingUser) {
        showError("Không tìm thấy người dùng!");
        return;
      }
      let finalUserData = { ...existingUser, ...updatedUser };
      const response = await fetch(
        `http://localhost:8080/user/${updatedUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalUserData),
        }
      );
      if (response.ok) {
        await refreshUserData();
        showSuccess("Thông tin đã được cập nhật thành công!");
      } else {
        showError("Lỗi khi cập nhật thông tin. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showError("Có lỗi xảy ra. Vui lòng thử lại sau!");
    }
  };

  // ===== QR CODE (Incoming) =====
  const generateQRCode = (orderId, amount) => {
    const qrData = `Order: ${orderId}\nAmount: ${amount.toLocaleString(
      "vi-VN"
    )} VND\nPayment: QR Code`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      qrData
    )}`;
    return qrUrl;
  };


  const handleGoTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===== ORDER CANCELLATION FUNCTIONS =====

  // Kiểm tra xem đơn hàng có thể hủy được không
  const canCancelOrder = (order) => {
    // Chỉ cho phép hủy đơn hàng có status là 'pending' hoặc 'processing'
    const cancellableStatuses = ['pending', 'processing'];
    return cancellableStatuses.includes(order.status);
  };

  // Hoàn trả stock khi hủy đơn hàng
  const restoreProductStock = async (orderItems) => {
    try {
      // Lấy danh sách sản phẩm hiện tại
      const productRes = await axios.get("http://localhost:8080/products");
      const allProducts = productRes.data;

      // Nhóm items theo product_id để xử lý
      const itemsByProduct = {};
      orderItems.forEach((item) => {
        const productId = String(item.product_id).split("-")[0];
        if (!itemsByProduct[productId]) itemsByProduct[productId] = [];
        itemsByProduct[productId].push(item);
      });

      // Tạo các request cập nhật stock
      const updateRequests = Object.entries(itemsByProduct)
        .map(([productId, items]) => {
          const productRoot = allProducts.find(
            (p) => String(p.id) === productId
          );
          if (!productRoot) return null;

          // Cập nhật variants với stock được hoàn trả
          const updatedVariants = productRoot.variants.map((variant) => {
            const matchedItem = items.find(
              (i) => i.variant_sku === variant.sku
            );
            if (matchedItem) {
              return {
                ...variant,
                stock_quantity: variant.stock_quantity + matchedItem.quantity, // Cộng lại stock
              };
            }
            return variant;
          });

          return axios.put(`http://localhost:8080/products/${productId}`, {
            ...productRoot,
            variants: updatedVariants,
          });
        })
        .filter(Boolean);

      // Thực hiện tất cả các request cập nhật
      await Promise.all(updateRequests);

      // Cập nhật lại state products với dữ liệu mới
      const updatedProductsRes = await axios.get("http://localhost:8080/products");
      const flattenedProducts = updatedProductsRes.data
        .map((product) =>
          product.variants.map((variant) => ({
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

      setProduct(flattenedProducts);

    } catch (error) {
      console.error("❌ Lỗi khi hoàn trả stock:", error);
      throw error;
    }
  };

  // Hàm hủy đơn hàng chính
  const cancelOrder = async (orderId, restoreStock = true) => {
    try {
      // Tìm đơn hàng cần hủy
      const orderToCancel = orders.find(order => String(order.id) === String(orderId));

      if (!orderToCancel) {
        showError("Không tìm thấy đơn hàng!");
        return { success: false, message: "Không tìm thấy đơn hàng!" };
      }

      // Kiểm tra xem có thể hủy đơn hàng không
      if (!canCancelOrder(orderToCancel)) {
        showWarning("Đơn hàng này không thể hủy!");
        return {
          success: false,
          message: "Chỉ có thể hủy đơn hàng đang chờ xử lý hoặc đang xử lý!"
        };
      }

      // Cập nhật status đơn hàng thành 'cancelled'
      const updatedOrder = {
        ...orderToCancel,
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Gửi request cập nhật đơn hàng
      const response = await axios.put(
        `http://localhost:8080/orders/${orderId}`,
        updatedOrder
      );

      if (response.status === 200) {
        // Hoàn trả stock nếu cần
        if (restoreStock && orderToCancel.items) {
          await restoreProductStock(orderToCancel.items);
        }

        // Cập nhật state orders
        setOrder(prevOrders =>
          prevOrders.map(order =>
            String(order.id) === String(orderId) ? updatedOrder : order
          )
        );

        // Cập nhật adminOrder nếu có
        setAdminOrder(prevOrders =>
          prevOrders.map(order =>
            String(order.id) === String(orderId) ? updatedOrder : order
          )
        );

        showSuccess("Đơn hàng đã được hủy thành công!");
        return { success: true, message: "Đơn hàng đã được hủy thành công!" };
      }
    } catch (error) {
      console.error("❌ Lỗi khi hủy đơn hàng:", error);
      showError("Có lỗi xảy ra khi hủy đơn hàng!");
      return { success: false, message: "Có lỗi xảy ra khi hủy đơn hàng!" };
    }
  };

  // Hàm hủy đơn hàng với xác nhận
  const handleCancelOrder = async (order) => {
    // Hiển thị dialog xác nhận
    const confirmCancel = window.confirm(
      `Bạn có chắc chắn muốn hủy đơn hàng #${order.id}?\n\n` +
      `Tổng tiền: ${formatCurrency(order.total)}\n` +
      `Trạng thái: ${getStatusInfo(order.status).text}\n\n` +
      `Hành động này không thể hoàn tác!`
    );

    if (confirmCancel) {
      const result = await cancelOrder(order.id, true);
      return result;
    }

    return { success: false, message: "Đã hủy thao tác" };
  };

  // Helper function format currency (nếu chưa có)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Helper function get status info (nếu chưa có)
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' };
      case 'processing':
        return { text: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' };
      case 'shipped':
        return { text: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' };
      case 'delivered':
        return { text: 'Đã giao hàng', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { text: 'Đã hủy', color: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Không xác định', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // ===== USER MANAGEMENT FUNCTION =====




  // Search user by name
  const searchUserByName = (name) => {
    if (!name) {
      setFilteredUsers(users);
    } else {
      const keyword = name.toLowerCase();
      setFilteredUsers(
        users.filter((u) => u.name.toLowerCase().includes(keyword))
      );
    }
  };

  // Filter user by address, phone, role
  const sortUsersByNameAsc = () => {
    // Cập nhật cả users (state gốc) và filteredUsers (nếu bạn dùng)
    setUser(prevUsers => {
      // prevUsers có thể undefined lúc đầu => fallback sang users (nếu có)
      const source = Array.isArray(prevUsers) && prevUsers.length ? prevUsers : (users || []);
      const sorted = [...source].sort((a, b) => {
        const A = (a?.name || "").toString().toLowerCase();
        const B = (b?.name || "").toString().toLowerCase();
        return A.localeCompare(B, "en", { sensitivity: "base" });
      });

      // Đồng bộ filteredUsers nếu bạn dùng filteredUsers để hiển thị
      if (typeof setFilteredUsers === "function") {
        setFilteredUsers(sorted);
      }

      return sorted;
    });
  };
  // Add new user
  const addUser = (newUser) => {
    const updated = [...users, newUser];
    setUser(updated);
    setFilteredUsers(updated);
  };

  // Edit user
  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditData({ role: user.role, status: user.status });
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditData({ role: "", status: "" });
  };

  const saveEdit = (id) => {
    setUser((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: editData.role, status: editData.status } : u
      )
    );
    cancelEdit();
  };

  // Export to Excel
  const exportUsersToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  // Soft delete user (ẩn thay vì xóa hẳn)
  const softDeleteUser = async (id) => {
    try {
      const userToDelete = users.find((u) => String(u.id) === String(id));
      if (!userToDelete) {
        showError("Không tìm thấy người dùng!");
        return;
      }

      const updatedUser = {
        ...userToDelete,
        status: "Deleted", // hoặc is_deleted: true
      };

      await axios.put(`http://localhost:8080/user/${id}`, updatedUser);

      // Cập nhật state
      const updatedUsers = users.map((u) =>
        String(u.id) === String(id) ? updatedUser : u
      );
      setUser(updatedUsers);
      setFilteredUsers(updatedUsers);

      showError("Người dùng đã được ẩn thành công!");
    } catch (error) {
      console.error("Lỗi khi ẩn người dùng:", error);
      showError("Không thể ẩn người dùng!");
    }
  };


  // Khôi phục user đã bị ẩn
  const restoreUser = async (id) => {
    try {
      const userToRestore = users.find((u) => String(u.id) === String(id));
      if (!userToRestore) {
        showError("Không tìm thấy người dùng!");
        return;
      }

      const updatedUser = {
        ...userToRestore,
        status: "Active", // hoặc giá trị gốc của status
      };

      await axios.put(`http://localhost:8080/user/${id}`, updatedUser);

      const updatedUsers = users.map((u) =>
        String(u.id) === String(id) ? updatedUser : u
      );

      setUser(updatedUsers);
      setFilteredUsers(updatedUsers);

      showSuccess("Người dùng đã được khôi phục!");
    } catch (error) {
      console.error("Lỗi khi khôi phục người dùng:", error);
      showError("Không thể khôi phục người dùng!");
    }
  };

  // ===== CONTEXT PROVIDER =====
  return (
    <ShoesShopContext.Provider
      value={{
        // Product functions
        handleChange,
        handleSubmit,
        fetchProductRootById,

        // State variables
        products,
        setProduct,
        categories,
        setCategory,
        currentProducts,
        setCurrentProducts,
        pages,
        setPages,
        currentPage,
        setCurrentPage,
        pagingProducts,
        setPagingProducts,
        productsRoot,
        setProductsRoot,
        usersRaw: users,
        search,
        setSearch,
        category,
        setCat,
        size,
        setSize,
        priceF,
        setPriceFilter,
        users,
        setUser,
        msg,
        setMsg,
        msgs,
        setMsgs,
        carts,
        setCart,
        selectedItems,
        setSelectedItems,
        orders,
        setOrder,
        formData,
        setFormData,
        adminOrder,
        setAdminOrder,

        // extra states
        proDetail,
        setProDetail,
        numDetail,
        setNumDetail,
        totalOrder,
        setTotalOrder,

        // Auth state & helpers
        currentUser,
        isAuthenticated,
        logout,
        getCurrentUser,
        getUserData,
        getCompleteUserData,
        refreshUserData,

        // Cart functions
        addToCart,
        buyProduct,
        increCart,
        decreCart,
        deleteFromCart,
        handleCheckboxChange,
        handleCheckout,

        // Navigation
        navigate,

        // Admin functions
        handleAddProduct,
        handleImageChange,
        handleClickConfirm,
        handleRemoveImage,

        // User functions
        updateUser,
        handleSubmitLogin,
        handleSubmitSignup,

        // Utilities / analytics
        // loading,
        calculateSales,
        getBestSellingProducts,
        generateQRCode,
        getTotal,
        removeItemsFromCart,
        createOrder,
        updateProductStock,

        // Product detail utils
        getProductDetails,
        clickDetailProduct,
        increaseQuan,
        decreaPro,

        // compatibility
        localUserData,
        handleGoTop,

        // Admin orders
        adminOrder,
        setSize,
        setPriceFilter,
        handleClickConfirm,
        priceF,
        setSearch,

        // Thêm các functions cancel order mới
        cancelOrder,
        handleCancelOrder,
        canCancelOrder,
        restoreProductStock,

        // User Management functions
        users: filteredUsers,
        searchUserByName,
        sortUsersByNameAsc,
        addUser,
        editingUserId,
        editData,
        setEditData,
        startEdit,
        cancelEdit,
        saveEdit,
        exportUsersToExcel,
        softDeleteUser,
        setEditingUserId,
        restoreUser,
        reloadProducts,
      }}
    >
      {children}
    </ShoesShopContext.Provider>
  );
};
export default ShoesProvider;