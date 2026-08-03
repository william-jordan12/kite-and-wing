const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  if (data === null) throw new Error('Invalid response')
  return data
}

export const getProducts = () => request('/products')

export const adminLogin = (username, password) =>
  request('/login', { method: 'POST', body: JSON.stringify({ username, password }) })

export const createProduct = (product, token) =>
  request('/products', { method: 'POST', body: JSON.stringify(product), headers: { Authorization: `Bearer ${token}` } })

export const updateProduct = (id, product, token) =>
  request(`/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(product),
    headers: { Authorization: `Bearer ${token}` },
  })

export const deleteProduct = (id, token) =>
  request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })

export const getOrders = (token) =>
  request('/orders', { headers: { Authorization: `Bearer ${token}` } })

export const saveOrder = (order) =>
  request('/orders', { method: 'POST', body: JSON.stringify(order) })

export const getSettings = () => request('/settings')

export const updateSettings = (settings, token) =>
  request('/settings', { method: 'PUT', body: JSON.stringify(settings), headers: { Authorization: `Bearer ${token}` } })

const TOKEN_KEY = 'kws_admin_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)
