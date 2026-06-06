import { google } from 'googleapis'

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID
const SERVICE_ACCOUNT_RAW = process.env.GOOGLE_SERVICE_ACCOUNT

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    if (!SERVICE_ACCOUNT_RAW) throw new Error('GOOGLE_SERVICE_ACCOUNT no configurado')
    if (!CALENDAR_ID) throw new Error('GOOGLE_CALENDAR_ID no configurado')

    const SERVICE_ACCOUNT = JSON.parse(SERVICE_ACCOUNT_RAW)

    const auth = new google.auth.GoogleAuth({
      credentials: SERVICE_ACCOUNT,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    })

    const calendar = google.calendar({ version: 'v3', auth })

    const now = new Date()
    const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const timeMax = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59).toISOString()

    const { data } = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 250,
    })

    res.status(200).json({ events: data.items || [] })
  } catch (error) {
    console.error('Calendar error:', error.message)
    res.status(500).json({ error: error.message })
  }
}