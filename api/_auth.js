import crypto from 'node:crypto'

function secret() {
  return process.env.ADMIN_SECRET || 'dev-secret'
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':')
  if (!salt || !hash) return false
  try {
    const derived = crypto.scryptSync(password, salt, 64)
    const expected = Buffer.from(hash, 'hex')
    return derived.length === expected.length && crypto.timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}

export function parseSettingsString(raw) {
  if (typeof raw === 'string') {
    try {
      const v = JSON.parse(raw)
      if (typeof v === 'string') return v
    } catch {
      // not JSON-wrapped; use as-is
    }
    return raw
  }
  return raw
}

export function signToken(username, hours = 24) {
  const payload = {
    sub: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + hours * 3600,
  }
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', secret()).update(body).digest('base64url')
  return `${body}.${sig}`
}

export function verifyToken(token) {
  try {
    const [body, sig] = String(token || '').split('.')
    if (!body || !sig) return null
    const expected = crypto.createHmac('sha256', secret()).update(body).digest('base64url')
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export function requireAuth(handler) {
  return async (req, res) => {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!verifyToken(token)) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    await handler(req, res)
  }
}

export function readBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch {
        resolve({})
      }
    })
  })
}
