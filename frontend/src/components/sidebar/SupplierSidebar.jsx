import React from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, Home, LogOut, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { authAPI } from "../../services/api";
import { toast } from "react-toastify";

const menuItems = [
  { path: "", icon: Home, label: "Overview" },
  { path: "my-requests", icon: FileText, label: "My Requests" },
];

const SupplierSidebar = ({ activePath, onCreateRequest }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Call the logout API
      await authAPI.signOut();

      // Clear local state and redirect
      dispatch(logout());
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, still logout locally
      dispatch(logout());
      toast.success("Logged out successfully");
      window.location.href = "/";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Supplier":
        return "bg-blue-100 text-blue-800";
      case "Admin":
        return "bg-green-300 text-xl text-green-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="hidden lg:block fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-white rounded-xl shadow-md p-4 z-40 flex flex-col">
      <div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const currentPath = activePath.split("/").pop() || "";
            const isActive =
              item.path === ""
                ? currentPath === "" || currentPath === "suplier-dashboard"
                : item.path === currentPath;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-md border-r-2 border-blue-300"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:border-r-2 hover:border-blue-300"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={onCreateRequest}
              className="w-full flex items-center px-3 py-2 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </button>
          </div>
        </div>
      </div>
      {/* Profile section at the very bottom with large top margin */}
      <div className="border-t border-gray-200 flex flex-col items-center mt-96 pt-6 w-full">
        <div className="flex flex-row items-center w-full justify-start mb-2 pl-2">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">
              {user?.name}
            </span>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${getRoleColor(
                user?.role
              )}`}
            >
              {user?.role}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 text-base font-semibold text-red-700 bg-red-100 rounded-lg hover:bg-red-200 hover:text-red-800 transition-colors duration-200 flex items-center w-full justify-center"
          title="Logout"
        >
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default SupplierSidebar;
