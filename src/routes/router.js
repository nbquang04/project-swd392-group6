import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import ShoesProvider from "../context/ShoeShopContext";
import { NotificationProvider } from "../context/NotificationContext";
import ScrollToTop from "../components/ScrollToTop";

import Layout from "../pages/Layout";
import Home from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import DetailProduct from "../pages/DetailProduct";
import AboutPage from "../pages/AboutPage";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Auth from "../pages/Auth/Auth";
import UserProfile from "../pages/user/UserProfile";
import ShopCartDetail from "../pages/user/ShopCartDetail";
import Payment from "../pages/user/Payment";
import QRPayment from "../pages/user/QRPayment";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UserManagement from "../pages/Admin/UserManagement";
import ProductManagement from "../pages/Admin/ProductManagement";
import EditProduct from "../pages/Admin/EditProduct";
import AddNewProduct from "../pages/Admin/AddNewProduct";
import OrderManagement from "../pages/Admin/OrderManagement";
import Statistic from "../pages/Admin/Statistic";
import Forbidden from "../pages/Forbidden";

import AdminRoute from "./AdminRoute";
import { ShoesShopContext } from "../context/ShoeShopContext";
import { useContext } from "react";




























// Dynamic redirect sau khi login hoặc truy cập "/"
const HomeRedirect = () => {
  const { currentUser } = useContext(ShoesShopContext);
  if (currentUser?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/home" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <NotificationProvider>
        <ShoesProvider>
          <ScrollToTop />
          <Outlet />
        </ShoesProvider>
      </NotificationProvider>
    ),
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <HomeRedirect /> },
          { path: "home", element: <Home /> },
          { path: "about", element: <AboutPage /> },
          { path: "privacy", element: <PrivacyPolicy /> },
          { path: "products", element: <ProductPage /> },
          { path: "products/:id", element: <DetailProduct /> },
          { path: "*", element: <NotFound /> },
        ],
      },
      { path: "auth", element: <Auth /> },
      { path: "profile", element: <UserProfile /> },
      { path: "cart", element: <ShopCartDetail /> },
      { path: "payment", element: <Payment /> },
      { path: "payment/bank", element: <QRPayment /> },
      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "users", element: <UserManagement /> },
          { path: "products", element: <ProductManagement /> },
          { path: "editProduct", element: <EditProduct /> },
          { path: "addProduct", element: <AddNewProduct /> },
          { path: "orders", element: <OrderManagement /> },
          { path: "analytics", element: <Statistic /> },
        ],
      },
      { path: "403", element: <Forbidden /> },
    ],
  },
]);

export default router;
