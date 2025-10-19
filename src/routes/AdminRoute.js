import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ShoesShopContext } from "../context/ShoeShopContext";




const AdminRoute = () => {
    const { isAuthenticated, currentUser, isLoading } = useContext(ShoesShopContext);
    const location = useLocation();

    // Nếu đang tải thông tin user -> tránh giật màn hình
    if (isLoading) return null; // hoặc spinner

    // Chưa đăng nhập
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace state={{ from: location }} />;
    }

    // Không phải admin
    if (currentUser?.role !== "admin") {
        return <Navigate to="/403" replace />;
    }

    // Là admin -> cho vào tiếp các route con
    return <Outlet />;
};

export default AdminRoute;
