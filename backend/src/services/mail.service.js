const nodemailer = require('nodemailer');

/**
 * Cria o transporter do Nodemailer a partir das variáveis de ambiente SMTP.
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED === 'false' ? false : true
    }
  });
}

/**
 * Envia e-mail com o link de recuperação de senha.
 * @param {Object} params
 * @param {string} params.to - E-mail do destinatário
 * @param {string} params.name - Nome do usuário
 * @param {string} params.resetLink - URL completa com token para redefinir senha
 */
async function sendPasswordResetEmail({ to, name, resetLink }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@innovaaisolutions.com.br';
  const transporter = createTransporter();

  if (!transporter) {
    console.warn('⚠️ [SMTP Não Configurado] Configure as variáveis SMTP no arquivo backend/.env para enviar e-mails reais.');
    console.log(`🔗 [LINK DE RECUPERAÇÃO GERADO]: ${resetLink}`);
    return { success: false, reason: 'SMTP_NOT_CONFIGURED', resetLink };
  }

  const displayName = name ? name.split(' ')[0] : 'Usuário';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0a0b0d; color: #e5e7eb; margin: 0; padding: 0; }
        .container { max-width: 540px; margin: 30px auto; background-color: #12151a; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { background: linear-gradient(135deg, #0a0b0d 0%, #161b22 100%); padding: 30px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 1px; }
        .header span { color: #00f5ff; }
        .content { padding: 35px 30px; line-height: 1.6; color: #d1d5db; }
        .content p { margin-bottom: 20px; font-size: 15px; }
        .button-wrapper { text-align: center; margin: 35px 0; }
        .btn { display: inline-block; background-color: #00f5ff; color: #0a0b0d !important; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 245, 255, 0.3); }
        .alt-link { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 12px; font-size: 12px; color: #9ca3af; word-break: break-all; margin-top: 20px; }
        .footer { background-color: #0c0e12; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid rgba(255,255,255,0.05); }
        .warning { font-size: 13px; color: #9ca3af; border-left: 3px solid #00f5ff; padding-left: 12px; margin: 25px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>INNOVA <span>AI</span> SOLUTIONS</h1>
        </div>
        <div class="content">
          <p>Olá, <strong>${displayName}</strong>,</p>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta no CRM.</p>
          <p>Clique no botão abaixo para escolher uma nova senha:</p>
          
          <div class="button-wrapper">
            <a href="${resetLink}" class="btn" target="_blank">Redefinir Minha Senha</a>
          </div>

          <div class="warning">
            Este link é válido por <strong>1 hora</strong>. Se você não solicitou a redefinição de senha, nenhuma ação é necessária e você pode desconsiderar este e-mail com segurança.
          </div>

          <p style="font-size: 13px; color: #9ca3af; margin-bottom: 5px;">Se o botão não funcionar, copie e cole o endereço abaixo no seu navegador:</p>
          <div class="alt-link">${resetLink}</div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Innova AI Solutions. Todos os direitos reservados.
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Olá, ${displayName}!\n\nRecebemos uma solicitação para redefinir a senha da sua conta no CRM.\n\nPara prosseguir, acesse o link a seguir (válido por 1 hora):\n${resetLink}\n\nSe você não solicitou a redefinição, apenas desconsidere esta mensagem.\n\nAtenciosamente,\nInnova AI Solutions`;

  const mailOptions = {
    from,
    to,
    subject: 'Recuperação de Senha - Innova AI Solutions',
    text,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✉️ [E-mail de Recuperação Enviado] ID: ${info.messageId} para ${to}`);
  return { success: true, messageId: info.messageId };
}

module.exports = {
  createTransporter,
  sendPasswordResetEmail
};
