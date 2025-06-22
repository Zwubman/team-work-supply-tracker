import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Package,
  Calendar,
  Box,
  Hash,
  User,
} from "lucide-react";
import { supplyAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import EditRequestForm from "../forms/EditRequestForm";
import ConfirmationModal from "../common/ConfirmationModal";

const MyRequestsList = ({ filter: filterProp = "all" }) => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState(filterProp);
  const [editingRequest, setEditingRequest] = useState(null);
  const [cancellingRequest, setCancellingRequest] = useState(null);
  const [cancellingLoading, setCancellingLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFilter(filterProp);
  }, [filterProp]);

  const basePath = "/suplier-dashboard/my-requests";
  const handleFilterClick = (newFilter) => {
    if (newFilter === "all") {
      navigate(basePath);
    } else {
      navigate(`${basePath}/${newFilter}`);
    }
  };

  useEffect(() => {
    loadMyRequests();
  }, []);

  const loadMyRequests = async () => {
    try {
      const response = await supplyAPI.getMyRequests();
      const requestsData = response.data?.data || response.data || [];
      setRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch {
      toast.error("Failed to load requests");
      setRequests([]);
    }
  };

  const handleCancelClick = (requestId) => {
    setCancellingRequest(requestId);
  };

  const handleCancelConfirm = async () => {
    if (!cancellingRequest) return;

    setCancellingLoading(true);
    try {
      await supplyAPI.cancelRequest(cancellingRequest);
      toast.success("Request cancelled successfully");
      loadMyRequests();
    } catch {
      toast.error("Failed to cancel request");
    } finally {
      setCancellingLoading(false);
      setCancellingRequest(null);
    }
  };

  const handleCancelClose = () => {
    setCancellingRequest(null);
    setCancellingLoading(false);
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
  };

  const handleEditClose = () => {
    setEditingRequest(null);
  };

  const handleEditSuccess = () => {
    loadMyRequests();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categorizedRequests = {
    pending: Array.isArray(requests)
      ? requests.filter((r) => r.status === "pending")
      : [],
    approved: Array.isArray(requests)
      ? requests.filter((r) => r.status === "approved")
      : [],
    rejected: Array.isArray(requests)
      ? requests.filter((r) => r.status === "rejected")
      : [],
    cancelled: Array.isArray(requests)
      ? requests.filter((r) => r.status === "cancelled")
      : [],
  };

  // Helper to get the correct date label and value
  const getStatusDateInfo = (request) => {
    switch (request.status) {
      case "approved":
        return {
          label: "Approved",
          date:
            request.approvedAt ||
            request.updatedAt ||
            request.createdAt ||
            null,
        };
      case "rejected":
        return {
          label: "Rejected",
          date:
            request.rejectedAt ||
            request.updatedAt ||
            request.createdAt ||
            null,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          date:
            request.cancelledAt ||
            request.updatedAt ||
            request.createdAt ||
            null,
        };
      default:
        return {
          label: "Created",
          date: request.createdAt || null,
        };
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3 mt-6 bg-gray-100 p-2 rounded-xl">
          {/* Filter Buttons */}
          <button
            className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ${
              filter === "all"
                ? "bg-gray-300 text-gray-900"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleFilterClick("all")}
          >
            All Requests
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ${
              filter === "pending"
                ? "bg-gray-300 text-gray-900"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleFilterClick("pending")}
          >
            Pending Requests
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ${
              filter === "approved"
                ? "bg-gray-300 text-gray-900"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleFilterClick("approved")}
          >
            Approved Requests
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ${
              filter === "rejected"
                ? "bg-gray-300 text-gray-900"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleFilterClick("rejected")}
          >
            Rejected Requests
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ${
              filter === "cancelled"
                ? "bg-gray-300 text-gray-900"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleFilterClick("cancelled")}
          >
            Cancelled Requests
          </button>
        </div>
      </div>
      {filter === "all" ? (
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No requests found
              </h3>
              <p className="text-gray-500">
                There are no supply requests to display at the moment.
              </p>
            </div>
          ) : (
            requests.map((request) => {
              const { label, date } = getStatusDateInfo(request);
              return (
                <div
                  key={request.id}
                  className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">
                              #{request.id}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-gray-900">
                              Supply Request
                            </h4>
                            <p className="text-sm text-gray-500">
                              {label}{" "}
                              {date
                                ? `on ${new Date(date).toLocaleDateString()}`
                                : ""}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Item Name */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center mb-2">
                            <Box className="w-4 h-4 text-blue-600 mr-2" />
                            <p className="text-xs text-blue-600 uppercase font-semibold tracking-wide">
                              Item Name
                            </p>
                          </div>
                          <p className="font-bold text-blue-900">
                            {request.item?.name || request.itemName || "N/A"}
                          </p>
                        </div>

                        {/* SKU */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-center mb-2">
                            <Hash className="w-4 h-4 text-purple-600 mr-2" />
                            <p className="text-xs text-purple-600 uppercase font-semibold tracking-wide">
                              SKU
                            </p>
                          </div>
                          <p className="font-bold text-purple-900">
                            {request.item?.SKU || request.sku || "N/A"}
                          </p>
                        </div>

                        {/* Quantity */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center mb-2">
                            <Package className="w-4 h-4 text-green-600 mr-2" />
                            <p className="text-xs text-green-600 uppercase font-semibold tracking-wide">
                              Quantity
                            </p>
                          </div>
                          <p className="font-bold text-green-900">
                            {request.quantity}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                          <div className="flex items-center mb-2">
                            <User className="w-4 h-4 text-orange-600 mr-2" />
                            <p className="text-xs text-orange-600 uppercase font-semibold tracking-wide">
                              Status
                            </p>
                          </div>
                          <div className="flex items-center">
                            {getStatusIcon(request.status)}
                            <p className="font-bold text-orange-900 ml-2 capitalize">
                              {request.status}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border-l-4 border-blue-400">
                        <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          Description
                        </p>
                        <p className="text-gray-800 leading-relaxed">
                          {request.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 ml-6">
                      {request.status === "pending" && (
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleEdit(request)}
                            className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md"
                            title="Edit request"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleCancelClick(request.id)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md"
                            title="Cancel request"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full">
          <div className="px-6 py-4 flex items-center">
            <div
              className={`flex items-center space-x-4 px-6 py-2 rounded-2xl border shadow-md w-full bg-gray-200`}
              style={{
                borderWidth: "1.5px",
                borderColor: "#e5e7eb",
                justifyContent: "flex-start",
              }}
            >
              <h3
                className={`text-xl font-bold capitalize flex items-center ${
                  filter === "pending"
                    ? "text-yellow-700"
                    : filter === "approved"
                    ? "text-green-700"
                    : filter === "rejected"
                    ? "text-red-700"
                    : filter === "cancelled"
                    ? "text-gray-700"
                    : "text-blue-700"
                }`}
              >
                {getStatusIcon(filter)}
                <span className="ml-2">{filter} Requests</span>
                <span
                  className={
                    `ml-3 px-3 py-1 rounded-full text-lg font-bold ` +
                    (filter === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : filter === "approved"
                      ? "bg-green-100 text-green-700"
                      : filter === "rejected"
                      ? "bg-red-100 text-red-700"
                      : filter === "cancelled"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-blue-100 text-blue-700")
                  }
                >
                  {categorizedRequests[filter]?.length || 0}{" "}
                  {categorizedRequests[filter]?.length === 1
                    ? "request"
                    : "requests"}
                </span>
              </h3>
            </div>
          </div>
          <div className="p-6">
            {categorizedRequests[filter]?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  No {filter} requests found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Your {filter} requests will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {categorizedRequests[filter].map((request) => {
                  const { label, date } = getStatusDateInfo(request);
                  return (
                    <div
                      key={request.id}
                      className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">
                                  #{request.id}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold text-lg text-gray-900">
                                  Supply Request
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {label}{" "}
                                  {date
                                    ? `on ${new Date(
                                        date
                                      ).toLocaleDateString()}`
                                    : ""}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {/* Item Name */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                              <div className="flex items-center mb-2">
                                <Box className="w-4 h-4 text-blue-600 mr-2" />
                                <p className="text-xs text-blue-600 uppercase font-semibold tracking-wide">
                                  Item Name
                                </p>
                              </div>
                              <p className="font-bold text-blue-900">
                                {request.item?.name ||
                                  request.itemName ||
                                  "N/A"}
                              </p>
                            </div>

                            {/* SKU */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                              <div className="flex items-center mb-2">
                                <Hash className="w-4 h-4 text-purple-600 mr-2" />
                                <p className="text-xs text-purple-600 uppercase font-semibold tracking-wide">
                                  SKU
                                </p>
                              </div>
                              <p className="font-bold text-purple-900">
                                {request.item?.SKU || request.sku || "N/A"}
                              </p>
                            </div>

                            {/* Quantity */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                              <div className="flex items-center mb-2">
                                <Package className="w-4 h-4 text-green-600 mr-2" />
                                <p className="text-xs text-green-600 uppercase font-semibold tracking-wide">
                                  Quantity
                                </p>
                              </div>
                              <p className="font-bold text-green-900">
                                {request.quantity}
                              </p>
                            </div>

                            {/* Status */}
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                              <div className="flex items-center mb-2">
                                <User className="w-4 h-4 text-orange-600 mr-2" />
                                <p className="text-xs text-orange-600 uppercase font-semibold tracking-wide">
                                  Status
                                </p>
                              </div>
                              <div className="flex items-center">
                                {getStatusIcon(request.status)}
                                <p className="font-bold text-orange-900 ml-2 capitalize">
                                  {request.status}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border-l-4 border-blue-400">
                            <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center">
                              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                              Description
                            </p>
                            <p className="text-gray-800 leading-relaxed">
                              {request.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 ml-6">
                          {request.status === "pending" && (
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => handleEdit(request)}
                                className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md"
                                title="Edit request"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleCancelClick(request.id)}
                                className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md"
                                title="Cancel request"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
      {editingRequest && (
        <EditRequestForm
          request={editingRequest}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
        />
      )}
      {cancellingRequest && (
        <ConfirmationModal
          isOpen={!!cancellingRequest}
          onConfirm={handleCancelConfirm}
          onClose={handleCancelClose}
          loading={cancellingLoading}
          title="Cancel Request"
          message="Are you sure you want to cancel this request?"
          confirmText="Cancel Request"
          cancelText="Keep Request"
        />
      )}
    </div>
  );
};

export default MyRequestsList;
