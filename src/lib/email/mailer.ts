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

  const fromAddress = (process.env.SMTP_FROM || 'onboarding@resend.dev').trim()
  const fromName = (process.env.SMTP_FROM_NAME || 'LLEDO Industries').trim()
  const FALLBACK_FROM = 'onboarding@resend.dev'

  // Try sending with configured address first, fallback to resend default
  const fromAddresses = [fromAddress]
  if (fromAddress !== FALLBACK_FROM) {
    fromAddresses.push(FALLBACK_FROM)
  }

  for (const sender of fromAddresses) {
    try {
      const from = `${fromName} <${sender}>`
      console.log(`[mailer] Sending email via Resend to ${options.to} from ${from}...`)
      
      const { data, error } = await getResend().emails.send({
        from,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      })

      if (error) {
        console.error(`[mailer] Resend error with sender ${sender}:`, JSON.stringify(error))
        if (sender !== FALLBACK_FROM) {
          console.log('[mailer] Retrying with fallback sender...')
          continue
        }
        return false
      }

      console.log(`[mailer] Email sent successfully via Resend: id=${data?.id}, from=${sender}`)
      return true
    } catch (error) {
      console.error(`[mailer] Failed to send email with sender ${sender}:`, error)
      if (sender !== FALLBACK_FROM) {
        console.log('[mailer] Retrying with fallback sender...')
        continue
      }
      return false
    }
  }

  return false
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
