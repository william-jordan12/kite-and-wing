const KEY = 'kws_order_v1'

export function saveOrder(data) {
  sessionStorage.setItem(KEY, JSON.stringify(data))
}

export function getOrder() {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearOrder() {
  sessionStorage.removeItem(KEY)
}
