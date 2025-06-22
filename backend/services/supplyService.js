import { sendRequestApprovalEmail, } from "../utils/emailAlert.js";
import { Sequelize } from "sequelize";
import db from "../models/index.js"; 
const { Supply, Item } = db;

const requestSupply = async (Supply, data, userId) => {
  return await Supply.create({
    ...data,
    requestedBy: userId,
    status: "pending",
  });
};

const approveSupply = async (Supply, Item, Movement, supplyId, adminId) => {
  const supply = await Supply.findByPk(supplyId);

  if (!supply) throw new Error("Supply request not found");
  if (supply.status !== "pending")
    throw new Error("Supply has already been processed");

  // Confirm item exists
  const item = await Item.findByPk(supply.itemId);
  if (!item) throw new Error("Related item not found");

  // Update supply status and approvedBy
  supply.status = "approved";
  supply.approvedBy = adminId;
  supply.itemId = item.id;
  supply.supplierId = supply.requestedBy;
  await supply.save();

  // Update item stock
  item.quantity += supply.quantity;
  await item.save();

  // Create movement record
  await Movement.create({
    movementType: "inbound",
    quantity: supply.quantity,
    itemId: item.id,
    movedBy: adminId,
  });

  const supplier = await Supply.sequelize.models.User.findByPk(
    supply.supplierId
  );

  if (supplier?.email) {
    await sendRequestApprovalEmail(
      supplier.email, 
      item.name, 
      supply.quantity
    );
  } else {
    console.warn("No supplier email found, skipping email.");
  }

  return {
    message: "Supply approved and stock/movement updated",
    supply,
    item,
  };
};


const rejectSupplyRequest = async (Supply, supplyId, adminId) => {
  const supply = await Supply.findByPk(supplyId);

  if (!supply) throw new Error("Supply request not found");
  if (supply.status !== "pending") {
    throw new Error("Only pending requests can be rejected");
  }

  supply.status = "rejected";
  supply.rejectedBy = adminId;
  await supply.save();

  return {
    message: "Supply request rejected successfully",
    supply,
  };
};

const cancelSupplyRequest = async (Supply, supplyId, userId) => {
  const supply = await Supply.findByPk(supplyId);

  if (!supply) {
    throw new Error("Supply request not found");
  }

  if (supply.status !== "pending") {
    throw new Error("Only pending requests can be canceled");
  }

  if (supply.requestedBy !== userId) {
    throw new Error("You are not authorized to cancel this request");
  }

  supply.status = "cancelled";
  await supply.save();

  return {
    message: "Supply request canceled successfully",
    data: supply,
  };
};

const updatePendingSupply = async (Supply, supplyId, userId, updates) => {
  const supply = await Supply.findByPk(supplyId);

  if (!supply) {
    throw new Error("Supply request not found");
  }

  if (supply.status !== "pending") {
    throw new Error("Only pending requests can be updated");
  }

  if (supply.requestedBy !== userId) {
    throw new Error("You are not authorized to update this request");
  }

  await supply.update(updates);
  return supply;
};

const getUserSupplyRequests = async (_, userId) => {
  const supplies = await Supply.findAll({
    where: { requestedBy: userId },
    include: [
      {
        model: Item,
        as: "item",
        attributes: ["name", "SKU"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return supplies;
};

const getAllSupplyRequestsSorted = async (Supply, User, Item) => {
  const supplies = await Supply.findAll({
    include: [
      {
        model: User,
        as: "supplier",
        attributes: ["id", "name", "email"],
      },
      {
        model: Item,
        as: "item",
        attributes: ["id", "name", "SKU"],
      },
    ],
    order: [
      // Sort pending status first, then newest to oldest
      [
        Sequelize.literal(`CASE WHEN status = 'pending' THEN 0 ELSE 1 END`),
        "ASC",
      ],
      ["createdAt", "DESC"],
    ],
  });

  return supplies;
};

const getPendingSupplyRequests = async (Supply, User, Item) => {
  return await Supply.findAll({
    where: { status: "pending" },
    include: [
      {
        model: User,
        as: "supplier",
        attributes: ["id", "name", "email"],
      },
      {
        model: Item,
        as: "item",
        attributes: ["id", "name", "SKU"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const getApprovedSupplyRequests = async (Supply, User, Item) => {
  return await Supply.findAll({
    where: { status: "approved" },
    include: [
      {
        model: User,
        as: "supplier",
        attributes: ["id", "name", "email", ],
      },
      {
        model: User,
        as: "approvedByUser",
        attributes: ["id", "name", "email", ],
      },
      {
        model: Item,
        as: "item",
        attributes: ["id", "name", "SKU"],
      },
    ],
    order: [["updatedAt", "DESC"]], // Sort by most recently approved
  });
};

const getRejectedSupplyRequests = async (Supply, User, Item) => {
  return await Supply.findAll({
    where: { status: "rejected" },
    include: [
      {
        model: User,
        as: "supplier",
        attributes: ["id", "name", "email",],
      },
      {
        model: User,
        as: "rejectedByUser",
        attributes: ["id", "name", "email", ],
      },
      {
        model: Item,
        as: "item",
        attributes: ["id", "name", "SKU"],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
};

const getCancelledSupplyRequests = async (Supply, User, Item) => {
  return await Supply.findAll({
    where: { status: "cancelled" },
    include: [
      {
        model: User,
        as: "supplier",
        attributes: ["id", "name", "email"],
      },
      {
        model: Item,
        as: "item",
        attributes: ["id", "name", "SKU"],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
};

export default {
  requestSupply,
  approveSupply,
  rejectSupplyRequest,
  cancelSupplyRequest,
  updatePendingSupply,
  getUserSupplyRequests,
  getAllSupplyRequestsSorted,
  getPendingSupplyRequests,
  getApprovedSupplyRequests,
  getRejectedSupplyRequests,
  getCancelledSupplyRequests,
};
