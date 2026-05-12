import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { url } = req.body
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "url is required" })
  }

  const apiKey = process.env.DUB_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: "DUB_API_KEY not configured" })
  }

  const response = await fetch("https://api.dub.co/links", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    const error = await response.text()
    return res.status(response.status).json({ error })
  }

  const data = await response.json()
  return res.status(200).json({ shortUrl: data.shortLink })
}
