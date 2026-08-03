import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  getToken,
  clearToken,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getSettings,
  updateSettings,
} from '../../api.js'
import { CATEGORIES, formatPrice } from '../../data/store.js'
import { useProducts } from '../../context/ProductsContext.jsx'
import { useSettings } from '../../context/SettingsContext.jsx'
import '../admin.css'

const EMPTY = { id: '', name: '', brand: '', category: 'kiteboarding', type: '', size: '', price: '', description: '' }

export default function AdminDashboard() {
  const token = getToken()
  const navigate = useNavigate()
  const { reload } = useProducts()
  const { settings, setSettings } = useSettings()
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [settingsForm, setSettingsForm] = useState({})
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    loadProducts()
    loadOrders()
    loadSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (!token) return <Navigate to="/admin" replace />

  const loadSettings = async () => {
    try {
      const data = await getSettings()
      setSettingsForm({
        email: data.email || '',
        whatsapp: data.whatsapp || '',
        locations: Array.isArray(data.locations) ? data.locations.join('\n') : '',
        facebook: data.facebook || '',
      })
    } catch (e) {
      setError(e.message)
    }
  }

  const loadProducts = async () => {
    try {
      setProducts(await getProducts())
    } catch (e) {
      setError(e.message)
    }
  }

  const loadOrders = async () => {
    try {
      setOrders(await getOrders(token))
    } catch (e) {
      setError(e.message)
    }
  }

  const logout = () => {
    clearToken()
    navigate('/admin', { replace: true })
  }

  const startNew = () => {
    setEditing(null)
    setForm(EMPTY)
    setError('')
  }

  const startEdit = (p) => {
    setEditing(p.id)
    setForm({ ...p, price: String(p.price) })
    setError('')
  }

  const change = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const changeSetting = (field, value) => setSettingsForm((f) => ({ ...f, [field]: value }))

  const saveSettings = async (ev) => {
    ev.preventDefault()
    setError('')
    setMessage('')
    try {
      const payload = {
        email: settingsForm.email.trim(),
        whatsapp: settingsForm.whatsapp.trim(),
        locations: settingsForm.locations.split('\n').map((l) => l.trim()).filter(Boolean),
        facebook: settingsForm.facebook.trim(),
      }
      const updated = await updateSettings(payload, token)
      setSettings(updated)
      setMessage('Store settings saved.')
    } catch (e) {
      setError(e.message)
    }
  }

  const save = async (ev) => {
    ev.preventDefault()
    setError('')
    setMessage('')
    try {
      const payload = { ...form, price: Number(form.price) }
      if (editing) {
        await updateProduct(editing, payload, token)
      } else {
        await createProduct(payload, token)
      }
      await Promise.all([loadProducts(), reload()])
      startNew()
      setMessage(editing ? 'Product updated.' : 'Product created.')
    } catch (e) {
      setError(e.message)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteProduct(id, token)
      await Promise.all([loadProducts(), reload()])
      setMessage('Product deleted.')
    } catch (e) {
      setError(e.message)
    }
  }

  const brands = CATEGORIES.find((c) => c.id === form.category)?.brands || []

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <h1>Admin dashboard</h1>
        <button className="btn btn-secondary" onClick={logout}>
          Log out
        </button>
      </div>

      <div className="admin-tabs">
        <button className={tab === 'products' ? 'tab-active' : ''} onClick={() => setTab('products')}>
          Products ({products.length})
        </button>
        <button className={tab === 'orders' ? 'tab-active' : ''} onClick={() => setTab('orders')}>
          Orders ({orders.length})
        </button>
        <button className={tab === 'settings' ? 'tab-active' : ''} onClick={() => setTab('settings')}>
          Store settings
        </button>
      </div>

      {message && <p className="admin-msg">{message}</p>}
      {error && <p className="field-error">{error}</p>}

      {tab === 'products' && (
        <div className="admin-products">
          <div className="admin-form">
            <h2>{editing ? `Edit: ${form.name}` : 'Add a product'}</h2>
            <form onSubmit={save}>
              {!editing && (
                <div className="field">
                  <label>ID (slug, e.g. rebel-2026)</label>
                  <input value={form.id} onChange={(e) => change('id', e.target.value)} required />
                </div>
              )}
              <div className="field">
                <label>Name</label>
                <input value={form.name} onChange={(e) => change('name', e.target.value)} required />
              </div>
              <div className="field">
                <label>Brand</label>
                <input value={form.brand} onChange={(e) => change('brand', e.target.value)} list="brand-options" required />
                <datalist id="brand-options">
                  {CATEGORIES.flatMap((c) => c.brands).map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>
              <div className="admin-row">
                <div className="field">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => change('category', e.target.value)}>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Type</label>
                  <input value={form.type} onChange={(e) => change('type', e.target.value)} />
                </div>
                <div className="field">
                  <label>Size</label>
                  <input value={form.size} onChange={(e) => change('size', e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Price (USD)</label>
                <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => change('price', e.target.value)} required />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea rows="3" value={form.description} onChange={(e) => change('description', e.target.value)} />
              </div>
              {editing && (
                <button type="button" className="text-link" onClick={startNew}>
                  Cancel edit
                </button>
              )}
              <div className="admin-actions">
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Save changes' : 'Add product'}
                </button>
              </div>
            </form>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      <span className="admin-sub">{p.type} {p.size}</span>
                    </td>
                    <td>{p.brand}</td>
                    <td>{CATEGORIES.find((c) => c.id === p.category)?.name || p.category}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td className="admin-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => startEdit(p)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="admin-orders">
          {!orders.length && <p className="admin-sub">No orders yet.</p>}
          {orders.map((o) => (
            <div className="admin-order" key={o.id}>
              <div className="admin-order-head">
                <strong>#{o.id} — {o.full_name}</strong>
                <span className="admin-sub">{new Date(o.created_at).toLocaleString()}</span>
              </div>
              <div className="admin-order-body">
                <ul>
                  {o.items.map((it, idx) => (
                    <li key={idx}>
                      {it.qty} x {it.product?.name || it.productId} — $
                      {((it.product?.price || 0) * it.qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Total:</strong> {formatPrice(o.total)} &middot; <strong>Pay:</strong> {o.payment_method}{' '}
                  &middot; <strong>Channel:</strong> {o.channel}
                </p>
                <p className="admin-sub">
                  {o.email} {o.phone ? `· ${o.phone}` : ''}
                </p>
                {o.shipping && <p className="admin-sub">Ship: {o.shipping}</p>}
                {o.billing && <p className="admin-sub">Bill: {o.billing}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'settings' && (
        <div className="admin-settings">
          <div className="admin-form">
            <h2>Store settings</h2>
            <p className="admin-sub">These appear on the site, in emails, and on the payment request.</p>
            <form onSubmit={saveSettings}>
              <div className="field">
                <label>Order email</label>
                <input
                  type="email"
                  value={settingsForm.email || ''}
                  onChange={(e) => changeSetting('email', e.target.value)}
                  placeholder="kiteandwindsupply@gmail.com"
                />
              </div>
              <div className="field">
                <label>WhatsApp number</label>
                <input
                  value={settingsForm.whatsapp || ''}
                  onChange={(e) => changeSetting('whatsapp', e.target.value)}
                  placeholder="+15551234567"
                />
              </div>
              <div className="field">
                <label>Facebook link</label>
                <input
                  value={settingsForm.facebook || ''}
                  onChange={(e) => changeSetting('facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div className="field">
                <label>Locations (one per line)</label>
                <textarea
                  rows="3"
                  value={settingsForm.locations || ''}
                  onChange={(e) => changeSetting('locations', e.target.value)}
                  placeholder={'California, USA\nVilnius, Lithuania'}
                />
              </div>
              <div className="admin-actions">
                <button type="submit" className="btn btn-primary">
                  Save settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
