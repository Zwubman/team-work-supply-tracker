import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendLowStockAlertEmail = async (adminEmail, lowStockItems) => {
  try {
    if (lowStockItems.length === 0) return; // No need to send if nothing is low

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsHtml = lowStockItems
      .map(
        (item) => `
        <li>
          <strong>Item:</strong> ${item.name}<br/>
          <strong>Current Quantity:</strong> ${item.quantity}<br/>
          <strong>Threshold:</strong> ${item.threshold}
        </li>`
      )
      .join("");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: "⚠️ Low Stock Alert: Multiple Items",
      html: `
        <h2>Stock Threshold Reached</h2>
        <p>Dear Admin,</p>
        <p>The following items have reached or fallen below their minimum stock threshold:</p>
        <ul>${itemsHtml}</ul>
        <p>Please consider restocking as needed.</p>
        <p>Best regards,<br/>Inventory Alert System</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Low stock summary email sent to ${adminEmail}`);
  } catch (error) {
    console.error("Error sending low stock alert:", error);
  }
};

export const sendRequestApprovalEmail = async (
  recipientEmail,
  itemName,
  quantity
) => {
  try {
    if (!itemName || !quantity) return;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: "Request Approved!",
      html: `
        <h2>Congratulations!</h2>
        <p>Dear User,</p>
        <p>Your request has been approved for the following item:</p>
        <ul>
          <li><strong>Item:</strong> ${itemName}</li>
          <li><strong>Approved Quantity:</strong> ${quantity}</li>
        </ul>
        <p>Thank you for using our inventory system.</p>
        <p>Best regards,<br/>Inventory Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};
