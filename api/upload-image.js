import crypto from 'node:crypto'
import { requireAuth, readBody } from './_auth.js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }
    await authed(req, res)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME
const KEY = process.env.CLOUDINARY_API_KEY
const SECRET = process.env.CLOUDINARY_API_SECRET

const authed = requireAuth(async (req, res) => {
  const body = await readBody(req)
  const m = String(body.dataUrl || '').match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/s)
  if (!m) {
    res.status(400).json({ error: 'Invalid image data' })
    return
  }
  if (!CLOUD || !KEY || !SECRET) {
    res.status(500).json({ error: 'Cloudinary is not configured for this site.' })
    return
  }

  const slug =
    String(body.slug || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'photo'
  const publicId = `kw/${slug}-${Date.now()}`

  const timestamp = Math.floor(Date.now() / 1000)
  const params = { public_id: publicId, overwrite: 'true', timestamp: String(timestamp) }
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&')
  const signature = crypto.createHash('sha1').update(toSign + SECRET).digest('hex')

  const form = new URLSearchParams({
    file: body.dataUrl,
    api_key: KEY,
    ...params,
    signature,
  })

  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body: form,
  })
  if (!r.ok) {
    const text = await r.text()
    res.status(502).json({ error: `Cloudinary upload failed (${r.status}): ${text.slice(0, 200)}` })
    return
  }
  const data = await r.json()
  res.status(201).json({ url: data.secure_url })
})
