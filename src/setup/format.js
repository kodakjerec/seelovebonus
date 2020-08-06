export function formatMoney (value) {
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  })
  return formatter.format(value)
}

export function formatDate (value) {
  if (value) {
    return value.substring(0, 10)
  } else {
    return value
  }
}

export function formatDateTime (value) {
  if (value) {
    return value.replace('T', ' ').replace('Z', '')
  } else {
    return value
  }
}

export function formatCard (value) {
  if (value) {
    return value.substring(0, 10)
  } else {
    return value
  }
}
