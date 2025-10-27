import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfo from './UserInfo';
import EditProfile from './EditProfile';
import OrderHistory from './OrderHistory';
import Header from "../../components/Header1";
import { ShoesShopContext } from '../../context/ShoeShopContext';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('info');
  const { users, getCompleteUserData, isAuthenticated } = useContext(ShoesShopContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    password: "",
    role: "",
    status: "",
  });

  const [userNotFound, setUserNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      const currentUser = getCompleteUserData();

      if (!currentUser || !isAuthenticated) {
        setUserNotFound(true);
        setLoading(false);
        return;
      }

      setUserNotFound(false);
      setFormData({
        id: currentUser.id || "",
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        password: currentUser.password || "",
        role: currentUser.role || "",
        status: currentUser.status || "",
      });
      setLoading(false);
    };

    if (users.length === 0) {
      setTimeout(checkUser, 100);
    } else {
      checkUser();
    }
  }, [users, getCompleteUserData, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="animate-pulse p-6 sm:p-8">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userNotFound) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-6 sm:space-x-10 px-6 sm:px-8 pt-6 sm:pt-8">
              {[
                { key: 'info', label: 'Thông tin cá nhân', icon: <i className="ri-user-line text-lg"></i> },
                { key: 'edit', label: 'Chỉnh sửa hồ sơ', icon: <i className="ri-edit-line text-lg"></i> },
                { key: 'orders', label: 'Lịch sử đơn hàng', icon: <i className="ri-shopping-bag-line text-lg"></i> }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === tab.key
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400 to-yellow-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 p-8 sm:p-12">
              <div className="bg-white rounded-2xl ">
                {activeTab === 'info' && <UserInfo />}
                {activeTab === 'edit' && <EditProfile formData={formData} setFormData={setFormData} />}
                {activeTab === 'orders' && <OrderHistory />}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
