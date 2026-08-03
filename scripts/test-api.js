import 'dotenv/config'
import http from 'node:http'
import login from '../api/login.js'
import * as products from '../api/products.js'
import * as productItem from '../api/products/[id].js'
import * as orders from '../api/orders.js'

function makeReq(res, rawUrl, method, headers = {}, body = null) {
  const url = new URL(rawUrl, 'http://localhost')
  const req = {
    url: url.pathname + url.search,
    method,
    headers,
    on(evt, cb) {
      if (evt === 'data' && body) {
        cb(JSON.stringify(body))
      }
      if (evt === 'end') {
        cb()
      }
    },
  }
  return { req, res }
}

function makeRes() {
  const res = {
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
  return res
}

const server = http.createServer(async (req, res) => {
  const raw = await new Promise((resolve) => {
    let d = ''
    req.on('data', (c) => (d += c))
    req.on('end', () => resolve(d))
  })

  const method = req.method
  const url = new URL(req.url, 'http://localhost')
  const path = url.pathname
  const headers = req.headers

  let handler
  let body = raw ? JSON.parse(raw) : null

  if (path === '/api/login' && method === 'POST') handler = login
  else if (path === '/api/products' && method === 'GET') handler = products.GET
  else if (path === '/api/products' && method === 'POST') handler = products.POST
  else if (path.startsWith('/api/products/') && method === 'PUT') handler = productItem.PUT
  else if (path.startsWith('/api/products/') && method === 'DELETE') handler = productItem.DELETE
  else if (path === '/api/orders' && method === 'GET') handler = orders.GET
  else if (path === '/api/orders' && method === 'POST') handler = orders.POST

  if (!handler) {
    res.statusCode = 404
    res.end('not found')
    return
  }

  const fakeReq = {
    url: path,
    method,
    headers,
    on(evt, cb) {
      if (evt === 'data' && body) cb(JSON.stringify(body))
      if (evt === 'end') cb()
    },
  }
  const fakeRes = makeRes()
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

  try {
    let r = await fetch(`${base}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: process.env.ADMIN_USER, password: process.env.ADMIN_PASSWORD }),
    })
    const { token } = await r.json()
    const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    log('login', { status: r.status, data: { token: token.slice(0, 20) + '...' } })

    r = await fetch(`${base}/products`, { headers: auth })
    const all = await r.json()
    log('GET products', { status: r.status, data: { count: all.length } })

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

    r = await fetch(`${base}/products`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify(testProduct),
    })
    log('POST product', r)

    r = await fetch(`${base}/products/test-product`, {
      method: 'PUT',
      headers: auth,
      body: JSON.stringify({ ...testProduct, price: 1300 }),
    })
    log('PUT product', r)

    r = await fetch(`${base}/products/test-product`, { method: 'DELETE', headers: auth })
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
    r = await fetch(`${base}/orders`, { method: 'POST', headers: auth, body: JSON.stringify(order) })
    log('POST order', r)

    r = await fetch(`${base}/orders`, { headers: auth })
    const ordersList = await r.json()
    log('GET orders', { status: r.status, data: { count: ordersList.length } })

    r = await fetch(`${base}/products`, {})
    log('GET products no-auth', { status: r.status, data: (await r.json()).error })
  } catch (err) {
    console.error('TEST FAILED:', err.message)
  } finally {
    server.close()
    process.exit(0)
  }
})
