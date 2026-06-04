export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { subscriber_id, text, canal } = req.body
  if (!subscriber_id || !text) return res.status(400).json({ error: "Missing fields" })

  const tipo = canal === "WhatsApp" ? "whatsapp" : "instagram"

  try {
    const response = await fetch("https://api.manychat.com/fb/sending/sendContent", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VITE_MANYCHAT_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriber_id,
        data: {
          version: "v2",
          content: {
            type: tipo,
            messages: [{ type: "text", text }],
          },
        },
      }),
    })
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
