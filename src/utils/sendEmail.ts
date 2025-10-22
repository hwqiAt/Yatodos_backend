import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail(options: EmailOptions) {
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
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
