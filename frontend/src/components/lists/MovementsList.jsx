import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Package,
  Filter,
} from "lucide-react";
import { movementsAPI } from "../../services/api";

const MovementsList = () => {
  const { movements } = useSelector((state) => state.movements);
  const [movementsList, setMovementsList] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMovements();
  }, [filter]);

  const loadMovements = async () => {
    setLoading(true);
    try {
      let response;
      response = await movementsAPI.getAllMovements();
      let allMovements = response.data?.data || response.data || [];
      // Filter client-side
      let filtered = allMovements;
      if (filter === "inbound") {
        filtered = allMovements.filter(
          (m) => (m.movementType || m.type) === "inbound"
        );
      } else if (filter === "outbound") {
        filtered = allMovements.filter(
          (m) => (m.movementType || m.type) === "outbound"
        );
      }
      setMovementsList(filtered);
    } catch (error) {
      toast.error("Failed to load movements");
    } finally {
      setLoading(false);
    }
  };

  const getMovementIcon = (type) => {
    return type === "inbound" || type === "Inbound" ? (
      <TrendingUp className="w-5 h-5 text-green-600" />
    ) : (
      <TrendingDown className="w-5 h-5 text-red-600" />
    );
  };

  const getMovementColor = (type) => {
    return type === "inbound" || type === "Inbound"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Movement History</h2>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Movements</option>
            <option value="inbound">Inbound Only</option>
            <option value="outbound">Outbound Only</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : movementsList.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No movements found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {movementsList.map((movement) => (
            <div
              key={movement.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-gray-50 to-blue-50"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 mr-3">
                      Movement #{movement.id}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getMovementColor(
                        movement.movementType || movement.type
                      )}`}
                    >
                      {(movement.movementType || movement.type)
                        ?.charAt(0)
                        .toUpperCase() +
                        (movement.movementType || movement.type)?.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
                        Item Name
                      </p>
                      <p className="font-bold text-blue-900">
                        {movement.itemName || movement.item?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
                        SKU
                      </p>
                      <p className="font-bold text-purple-900">
                        {movement.sku || movement.item?.SKU || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
                        Quantity
                      </p>
                      <p className="font-bold text-green-900">
                        {movement.quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
                        Moved By
                      </p>
                      <p className="font-bold text-orange-900">
                        {movement.movedBy ||
                          movement.movedByUser?.name ||
                          "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
                          Date
                        </p>
                        <p className="text-sm font-medium">
                          {movement.movedAt ||
                            new Date(movement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {movement.notes && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
                        Notes
                      </p>
                      <p className="text-gray-900">{movement.notes}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center ml-4">
                  {getMovementIcon(movement.movementType || movement.type)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovementsList;
