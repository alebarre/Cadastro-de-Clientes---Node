"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarEmailCodigo = enviarEmailCodigo;
/**
 * EmailService.ts
 * Serviço responsável pelo envio de e-mails (códigos de recuperação, confirmações, etc).
 */
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
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
async function enviarEmailCodigo(destinatario, codigo) {
    const from = process.env.EMAIL_FROM || "no-reply@example.com";
    const info = await transporter.sendMail({
        from,
        to: destinatario,
        subject: "Código de recuperação",
        text: `Seu código de recuperação é: ${codigo}`
    });
    return info;
}
