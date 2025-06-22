import React from "react";
import { useSelector } from "react-redux";
import ItemCard from "../components/common/ItemCard";

const staticItems = [
  {
    id: 1,
    sku: "ITEM-001",
    name: "Wireless Mouse",
    description: "A high-precision wireless mouse with ergonomic design.",
    quantity: 50,
    threshold: 10,
    category: "Electronics",
    location: "Warehouse A",
    supplier: "Tech Supplies Ltd.",
    price: 19.99,
  },
  {
    id: 2,
    sku: "ITEM-002",
    name: "Mechanical Keyboard",
    description:
      "A durable mechanical keyboard with customizable RGB lighting.",
    quantity: 30,
    threshold: 5,
    category: "Electronics",
    location: "Warehouse B",
    supplier: "Keyboards Inc.",
    price: 49.99,
  },
];

export default function ItemsPage() {
  const items = useSelector((state) => state.inventory.items);
  const displayItems = items.length > 0 ? items : staticItems;
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayItems.map((item) => (
        <ItemCard key={item.id} item={item} showActions={false} />
      ))}
    </div>
  );
}
