import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app  = express()
const PORT = process.env.PORT || 3001

const NOTIFY_EMAIL  = process.env.NOTIFY_EMAIL  || 'cleanneatly1219@gmail.com'
const RESEND_API_KEY = process.env.RESEND_API_KEY

async function sendEmail({ to, replyTo, subject, html }) {
  if (!RESEND_API_KEY) {
    console.warn('[EMAIL] No RESEND_API_KEY — logged but not sent.')
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Cleaned Neatly LLC <onboarding@resend.dev>',
      to,
      reply_to: replyTo,
      subject,
      html,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error('[EMAIL] Resend error:', err)
  } else {
    console.log('[EMAIL] Sent:', subject)
  }
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// ── Debug ─────────────────────────────────────────────────────────────────────
app.get('/api/debug-email', async (req, res) => {
  const status = {
    NOTIFY_EMAIL,
    RESEND_API_KEY_SET: !!RESEND_API_KEY,
    RESEND_API_KEY_LENGTH: RESEND_API_KEY ? RESEND_API_KEY.length : 0,
  }
  if (RESEND_API_KEY) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'test@resend.dev', to: NOTIFY_EMAIL, subject: 'debug', html: 'test' }),
      })
      status.resend_status = r.status
      status.resend_ok = r.status < 400
      const body = await r.json()
      status.resend_body = body
    } catch (err) {
      status.resend_error = err.message
    }
  }
  res.json(status)
})

// ── Clean URL Redirects ───────────────────────────────────────────────────────
app.get('/services',  (req, res) => res.redirect(301, '/services.html'))
app.get('/about',     (req, res) => res.redirect(301, '/about.html'))
app.get('/faq',       (req, res) => res.redirect(301, '/faq.html'))
app.get('/contact',   (req, res) => res.redirect(301, '/contact.html'))
app.get('/quote',     (req, res) => res.redirect(301, '/quote.html'))

// ── Quote Request ─────────────────────────────────────────────────────────────
app.post('/api/quote', async (req, res) => {
  const {
    fname, lname, email, phone, biz,
    sqft, facility, address, schedule,
    startDate, notes, services
  } = req.body

  const name = [fname, lname].filter(Boolean).join(' ').trim()

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' })
  }

  const serviceList = Array.isArray(services) && services.length
    ? services.join(', ')
    : (typeof services === 'string' && services ? services : 'Not specified')

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f8f5ff;padding:0;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#3b1f6e,#6b35a8);padding:24px 28px;">
        <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:0.5px;font-weight:700;">NEW QUOTE REQUEST</h1>
        <p style="color:#d4b8f0;margin:5px 0 0;font-size:13px;">Cleaned Neatly LLC · Commercial Cleaning · St. Louis, MO</p>
      </div>
      <div style="padding:28px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;width:38%;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Name</td><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:14px;color:#1a1a2e;">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:14px;"><a href="mailto:${email}" style="color:#6b35a8;">${email}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:14px;color:#1a1a2e;">${phone || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Business</td><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:14px;color:#1a1a2e;">${biz || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Square Footage</td><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:14px;color:#1a1a2e;">${sqft || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Facility Type</td><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:14px;color:#1a1a2e;">${facility || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Address / ZIP</td><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:14px;color:#1a1a2e;">${address || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Services Needed</td><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:14px;color:#1a1a2e;">${serviceList}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Schedule</td><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:14px;color:#1a1a2e;">${schedule || '—'}</td></tr>
          <tr><td style="padding:10px 0;${notes ? 'border-bottom:1px solid #e8e2f0;' : ''}font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Start Date</td><td style="padding:10px 0;${notes ? 'border-bottom:1px solid #e8e2f0;' : ''}font-size:14px;color:#1a1a2e;">${startDate || '—'}</td></tr>
          ${notes ? `<tr><td style="padding:10px 0;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;vertical-align:top;">Notes</td><td style="padding:10px 0;font-size:14px;color:#1a1a2e;">${notes}</td></tr>` : ''}
        </table>
      </div>
      <div style="background:#3b1f6e;padding:14px 28px;text-align:center;">
        <p style="color:#d4b8f0;font-size:12px;margin:0;">Cleaned Neatly LLC · cleanneatly1219@gmail.com · (314) 565-7406</p>
      </div>
    </div>
  `

  console.log(`[QUOTE] ${new Date().toISOString()} | ${name} | ${email}`)

  try {
    await sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: `New Quote Request — ${name}`,
      html,
    })
    res.json({ success: true })
  } catch (err) {
    console.error('[QUOTE] Error:', err.message)
    res.json({ success: true })
  }
})

// ── Contact Form ──────────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' })
  }

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f8f5ff;padding:0;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#3b1f6e,#6b35a8);padding:24px 28px;">
        <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:0.5px;font-weight:700;">NEW MESSAGE</h1>
        <p style="color:#d4b8f0;margin:5px 0 0;font-size:13px;">Cleaned Neatly LLC · Contact Form</p>
      </div>
      <div style="padding:28px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;width:30%;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Name</td><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:14px;color:#1a1a2e;">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:14px;"><a href="mailto:${email}" style="color:#6b35a8;">${email}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #e8e2f0;font-size:14px;color:#1a1a2e;">${phone || '—'}</td></tr>
          <tr><td style="padding:10px 0;font-size:12px;color:#6b35a8;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;vertical-align:top;">Message</td><td style="padding:10px 0;font-size:14px;color:#1a1a2e;line-height:1.6;">${message}</td></tr>
        </table>
      </div>
      <div style="background:#3b1f6e;padding:14px 28px;text-align:center;">
        <p style="color:#d4b8f0;font-size:12px;margin:0;">Cleaned Neatly LLC · cleanneatly1219@gmail.com · (314) 565-7406</p>
      </div>
    </div>
  `

  console.log(`[CONTACT] ${new Date().toISOString()} | ${name} | ${email}`)

  try {
    await sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: `New Message — ${name}`,
      html,
    })
    res.json({ success: true })
  } catch (err) {
    console.error('[CONTACT] Error:', err.message)
    res.json({ success: true })
  }
})

// ── Catch-all → index.html ────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Cleaned Neatly server running on port ${PORT}`)
})
