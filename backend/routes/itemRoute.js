import express from "express";
import {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";
import {
  createItemRules,
  idParamRule,
  updateItemRules,
} from "../middlewares/validators/authValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { protect, checkAdminRole } from "../middlewares/authMiddleware.js";
import { uploadItemPicture } from "../middlewares/uploadImage.js";

const itemRouter = express.Router();

itemRouter.post(
  "/add-item",
  protect,
  checkAdminRole,
  uploadItemPicture,
  createItemRules,
  validateRequest,
  createItem
);
itemRouter.get("/all-items", protect, getAllItems);
itemRouter.put(
  "/update-item/:id",
  protect,
  checkAdminRole,
  uploadItemPicture,
  updateItemRules,
  idParamRule,
  validateRequest,
  updateItem
);
itemRouter.delete(
  "/delete-item/:id",
  protect,
  checkAdminRole,
  idParamRule,
  validateRequest,
  deleteItem
);

export default itemRouter;
