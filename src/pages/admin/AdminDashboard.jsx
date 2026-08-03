import { useEffect, useRef, useState } from 'react'
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
  getVisits,
  markVisitsRead,
  changePassword,
} from '../../api.js'
import { CATEGORIES, formatPrice } from '../../data/store.js'
import { useProducts } from '../../context/ProductsContext.jsx'
import { useSettings } from '../../context/SettingsContext.jsx'
import '../admin.css'

const EMPTY = { id: '', name: '', brand: '', category: 'kiteboarding', type: '', size: '', price: '', description: '', image: '' }

export default function AdminDashboard() {
  const token = getToken()
  const navigate = useNavigate()
  const { reload } = useProducts()
  const { settings, setSettings } = useSettings()
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [settingsForm, setSettingsForm] = useState(() => ({
    email: settings.email || '',
    whatsapp: settings.whatsapp || '',
    locations: Array.isArray(settings.locations) ? settings.locations.join('\n') : '',
    facebook: settings.facebook || '',
    instagram: settings.instagram || '',
  }))
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [visits, setVisits] = useState([])
  const [unread, setUnread] = useState(0)
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })
  const [toast, setToast] = useState('')
  const lastUnread = useRef(0)
  const firstPoll = useRef(true)
  const toastTimer = useRef(null)

  useEffect(() => {
    if (!token) return
    loadProducts()
    loadOrders()
    loadSettings()
    loadVisits()
    const id = setInterval(loadVisits, 30000)
    return () => {
      clearInterval(id)
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    }
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
        instagram: data.instagram || '',
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

  const loadVisits = async () => {
    try {
      const data = await getVisits(token)
      setVisits(data.visits)
      const unreadCount = data.unread
      if (firstPoll.current) {
        firstPoll.current = false
      } else if (unreadCount > lastUnread.current) {
        const diff = unreadCount - lastUnread.current
        setToast(`Someone just visited your site${diff > 1 ? ` (${diff} new visits)` : ''}`)
        if (toastTimer.current) window.clearTimeout(toastTimer.current)
        toastTimer.current = window.setTimeout(() => setToast(''), 5000)
      }
      lastUnread.current = unreadCount
      setUnread(unreadCount)
    } catch {
      // ignore polling failures
    }
  }

  const markAllRead = async () => {
    try {
      await markVisitsRead(token)
      setUnread(0)
      lastUnread.current = 0
      setVisits((v) => v.map((x) => ({ ...x, is_read: true })))
    } catch (e) {
      setError(e.message)
    }
  }

  const changePwField = (field, value) => setPwForm((f) => ({ ...f, [field]: value }))

  const togglePw = (field) => setShowPw((s) => ({ ...s, [field]: !s[field] }))

  const savePassword = async (ev) => {
    ev.preventDefault()
    setError('')
    setMessage('')
    if (pwForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (pwForm.newPassword !== pwForm.confirm) {
      setError('New password and confirmation do not match.')
      return
    }
    try {
      await changePassword(
        { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword },
        token
      )
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
      setMessage('Password updated. Use it on your next login.')
    } catch (e) {
      setError(e.message)
    }
  }

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime()
    const min = Math.floor(diff / 60000)
    if (min < 1) return 'just now'
    if (min < 60) return `${min}m ago`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr}h ago`
    return `${Math.floor(hr / 24)}d ago`
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

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please drop an image file.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const max = 1200
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        change('image', dataUrl)
        setError('')
      }
      img.onerror = () => setError('Could not read that image.')
      img.src = reader.result
    }
    reader.onerror = () => setError('Could not read that file.')
    reader.readAsDataURL(file)
  }

  const onImageDrop = (ev) => {
    ev.preventDefault()
    const file = ev.dataTransfer?.files?.[0]
    handleImageFile(file)
  }

  const changeSetting = (field, value) => setSettingsForm((f) => ({ ...f, [field]: value }))

  const saveSettings = async (ev) => {
    ev.preventDefault()
    setError('')
    setMessage('')
    try {
      const payload = {
        email: (settingsForm.email || '').trim(),
        whatsapp: (settingsForm.whatsapp || '').trim(),
        locations: (settingsForm.locations || '')
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean),
        facebook: (settingsForm.facebook || '').trim(),
        instagram: (settingsForm.instagram || '').trim(),
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
        <button
          className={tab === 'notifications' ? 'tab-active' : ''}
          onClick={() => setTab('notifications')}
        >
          Notifications{unread > 0 && <span className="badge">{unread}</span>}
        </button>
        <button className={tab === 'settings' ? 'tab-active' : ''} onClick={() => setTab('settings')}>
          Settings
        </button>
      </div>

      {message && <p className="admin-msg">{message}</p>}
      {error && <p className="field-error">{error}</p>}
      {toast && (
        <div className="admin-toast" role="status">
          <span className="admin-toast__dot" />
          {toast}
        </div>
      )}

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
              <div className="field">
                <label>Product image (drag &amp; drop)</label>
                <div
                  className="dropzone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onImageDrop}
                  onClick={() => document.getElementById('product-image-input')?.click()}
                >
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="dropzone-preview" />
                  ) : (
                    <span className="dropzone-hint">Drop an image here or click to browse</span>
                  )}
                  <input
                    id="product-image-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageFile(e.target.files?.[0])}
                  />
                </div>
                {form.image && (
                  <button type="button" className="text-link" onClick={() => change('image', '')}>
                    Remove image
                  </button>
                )}
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
                  <th></th>
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
                    <td className="admin-thumb">
                      {p.image ? (
                        <img src={p.image} alt="" />
                      ) : (
                        <span className="admin-thumb-placeholder">—</span>
                      )}
                    </td>
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

      {tab === 'notifications' && (
        <div className="admin-notifications">
          <div className="admin-form">
            <div className="admin-notify-head">
              <h2>Visitor notifications</h2>
              <button type="button" className="btn btn-secondary btn-sm" onClick={markAllRead} disabled={!unread}>
                Mark all as read
              </button>
            </div>
            <p className="admin-sub">
              Live visitor alerts — every time someone enters your site a new notification appears here and
              you get an instant alert. Refreshes automatically.
            </p>
            {!visits.length ? (
              <p className="admin-sub">No visits recorded yet.</p>
            ) : (
              <ul className="visit-list">
                {visits.map((v) => (
                  <li key={v.id} className={`visit-item ${v.is_read ? '' : 'is-new'}`}>
                    <span className="visit-dot" />
                    <div className="visit-body">
                      <strong>{v.path}</strong>
                      <span className="admin-sub">{timeAgo(v.created_at)}</span>
                      {v.referrer && <span className="admin-sub">via {v.referrer}</span>}
                      {v.ip && <span className="admin-sub">{v.ip}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
                <label>Instagram link</label>
                <input
                  value={settingsForm.instagram || ''}
                  onChange={(e) => changeSetting('instagram', e.target.value)}
                  placeholder="https://instagram.com/yourpage"
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

          <div className="admin-form">
            <h2>Change password</h2>
            <p className="admin-sub">Updates your admin password immediately.</p>
            <form onSubmit={savePassword}>
              <div className="field">
                <label>Current password</label>
                <div className="pw-wrap">
                  <input
                    type={showPw.current ? 'text' : 'password'}
                    value={pwForm.currentPassword}
                    onChange={(e) => changePwField('currentPassword', e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    aria-label={showPw.current ? 'Hide password' : 'Show password'}
                    onClick={() => togglePw('current')}
                  >
                    <EyeIcon off={showPw.current} />
                  </button>
                </div>
              </div>
              <div className="field">
                <label>New password</label>
                <div className="pw-wrap">
                  <input
                    type={showPw.next ? 'text' : 'password'}
                    value={pwForm.newPassword}
                    onChange={(e) => changePwField('newPassword', e.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    aria-label={showPw.next ? 'Hide password' : 'Show password'}
                    onClick={() => togglePw('next')}
                  >
                    <EyeIcon off={showPw.next} />
                  </button>
                </div>
              </div>
              <div className="field">
                <label>Confirm new password</label>
                <div className="pw-wrap">
                  <input
                    type={showPw.confirm ? 'text' : 'password'}
                    value={pwForm.confirm}
                    onChange={(e) => changePwField('confirm', e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    aria-label={showPw.confirm ? 'Hide password' : 'Show password'}
                    onClick={() => togglePw('confirm')}
                  >
                    <EyeIcon off={showPw.confirm} />
                  </button>
                </div>
              </div>
              <div className="admin-actions">
                <button type="submit" className="btn btn-primary">
                  Update password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function EyeIcon({ off }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {off ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  )
}
