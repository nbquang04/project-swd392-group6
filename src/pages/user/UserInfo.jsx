import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoesShopContext } from '../../context/ShoeShopContext';

const UserInfo = () => {
  const navigate = useNavigate();
  const { setSelectedItems, getCompleteUserData, logout, users } = useContext(ShoesShopContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = () => {
      const userData = getCompleteUserData();
      setUser(userData);
      setLoading(false);
    };

    // If users array is not loaded yet, wait a bit and try again
    if (users.length === 0) {
      setTimeout(fetchUserData, 100);
    } else {
      fetchUserData();
    }
  }, [getCompleteUserData, users]);

  const handleLogout = () => {
    setSelectedItems([])
    logout();
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Chưa có thông tin';

      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Chưa có thông tin';
    }
  };

  // Handle missing or empty fields
  const getFieldValue = (value) => {
    if (!value || value === '') return 'Chưa có thông tin';
    return value;
  };

  if (loading) {
    return (
      <div className="max-w-3xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl text-center py-8">
        <p className="text-gray-500">Không thể tải thông tin người dùng</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Thông tin cá nhân</h2>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500">Thành viên từ: {formatDate(user.created_at)}</p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <p className="text-gray-900 font-medium">{getFieldValue(user.name)}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900">{getFieldValue(user.email)}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <p className="text-gray-900">{getFieldValue(user.phone)}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới tính
            </label>
            <p className="text-gray-900">{getFieldValue(user.gender)}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <p className="text-gray-900">{getFieldValue(user.address)}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò
            </label>
            <p className="text-gray-900 capitalize">{getFieldValue(user.role)}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID người dùng
            </label>
            <p className="text-gray-900">{getFieldValue(user.id)}</p>
          </div>
        </div>
      </div>

      {/* Nút Đăng xuất */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default UserInfo;