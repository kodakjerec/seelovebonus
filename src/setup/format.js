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

// <br/> 換成 \n
export function brToNewLine (value) {
  if (value) {
    return value.replace(/(<br>|<\/br>|<br\/>)/mgi, '\n')
  } else {
    return value
  }
}

// \n 換成 <br/>
export function newLineToBr (value) {
  if (value) {
    return value.replace(/\n/mg, '<br/>')
  } else {
    return value
  }
}

// " " 換成 &nbsp
export function spaceToNBSP (value) {
  if (value) {
    return value.replace(/ /mg, '&nbsp;')
  } else {
    return value
  }
}
