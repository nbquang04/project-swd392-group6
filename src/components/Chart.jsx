import React, { useContext, useMemo } from "react";
import { ShoesShopContext } from "../context/ShoeShopContext";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";


export default function MonthlyRevenueChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data;
  }, [data]);

  // Always render the chart container to preserve layout; show empty state inside

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">📊 Doanh thu theo tháng</h2>
      <div className="w-full h-96">
        {!chartData || chartData.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            📭 Chưa có dữ liệu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "Doanh thu") return `${value.toLocaleString()} VND`;
                  return value;
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="sales" name="Doanh thu" fill="#3b82f6" barSize={50} radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Đơn hàng" />
              <Line yAxisId="right" type="monotone" dataKey="users" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Người dùng mới" />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
