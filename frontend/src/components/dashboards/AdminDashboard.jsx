import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Package,
  Plus,
  FileText,
  BarChart3,
  Users,
  Home,
  TrendingUp,
  AlertTriangle,
  Clock,
} from "lucide-react";
import Layout from "../common/Layout";
import ItemCard from "../common/ItemCard";
import AddItemForm from "../forms/AddItemForm";
import EditItemForm from "../forms/EditItemForm";
import MovementForm from "../forms/MovementForm";
import Analytics from "../analytics/Analytics";
import { setItems, setEditingItem } from "../../store/slices/inventorySlice";
import { setRequests } from "../../store/slices/requestSlice";
import { itemsAPI, supplyAPI } from "../../services/api";
import AdminSidebar from "../sidebar/AdminSidebar";

const AdminDashboard = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { editingItem, items } = useSelector((state) => state.inventory);
  const { requests } = useSelector((state) => state.requests);
  const user = useSelector((state) => state.auth.user);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the correct role
  if (user.role !== "Admin") {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    loadItems();
    loadRequests();
  }, []);

  const loadItems = async () => {
    try {
      const response = await itemsAPI.getAllItems();
      console.log("API items response:", response.data);
      dispatch(setItems(response.data.items));
    } catch {
      toast.error("Failed to load items");
    }
  };

  const loadRequests = async () => {
    try {
      const response = await supplyAPI.getAllSupplies();
      // The API returns { message: "...", data: [...] }
      const requestsData = response.data?.data || response.data || [];
      dispatch(setRequests(Array.isArray(requestsData) ? requestsData : []));
    } catch {
      toast.error("Failed to load requests");
      dispatch(setRequests([]));
    }
  };

  const handleCreateMovement = () => {
    if (selectedItem) {
      setShowMovementForm(true);
    } else {
      toast.info("Please select an item first before creating a movement");
    }
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setShowMovementForm(true);
  };

  return (
    <Layout title="Admin Dashboard" fullWidth={true}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 bg-white rounded-xl shadow-md p-4">
          <AdminSidebar
            activePath={location.pathname}
            onAddItem={() => setShowAddForm(true)}
            onCreateMovement={handleCreateMovement}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {location.pathname === "/admin-dashboard" ? (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Items
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(items) ? items.length : 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Low Stock
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(items)
                          ? items.filter(
                              (item) => item.quantity <= item.threshold
                            ).length
                          : 0}
                      </p>
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
                        {Array.isArray(requests)
                          ? requests.filter((r) => r.status === "pending")
                              .length
                          : 0}
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
                      <p className="text-sm font-medium text-gray-600">
                        Total Stock
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(items)
                          ? items.reduce((sum, item) => sum + item.quantity, 0)
                          : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Recent Items */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Recent Items
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {Array.isArray(items) &&
                    [...items]
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .slice(0, 5)
                      .map((item) => (
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
                              handleItemSelect(itemObj);
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
                  {Array.isArray(items) &&
                    items.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        userRole="Admin"
                        onEdit={(item) => dispatch(setEditingItem(item))}
                        onDelete={async (itemId) => {
                          try {
                            await itemsAPI.deleteItem(itemId);
                            toast.success("Item deleted successfully");
                            loadItems();
                          } catch (error) {
                            toast.error(
                              error.response?.data?.message ||
                                "Failed to delete item"
                            );
                          }
                        }}
                        onSelect={(itemObj, mode) => {
                          if (mode === "movement") {
                            setSelectedItem(itemObj);
                            setShowMovementForm(true);
                          } else if (mode === "select") {
                            setSelectedItem(itemObj);
                          }
                        }}
                        showActions={true}
                      />
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <Outlet
              context={{
                setSelectedItem,
                onSelectItem: handleItemSelect,
                loadItems,
              }}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddForm && (
        <AddItemForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            loadItems();
          }}
        />
      )}

      {editingItem && (
        <EditItemForm
          item={editingItem}
          onClose={() => dispatch(setEditingItem(null))}
          onSuccess={() => {
            dispatch(setEditingItem(null));
            loadItems();
          }}
        />
      )}

      {showMovementForm && (
        <MovementForm
          selectedItem={selectedItem}
          onClose={() => {
            setShowMovementForm(false);
            setSelectedItem(null);
          }}
          onSuccess={() => {
            setShowMovementForm(false);
            setSelectedItem(null);
            loadItems();
          }}
        />
      )}
    </Layout>
  );
};

export default AdminDashboard;
