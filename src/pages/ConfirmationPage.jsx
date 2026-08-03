import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getOrder, clearOrder } from '../utils/order.js'
import { buildOrderMessage, whatsappLink, mailtoLink } from '../utils/message.js'
import { formatUSD, formatEUR } from '../utils/pricing.js'
import { saveOrder } from '../api.js'
import { useCart } from '../context/CartContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'

export default function ConfirmationPage() {
  const location = useLocation()
  const order = getOrder()
  const { clear } = useCart()
  const { settings } = useSettings()
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const posted = useRef(false)

  useEffect(() => {
    if (!order || posted.current) return
    posted.current = true
    saveOrder(order)
      .then(() => setSaved(true))
      .catch(() => setSaved(false))
  }, [order])

  if (!order) {
    return (
      <div className="page">
        <div className="empty-state-block">
          <h1>No order found</h1>
          <Link to="/checkout" className="btn btn-primary">
            Start a new order
          </Link>
        </div>
      </div>
    )
  }

  const channel = location.state?.channel || 'email'
  const message = buildOrderMessage(order, settings.email)
  const total = order.total || 0

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.getElementById('order-text')
      ta?.select()
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSend = () => {
    window.open(
      channel === 'whatsapp'
        ? whatsappLink(message, settings.whatsapp)
        : mailtoLink(message, settings.email),
      '_blank'
    )
  }

  const handleDone = () => {
    clearOrder()
    clear()
  }

  return (
    <div className="page">
      <div className="confirmation">
        <div className="confirmation-head">
          <span className="check-badge">&#10003;</span>
          <h1>Almost done!</h1>
          <p>
            Your order of <strong>{formatUSD(total)}</strong> ({formatEUR(total)}) is ready. No
            automated email is sent — copy the request below and send it to us via{' '}
            {channel === 'whatsapp' ? 'WhatsApp' : 'email'} to receive payment details.
          </p>
          {saved && <span className="order-saved">Order received &middot; we&apos;ll reply shortly.</span>}
        </div>

        <div className="order-text-wrap">
          <textarea id="order-text" readOnly value={message} rows={16} spellCheck="false" />
        </div>

        <div className="confirmation-actions">
          <button className="btn btn-secondary" onClick={handleCopy}>
            {copied ? 'Copied! ✓' : 'Copy payment request'}
          </button>
          <button className="btn btn-primary" onClick={handleSend}>
            Send via {channel === 'whatsapp' ? 'WhatsApp' : 'Email'}
          </button>
        </div>

        <p className="confirmation-note">
          Please include your full name and email so we can link your payment to this order.
        </p>

        <Link to="/" className="text-link" onClick={handleDone}>
          Start a new order
        </Link>
      </div>
    </div>
  )
}
