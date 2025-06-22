import React, { useState } from "react";
import { Edit, Trash2, AlertTriangle, Package } from "lucide-react";

const ItemCard = ({
  item,
  onEdit,
  onDelete,
  onSelect,
  userRole,
  showActions = true,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isLowStock = item.quantity <= item.threshold;

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await onDelete(item.id);
      setShowDeleteModal(false);
    } catch (error) {
      // Keep modal open if there's an error
      console.error("Failed to delete item:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 text-center">
              Are you sure delete this item!
            </h3>
            <div className="flex justify-between gap-4">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group hover:scale-[1.02] cursor-pointer"
        onClick={() => onSelect && onSelect(item, "movement")}
      >
        <div className="relative">
          <img
            src={
              item.pictureUrl ||
              item.image ||
              "https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg?auto=compress&cs=tinysrgb&w=300"
            }
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          {isLowStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Low Stock
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {item.name}
            </h3>
            {showActions && userRole === "Admin" && (
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Edit item"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">SKU:</span>
              <span className="font-medium text-gray-900">
                {item.sku || item.SKU}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Stock:</span>
              <span
                className={`font-bold ${
                  isLowStock ? "text-red-600" : "text-green-600"
                }`}
              >
                {item.quantity}
              </span>
            </div>
          </div>

          {(userRole === "Supplier" || userRole === "Admin") && onSelect && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item, "select");
              }}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
            >
              <Package className="w-4 h-4 mr-2" />
              Select Item
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ItemCard;
