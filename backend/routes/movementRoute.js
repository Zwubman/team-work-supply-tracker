import express from "express";
import {
  createMovement,
  getOutboundMovements,
  getInboundMovements,
  getAllMovements,
} from "../controllers/movementController.js";
import {
  createMovementRules,
  movementIdParamRule,
} from "../middlewares/validators/authValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { protect, checkAdminRole } from "../middlewares/authMiddleware.js";

const movementRouter = express.Router();

movementRouter.post(
  "/create-outbound",
  protect,
  checkAdminRole,
  createMovementRules,
  validateRequest,
  createMovement
);
movementRouter.get("/all-outbound", protect, getOutboundMovements);
movementRouter.get("/all-inbound", protect, getInboundMovements);
movementRouter.get("/all-movements", protect, getAllMovements);

export default movementRouter;
