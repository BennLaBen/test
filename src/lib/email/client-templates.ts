import { EmailTemplate } from './templates'

const COMPANY_NAME = 'LLEDO Industries'
const SUPPORT_EMAIL = 'support@lledo-industries.com'

const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6; }
  .container { max-width: 600px; margin: 0 auto; }
  .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #0047FF 0%, #002d99 100%); border-radius: 12px 12px 0 0; }
  .content { background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; }
  .footer { background: #f9fafb; padding: 20px 30px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; }
  .btn { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #0047FF 0%, #002d99 100%); color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
  .alert { padding: 16px; border-radius: 8px; margin: 20px 0; }
  .alert-warning { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; }
  .alert-info { background: #dbeafe; border: 1px solid #3b82f6; color: #1e40af; }
  .otp-code { font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #0047FF; background: #f0f4ff; padding: 20px 30px; border-radius: 12px; display: inline-block; margin: 20px 0; border: 2px dashed #0047FF; }
  h1 { color: #111827; font-size: 24px; margin-bottom: 20px; }
  p { margin: 16px 0; }
`

// ============================================
// EMAIL DE CONFIRMATION D'INSCRIPTION
// ============================================

export function getEmailConfirmationTemplate(params: {
  firstName: string
  confirmUrl: string
  expiresIn: string
}): EmailTemplate {
  const { firstName, confirmUrl, expiresIn } = params

  return {
    subject: `Confirmez votre adresse email - ${COMPANY_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><style>${baseStyles}</style></head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="color: white; margin: 0;">✉️ ${COMPANY_NAME}</h2>
          </div>
          <div class="content">
            <h1>Confirmez votre adresse email</h1>
            <p>Bonjour ${firstName},</p>
            <p>Merci de vous être inscrit sur ${COMPANY_NAME}. Pour activer votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
            <div style="text-align: center;">
              <a href="${confirmUrl}" class="btn">Confirmer mon email</a>
            </div>
            <div class="alert alert-warning">
              ⏰ Ce lien expire dans <strong>${expiresIn}</strong>.
            </div>
            <p style="font-size: 14px; color: #6b7280;">
              Si vous n'avez pas créé de compte, ignorez simplement cet email.
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. Tous droits réservés.</p>
            <p>Questions ? Contactez <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${firstName},

Merci de vous être inscrit sur ${COMPANY_NAME}.

Confirmez votre adresse email en cliquant sur ce lien :
${confirmUrl}

Ce lien expire dans ${expiresIn}.

Si vous n'avez pas créé de compte, ignorez cet email.

---
${COMPANY_NAME}
    `.trim(),
  }
}

// ============================================
// OTP DE CONNEXION CLIENT
// ============================================

export function getClientLoginOTPTemplate(params: {
  firstName: string
  code: string
  expiresIn: string
}): EmailTemplate {
  const { firstName, code, expiresIn } = params

  return {
    subject: `Votre code de connexion - ${COMPANY_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><style>${baseStyles}</style></head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="color: white; margin: 0;">🔐 ${COMPANY_NAME}</h2>
          </div>
          <div class="content">
            <h1>Votre code de connexion</h1>
            <p>Bonjour ${firstName},</p>
            <p>Voici votre code de vérification pour vous connecter à votre compte :</p>
            <div style="text-align: center;">
              <div class="otp-code">${code}</div>
            </div>
            <div class="alert alert-warning">
              ⏰ Ce code expire dans <strong>${expiresIn}</strong>.
            </div>
            <div class="alert alert-info">
              🔒 Si vous n'avez pas tenté de vous connecter, quelqu'un essaie peut-être d'accéder à votre compte. Changez votre mot de passe immédiatement.
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. Tous droits réservés.</p>
            <p>Ne partagez jamais ce code avec qui que ce soit.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${firstName},

Votre code de connexion : ${code}

Ce code expire dans ${expiresIn}.

Si vous n'avez pas tenté de vous connecter, changez votre mot de passe immédiatement.

Ne partagez jamais ce code avec qui que ce soit.

---
${COMPANY_NAME}
    `.trim(),
  }
}

// ============================================
// RÉINITIALISATION DE MOT DE PASSE CLIENT
// ============================================

export function getClientPasswordResetTemplate(params: {
  firstName: string
  resetUrl: string
  expiresIn: string
}): EmailTemplate {
  const { firstName, resetUrl, expiresIn } = params

  return {
    subject: `Réinitialisation de votre mot de passe - ${COMPANY_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><style>${baseStyles}</style></head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="color: white; margin: 0;">🔑 ${COMPANY_NAME}</h2>
          </div>
          <div class="content">
            <h1>Réinitialisation de mot de passe</h1>
            <p>Bonjour ${firstName},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en créer un nouveau :</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="btn">Réinitialiser mon mot de passe</a>
            </div>
            <div class="alert alert-warning">
              ⏰ Ce lien expire dans <strong>${expiresIn}</strong>.
            </div>
            <p style="font-size: 14px; color: #6b7280;">
              Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe ne sera pas modifié.
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${firstName},

Vous avez demandé la réinitialisation de votre mot de passe.

Cliquez sur ce lien pour créer un nouveau mot de passe :
${resetUrl}

Ce lien expire dans ${expiresIn}.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

---
${COMPANY_NAME}
    `.trim(),
  }
}

// ============================================
// CONFIRMATION DE CHANGEMENT DE MOT DE PASSE
// ============================================

export function getClientPasswordChangedTemplate(params: {
  firstName: string
}): EmailTemplate {
  const { firstName } = params

  return {
    subject: `Votre mot de passe a été modifié - ${COMPANY_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><style>${baseStyles}</style></head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="color: white; margin: 0;">✅ ${COMPANY_NAME}</h2>
          </div>
          <div class="content">
            <h1>Mot de passe modifié</h1>
            <p>Bonjour ${firstName},</p>
            <p>Votre mot de passe a été modifié avec succès.</p>
            <div class="alert alert-warning">
              ⚠️ Si vous n'êtes pas à l'origine de ce changement, contactez immédiatement notre support à <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> et changez votre mot de passe.
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${firstName},

Votre mot de passe a été modifié avec succès.

Si vous n'êtes pas à l'origine de ce changement, contactez immédiatement ${SUPPORT_EMAIL}.

---
${COMPANY_NAME}
    `.trim(),
  }
}
