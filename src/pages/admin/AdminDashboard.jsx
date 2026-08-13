import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  getToken,
  clearToken,
  getProducts,
  getProductFull,
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
import { productEUR } from '../../utils/pricing.js'
import { formatNumberEUR } from '../../utils/pricing.js'
import '../admin.css'

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const toVariantForm = (v) => ({
  size: String(v && v.size || '').trim(),
  price: v && v.price != null ? String(v.price) : '',
  priceEur: v && v.priceEur != null ? String(v.priceEur) : '',
})

const EMPTY = {
  id: '',
  name: '',
  brand: '',
  category: 'kiteboarding',
  type: '',
  size: '',
  price: '',
  priceEur: '',
  description: '',
  image: '',
  images: [],
  variants: [],
}

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

  const startEdit = async (p) => {
    setEditing(p.id)
    setForm({
      ...p,
      price: String(p.price ?? ''),
      priceEur: p.priceEur != null ? String(p.priceEur) : '',
      image: p.image || '',
      images: Array.isArray(p.images) && p.images.length ? p.images : [],
      variants: Array.isArray(p.variants) && p.variants.length ? p.variants.map(toVariantForm) : [],
    })
    setError('')
    try {
      const full = await getProductFull(p.id)
      setForm((f) => ({
        ...f,
        image: full.image || f.image,
        images:
          Array.isArray(full.images) && full.images.length
            ? full.images
            : full.image
              ? [full.image]
              : f.images,
        variants:
          Array.isArray(full.variants) && full.variants.length
            ? full.variants.map(toVariantForm)
            : f.variants,
      }))
    } catch {
      // keep the light form data
    }
  }

  const change = (field, value) =>
    setForm((f) => {
      const next = { ...f, [field]: value }
      if (field === 'category') {
        next.brand = ''
      }
      return next
    })

  const setVariantField = (index, field, value) =>
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }))

  const addVariant = () =>
    setForm((f) => ({ ...f, variants: [...f.variants, { size: '', price: '', priceEur: '' }] }))

  const removeVariant = (index) =>
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== index) }))

  const processFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const max = 1200
          const scale = Math.min(1, max / Math.max(img.width, img.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(img.width * scale)
          canvas.height = Math.round(img.height * scale)
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', 0.85))
        }
        img.onerror = () => reject(new Error('read'))
        img.src = reader.result
      }
      reader.onerror = () => reject(new Error('file'))
      reader.readAsDataURL(file)
    })

  const addImages = async (files) => {
    const list = Array.from(files || []).filter((f) => f.type.startsWith('image/'))
    if (!list.length) {
      setError('Please drop image files.')
      return
    }
    try {
      const dataUrls = await Promise.all(list.map(processFile))
      setForm((f) => ({ ...f, images: [...f.images, ...dataUrls] }))
      setError('')
    } catch {
      setError('Could not read one of the images.')
    }
  }

  const removeImage = (index) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }))

  const handleMainImage = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please drop an image file.')
      return
    }
    try {
      const dataUrl = await processFile(file)
      setForm((f) => ({ ...f, image: dataUrl }))
      setError('')
    } catch {
      setError('Could not read that image.')
    }
  }

  const onMainImageDrop = (ev) => {
    ev.preventDefault()
    handleMainImage(ev.dataTransfer?.files?.[0])
  }

  const onImageDrop = (ev) => {
    ev.preventDefault()
    addImages(ev.dataTransfer?.files)
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
      const allImages = [form.image, ...form.images].filter(Boolean)
      const payload = {
        ...form,
        id: editing ? (form.id || '').trim() : slugify(form.id) || slugify(form.name),
        name: (form.name || '').trim(),
        brand: (form.brand || '').trim(),
        type: (form.type || '').trim(),
        size: (form.size || '').trim(),
        price: Number(form.price),
        priceEur: form.priceEur ? Number(form.priceEur) : null,
        image: form.image || allImages[0] || '',
        images: allImages,
        variants: form.variants
          .map((v) => ({
            size: String(v.size || '').trim(),
            price: v.price === '' || v.price == null ? null : Number(v.price),
            priceEur: v.priceEur === '' || v.priceEur == null ? null : Number(v.priceEur),
          }))
          .filter((v) => v.size),
      }
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

  const copyProductLink = async (p) => {
    const url = `${window.location.origin}/product/${encodeURIComponent(p.id)}`
    try {
      await navigator.clipboard.writeText(url)
      setMessage('Product link copied.')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setError('Could not copy the link.')
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
                  <label>ID (auto-converted to a clean link slug, e.g. rebel-2026)</label>
                  <input value={form.id} onChange={(e) => change('id', e.target.value)} required />
                </div>
              )}
              <div className="field">
                <label>Name</label>
                <input value={form.name} onChange={(e) => change('name', e.target.value)} required />
              </div>
              <div className="field">
                <label>Brand</label>
                <select
                  value={form.brand}
                  onChange={(e) => change('brand', e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a brand
                  </option>
                  {form.brand && !brands.includes(form.brand) && (
                    <option value={form.brand}>{form.brand}</option>
                  )}
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
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
                  <label>Type (model, e.g. Kite)</label>
                  <input value={form.type} onChange={(e) => change('type', e.target.value)} />
                </div>
                <div className="field">
                  <label>Default size (used if no sizes added below)</label>
                  <input value={form.size} onChange={(e) => change('size', e.target.value)} />
                </div>
              </div>
              <div className="field">
                <span className="admin-sub">Sizes &amp; prices (manual — type each size and its own price)</span>
                <div className="variant-editor">
                  {form.variants.map((v, i) => (
                    <div className="variant-editor__row" key={i}>
                      <input
                        className="variant-editor__size"
                        placeholder="Size e.g. 10m"
                        value={v.size}
                        onChange={(e) => setVariantField(i, 'size', e.target.value)}
                      />
                      <input
                        className="variant-editor__price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="USD price"
                        value={v.price}
                        onChange={(e) => setVariantField(i, 'price', e.target.value)}
                      />
                      <input
                        className="variant-editor__price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="EUR price (optional)"
                        value={v.priceEur}
                        onChange={(e) => setVariantField(i, 'priceEur', e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        aria-label="Remove size"
                        onClick={() => removeVariant(i)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addVariant}>
                  + Add size
                </button>
              </div>
              <div className="admin-row">
                <div className="field">
                  <label>Base price (USD)</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => change('price', e.target.value)} required />
                </div>
                <div className="field">
                  <label>Base price (EUR)</label>
                  <input type="number" min="0" step="0.01" value={form.priceEur} onChange={(e) => change('priceEur', e.target.value)} placeholder="optional, defaults to USD rate" />
                </div>
              </div>
              <div className="field">
                <label>Description</label>
                <textarea rows="3" value={form.description} onChange={(e) => change('description', e.target.value)} />
              </div>
              <div className="field">
                <label>Main photo (drag &amp; drop)</label>
                <div
                  className="dropzone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onMainImageDrop}
                  onClick={() => document.getElementById('product-main-image-input')?.click()}
                >
                  {form.image ? (
                    <img src={form.image} alt="Main photo preview" className="dropzone-preview" />
                  ) : (
                    <span className="dropzone-hint">Drop the main photo here or click to browse</span>
                  )}
                  <input
                    id="product-main-image-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      handleMainImage(e.target.files?.[0])
                      e.target.value = ''
                    }}
                  />
                </div>
                {form.image && (
                  <button type="button" className="text-link" onClick={() => change('image', '')}>
                    Remove main photo
                  </button>
                )}
              </div>
              <div className="field">
                <label>More pictures (drag &amp; drop multiple)</label>
                <div
                  className="dropzone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onImageDrop}
                  onClick={() => document.getElementById('product-image-input')?.click()}
                >
                  {form.images.length ? (
                    <div className="thumbnails">
                      {form.images.map((img, i) => (
                        <div className="thumb" key={i}>
                          <img src={img} alt={`Preview ${i + 1}`} />
                          <button
                            type="button"
                            className="thumb-remove"
                            aria-label="Remove image"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeImage(i)
                            }}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="dropzone-hint">Drop one or more extra pictures here or click to browse</span>
                  )}
                  <input
                    id="product-image-input"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      addImages(e.target.files)
                      e.target.value = ''
                    }}
                  />
                </div>
                <span className="admin-sub">Extra pictures shown in the product gallery</span>
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
                      {(p.images && p.images[0]) || p.image ? (
                        <img src={(p.images && p.images[0]) || p.image} alt="" />
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
                    <td>
                      {formatPrice(p.price)}
                      <span className="admin-sub">{formatNumberEUR(productEUR(p, p.price))}</span>
                    </td>
                    <td className="admin-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => copyProductLink(p)}>
                        Copy link
                      </button>
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
