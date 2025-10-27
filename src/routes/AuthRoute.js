import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ShoesShopContext } from "../context/ShoeShopContext";
import Auth from "../pages/Auth/Auth";

const AuthRoute = () => {
  const { isAuthenticated, authChecked, currentUser } = useContext(ShoesShopContext);

  if (!authChecked) {
    return <div className="p-6 text-center">Đang kiểm tra phiên đăng nhập...</div>;
  }

  if (isAuthenticated) {
    if (currentUser?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return <Auth />;
};

export default AuthRoute;
