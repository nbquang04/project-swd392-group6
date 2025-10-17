import React, { useContext } from 'react'
import {
  LayoutDashboardIcon,
  UsersIcon,
  PackageIcon,
  LockIcon,
  BarChart3Icon,
  LogOut,
} from 'lucide-react';
import { Link } from 'react-router-dom'; 
import { ShoesShopContext } from '../context/ShoeShopContext';
const SideBarAdmin = () => {
    const { logout, currentUser } = useContext(ShoesShopContext);
    const adminName = currentUser?.name || "Admin"; // Fallback to "Admin" if name is not available

    return (
        <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg rounded-lg p-6 space-y-6 h-full">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-800">Welcome, {adminName}!</h2>
                    <p className="text-sm text-gray-500">Admin Panel</p>
                </div>
                <nav className="flex flex-col gap-3 text-gray-700">
                    <Link className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200" to="/admin/dashboard">
                        <LayoutDashboardIcon className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200" to="/admin/users">
                        <UsersIcon className="w-5 h-5" /> Users
                    </Link>
                    <Link className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200" to="/admin/products">
                        <PackageIcon className="w-5 h-5" /> Products
                    </Link>
                    <Link className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200" to="/admin/orders">
                        <LockIcon className="w-5 h-5" /> Orders
                    </Link>
                    <Link className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200" to="/admin/analytics">
                        <BarChart3Icon className="w-5 h-5" /> Analytics
                    </Link>
                    <button className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 w-full text-left" onClick={logout}>
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </nav>
            </aside></div>
    )
}

export default SideBarAdmin