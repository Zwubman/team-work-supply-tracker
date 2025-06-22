import SuplierDashboard from "../components/dashboards/SuplierDashboard";
import SuplierOverview from "../components/dashboards/SuplierOverview";
import { Outlet, useLocation } from "react-router-dom";
import React, { useState } from "react";

export default function SuplierDashboardPage() {
  const location = useLocation();
  const [showRequestForm, setShowRequestForm] = useState(false);

  const handleSelectItem = () => {
    setShowRequestForm(true);
  };

  // If the current path is exactly /suplier-dashboard, show the overview content
  const isIndex = location.pathname === "/suplier-dashboard";
  return (
    <SuplierDashboard>
      {isIndex ? (
        <SuplierOverview onSelectItem={handleSelectItem} />
      ) : (
        <Outlet />
      )}
      {/* Supply Request Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 text-center">
              Create Supply Request
            </h3>
            {/* You can import and use your SupplyRequestForm here */}
            {/* <SupplyRequestForm selectedItem={selectedItem} onClose={() => setShowRequestForm(false)} /> */}
            <button
              onClick={() => setShowRequestForm(false)}
              className="mt-4 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </SuplierDashboard>
  );
}
