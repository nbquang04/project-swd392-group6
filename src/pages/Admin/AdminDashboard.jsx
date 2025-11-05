import React from "react";
import SideBarAdmin from "../../components/SideBarAdmin";
import MonthlyRevenueChart from "../../components/Chart";
import {
  UserIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  PackageCheckIcon,
} from "lucide-react";

// === Mock data cố định ===
const totalUsers = 128;
const totalOrders = 320;
const totalRevenue = 125000000;
const totalProducts = 45;

const chartData = [
  { month: "Jan", sales: 10000000, users: 10, orders: 20 },
  { month: "Feb", sales: 12000000, users: 12, orders: 25 },
  { month: "Mar", sales: 8000000, users: 8, orders: 15 },
  { month: "Apr", sales: 15000000, users: 15, orders: 28 },
  { month: "May", sales: 13000000, users: 13, orders: 22 },
  { month: "Jun", sales: 11000000, users: 11, orders: 18 },
];

const recentActivities = [
  { icon: "🟢", title: "Order completed", desc: "Order #1001 total 2.000.000 VND", time: "5 minutes ago" },
  { icon: "🧑‍💻", title: "New user registered", desc: "Nguyen Van A joined", time: "10 minutes ago" },
  { icon: "🔵", title: "Order processing", desc: "Order #1002 total 3.500.000 VND", time: "15 minutes ago" },
  { icon: "🟢", title: "Order completed", desc: "Order #1003 total 1.200.000 VND", time: "1 hour ago" },
  { icon: "🧑‍💻", title: "New user registered", desc: "Tran Thi B joined", time: "2 hours ago" },
  { icon: "⚪", title: "Order placed", desc: "Order #1004 total 4.800.000 VND", time: "3 hours ago" },
];

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`text-white p-2 rounded-full bg-opacity-20 ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex gap-6">
        {/* Sidebar */}
        <SideBarAdmin />

        {/* Main content */}
        <main className="flex-1 space-y-6 p-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={totalUsers.toLocaleString()}
              icon={<UserIcon className="w-5 h-5" />}
              color="text-blue-600"
            />
            <StatCard
              title="Total Revenue"
              value={`${totalRevenue.toLocaleString()} VND`}
              icon={<CreditCardIcon className="w-5 h-5" />}
              color="text-green-600"
            />
            <StatCard
              title="Total Orders"
              value={totalOrders.toLocaleString()}
              icon={<ShoppingCartIcon className="w-5 h-5" />}
              color="text-purple-600"
            />
            <StatCard
              title="Products"
              value={totalProducts.toLocaleString()}
              icon={<PackageCheckIcon className="w-5 h-5" />}
              color="text-orange-600"
            />
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
                <h3 className="text-lg font-semibold">Recent Activities</h3>
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
