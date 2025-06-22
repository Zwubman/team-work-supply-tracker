import React, { useState, useEffect } from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Layout from "../common/Layout";
import SupplyRequestForm from "../forms/SupplyRequestForm";
import { setItems } from "../../store/slices/inventorySlice";
import { setMyRequests } from "../../store/slices/requestSlice";
import { itemsAPI, supplyAPI } from "../../services/api";
import SupplierSidebar from "../sidebar/SupplierSidebar";

const SupplierDashboard = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the correct role
  if (user.role !== "Supplier") {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    loadItems();
    loadMyRequests();
  }, []);

  const loadItems = async () => {
    try {
      const response = await itemsAPI.getAllItems();
      const itemsData = response.data?.items || response.data || [];
      dispatch(setItems(Array.isArray(itemsData) ? itemsData : []));
    } catch {
      toast.error("Failed to load items");
      dispatch(setItems([]));
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

  const handleCreateRequest = () => {
    if (selectedItem) {
      setShowRequestForm(true);
    } else {
      toast.info("Please select an item first before creating a request");
    }
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setShowRequestForm(true);
  };

  return (
    <Layout title="Supplier Dashboard" fullWidth={true}>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 bg-white rounded-xl shadow-md p-4">
          <SupplierSidebar
            activePath={location.pathname}
            onCreateRequest={handleCreateRequest}
          />
        </div>
        <div className="flex-1">
          <Outlet
            context={{ setSelectedItem, onSelectItem: handleItemSelect }}
          />
        </div>
      </div>

      {showRequestForm && (
        <SupplyRequestForm
          selectedItem={selectedItem}
          onClose={() => {
            setShowRequestForm(false);
            setSelectedItem(null);
          }}
          onSuccess={() => {
            setShowRequestForm(false);
            setSelectedItem(null);
            loadMyRequests();
          }}
        />
      )}
    </Layout>
  );
};

export default SupplierDashboard;
