import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
  Package,
  Plus,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import ItemCard from "../common/ItemCard";
import { setItems } from "../../store/slices/inventorySlice";
import { itemsAPI } from "../../services/api";
import { toast } from "react-toastify";

const AdminOverview = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.inventory);
  const { setSelectedItem, onSelectItem } = useOutletContext(); // Receive from AdminDashboard

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line
  }, []);

  const loadItems = async () => {
    try {
      const response = await itemsAPI.getAllItems();
      dispatch(setItems(response.data.items));
    } catch {
      toast.error("Failed to load items");
    }
  };

  // Sort items by createdAt descending and take the first 5
  const recentItems = Array.isArray(items)
    ? [...items]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    : [];

  const lowStockItems = Array.isArray(items)
    ? items.filter((item) => item.quantity <= item.threshold)
    : [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Requests
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {/* You can add pending requests count here if available */}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {recentItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              userRole="Admin"
              onSelect={(itemObj, mode) => {
                if (mode === "select") {
                  // Only select the item, don't open form
                  setSelectedItem(itemObj);
                  toast.success(`Selected: ${itemObj.name}`);
                } else if (mode === "movement") {
                  // Open movement form directly
                  onSelectItem(itemObj);
                }
              }}
              showActions={false}
            />
          ))}
        </div>
      </div>

      {/* All Items */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">All Items</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              userRole="Admin"
              onSelect={(itemObj, mode) => {
                if (mode === "select") {
                  // Only select the item, don't open form
                  setSelectedItem(itemObj);
                  toast.success(`Selected: ${itemObj.name}`);
                } else if (mode === "movement") {
                  // Open movement form directly
                  onSelectItem(itemObj);
                }
              }}
              showActions={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
