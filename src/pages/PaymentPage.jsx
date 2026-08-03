import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getOrder } from '../utils/order.js'

export default function PaymentPage() {
  const navigate = useNavigate()
  const order = getOrder()
  const [choice, setChoice] = useState(null)

  if (!order) {
    return (
      <div className="page">
        <div className="empty-state-block">
          <h1>No order found</h1>
          <Link to="/checkout" className="btn btn-primary">
            Go to checkout
          </Link>
        </div>
      </div>
    )
  }

  const next = () => {
    if (choice) navigate('/confirmation', { state: { channel: choice } })
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Proceed to payment</h1>
        <p>How would you like to finalize your order and receive payment details?</p>
      </div>

      <div className="payment-channel-grid">
        <button
          className={`channel-card ${choice === 'whatsapp' ? 'selected' : ''}`}
          onClick={() => setChoice('whatsapp')}
        >
          <span className="channel-icon">&#128172;</span>
          <h2>WhatsApp</h2>
          <p>Send the payment request straight to our WhatsApp with one tap.</p>
        </button>
        <button
          className={`channel-card ${choice === 'email' ? 'selected' : ''}`}
          onClick={() => setChoice('email')}
        >
          <span className="channel-icon">&#9993;</span>
          <h2>Email</h2>
          <p>Send the payment request to kiteandwindsupply@gmail.com.</p>
        </button>
      </div>

      <div className="step-actions">
        <Link to="/checkout" className="text-link">
          &larr; Back to checkout
        </Link>
        <button className="btn btn-primary" disabled={!choice} onClick={next}>
          Continue
        </button>
      </div>
    </div>
  )
}
