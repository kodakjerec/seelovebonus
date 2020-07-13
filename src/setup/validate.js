import i18n from './setupLocale'
const validate = {
  // 驗證台灣電話
  validatePhone: (rule, value, callback) => {
    if (value === '') {
      callback()
    } else if (value[2] === '-') {
      // 格式為 02-12345678, 03-1234567
      if (!isNaN(value.substring(0, 2))) {
        switch (value.substring(0, 2)) {
          case '02':
            if (value.substring(3, 11).length < 8) {
              callback(new Error(i18n.t('__pleaseInputPhoneLength')))
            }
            if (isNaN(value.substring(3, 11))) {
              callback(new Error(i18n.t('__pleaseInputNumber')))
            }
            break
          default:
            if (value.substring(3, 10).length < 7) {
              callback(new Error(i18n.t('__pleaseInputPhoneLength')))
            }
            if (isNaN(value.substring(3, 10))) {
              callback(new Error(i18n.t('__pleaseInputNumber')))
            }
        }
        callback()
      } else {
        callback(new Error(i18n.t('__pleaseInputNumber')))
      }
    } else if (value[3] === '-') {
      // 格式為 037-123456, 049-1234567, 089-123456
      if (!isNaN(value.substring(0, 3))) {
        switch (value.substring(0, 3)) {
          case '037':
          case '089':
            if (value.substring(4, 10).length < 6) {
              callback(new Error(i18n.t('__pleaseInputPhoneLength')))
            }
            if (isNaN(value.substring(4, 10))) {
              callback(new Error(i18n.t('__pleaseInputNumber')))
            }
            break
          default:
            if (value.substring(4, 11).length < 7) {
              callback(new Error(i18n.t('__pleaseInputPhoneLength')))
            }
            if (isNaN(value.substring(4, 11))) {
              callback(new Error(i18n.t('__pleaseInputNumber')))
            }
        }
        callback()
      } else {
        callback(new Error(i18n.t('__pleaseInputNumber')))
      }
    } else if (value[4] === '-') {
      // 格式為 0836-12345
      // 手機   0980-123456
      if (!isNaN(value.substring(0, 4))) {
        switch (value.substring(0, 4)) {
          case '0836':
            if (value.substring(5, 10).length < 5) {
              callback(new Error(i18n.t('__pleaseInputPhoneLength')))
            }
            if (isNaN(value.substring(5, 10))) {
              callback(new Error(i18n.t('__pleaseInputNumber')))
            }
            break
          default:
            if (value.substring(5, 11).length < 6) {
              callback(new Error(i18n.t('__pleaseInputPhoneLength')))
            }
            if (isNaN(value.substring(5, 11))) {
              callback(new Error(i18n.t('__pleaseInputNumber')))
            }
        }
        callback()
      } else {
        callback(new Error(i18n.t('__pleaseInputNumber')))
      }
    } else {
      callback(new Error(i18n.t('__pleaseInputPhoneStyle')))
    }

    callback()
  },
  // 驗證信用卡
  validateCard: (rule, value, callback) => {
    if (!value || value === null) {
      callback(new Error(i18n.t('__plzInputCardNumber')))
      return
    }
    value = value.replace(/-/g, '')
    let regex = /[0-9]{16}/
    if (!regex.test(value)) {
      callback(new Error(i18n.t('__plzInputCardNumber')))
    }

    // TODO: 目前不做卡片號碼驗證
    // let sum = 0
    // for (var i = 0; i < value.length; i++) {
    //   var intVal = parseInt(value.substr(i, 1))
    //   if (i % 2 === 0) {
    //     intVal *= 2
    //     if (intVal > 9) {
    //       intVal = 1 + (intVal % 10)
    //     }
    //   }
    //   sum += intVal
    // }
    // if ((sum % 10) !== 0) {
    //   callback(new Error(i18n.t('__plzInputCardNumber')))
    // }

    callback()
  },
  // 驗證身分證字號
  // TODO
  validatePersonalID: (rule, value, callback) => {
    callback()
  },
  // 驗證發票號碼
  validateInvoiceID: (rule, value, callback) => {
    let regex = /^[a-zA-Z]{2}[-]?[0-9]{8}$/
    if (!regex.test(value)) {
      callback(new Error(i18n.t('__pleaseInputInvoiceID')))
    }
    callback()
  },
  // 驗證使用者帳號密碼
  validateUserIDAndPassword: (rule, value, callback) => {
    let regex = /^.{7,}$/
    if (!regex.test(value)) {
      callback(new Error(i18n.t('__pleaseInputLength') + '7'))
    }
    callback()
  }
}

export default validate
