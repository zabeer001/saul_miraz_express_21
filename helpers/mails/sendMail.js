import nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL_USER } from '../../config/env.js';


// Create transporter once (reusable)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

/**
 * Sends an email using the pre-configured transporter.
 * @param {Object} options
 * @param {string} options.to - Recipient email.
 * @param {string} options.subject - Email subject.
 * @param {string} options.text - Plain text content.
 * @param {string} options.html - HTML content.
 * @returns {Promise<Object>} - Nodemailer info object.
 */
export const sendMail = async ({ to, subject, text, html }) => {
    const mailOptions = {
        from: `"Seoul Mirage" <${EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    };

    return await transporter.sendMail(mailOptions);
};
