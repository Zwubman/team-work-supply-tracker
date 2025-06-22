import db from "../models/index.js";
import supplyService from "../services/supplyService.js";
import { formatTimestamp } from "../utils/timeFormat.js";
const { Supply, Item, Movement, User } = db;


export const addNewSupplyRequest = async (req, res) => {
  const { quantity, itemId, description } = req.body;


  try {
    const newRequest = await supplyService.requestSupply(
      Supply,
      {
        quantity,
        itemId,
        description,
      },
      req.user.id
    );

    // Fetch request with associated requester (supplier) name
    const populatedRequest = await Supply.findByPk(newRequest.id, {
      include: {
        model: User,
        as: "supplier",
        attributes: ["id", "name", "email"], 
      },
    });

    res.status(201).json({
      message: "Supply request submitted. Awaiting admin approval.",
      data: populatedRequest,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const approveSupplyRequest = async (req, res) => {
  const { supplyId } = req.params;

  try {
    const result = await supplyService.approveSupply(
      Supply,
      Item,
      Movement,
      supplyId,
      req.user.id
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const rejectSupplyRequest = async (req, res) => {
  const { supplyId } = req.params;

  try {
    const result = await supplyService.rejectSupplyRequest(
      Supply,
      supplyId,
      req.user.id // assuming admin ID from auth middleware
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Reject Supply Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const cancelSupply = async (req, res) => {
  const { supplyId } = req.params;

  try {
    const result = await supplyService.cancelSupplyRequest(
      Supply,
      supplyId,
      req.user.id
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Cancel Supply Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const updateSupplyRequest = async (req, res) => {
  const { supplyId } = req.params;
  const updates = req.body;

  try {
    const updatedSupply = await supplyService.updatePendingSupply(
      Supply,
      supplyId,
      req.user.id,
      updates
    );

    res.status(200).json({
      message: "Supply request updated successfully",
      data: updatedSupply,
    });
  } catch (error) {
    console.error("Update Supply Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getMySupplyRequests = async (req, res) => {
  try {
    const userId = req.user.id; 
    const requests = await supplyService.getUserSupplyRequests(Supply, userId);

    res.status(200).json({
      message: "Fetched your supply requests successfully",
      data: requests,
    });
  } catch (error) {
    console.error("Fetch Supply Requests Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllSupplies = async (req, res) => {
  try {
    const allSupplies = await supplyService.getAllSupplyRequestsSorted(
      Supply,
      User,
      Item
    );
    res.status(200).json({
      message: "All supply requests retrieved (pending first)",
      data: allSupplies,
    });
  } catch (error) {
    console.error("Get All Supplies Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getPendingSupplyRequests = async (req, res) => {
  try {
    const pending = await supplyService.getPendingSupplyRequests(
      Supply,
      User,
      Item
    );

    const data = pending.map((supply) => ({
      id: supply.id,
      itemName: supply.item?.name,
      sku: supply.item?.SKU,
      quantity: supply.quantity,
      description: supply.description,
      supplier: supply.supplier?.email,
      requestedAt: formatTimestamp(supply.createdAt),
    }));

    res.status(200).json({
      message: "Pending supply requests retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Fetch Pending Supplies Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getApprovedSupplyRequests = async (req, res) => {
  try {
    const approved = await supplyService.getApprovedSupplyRequests(
      Supply,
      User,
      Item
    );

    const data = approved.map((supply) => ({
      id: supply.id,
      itemName: supply.item?.name,
      sku: supply.item?.SKU,
      quantity: supply.quantity,
      description: supply.description,
      supplier: supply.supplier?.email,
      approvedBy: supply.approvedByUser?.email,
      approvedAt: formatTimestamp(supply.updatedAt),
    }));

    res.status(200).json({
      message: "Approved supply requests retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Fetch Approved Supplies Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getRejectedSupplyRequests = async (req, res) => {
  try {
    const rejected = await supplyService.getRejectedSupplyRequests(
      Supply,
      User,
      Item
    );

    const data = rejected.map((supply) => ({
      id: supply.id,
      itemName: supply.item?.name,
      sku: supply.item?.SKU,
      quantity: supply.quantity,
      description: supply.description,
      supplier: supply.supplier?.email,
      rejectedBy: supply.rejectedByUser?.email,
      rejectedAt: formatTimestamp(supply.updatedAt),
    }));

    res.status(200).json({
      message: "Rejected supply requests retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Fetch Rejected Supplies Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCancelledSupplyRequests = async (req, res) => {
  try {
    const cancelled = await supplyService.getCancelledSupplyRequests(
      Supply,
      User,
      Item
    );

    const data = cancelled.map((supply) => ({
      id: supply.id,
      itemName: supply.item?.name,
      sku: supply.item?.SKU,
      quantity: supply.quantity,
      description: supply.description,
      supplier: supply.supplier?.email,
      cancelledAt: formatTimestamp(supply.updatedAt),
    }));

    res.status(200).json({
      message: "Cancelled supply requests retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Fetch Cancelled Supplies Error:", error);
    res.status(500).json({ message: error.message });
  }
};
