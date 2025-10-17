import React, { useContext, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  UserIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  PackageCheckIcon,
  LayoutDashboardIcon,
  UsersIcon,
  PackageIcon,
  LockIcon,
  BarChart3Icon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SideBarAdmin from '../../components/SideBarAdmin';
import { ShoesShopContext } from '../../context/ShoeShopContext';
import MonthlyRevenueChart from '../../components/Chart';

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
};
const getMonthlyData = (orders, users) => {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleString('en-US', { month: 'short' });
  }).reverse();

  const monthlyData = months.map(month => {
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.toLocaleString('en-US', { month: 'short' }) === month;
    });

    const monthUsers = users.filter(user => {
      const userDate = new Date(user.created_at);
      return userDate.toLocaleString('en-US', { month: 'short' }) === month;
    });

    return {
      month,
      sales: monthOrders.reduce((sum, order) => sum + order.total, 0),
      users: monthUsers.length,
      orders: monthOrders.length
    };
  });

  return monthlyData;
};

const StatCard = ({ title, value, change, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {change && <p className="text-xs mt-1 text-green-600">{change}</p>}
      </div>
      <div className={`text-white p-2 rounded-full bg-opacity-20 ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const getRecentActivities = (orders, users, maxItems = 6) => {
  const activities = [
    // Map orders to activities
    ...orders.map(order => ({
      icon: order.status === 'delivered' ? '🟢' : order.status === 'processing' ? '🔵' : '⚪',
      title: `Order ${order.status === 'delivered' ? 'completed' : order.status === 'processing' ? 'processing' : 'placed'}`,
      desc: `Order #${order.id} for ${order.total.toLocaleString()} VND`,
      time: new Date(order.created_at).getTime(),
      rawTime: order.created_at
    })),
    // Map user registrations to activities
    ...users.map(user => ({
      icon: '�',
      title: 'New user registered',
      desc: `${user.name} joined the platform`,
      time: new Date(user.created_at).getTime(),
      rawTime: user.created_at
    }))
  ]
  .sort((a, b) => b.time - a.time) // Sort by most recent
  .slice(0, maxItems) // Limit to maxItems
  .map(activity => ({
    ...activity,
    time: formatTimeAgo(activity.rawTime)
  }));

  return activities;
};

export default function AdminDashboard() {
  const { 
    usersRaw, 
    orders, 
    adminOrder, 
    productsRoot,
    setOrder,
    setUser
  } = useContext(ShoesShopContext);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("http://localhost:9999/orders").then(res => setOrder(res.data));
        await axios.get("http://localhost:9999/user").then(res => setUser(res.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Initial fetch
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const ordersSource = Array.isArray(adminOrder) && adminOrder.length ? adminOrder : orders;

  const totalUsers = useMemo(() => (Array.isArray(usersRaw) ? usersRaw.length : 0), [usersRaw]);
  const totalOrders = useMemo(() => (Array.isArray(ordersSource) ? ordersSource.length : 0), [ordersSource]);
  const totalRevenue = useMemo(() => {
    if (!Array.isArray(ordersSource)) return 0;
    return ordersSource.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  }, [ordersSource]);
  const totalProducts = useMemo(() => (Array.isArray(productsRoot) ? productsRoot.length : 0), [productsRoot]);

  const chartData = useMemo(() => getMonthlyData(ordersSource, usersRaw), [ordersSource, usersRaw]);
  const recentActivities = useMemo(() => getRecentActivities(ordersSource, usersRaw), [ordersSource, usersRaw]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex gap-6">
        {/* Sidebar */}
        <SideBarAdmin />
        {/* Main */}
        <main className="flex-1 space-y-6 p-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Users" value={totalUsers.toLocaleString()} change={null} icon={<UserIcon className="w-5 h-5" />} color="text-blue-600" />
            <StatCard title="Total Revenue" value={`${totalRevenue.toLocaleString()} VND`} change={null} icon={<CreditCardIcon className="w-5 h-5" />} color="text-green-600" />
            <StatCard title="Total Orders" value={totalOrders.toLocaleString()} change={null} icon={<ShoppingCartIcon className="w-5 h-5" />} color="text-purple-600" />
            <StatCard title="Products" value={totalProducts.toLocaleString()} change={null} icon={<PackageCheckIcon className="w-5 h-5" />} color="text-orange-600" />
          </div>

          {/* Chart & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Analytics Overview</h3>
              <MonthlyRevenueChart data={chartData} />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Hoạt động gần đây</h3>
              </div>
              <ul className="space-y-4">
                {recentActivities.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-lg">{act.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{act.title}</p>
                      <p className="text-gray-500 text-xs">{act.desc}</p>
                      <p className="text-gray-400 text-xs italic">{act.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
