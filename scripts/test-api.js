import 'dotenv/config'
import http from 'node:http'
import login from '../api/login.js'
import products from '../api/products.js'
import productItem from '../api/products/[id].js'
import orders from '../api/orders.js'
import settings from '../api/settings.js'

const server = http.createServer(async (req, res) => {
  const raw = await new Promise((resolve) => {
    let d = ''
    req.on('data', (c) => (d += c))
    req.on('end', () => resolve(d))
  })

  const method = req.method
  const path = new URL(req.url, 'http://localhost').pathname
  const body = raw ? JSON.parse(raw) : null

  let handler
  if (path === '/api/login' && method === 'POST') handler = login
  else if (path === '/api/products') handler = products
  else if (path.startsWith('/api/products/')) handler = productItem
  else if (path === '/api/orders') handler = orders
  else if (path === '/api/settings') handler = settings

  if (!handler) {
    res.statusCode = 404
    res.end('not found')
    return
  }

  const fakeReq = {
    url: path,
    method,
    headers: req.headers,
    on(evt, cb) {
      if (evt === 'data' && body) cb(JSON.stringify(body))
      if (evt === 'end') cb()
    },
  }
  const fakeRes = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(data) {
      this.body = data
    },
  }
  await handler(fakeReq, fakeRes)
  res.statusCode = fakeRes.statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(fakeRes.body))
})

const port = 4455
server.listen(port, async () => {
  const base = `http://localhost:${port}/api`
  const log = (name, r) => {
    const data = r.data === undefined ? '(no body)' : JSON.stringify(r.data).slice(0, 180)
    console.log(name, r.status, data)
  }
  const call = async (url, opts = {}) => {
    const r = await fetch(base + url, opts)
    return { status: r.status, data: await r.json().catch(() => null) }
  }

  try {
    let r = await call('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: process.env.ADMIN_USER, password: process.env.ADMIN_PASSWORD }),
    })
    const auth = { Authorization: `Bearer ${r.data.token}`, 'Content-Type': 'application/json' }
    log('login', { status: r.status, data: { token: (r.data.token || '').slice(0, 20) + '...' } })

    r = await call('/products')
    log('GET products', { status: r.status, data: { count: r.data?.length } })

    const testProduct = {
      id: 'test-product',
      name: 'Test Product',
      brand: 'Duotone',
      category: 'kiteboarding',
      type: 'Kite',
      size: '10m',
      price: 1234,
      description: 'temporary test entry',
    }
    r = await call('/products', { method: 'POST', headers: auth, body: JSON.stringify(testProduct) })
    log('POST product', r)

    r = await call('/products/test-product', {
      method: 'PUT',
      headers: auth,
      body: JSON.stringify({ ...testProduct, price: 1300 }),
    })
    log('PUT product', r)

    r = await call('/products/test-product', { method: 'DELETE', headers: auth })
    log('DELETE product', r)

    const order = {
      fullName: 'API Test User',
      email: 'test@example.com',
      phone: '+15550001111',
      shipping: '1 Test St, Los Angeles, CA',
      billing: 'Same',
      paymentMethod: 'PayPal',
      channel: 'email',
      total: 2400,
      items: [{ productId: 'rebel-2026', qty: 1, product: { name: 'Rebel', price: 1899 } }],
    }
    r = await call('/orders', { method: 'POST', headers: auth, body: JSON.stringify(order) })
    log('POST order', r)

    r = await call('/orders', { headers: auth })
    log('GET orders', { status: r.status, data: { count: r.data?.length } })

    r = await call('/products')
    log('GET products no-auth', { status: r.status, data: { count: r.data?.length } })

    r = await call('/settings')
    log('GET settings', r)

    r = await call('/settings', {
      method: 'PUT',
      headers: auth,
      body: JSON.stringify({ facebook: 'https://facebook.com/test', email: 'kiteandwindsupply@gmail.com' }),
    })
    log('PUT settings', r)

    r = await call('/settings', { method: 'PUT', headers: {} })
    log('PUT settings no-auth', { status: r.status, data: r.data && r.data.error })
  } catch (err) {
    console.error('TEST FAILED:', err.message)
  } finally {
    server.close()
    process.exit(0)
  }
})
