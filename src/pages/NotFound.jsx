import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ShoeShopContext } from '../context/ShoeShopContext';





const NotFound = () => {
    const navigate = useNavigate();
    const { getCurrentUser } = useContext(ShoeShopContext);

    const handleGoBack = () => {
        // Kiểm tra nếu user đã đăng nhập thì về trang chủ, không thì về trang trước
        const user = getCurrentUser();
        if (user) {
            navigate('/home');
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Icon */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="text-9xl font-bold text-gray-300">404</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-6xl font-bold text-indigo-600">404</div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Oops! Page Not Found
                </h1>

                <p className="text-gray-600 mb-8 text-lg">
                    Trang mà bạn đang truy cập không tồn tại hoặc đã được di chuyển.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={handleGoBack}
                        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-semibold"
                    >
                        ← Trở lại
                    </button>

                    <Link
                        to="/home"
                        className="block w-full bg-white text-indigo-600 py-3 px-6 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors duration-200 font-semibold"
                    >
                        🏠 Trở về Trang Chủ
                    </Link>
                </div>

                {/* Additional Help */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">
                        Need help? Try these links:
                    </p>
                    <div className="flex justify-center space-x-4 text-sm">
                        <Link
                            to="/products"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
