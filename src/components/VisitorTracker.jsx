import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { recordVisit } from '../api.js'

const KEY = 'kws_last_visit_ts'
const THROTTLE_MS = 60 * 1000

export default function VisitorTracker() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return
    const last = Number(sessionStorage.getItem(KEY) || 0)
    const now = Date.now()
    if (now - last < THROTTLE_MS) return
    sessionStorage.setItem(KEY, String(now))
    recordVisit({
      path: location.pathname,
      referrer: document.referrer || '',
      userAgent: navigator.userAgent,
    }).catch(() => {})
  }, [location.pathname])

  return null
}
