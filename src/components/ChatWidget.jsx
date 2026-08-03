import { useState } from 'react'
import { FAQS } from '../data/content.js'
import { useSettings } from '../context/SettingsContext.jsx'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(null)
  const { settings } = useSettings()

  const whatsapp = settings.whatsapp
  const email = settings.email

  const start = () => {
    setOpen(true)
    setActiveIdx(null)
  }

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <div>
              <strong>Kite &amp; Wing — Help</strong>
              <span>Quick answers to common questions</span>
            </div>
            <button className="chat-close" aria-label="Close chat" onClick={() => setOpen(false)}>
              &times;
            </button>
          </div>

          <div className="chat-body">
            {activeIdx === null ? (
              <>
                <p className="chat-greeting">
                  Hi! Pick a question below, or message us directly.
                </p>
                <div className="chat-questions">
                  {FAQS.map((f, idx) => (
                    <button key={idx} className="chat-question" onClick={() => setActiveIdx(idx)}>
                      {f.q}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="chat-answer">
                <button className="chat-back" onClick={() => setActiveIdx(null)}>
                  &larr; All questions
                </button>
                <h3>{FAQS[activeIdx].q}</h3>
                <p>{FAQS[activeIdx].a}</p>
              </div>
            )}
          </div>

          <div className="chat-footer">
            <span>Still need help?</span>
            <div className="chat-links">
              {whatsapp && (
                <a
                  className="btn btn-primary btn-sm"
                  href={`https://wa.me/${String(whatsapp).replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              )}
              {email && (
                <a className="btn btn-secondary btn-sm" href={`mailto:${email}`}>
                  Email us
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <button className="chat-toggle" aria-label="Open chat" onClick={start}>
        {open ? (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </div>
  )
}
