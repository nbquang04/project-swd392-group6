import React, { useContext, useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import SideBarAdmin from '../../components/SideBarAdmin';
import MonthlyRevenueChart from "../../components/Chart";
import { ShoesShopContext } from '../../context/ShoeShopContext';
import { BarChart3, TrendingUp, Users, ShoppingBag } from 'lucide-react';







const Statistic = () => {
  const { orders, usersRaw, productsRoot, setOrder, setUser } = useContext(ShoesShopContext);
  const [timeRange, setTimeRange] = useState('all'); // all, year, month, week

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("http://localhost:9999/orders").then(res => setOrder(res.data));
        await axios.get("http://localhost:9999/user").then(res => setUser(res.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [setOrder, setUser]);

  const stats = useMemo(() => {
    if (!orders?.length) return null;

    const now = new Date();
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      switch (timeRange) {
        case 'week':
          return now - orderDate <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return now - orderDate <= 30 * 24 * 60 * 60 * 1000;
        case 'year':
          return orderDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });

    // Tổng doanh thu
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Số đơn hàng theo trạng thái
    const ordersByStatus = filteredOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Sản phẩm bán chạy
    const productSales = {};
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        const baseProductId = item.product_id.split('-')[0];
        productSales[baseProductId] = (productSales[baseProductId] || 0) + item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([id, quantity]) => {
        const product = productsRoot?.find(p => p.id === id);
        return {
          name: product?.name || 'Unknown Product',
          quantity,
          revenue: filteredOrders.reduce((sum, order) => {
            const matchingItem = order.items?.find(item => item.product_id.split('-')[0] === id);
            return sum + (matchingItem ? matchingItem.price * matchingItem.quantity : 0);
          }, 0)
        };
      });

    // Thống kê khách hàng
    const uniqueCustomers = new Set(filteredOrders.map(order => order.user_id)).size;
    const averageOrderValue = totalRevenue / filteredOrders.length;

    return {
      totalRevenue,
      ordersByStatus,
      topProducts,
      uniqueCustomers,
      averageOrderValue,
      totalOrders: filteredOrders.length
    };
  }, [orders, timeRange, productsRoot]);

  const chartData = useMemo(() => {
    if (!orders?.length) return [];
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString('en-US', { month: 'short' });
    }).reverse();

    return months.map(month => {
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toLocaleString('en-US', { month: 'short' }) === month;
      });

      const monthUsers = usersRaw.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.toLocaleString('en-US', { month: 'short' }) === month;
      });

      return {
        month,
        sales: monthOrders.reduce((sum, order) => sum + (order.total || 0), 0),
        orders: monthOrders.length,
        users: monthUsers.length
      };
    });
  }, [orders, usersRaw]);

  return (
    <div className="flex">
      <SideBarAdmin />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Thống kê kinh doanh</h1>
          <div className="mt-4 flex gap-2">
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">Tất cả thời gian</option>
              <option value="year">Năm nay</option>
              <option value="month">Tháng này</option>
              <option value="week">Tuần này</option>
            </select>
          </div>
        </div>

        {stats && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng doanh thu</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} VND</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <ShoppingBag className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Khách hàng</p>
                    <p className="text-xl font-bold text-gray-900">{stats.uniqueCustomers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giá trị đơn trung bình</p>
                    <p className="text-xl font-bold text-gray-900">{Math.round(stats.averageOrderValue).toLocaleString()} VND</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Biểu đồ doanh thu</h2>
                <MonthlyRevenueChart data={chartData} />
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h2>
                <div className="space-y-4">
                  {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'delivered' ? 'bg-green-500' :
                          status === 'processing' ? 'bg-yellow-500' :
                          status === 'pending' ? 'bg-blue-500' :
                          'bg-red-500'
                        }`} />
                        <span className="capitalize">{status}</span>
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Top 5 sản phẩm bán chạy</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm">
                      <th className="py-2">Sản phẩm</th>
                      <th className="py-2">Số lượng bán</th>
                      <th className="py-2">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts.map((product, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-3">{product.name}</td>
                        <td className="py-3">{product.quantity}</td>
                        <td className="py-3">{product.revenue.toLocaleString()} VND</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Statistic;