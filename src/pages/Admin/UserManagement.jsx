import React, { useContext, useState, useEffect } from "react";
import { Trash2, Filter, Download, RotateCcw, Edit, X, Check, Loader2, ArrowUpDown, ArrowUp, ArrowDown, AlertCircle, Shield, UserCheck, UserX } from "lucide-react";
import { ShoeShopContext } from "../../context/ShoeShopContext";
import SideBarAdmin from '../../components/SideBarAdmin';
import { fetchUsers } from "../../service/users";

const getRoleBadge = (role) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-600";
    case "user":
      return "bg-green-100 text-green-600";
    case "customer":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getStatusBadge = (status, role) => {
  if (role === "admin") {
    return "bg-purple-100 text-purple-600";
  }
  
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-600";
    case "Disabled":
      return "bg-red-100 text-red-600";
    case "Deleted":
      return "bg-gray-200 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

// Confirm Dialog Component
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = "warning" }) => {
  if (!isOpen) return null;

  const getButtonStyle = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertCircle className={`w-6 h-6 mr-3 ${
            type === "danger" ? "text-red-600" : 
            type === "warning" ? "text-yellow-600" : 
            "text-blue-600"
          }`} />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelText || "Hủy"}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition-colors ${getButtonStyle()}`}
          >
            {confirmText || "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const {
    usersRaw,
    searchUserByName,
    sortUsersByNameAsc,
    exportUsersToExcel,
    editingUserId,
    editData,
    setEditData,
    softDeleteUser,
    restoreUser,
    setUser,
  } = useContext(ShoeShopContext);

  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Confirm dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    type: 'warning',
    onConfirm: null
  });

  // Filtered users based on search
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch users data when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await fetchUsers();
        if (Array.isArray(usersData)) {
          setUser(usersData);
          setFilteredUsers(usersData); // Initialize filtered users
        }
      } catch (error) {
        console.error("Error loading users:", error);
        setMessage({ type: 'error', text: 'Không thể tải danh sách người dùng' });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [setUser]);

  // Handle search - local search implementation
  const handleSearch = (value) => {
    setSearch(value);
    
    if (!value.trim()) {
      // If search is empty, show all users
      setFilteredUsers(usersRaw || []);
    } else {
      // Filter users based on search term
      const searchTerm = value.toLowerCase().trim();
      const filtered = (usersRaw || []).filter(user => 
        user.name?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.phone?.toLowerCase().includes(searchTerm) ||
        user.address?.toLowerCase().includes(searchTerm) ||
        user.role?.toLowerCase().includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  };

  // Update filtered users when usersRaw changes
  useEffect(() => {
    if (usersRaw && Array.isArray(usersRaw)) {
      setFilteredUsers(usersRaw);
    }
  }, [usersRaw]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    
    setSortConfig({ key, direction });
    
    // Sort users locally
    if (filteredUsers && Array.isArray(filteredUsers)) {
      const sortedUsers = [...filteredUsers].sort((a, b) => {
        let aValue = a[key];
        let bValue = b[key];
        
        // Handle numeric values
        if (key === 'id') {
          aValue = parseInt(aValue) || 0;
          bValue = parseInt(bValue) || 0;
        } else {
          // Handle string values
          aValue = String(aValue || '').toLowerCase();
          bValue = String(bValue || '').toLowerCase();
        }
        
        if (direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      setFilteredUsers(sortedUsers);
    }
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={16} />;
    }
    return sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  // Handle edit start - chỉ cho phép edit status của user có role = "user"
  const handleEditStart = (user) => {
    if (user.role !== "user") {
      setMessage({ type: 'error', text: 'Chỉ có thể chỉnh sửa trạng thái của người dùng thường (role = user)' });
      return;
    }
    
    setEditData({
      role: user.role || "",
      status: user.status || "Active"
    });
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  // Handle edit save - cập nhật status của user
  const handleEditSave = async (userId) => {
    try {
      // Cập nhật status trong database
      const response = await fetch(`http://localhost:9999/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editData.status
        }),
      });

      if (response.ok) {
        // Cập nhật cả usersRaw và filteredUsers
        const updatedUsers = usersRaw.map(user => 
          user.id === userId 
            ? { ...user, status: editData.status }
            : user
        );
        setUser(updatedUsers);
        
        // Cập nhật filteredUsers nếu user hiện tại đang được hiển thị
        const updatedFilteredUsers = filteredUsers.map(user => 
          user.id === userId 
            ? { ...user, status: editData.status }
            : user
        );
        setFilteredUsers(updatedFilteredUsers);
        
        const statusText = editData.status === "Active" ? "kích hoạt" : "vô hiệu hóa";
        setMessage({ type: 'success', text: `Đã ${statusText} tài khoản thành công!` });
        setIsEditing(false);
        setEditData({ role: "", status: "" });
        
        // Auto hide message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        throw new Error('Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      setMessage({ type: 'error', text: 'Lỗi khi cập nhật trạng thái: ' + error.message });
    }
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditData({ role: "", status: "" });
    setMessage({ type: '', text: '' });
  };

  // Handle delete user with confirmation
  const handleDeleteUser = (user) => {
    if (user.role === "admin") {
      setMessage({ type: 'error', text: 'Không thể xóa tài khoản admin!' });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Xác nhận xóa người dùng',
      message: `Bạn có chắc chắn muốn xóa người dùng "${user.name}" (${user.email})? Hành động này không thể hoàn tác.`,
      confirmText: 'Xóa người dùng',
      cancelText: 'Hủy',
      type: 'danger',
      onConfirm: () => {
        softDeleteUser(user.id);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        setMessage({ type: 'success', text: 'Đã xóa người dùng thành công!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    });
  };

  // Handle restore user with confirmation
  const handleRestoreUser = (user) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Xác nhận khôi phục người dùng',
      message: `Bạn có chắc chắn muốn khôi phục người dùng "${user.name}" (${user.email})?`,
      confirmText: 'Khôi phục',
      cancelText: 'Hủy',
      type: 'success',
      onConfirm: () => {
        restoreUser(user.id);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        setMessage({ type: 'success', text: 'Đã khôi phục người dùng thành công!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    });
  };

  // Handle status change with confirmation
  const handleStatusChange = (user, newStatus) => {
    const statusText = newStatus === "Active" ? "kích hoạt" : "vô hiệu hóa";
    
    setConfirmDialog({
      isOpen: true,
      title: `Xác nhận ${statusText} tài khoản`,
      message: `Bạn có chắc chắn muốn ${statusText} tài khoản của "${user.name}" (${user.email})?`,
      confirmText: statusText === "kích hoạt" ? 'Kích hoạt' : 'Vô hiệu hóa',
      cancelText: 'Hủy',
      type: newStatus === "Active" ? 'success' : 'warning',
      onConfirm: () => {
        setEditData({ role: user.role, status: newStatus });
        handleEditSave(user.id);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  };

  // Check if user can be edited (chỉ role = "user")
  const canEditUser = (user) => {
    return user.role === "user";
  };

  // Check if user can be deleted (không phải admin)
  const canDeleteUser = (user) => {
    return user.role !== "admin";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideBarAdmin />
        <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
      </div>

        {/* Message Display */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            <div className="flex items-center">
              <AlertCircle size={20} className="mr-3" />
              <span className="text-sm">{message.text}</span>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
          {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
          <input
            type="text"
                  placeholder="Tìm kiếm theo tên, email, SĐT, địa chỉ..."
            value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              {search && (
                <p className="text-sm text-gray-500 mt-1">
                  Tìm thấy {filteredUsers.length} kết quả
                </p>
              )}
          </div>
        </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th 
                    className="p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-2">
                      ID
                      {getSortIcon('id')}
                    </div>
                  </th>
                  <th 
                    className="p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      User
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="p-4 font-semibold text-gray-700">Role</th>
                  <th className="p-4 font-semibold text-gray-700">Status</th>
                  <th className="p-4 font-semibold text-gray-700">Phone</th>
                  <th className="p-4 font-semibold text-gray-700">Address</th>
                  <th className="p-4 font-semibold text-gray-700">Join Date</th>
                  <th className="p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center">
                      <Loader2 className="animate-spin text-blue-500" size={24} />
                      <span className="ml-2">Loading users...</span>
                    </td>
                  </tr>
                ) : filteredUsers?.map((user, idx) => (
                  <tr key={user.id || idx} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-gray-700">{user.id || "N/A"}</td>
                    <td className="p-4">
                  <div>
                        <div className="font-medium text-gray-900">{user.name || "N/A"}</div>
                        <div className="text-gray-500 text-sm">{user.email || "N/A"}</div>
                  </div>
                </td>
                    <td className="p-4">
                    <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${getRoleBadge(
                        user.role
                      )}`}
                    >
                        {user.role || "N/A"}
                    </span>
                </td>
                    <td className="p-4">
                    <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(
                          user.status, user.role
                      )}`}
                    >
                        {user.role === "admin" ? "Admin" : (user.status || "Active")}
                    </span>
                    </td>
                    <td className="p-4 text-gray-700">{user.phone || "N/A"}</td>
                    <td className="p-4 text-gray-700">{user.address || "N/A"}</td>
                    <td className="p-4 text-gray-700">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        {/* Status Change Buttons - chỉ cho user thường */}
                        {canEditUser(user) && (
                          <>
                            {user.status === "Active" ? (
                              <button
                                className="text-yellow-600 hover:text-yellow-800 p-2 rounded hover:bg-yellow-50 transition-colors"
                                onClick={() => handleStatusChange(user, "Disabled")}
                                title="Vô hiệu hóa tài khoản"
                              >
                                <UserX size={16} />
                              </button>
                            ) : (
                              <button
                                className="text-green-600 hover:text-green-800 p-2 rounded hover:bg-green-50 transition-colors"
                                onClick={() => handleStatusChange(user, "Active")}
                                title="Kích hoạt tài khoản"
                              >
                                <UserCheck size={16} />
                              </button>
                            )}
                          </>
                        )}

                        {/* Admin Protection Icon */}
                        {user.role === "admin" && (
                          <div className="text-purple-600 p-2" title="Tài khoản admin - được bảo vệ">
                            <Shield size={16} />
                          </div>
                        )}

                        {/* Delete/Restore Buttons */}
                        {canDeleteUser(user) && (
                          <>
                    {user.status !== "Deleted" ? (
                      <button
                                className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors"
                                onClick={() => handleDeleteUser(user)}
                                title="Xóa người dùng"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button
                                className="text-green-600 hover:text-green-800 p-2 rounded hover:bg-green-50 transition-colors"
                                onClick={() => handleRestoreUser(user)}
                                title="Khôi phục người dùng"
                      >
                        <RotateCcw size={16} />
                      </button>
                            )}
                          </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

          {/* Empty State */}
          {(!filteredUsers || filteredUsers.length === 0) && !loading && (
            <div className="text-center py-8 text-gray-500">
              {search ? (
                <div>
                  <p className="text-lg font-medium mb-2">Không tìm thấy kết quả</p>
                  <p className="text-sm">Không có người dùng nào khớp với từ khóa "{search}"</p>
                  <button
                    onClick={() => handleSearch("")}
                    className="mt-3 text-blue-600 hover:text-blue-800 underline"
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
              ) : (
                <p>Không có người dùng nào</p>
              )}
    </div>
          )}
    </div>
    
        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          type={confirmDialog.type}
        />
      </div>
    </div>
  );
};

export default UserManagement;
