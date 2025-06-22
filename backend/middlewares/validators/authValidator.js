import { body, param } from "express-validator";
import { check } from 'express-validator';


// supply validator
export const validateNewSupplyRequest = [
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("itemId")
    .isInt({ min: 1 })
    .withMessage("Valid itemId is required"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

export const validateUpdateSupplyRequest = [
  param("supplyId")
    .isInt()
    .withMessage("Valid supplyId is required"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

export const validateSupplyIdParam = [
  param("supplyId")
    .isInt()
    .withMessage("Valid supplyId is required"),
];

// user validator
export const signUpUserRules = [
  body("name")
    .isString()
    .withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["User", "Admin", "Supplier"])
    .withMessage('Role must be either "User", "Admin" or "Supplier"'),
];

export const userIdParamRule = [
  param("userId")
    .isInt()
      .withMessage("User ID must be a valid integer"),
];

// item validator
export const createItemRules = [
  check('name')
    .notEmpty()
    .withMessage('Item name is required')
    .isString()
    .withMessage('Name must be a valid string'),

  check('SKU')
    .notEmpty()
    .withMessage('SKU is required')
    .isString()
    .withMessage('SKU must be a valid string'),

  check('threshold')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Threshold must be a positive integer'),
];


export const updateItemRules = [
  check('name')
    .optional()
    .isString()
    .withMessage('Name must be a valid string'),

  check('threshold')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Threshold must be a positive integer'),

  check('pictureUrl')
    .optional()
    .isURL()
    .withMessage('Picture URL must be a valid URL'),
];



export const skuBodyRule = [
  body('SKU')
    .isString()
    .withMessage('SKU must be a valid string')
    .isLength({ min: 6 })
    .withMessage('SKU cannot be empty'),
];


export const idParamRule = [
  param('id')
    .exists({ checkFalsy: true })
    .withMessage('ID is required')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
];



//movement validator
export const createMovementRules =  [
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("movementType")
    .isIn(["inbound", "outbound"])
    .withMessage('Movement type must be "inbound" or "outbound"'),
  body("itemId")
    .isInt()
    .withMessage("Valid itemId is required"),
];

export const movementIdParamRule =  [
  param("movementId")
    .isInt()
    .withMessage("Movement ID must be a valid integer"),
];
