import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

// ============================================
// SMTP EMAIL SERVICE
// ============================================

let _transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (!_transporter) {
    const pass = process.env.SMTP_PASS
    console.log(`[mailer] Creating transporter: host=${process.env.SMTP_HOST}, port=${process.env.SMTP_PORT}, user=${process.env.SMTP_USER}, pass=${pass ? pass.substring(0, 3) + '***' : 'MISSING'}`)
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: pass,
      },
    })
  }
  return _transporter
}

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.warn('[mailer] SMTP not configured, logging email instead:')
      console.log(`  To: ${options.to}`)
      console.log(`  Subject: ${options.subject}`)
      console.log(`  Text: ${options.text?.substring(0, 200)}...`)
      return true
    }

    const fromAddress = process.env.SMTP_FROM || 'noreply@lledo-industries.com'
    const fromName = process.env.SMTP_FROM_NAME || 'LLEDO Industries'

    await getTransporter().sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    console.log(`[mailer] Email sent to ${options.to}: ${options.subject}`)
    return true
  } catch (error) {
    console.error('[mailer] Failed to send email:', error)
    // Reset transporter so it gets recreated on next attempt
    _transporter = null
    return false
  }
}

export async function verifyConnection(): Promise<boolean> {
  try {
    await getTransporter().verify()
    console.log('[mailer] SMTP connection verified')
    return true
  } catch (error) {
    console.error('[mailer] SMTP connection failed:', error)
    _transporter = null
    return false
  }
}
