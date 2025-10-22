"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendEmail(options) {
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
        if (error) {
            console.error("Resend error:", error);
            throw new Error(`Email could not be sent: ${error.message}`);
        }
        console.log("Email sent successfully via Resend!", data);
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}
//# sourceMappingURL=sendEmail.js.map