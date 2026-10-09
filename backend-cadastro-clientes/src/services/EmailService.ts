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
  const from = process.env.EMAIL_FROM;
  const info = await transporter.sendMail({
    from,
    to: destinatario,
    subject: "Código de recuperação",
    text: `Olá!\n\nRecebemos uma solicitação para recuperar o acesso à sua conta.\n\nSeu código de recuperação é: ${codigo}\n\nDigite esse código na tela de recuperação para continuar. Por segurança, não compartilhe este código com ninguém. Se você não solicitou a recuperação, ignore este e-mail.\n\nAtenciosamente,\nEquipe de atendimento`,
    html: `<!DOCTYPE html>
<html lang="pt-BR">
  <body style="margin:0;padding:24px;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#202124;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
      <h1 style="margin:0 0 16px;font-size:24px;color:#1f2937;">Recuperação de conta</h1>
      <p style="margin:0 0 16px;line-height:1.6;">Olá! Recebemos uma solicitação para recuperar o acesso à sua conta.</p>
      <p style="margin:0 0 8px;line-height:1.6;">Use o código abaixo para continuar:</p>
      <div style="margin:0 0 20px;padding:16px;text-align:center;background:#f3f4f6;border-radius:8px;font-size:28px;font-weight:bold;letter-spacing:6px;color:#111827;">${codigo}</div>
      <p style="margin:0 0 12px;line-height:1.6;">Por segurança, não compartilhe este código com ninguém.</p>
      <p style="margin:0;line-height:1.6;color:#5f6368;">Se você não solicitou a recuperação, ignore este e-mail.</p>
      <p style="margin:24px 0 0;line-height:1.6;">Atenciosamente,<br />Equipe de atendimento</p>
    </div>
  </body>
</html>`
  });
  return info;
}
