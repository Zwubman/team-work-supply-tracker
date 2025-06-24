import { sendLowStockAlertEmail } from "../utils/emailAlert.js";
import db from "../models/index.js";
const { Movement, Item, User } = db;
import { Op, Sequelize } from "sequelize";

const createOutboundMovement = async (
  Movement,
  Item,
  movementData,
  userId
) => {
  const { itemId, quantity } = movementData;

  const item = await Item.findByPk(itemId);
  if (!item) throw new Error("Item not found");

  if (item.quantity === 0 || item.quantity < quantity) {
    throw new Error("Insufficient stock for outbound movement");
  }

  // Update stock
  item.quantity -= quantity;
  await item.save();

  // Create movement record
  const movement = await Movement.create({
    movementType: "outbound",
    quantity,
    itemId,
    movedBy: userId,
  });

  //Find all low-stock items
  // const lowStockItems = await Item.findAll({
  //   where: {
  //     quantity: { [Op.lte]: Sequelize.col("threshold") },
  //   },
  // });

  // if(!lowStockItems || lowStockItems.length === 0) {
  //   return { movement, emailAlertSent: false };
  // }
  
  const adminUsers = await User.findAll({
    where: { role: "Admin" }, 
    attributes: ["email"],
  });


  const adminEmails = adminUsers.map((admin) => admin.email);

  let emailAlertSent = false;
  if (item.quantity <= item.threshold && adminEmails.length > 0) {
    for (const email of adminEmails) {
      await sendLowStockAlertEmail(email, [item]);
    }
    emailAlertSent = true;
  }

  return {
    movement,
    emailAlertSent,
  };
};

const getAllOutboundMovements = async (Movement, Item, User) => {
  return await Movement.findAll({
    where: { movementType: "outbound" },
    include: [
      {
        model: Item,
        as: "item",
        attributes: ["id", "name", "SKU"],
      },
      {
        model: User,
        as: "movedByUser",
        attributes: ["id", "name", "email"],
      },
    ],
    attributes: ["id", "quantity", "createdAt"],
    order: [["createdAt", "DESC"]],
  });
};

const getAllInboundMovements = async (Movement, Item, User) => {
  return await Movement.findAll({
    where: { movementType: "inbound" },
    include: [
      {
        model: Item,
        as: "item",
        attributes: ["id", "name", "SKU"],
      },
      {
        model: User,
        as: "movedByUser",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const getAllMovements = async (Movement, Item, User) => {
  return await Movement.findAll({
    include: [
      {
        model: Item,
        as: "item",
        attributes: ["id", "name", "SKU"],
      },
      {
        model: User,
        as: "movedByUser",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};



export default {
  createOutboundMovement,
  getAllOutboundMovements,
  getAllInboundMovements,
  getAllMovements,
};