// Email Templates for Admin Authentication
// Compatible with Nodemailer, SendGrid, Resend, etc.

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

const COMPANY_NAME = 'LLEDO Industries'
const SUPPORT_EMAIL = 'security@lledo-industries.com'
const LOGO_URL = 'https://lledo-industries.com/logo.png'

const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #0047FF 0%, #002d99 100%); border-radius: 12px 12px 0 0; }
  .header img { max-width: 150px; }
  .content { background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; }
  .footer { background: #f9fafb; padding: 20px 30px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; }
  .btn { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #0047FF 0%, #002d99 100%); color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
  .btn:hover { background: linear-gradient(135deg, #003acc 0%, #002280 100%); }
  .alert { padding: 16px; border-radius: 8px; margin: 20px 0; }
  .alert-warning { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; }
  .alert-info { background: #dbeafe; border: 1px solid #3b82f6; color: #1e40af; }
  .info-box { background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0; }
  .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
  .info-label { font-weight: 600; width: 120px; color: #6b7280; }
  h1 { color: #111827; font-size: 24px; margin-bottom: 20px; }
  p { margin: 16px 0; }
`

// ============================================
// ACCOUNT ACTIVATION EMAIL
// ============================================

export function getActivationEmail(params: {
  firstName: string
  company: string
  activationUrl: string
  expiresIn: string
}): EmailTemplate {
  const { firstName, company, activationUrl, expiresIn } = params

  return {
    subject: `Activez votre compte administrateur ${COMPANY_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><style>${baseStyles}</style></head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="color: white; margin: 0;">🔐 ${COMPANY_NAME}</h2>
          </div>
          <div class="content">
            <h1>Bienvenue ${firstName} !</h1>
            <p>Votre compte administrateur a été créé pour la société <strong>${company}</strong>.</p>
            <p>Cliquez sur le bouton ci-dessous pour définir votre mot de passe et activer votre compte :</p>
            <div style="text-align: center;">
              <a href="${activationUrl}" class="btn">Activer mon compte</a>
            </div>
            <div class="alert alert-warning">
              ⏰ Ce lien expire dans <strong>${expiresIn}</strong>.
            </div>
            <p style="font-size: 14px; color: #6b7280;">
              Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${COMPANY_NAME}. Tous droits réservés.</p>
            <p>Questions ? Contactez <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bienvenue ${firstName} !

Votre compte administrateur a été créé pour la société ${company}.

Cliquez sur le lien ci-dessous pour définir votre mot de passe et activer votre compte :
${activationUrl}

Ce lien expire dans ${expiresIn}.

Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

---
${COMPANY_NAME}
    `.trim(),
  }
}

// ============================================
// NEW LOGIN NOTIFICATION EMAIL
// ============================================

export function getNewLoginEmail(params: {
  firstName: string
  datetime: string
  city: string
  country: string
  device: string
  browser: string
  ip: string
  viewSessionsUrl: string
}): EmailTemplate {
  const { firstName, datetime, city, country, device, browser, ip, viewSessionsUrl } = params

  return {
    subject: `Nouvelle connexion à votre compte ${COMPANY_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><style>${baseStyles}</style></head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="color: white; margin: 0;">🔐 ${COMPANY_NAME}</h2>
          </div>
          <div class="content">
            <h1>Nouvelle connexion détectée</h1>
            <p>Bonjour ${firstName},</p>
            <p>Une connexion a été détectée sur votre compte administrateur :</p>
            <div class="info-box">
              <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="display: inline-block; width: 24px;">📅</span>
                <strong>Date :</strong> ${datetime}
              </div>
              <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="display: inline-block; width: 24px;">🌍</span>
                <strong>Localisation :</strong> ${city}, ${country}
              </div>
              <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="display: inline-block; width: 24px;">💻</span>
                <strong>Appareil :</strong> ${device}
              </div>
              <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="display: inline-block; width: 24px;">🌐</span>
                <strong>Navigateur :</strong> ${browser}
              </div>
              <div style="padding: 8px 0;">
                <span style="display: inline-block; width: 24px;">🔢</span>
                <strong>IP :</strong> ${ip}
              </div>
            </div>
            <p>Si c'est vous, vous pouvez ignorer cet email.</p>
            <div class="alert alert-warning">
              ⚠️ <strong>Sinon, sécurisez immédiatement votre compte :</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Changez votre mot de passe</li>
                <li>Vérifiez vos sessions actives</li>
                <li>Contactez le support : ${SUPPORT_EMAIL}</li>
              </ul>
            </div>
            <div style="text-align: center;">
              <a href="${viewSessionsUrl}" class="btn">Voir mes sessions actives</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${COMPANY_NAME}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${firstName},

Une connexion a été détectée sur votre compte administrateur :

📅 Date : ${datetime}
🌍 Localisation : ${city}, ${country}
💻 Appareil : ${device}
🌐 Navigateur : ${browser}
🔢 IP : ${ip}

Si c'est vous, vous pouvez ignorer cet email.

Sinon, sécurisez immédiatement votre compte :
- Changez votre mot de passe
- Vérifiez vos sessions actives
- Contactez le support : ${SUPPORT_EMAIL}

Voir mes sessions : ${viewSessionsUrl}

---
${COMPANY_NAME}
    `.trim(),
  }
}

// ============================================
// FAILED LOGIN ATTEMPTS EMAIL
// ============================================

export function getFailedLoginEmail(params: {
  firstName: string
  attempts: number
  ip: string
  location: string
  resetPasswordUrl: string
}): EmailTemplate {
  const { firstName, attempts, ip, location, resetPasswordUrl } = params

  return {
    subject: `⚠️ Tentatives de connexion suspectes - ${COMPANY_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><style>${baseStyles}</style></head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);">
            <h2 style="color: white; margin: 0;">⚠️ Alerte Sécurité</h2>
          </div>
          <div class="content">
            <h1>Tentatives de connexion suspectes</h1>
            <p>Bonjour ${firstName},</p>
            <p>Nous avons détecté <strong>${attempts} tentatives de connexion échouées</strong> sur votre compte dans les 15 dernières minutes.</p>
            <div class="info-box">
              <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="display: inline-block; width: 24px;">🔢</span>
                <strong>IP :</strong> ${ip}
              </div>
              <div style="padding: 8px 0;">
                <span style="display: inline-block; width: 24px;">🌍</span>
                <strong>Localisation :</strong> ${location}
              </div>
            </div>
            <div class="alert alert-warning">
              🔒 Votre compte est temporairement bloqué pour <strong>30 minutes</strong> par mesure de sécurité.
            </div>
            <p>Si ce n'est pas vous, changez immédiatement votre mot de passe :</p>
            <div style="text-align: center;">
              <a href="${resetPasswordUrl}" class="btn" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);">Réinitialiser mon mot de passe</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${COMPANY_NAME}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${firstName},

Nous avons détecté ${attempts} tentatives de connexion échouées sur votre compte dans les 15 dernières minutes.

🔢 IP : ${ip}
🌍 Localisation : ${location}

Votre compte est temporairement bloqué pour 30 minutes par mesure de sécurité.

Si ce n'est pas vous, changez immédiatement votre mot de passe :
${resetPasswordUrl}

---
${COMPANY_NAME}
    `.trim(),
  }
}

// ============================================
// PASSWORD RESET EMAIL
// ============================================

export function getPasswordResetEmail(params: {
  firstName: string
  resetUrl: string
  expiresIn: string
}): EmailTemplate {
  const { firstName, resetUrl, expiresIn } = params

  return {
    subject: `Réinitialisation de mot de passe - ${COMPANY_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><style>${baseStyles}</style></head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="color: white; margin: 0;">🔐 ${COMPANY_NAME}</h2>
          </div>
          <div class="content">
            <h1>Réinitialisation de mot de passe</h1>
            <p>Bonjour ${firstName},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
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
            <p>© ${new Date().getFullYear()} ${COMPANY_NAME}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${firstName},

Vous avez demandé la réinitialisation de votre mot de passe.

Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :
${resetUrl}

Ce lien expire dans ${expiresIn}.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

---
${COMPANY_NAME}
    `.trim(),
  }
}

// ============================================
// PASSWORD CHANGED CONFIRMATION EMAIL
// ============================================

export function getPasswordChangedEmail(params: {
  firstName: string
  datetime: string
  ip: string
  location: string
}): EmailTemplate {
  const { firstName, datetime, ip, location } = params

  return {
    subject: `Votre mot de passe a été modifié - ${COMPANY_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><style>${baseStyles}</style></head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="color: white; margin: 0;">🔐 ${COMPANY_NAME}</h2>
          </div>
          <div class="content">
            <h1>Mot de passe modifié</h1>
            <p>Bonjour ${firstName},</p>
            <p>Le mot de passe de votre compte administrateur a été modifié avec succès.</p>
            <div class="info-box">
              <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="display: inline-block; width: 24px;">📅</span>
                <strong>Date :</strong> ${datetime}
              </div>
              <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="display: inline-block; width: 24px;">🔢</span>
                <strong>IP :</strong> ${ip}
              </div>
              <div style="padding: 8px 0;">
                <span style="display: inline-block; width: 24px;">🌍</span>
                <strong>Localisation :</strong> ${location}
              </div>
            </div>
            <div class="alert alert-info">
              ℹ️ Toutes vos autres sessions ont été déconnectées par mesure de sécurité.
            </div>
            <p style="font-size: 14px; color: #6b7280;">
              Si vous n'avez pas effectué ce changement, contactez immédiatement ${SUPPORT_EMAIL}
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${COMPANY_NAME}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${firstName},

Le mot de passe de votre compte administrateur a été modifié avec succès.

📅 Date : ${datetime}
🔢 IP : ${ip}
🌍 Localisation : ${location}

Toutes vos autres sessions ont été déconnectées par mesure de sécurité.

Si vous n'avez pas effectué ce changement, contactez immédiatement ${SUPPORT_EMAIL}

---
${COMPANY_NAME}
    `.trim(),
  }
}

// ============================================
// EMAIL OTP CODE
// ============================================

export function getEmailOTPEmail(params: {
  firstName: string
  code: string
  expiresIn: string
}): EmailTemplate {
  const { firstName, code, expiresIn } = params

  return {
    subject: `Votre code de vérification - ${COMPANY_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><style>${baseStyles}</style></head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="color: white; margin: 0;">🔐 ${COMPANY_NAME}</h2>
          </div>
          <div class="content">
            <h1>Code de vérification</h1>
            <p>Bonjour ${firstName},</p>
            <p>Voici votre code de vérification pour vous connecter :</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; padding: 20px 40px; background: #f3f4f6; border-radius: 12px; font-family: monospace; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #0047FF;">
                ${code}
              </div>
            </div>
            <div class="alert alert-warning">
              ⏰ Ce code expire dans <strong>${expiresIn}</strong>.
            </div>
            <p style="font-size: 14px; color: #6b7280;">
              Si vous n'avez pas demandé ce code, ignorez cet email et votre compte restera sécurisé.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${COMPANY_NAME}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${firstName},

Voici votre code de vérification pour vous connecter :

${code}

Ce code expire dans ${expiresIn}.

Si vous n'avez pas demandé ce code, ignorez cet email.

---
${COMPANY_NAME}
    `.trim(),
  }
}
