import { Resend } from 'resend'

// ============================================
// EMAIL SERVICE (Resend API - works on serverless)
// ============================================

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    const apiKey = (process.env.RESEND_API_KEY || '').trim()
    console.log(`[mailer] Creating Resend client: apiKey=${apiKey ? apiKey.substring(0, 8) + '***' : 'MISSING'}`)
    _resend = new Resend(apiKey)
  }
  return _resend
}

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const apiKey = (process.env.RESEND_API_KEY || '').trim()
  
  if (!apiKey) {
    console.warn('[mailer] RESEND_API_KEY not configured, logging email instead:')
    console.log(`  To: ${options.to}`)
    console.log(`  Subject: ${options.subject}`)
    console.log(`  Text: ${options.text?.substring(0, 200)}...`)
    return true
  }

  try {
    const fromAddress = (process.env.SMTP_FROM || 'onboarding@resend.dev').trim()
    const fromName = (process.env.SMTP_FROM_NAME || 'LLEDO Industries').trim()

    console.log(`[mailer] Sending email via Resend to ${options.to}...`)
    
    const { data, error } = await getResend().emails.send({
      from: `${fromName} <${fromAddress}>`,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    if (error) {
      console.error('[mailer] Resend error:', error)
      return false
    }

    console.log(`[mailer] Email sent successfully via Resend: id=${data?.id}`)
    return true
  } catch (error) {
    console.error('[mailer] Failed to send email:', error)
    return false
  }
}

export async function verifyConnection(): Promise<boolean> {
  const apiKey = (process.env.RESEND_API_KEY || '').trim()
  if (!apiKey) {
    console.warn('[mailer] RESEND_API_KEY not configured')
    return false
  }
  console.log('[mailer] Resend API key configured')
  return true
}
