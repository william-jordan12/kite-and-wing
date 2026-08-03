import { readBody, signToken } from './_auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { username, password } = await readBody(req)

  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
    res.json({ token: signToken(username) })
    return
  }

  res.status(401).json({ error: 'Invalid credentials' })
}
