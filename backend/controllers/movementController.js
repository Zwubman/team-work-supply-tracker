import db from "../models/index.js";
import { formatTimestamp } from "../utils/timeFormat.js";
import movementService from "../services/movementService.js";
const { Movement, Item, User } = db;

export const createMovement = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    const result = await movementService.createOutboundMovement(
      Movement,
      Item,
      { itemId, quantity },
      req.user.id,
      req.user.email 
    );

    res.status(201).json(result);
  } catch (error) {
    console.error("Create Movement Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getOutboundMovements = async (req, res) => {
  try {
    const rawData = await movementService.getAllOutboundMovements(
      Movement,
      Item,
      User
    );

    const data = rawData.map((m) => ({
      id: m.id,
      itemName: m.item?.name,
      sku: m.item?.SKU,
      quantity: m.quantity,
      movedBy: m.user?.name,
      movedAt: formatTimestamp(m.createdAt),
      type: m.movementType,
    }));

    res.status(200).json({
      message: "Outbound movements retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Fetch Outbound Movements Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getInboundMovements = async (req, res) => {
  try {
    const raw = await movementService.getAllInboundMovements(
      Movement,
      Item,
      User
    );

    const data = raw.map((m) => ({
      id: m.id,
      item: m.item?.name,
      sku: m.item?.SKU,
      quantity: m.quantity,
      movedBy: m.user?.name,
      movedAt: formatTimestamp(m.createdAt),
      type: m.movementType,
    }));

    res.status(200).json({ message: "Inbound movements retrieved", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMovements = async (req, res) => {
  try {
    const rawData = await movementService.getAllMovements(Movement, Item, User);

    const data = rawData.map((m) => ({
      id: m.id,
      itemName: m.item?.name,
      sku: m.item?.SKU,
      quantity: m.quantity,
      movementType: m.movementType,
      movedBy: m.movedByUser?.email,
      movedAt: formatTimestamp(m.createdAt),
      type: m.movementType,
    }));

    res.status(200).json({
      message: "All item movements retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Fetch All Movements Error:", error);
    res.status(500).json({ message: error.message });
  }
};
