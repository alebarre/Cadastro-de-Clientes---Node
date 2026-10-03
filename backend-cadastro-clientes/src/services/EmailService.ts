/**
 * EmailService.ts
 * Serviço responsável pelo envio de e-mails (códigos de recuperação, confirmações, etc).
 */
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * enviarEmailCodigo
 * Envia um e-mail com um código de recuperação para o destinatário.
 */
export async function enviarEmailCodigo(destinatario: string, codigo: string) {
  const from = process.env.EMAIL_FROM || "no-reply@example.com";
  const info = await transporter.sendMail({
    from,
    to: destinatario,
    subject: "Código de recuperação",
    text: `Seu código de recuperação é: ${codigo}`
  });
  return info;
}
