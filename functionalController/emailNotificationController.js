import { sendMail } from "../helpers/mails/sendMail.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { EMAIL_USER } from "../config/env.js";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendSubscriberMail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Recipient email ('email') is required.",
            });
        }

        const templatePath = path.resolve(__dirname, "../resources/emailTemplates/commonMailTemplate.html");
        const htmlContent = await fs.readFile(templatePath, "utf-8");

        const info = await sendMail({
            to: email,
            subject: "Subscription done",
            text: "Thanks for subscribing to Seoul Mirage!",
            html: htmlContent,
        });
        const infoToCompany = await sendMail({
            to: EMAIL_USER,
            subject: "Subscription done",
            text: "Thanks for subscribing to Seoul Mirage!",
            html: htmlContent,
        });

        return res.json({
            success: true,
            message: `Email sent successfully to ${email}!`,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send email",
            error: error.message,
        });
    }
};

export const conatctMail = async (name, email, how_can_we_help) => {
    try {
        if (!email || !name || !how_can_we_help) {
            throw new Error("Name, email, and message ('how_can_we_help') are required.");
        }

        await sendMail({
            to: email,
            subject: "Thanks for contacting Seoul Mirage!",
            text: `Hi ${name},\n\nWe have received your message: "${how_can_we_help}"\n\nWe will get back to you soon!`,
            html: `<p>We will contact you soon.</p>`,
        });

        await sendMail({
            to: EMAIL_USER,
            subject: `New Contact Form Submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${how_can_we_help}`,
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${how_can_we_help}</p>
            `,
        });

        return {
            success: true,
            message: `Contact email sent successfully to ${email} and company.`,
        };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            success: false,
            message: "Failed to send email",
            error: error.message,
        };
    }
};


export const registerMail = async (email) => {
  try {
    if (!email) {
      throw new Error("Recipient email ('email') is required.");
    }

    const templatePath = path.resolve(__dirname, "../resources/emailTemplates/registerTemplate.html");
    const htmlContent = await fs.readFile(templatePath, "utf-8");

    const info = await sendMail({
      to: email,
      subject: "Registration Done",
      text: "Thanks for registering to Seoul Mirage!",
      html: htmlContent,
    });

    return {
      success: true,
      message: `Email sent successfully to ${email}!`,
      info,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
};
