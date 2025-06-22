// controllers/itemController.js
import itemService from "../services/itemService.js";
import db from "../models/index.js";

const { Item } = db;

export const createItem = async (req, res) => {
  try {
    const pictureUrl = req.file?.path; 
    const item = await itemService.createItem(Item, { ...req.body, pictureUrl });

    res.status(201).json({
      message: 'Item created successfully',
      data: item,
    });
  } catch (error) {
    console.error('Create Item Error:', error);
    res.status(400).json({ message: error.message || 'Failed to create item' });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await itemService.getAllItems(Item);
    res.status(200).json({ items });
  } catch (error) {
    console.error("Get All Items Error:", error);
    res.status(500).json({ message: "Failed to retrieve items" });
  }
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedItem = await itemService.updateItemById(Item, id, updates);
    res.status(200).json({
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Update Item Error:", error);
    res.status(400).json({ message: error.message || "Failed to update item" });
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await itemService.deleteItemById(Item, id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Delete Item Error:", error);
    res.status(400).json({ message: error.message || "Failed to delete item" });
  }
};
