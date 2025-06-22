import cron from "node-cron";
import db from "../models/index.js";
import { sendLowStockAlertEmail } from "./emailAlert.js";

const { Item, User } = db;

// This runs every 1 hour at the top of the hour
cron.schedule("0 * * * *", async () => {
  try {
    console.log("[Cron] Running low stock check...");

    const lowStockItems = await Item.findAll({
      where: {
        quantity: {
          [db.Sequelize.Op.lte]: db.Sequelize.col("threshold"),
        },
      },
    });

    if (lowStockItems.length === 0) {
      console.log("[Cron] No low stock items at this time.");
      return;
    }

    // choose who should receive alerts (e.g. all admins or system email)
    const admins = await User.findAll({
      where: { role: "Admin" },
      attributes: ["email"],
    });

    const emails = admins.map((admin) => admin.email);

    if (lowStockItems.length > 0 && emails.length > 0) {
      for (const email of emails) {
        await sendLowStockAlertEmail(email, lowStockItems);
      }
    }
  

    console.log(
      `[Cron] Low stock alerts sent for ${lowStockItems.length} item(s).`
    );
  } catch (error) {
    console.error("[Cron] Low stock check failed:", error);
  }
});
