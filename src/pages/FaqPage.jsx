import { useState } from 'react'
import { FAQS } from '../data/content.js'

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <div className="page">
      <div className="page-head">
        <h1>Frequently asked questions</h1>
        <p>Everything you need to know about ordering from Kite and Wind Supply.</p>
      </div>

      <div className="faq-list">
        {FAQS.map((f, idx) => (
          <div className={`faq-item ${openIdx === idx ? 'open' : ''}`} key={idx}>
            <button className="faq-question" onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}>
              {f.q}
              <span className="faq-toggle">{openIdx === idx ? '&minus;' : '+'}</span>
            </button>
            {openIdx === idx && <div className="faq-answer">{f.a}</div>}
          </div>
        ))}
      </div>

      <div className="cta-banner">
        <h2>Still have questions?</h2>
        <p>Send us a message at kiteandwindsupply@gmail.com and we&apos;ll help you out.</p>
        <a href="mailto:kiteandwindsupply@gmail.com" className="btn btn-primary">
          Email us
        </a>
      </div>
    </div>
  )
}
