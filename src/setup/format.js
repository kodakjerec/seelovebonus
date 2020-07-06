export function formatMoney (value) {
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  })
  return formatter.format(value)
}

export function formatDate (value) {
  return value.substring(0, 10)
}

export function formatCard (value) {
  return value.substring(0, 10)
}
