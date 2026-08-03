export function buildOrderMessage(order, email) {
  const items = order.items
    .map(
      (i) =>
        `- ${i.qty} x ${i.product.name} (${i.product.size}) — $${(
          i.product.price * i.qty
        ).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    )
    .join('\n')

  return `To: ${email}
Subject: Online payment request — order of $${order.total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
  })}

Hello kite and wind supply,
I would like to pay online for the following order:
${items}
TOTAL ORDER COST: $${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
