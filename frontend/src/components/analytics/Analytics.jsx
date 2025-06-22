import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Package, AlertTriangle } from "lucide-react";
import { movementsAPI } from "../../services/api";

const Analytics = () => {
  const { items } = useSelector((state) => state.inventory);
  const [chartData, setChartData] = useState([]);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    fetchAndGenerateChartData();
    generateStockData();
  }, [items]);

  const fetchAndGenerateChartData = async () => {
    // Fetch inbound and outbound movements
    const [inboundRes, outboundRes] = await Promise.all([
      movementsAPI.getInboundMovements(),
      movementsAPI.getOutboundMovements(),
    ]);
    const inboundMovements = Array.isArray(inboundRes.data)
      ? inboundRes.data
      : inboundRes.data?.data || [];
    const outboundMovements = Array.isArray(outboundRes.data)
      ? outboundRes.data
      : outboundRes.data?.data || [];
    // Prepare last 7 days
    const days = 7;
    const today = new Date();
    const dateMap = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dateMap[key] = { date: key, inbound: 0, outbound: 0 };
    }
    // Sum inbound by date
    inboundMovements.forEach((m) => {
      const d = new Date(m.createdAt || m.movedAt);
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (dateMap[key]) {
        dateMap[key].inbound += m.quantity;
      }
    });
    // Sum outbound by date
    outboundMovements.forEach((m) => {
      const d = new Date(m.createdAt || m.movedAt);
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (dateMap[key]) {
        dateMap[key].outbound += m.quantity;
      }
    });
    const last7Days = Object.values(dateMap).map((d) => ({
      ...d,
      net: d.inbound - d.outbound,
    }));
    setChartData(last7Days);
  };

  const generateStockData = () => {
    const stockLevels = items.map((item) => ({
      name: item.name,
      stock: item.quantity,
      threshold: item.threshold,
      lowStock: item.quantity <= item.threshold,
    }));
    setStockData(stockLevels);
  };

  const lowStockItems = items.filter((item) => item.quantity <= item.threshold);
  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const pieData = [
    { name: "In Stock", value: items.length - lowStockItems.length },
    { name: "Low Stock", value: lowStockItems.length },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {lowStockItems.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Movement Trends */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Daily Movement Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                interval={0}
                domain={[0, 1800]}
                ticks={[0, 300, 600, 900, 1200, 1500, 1800]}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="inbound"
                stroke="#10B981"
                strokeWidth={2}
                name="Inbound"
              />
              <Line
                type="monotone"
                dataKey="outbound"
                stroke="#EF4444"
                strokeWidth={2}
                name="Outbound"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Stock Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock Levels Bar Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Current Stock Levels
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stockData.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stock" fill="#3B82F6" name="Current Stock" />
            <Bar dataKey="threshold" fill="#F59E0B" name="Threshold" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
            <h3 className="text-xl font-bold text-red-900">Low Stock Alert</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg border border-red-200"
              >
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                <p className="text-sm text-red-600 font-medium">
                  Stock: {item.quantity} (Threshold: {item.threshold})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
