"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendEmail(options) {
    // 1. Tạo "transporter" (dịch vụ vận chuyển email)
    // Chúng ta dùng Gmail (SMTP)
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: false, // `secure: false` vì chúng ta dùng port 587 (TLS)
        auth: {
            user: process.env.EMAIL_USER, // Email Gmail của bạn
            pass: process.env.EMAIL_PASSWORD, // Mật khẩu ứng dụng 16 chữ số
        },
    });
    // 2. Định nghĩa nội dung email
    const mailOptions = {
        from: `"My Todo App" <${process.env.EMAIL_USER}>`, // Tên người gửi
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };
    // 3. Gửi email
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    }
    catch (error) {
        console.error("Error sending email:", error);
        // Ném lỗi ra ngoài để controller có thể bắt được
        throw new Error("Email could not be sent");
    }
}
//# sourceMappingURL=sendEmail.js.map