import { formatUSD, formatNumberEUR, productEUR } from './pricing.js'

export function buildOrderMessage(order, email) {
  const items = (order.items || [])
    .map((i) => {
      const name = i.product?.name || i.name
      const size = i.size || i.product?.size || 'One Size'
      const price = i.unitPrice || i.product?.price || i.price || 0
      const line = price * i.qty
      return `- ${i.qty} x ${name} (${size}) — ${formatUSD(line)} / ${formatNumberEUR(productEUR(i.product, line, size))}`
    })
    .join('\n')

  const total = order.total || 0
  const totalEUR = (order.items || []).reduce(
    (s, i) => s + productEUR(i.product, (i.unitPrice || i.product?.price || 0) * i.qty, i.size),
    0
  )

  return `To: ${email}
Subject: Online payment request — order of ${formatUSD(total)} / ${formatNumberEUR(totalEUR)}

Hello kite and wind supply,
I would like to pay online for the following order:
${items}
TOTAL ORDER COST: ${formatUSD(total)} / ${formatNumberEUR(totalEUR)}
My name: ${order.fullName}
My email: ${order.email}
Please send me your payment details so I can complete this order. Thank you!`
}

export function whatsappLink(message, whatsapp) {
  return `https://wa.me/${String(whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

export function mailtoLink(message, email) {
  const firstLine = message.split('\n')[0]
  const subject = firstLine.replace(/^To: /, '')
  const body = message.split('\n').slice(2).join('\n')
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
