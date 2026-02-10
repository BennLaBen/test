import nodemailer from 'nodemailer'

// ============================================
// SMTP EMAIL SERVICE
// ============================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM_ADDRESS = process.env.SMTP_FROM || 'noreply@lledo-industries.com'
const FROM_NAME = process.env.SMTP_FROM_NAME || 'LLEDO Industries'

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
      return true // Return true in dev so the flow doesn't break
    }

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_ADDRESS}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    console.log(`[mailer] Email sent to ${options.to}: ${options.subject}`)
    return true
  } catch (error) {
    console.error('[mailer] Failed to send email:', error)
    return false
  }
}

export async function verifyConnection(): Promise<boolean> {
  try {
    await transporter.verify()
    console.log('[mailer] SMTP connection verified')
    return true
  } catch (error) {
    console.error('[mailer] SMTP connection failed:', error)
    return false
  }
}
