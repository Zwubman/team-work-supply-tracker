import express from "express";
import { signUp, signIn } from "../controllers/userController.js";
import {
  signUpUserRules,
  userIdParamRule,
} from "../middlewares/validators/authValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const userRouter = express.Router();

userRouter.post(
  "/sign-up",
  signUpUserRules,
  validateRequest,
  userIdParamRule,
  signUp
);
userRouter.post("/sign-in", signIn);

export default userRouter;
