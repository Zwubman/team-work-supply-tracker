import express from "express";
import {
  addNewSupplyRequest,
  approveSupplyRequest,
  cancelSupply,
  updateSupplyRequest,
  getMySupplyRequests,
  getAllSupplies,
  rejectSupplyRequest,
  getPendingSupplyRequests,
  getApprovedSupplyRequests,
  getRejectedSupplyRequests,
  getCancelledSupplyRequests,
} from "../controllers/supplyController.js";
import {
  validateNewSupplyRequest,
  validateUpdateSupplyRequest,
  validateSupplyIdParam,
} from "../middlewares/validators/authValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  protect,
  checkAdminRole,
  checkSupplierRole,
} from "../middlewares/authMiddleware.js";

const supplyRouter = express.Router();

supplyRouter.post(
  "/request",
  protect,
  checkSupplierRole,
  validateNewSupplyRequest,
  validateRequest,
  addNewSupplyRequest
);
supplyRouter.patch(
  "/approve/:supplyId",
  protect,
  checkAdminRole,
  validateSupplyIdParam,
  validateRequest,
  approveSupplyRequest
);
supplyRouter.patch(
  "/reject/:supplyId",
  protect,
  checkAdminRole,
  validateSupplyIdParam,
  validateRequest,
  rejectSupplyRequest
);
supplyRouter.put("/cancel/:supplyId", protect, checkSupplierRole, cancelSupply);
supplyRouter.patch(
  "/update/:supplyId",
  protect,
  checkSupplierRole,
  validateUpdateSupplyRequest,
  validateRequest,
  updateSupplyRequest
);
supplyRouter.get(
  "/my-requests",
  protect,
  checkSupplierRole,
  getMySupplyRequests
);
supplyRouter.get("/all-supplies", protect, checkAdminRole, getAllSupplies);
supplyRouter.get(
  "/pending-requests",
  protect,
  checkAdminRole,
  getPendingSupplyRequests
);
supplyRouter.get(
  "/approved-requests",
  protect,
  checkAdminRole,
  getApprovedSupplyRequests
);
supplyRouter.get(
  "/rejected-requests",
  protect,
  checkAdminRole,
  getRejectedSupplyRequests
);
supplyRouter.get(
  "/cancelled-requests",
  protect,
  checkAdminRole,
  getCancelledSupplyRequests
);

export default supplyRouter;
