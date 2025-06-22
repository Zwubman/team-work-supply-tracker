import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import ItemCard from "../common/ItemCard";
import { setItems } from "../../store/slices/inventorySlice";
import { setMyRequests } from "../../store/slices/requestSlice";
import { itemsAPI, supplyAPI } from "../../services/api";
import { toast } from "react-toastify";

const SuplierOverview = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.inventory);
  const { myRequests } = useSelector((state) => state.requests);
  const { setSelectedItem, onSelectItem } = useOutletContext(); // Receive from SupplierDashboard
  const [requestStats, setRequestStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });

  useEffect(() => {
    loadItems();
    loadMyRequests();
  }, []);

  useEffect(() => {
    // Calculate request statistics when myRequests changes
    if (Array.isArray(myRequests)) {
      const stats = {
        pending: myRequests.filter((req) => req.status === "pending").length,
        approved: myRequests.filter((req) => req.status === "approved").length,
        rejected: myRequests.filter((req) => req.status === "rejected").length,
        cancelled: myRequests.filter((req) => req.status === "cancelled")
          .length,
      };
      setRequestStats(stats);
    }
  }, [myRequests]);

  const loadItems = async () => {
    try {
      const response = await itemsAPI.getAllItems();
      dispatch(setItems(response.data.items));
    } catch {
      toast.error("Failed to load items");
    }
  };

  const loadMyRequests = async () => {
    try {
      const response = await supplyAPI.getMyRequests();
      const requestsData = response.data?.data || response.data || [];
      dispatch(setMyRequests(Array.isArray(requestsData) ? requestsData : []));
    } catch {
      toast.error("Failed to load requests");
      dispatch(setMyRequests([]));
    }
  };

  // Sort items by createdAt descending and take the first 5
  const recentItems = Array.isArray(items)
    ? [...items]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
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
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Requests
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {requestStats.pending}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Approved Requests
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {requestStats.approved}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Rejected Requests
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {requestStats.rejected}
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
              userRole="Supplier"
              onSelect={(itemObj, mode) => {
                if (mode === "select") {
                  // Only select the item, don't open form
                  setSelectedItem(itemObj);
                  toast.success(`Selected: ${itemObj.name}`);
                } else if (mode === "movement") {
                  // Open request form directly
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
              userRole="Supplier"
              onSelect={(itemObj, mode) => {
                if (mode === "select") {
                  // Only select the item, don't open form
                  setSelectedItem(itemObj);
                  toast.success(`Selected: ${itemObj.name}`);
                } else if (mode === "movement") {
                  // Open request form directly
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

export default SuplierOverview;
