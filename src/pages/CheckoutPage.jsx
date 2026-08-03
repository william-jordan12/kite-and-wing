import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { STORE_INFO } from '../data/store'
import { paymentLogo } from '../utils/placeholder'
import { formatUSD, formatEUR } from '../utils/pricing.js'
import { useCart } from '../context/CartContext.jsx'
import { saveOrder } from '../utils/order.js'

const FIELDS = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true },
  { name: 'email', label: 'Email Address', type: 'email', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
  { name: 'shipping', label: 'Shipping Address', type: 'textarea', required: true },
  { name: 'billing', label: 'Billing Address', type: 'textarea', required: true },
]

export default function CheckoutPage() {
  const { detail, total } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ paymentMethod: '' })
  const [errors, setErrors] = useState({})

  if (!detail.length) {
    return (
      <div className="page">
        <div className="empty-state-block">
          <h1>Your cart is empty</h1>
          <Link to="/" className="btn btn-primary">
            Browse products
          </Link>
        </div>
      </div>
    )
  }

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: undefined }))
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const nextErrors = {}
    FIELDS.forEach((f) => {
      if (f.required && !form[f.name]?.trim()) nextErrors[f.name] = `${f.label} is required`
    })
    if (!form.email?.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address'
    }
    if (!form.paymentMethod) nextErrors.paymentMethod = 'Select a payment method'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    saveOrder({ ...form, items: detail, total })
    navigate('/payment')
  }

  return (
    <div className="page">
      <div className="page-head">
        <nav className="breadcrumb">
          <Link to="/cart">Cart</Link> / <span>Checkout</span>
        </nav>
        <h1>Checkout</h1>
        <p>Enter your details and choose how you&apos;d like to pay.</p>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit} noValidate>
        <section className="checkout-section">
          <h2>Your details</h2>
          {FIELDS.map((f) => (
            <div className="field" key={f.name}>
              <label htmlFor={f.name}>
                {f.label}
                {f.required && <span className="req"> *</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  id={f.name}
                  rows="3"
                  value={form[f.name] || ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                />
              ) : (
                <input
                  id={f.name}
                  type={f.type}
                  value={form[f.name] || ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                />
              )}
              {errors[f.name] && <p className="field-error">{errors[f.name]}</p>}
            </div>
          ))}
        </section>

        <section className="checkout-section">
          <h2>Payment method</h2>
          <div className="payment-methods">
            {STORE_INFO.paymentMethods.map((method) => (
              <label
                key={method}
                className={`payment-option ${form.paymentMethod === method ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={form.paymentMethod === method}
                  onChange={() => setField('paymentMethod', method)}
                />
                {paymentLogo(method) && (
                  <img className="payment-logo" src={paymentLogo(method)} alt={method} />
                )}
                <span>{method}</span>
              </label>
            ))}
          </div>
          {errors.paymentMethod && <p className="field-error">{errors.paymentMethod}</p>}
        </section>

        <div className="checkout-foot">
          <div className="checkout-total">
            <span>Order total</span>
            <strong>{formatUSD(total)}</strong>
            <span>{formatEUR(total)}</span>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Proceed to payment
          </button>
        </div>
        <p className="cart-shipping-note">
          We ship from California, USA and Vilnius, Lithuania — from the warehouse closest to you.
        </p>
      </form>
    </div>
  )
}
