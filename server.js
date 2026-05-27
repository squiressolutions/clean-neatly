import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { Resend } from 'resend'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app  = express()
const PORT = process.env.PORT || 3001

const resend = new Resend(process.env.RESEND_API_KEY)
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'cleanneatly1219@gmail.com'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// ── Quote Request ─────────────────────────────────────────────────────────────
app.post('/api/quote', async (req, res) => {
  const {
    fname, lname, email, phone, biz,
    sqft, facility, services,
    schedule, notes
  } = req.body

  const name     = [fname, lname].filter(Boolean).join(' ').trim()
  const business = biz || ''

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' })
  }

  // Build services list
  const serviceList = Array.isArray(services)
    ? services.join(', ')
    : services || 'Not specified'

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f8f5ff;padding:32px;border-radius:12px;">
      <div style="background:#3b1f6e;padding:20px 24px;border-radius:8px;margin-bottom:24px;">
        <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:1px;">NEW QUOTE REQUEST</h1>
        <p style="color:#d4b8f0;margin:4px 0 0;font-size:13px;">Clean Neatly LLC · Commercial Cleaning</p>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;width:40%;font-size:13px;color:#6b35a8;font-weight:600;">Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:14px;color:#1a1a2e;">${name}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:13px;color:#6b35a8;font-weight:600;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:14px;color:#1a1a2e;"><a href="mailto:${email}" style="color:#6b35a8;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:13px;color:#6b35a8;font-weight:600;">Phone</td>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:14px;color:#1a1a2e;">${phone || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:13px;color:#6b35a8;font-weight:600;">Business</td>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:14px;color:#1a1a2e;">${business || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:13px;color:#6b35a8;font-weight:600;">Sq. Footage</td>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:14px;color:#1a1a2e;">${sqft || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:13px;color:#6b35a8;font-weight:600;">Facility Type</td>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:14px;color:#1a1a2e;">${facility || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:13px;color:#6b35a8;font-weight:600;">Services Needed</td>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:14px;color:#1a1a2e;">${serviceList}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:13px;color:#6b35a8;font-weight:600;">Preferred Schedule</td>
          <td style="padding:10px 0;border-bottom:1px solid #e0d4f7;font-size:14px;color:#1a1a2e;">${schedule || 'Not specified'}</td>
        </tr>
        ${notes ? `<tr>
          <td style="padding:10px 0;font-size:13px;color:#6b35a8;font-weight:600;vertical-align:top;">Notes</td>
          <td style="padding:10px 0;font-size:14px;color:#1a1a2e;">${notes}</td>
        </tr>` : ''}
      </table>

      <div style="margin-top:24px;padding:14px 18px;background:#3b1f6e;border-radius:8px;text-align:center;">
        <p style="color:#d4b8f0;font-size:12px;margin:0;">Clean Neatly LLC · St. Louis, MO · cleanneatly.com</p>
      </div>
    </div>
  `

  try {
    await resend.emails.send({
      from: 'Clean Neatly LLC <onboarding@resend.dev>',
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: `New Quote Request from ${name}`,
      html,
    })
    res.json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    res.status(500).json({ error: 'Failed to send — please try again.' })
  }
})

// ── Catch-all → index.html ────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Clean Neatly server running on port ${PORT}`)
})
