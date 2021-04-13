import i18n from './setupLocale'
import api from '@/services/api'

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
    // 只驗證後四碼
    value = value.replace(/-/g, '')
    let regex = /[0-9]{4}$/
    if (!regex.test(value)) {
      callback(new Error(i18n.t('__plzInputCardNumber')))
      return
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
  // 驗證身分證字號(客戶 業務 共用)
  validatePersonalID: async (rule, value, userType, checkRepeat = true) => {
    value = value.toUpperCase()
    let regex = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/
    if (!regex.test(value)) {
      return new Error(i18n.t('__pleaseInputPersonalID') + '1')
    }

    // 2.驗證是否重複
    if (checkRepeat) {
      let response = await api.basic.checkValidate({ type: userType, ID: value })
      let rows = response.data.result
      if (rows && rows.length > 0) {
        return new Error(i18n.t('__id') + ' ' + value + i18n.t('__valueUsed'))
      }
    }

    // 驗證正確性
    // 宣告一個陣列放入A~Z相對應數字的順序
    let Esum = null
    let Nsum = null
    let country = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'W', 'Z', 'I', 'O']
    for (let index = 0; index < country.length; index++) {
      if (value[0] === country[index]) {
        // A是從10開始編碼,每個英文的碼都跟index差異10,先加回來
        index += 10
        Esum = (((index % 10) * 9) + Math.floor(index / 10))
        // 英文轉成的數字, 個位數(把數字/10取餘數)乘９再加上十位數
        // 加上十位數(數字/10,因為是int,後面會直接捨去)
        break
      }
    }
    // 從第二個數字開始跑,每個數字*相對應權重
    for (let i = 1; i < 9; i++) {
      Nsum += parseInt(value[i]) * (9 - i)
    }
    // 把上述的總和加起來,取餘數後,10-該餘數為檢查碼,要等於最後一個數字
    let count = 10 - ((Esum + Nsum) % 10)
    // console.log('Esum:' + Esum + ' Nsum:' + Nsum + ' count:' + count)
    // 餘數為0的判斷
    if (count === 10) {
      return ''
    }
    // 判斷計算總和是不是等於檢查碼
    if (count !== parseInt(value[9])) {
      return new Error(i18n.t('__pleaseInputPersonalID') + '2')
    }
    return ''
  },
  // 驗證護照
  validatePassport: async (rule, value, userType) => {
    let regex = /^.{7,}$/
    if (!regex.test(value)) {
      return new Error(i18n.t('__pleaseInputLength') + '7')
    }

    // 2.驗證是否重複
    let response = await api.basic.checkValidate({ type: userType, ID: value })
    let rows = response.data.result
    if (rows && rows.length > 0) {
      return new Error(i18n.t('__id') + ' ' + value + i18n.t('__valueUsed'))
    }

    return ''
  },
  // 驗證發票號碼
  validateInvoiceID: async (rule, value, callback) => {
    let regex = /^[a-zA-Z]{2}[0-9]{8}$/
    if (!regex.test(value)) {
      callback(new Error(i18n.t('__pleaseInputInvoiceID')))
    }

    // 2.驗證是否重複
    let response = await api.basic.checkValidate({ type: 'invoice', ID: value })
    let rows = response.data.result
    if (rows && rows.length > 0) {
      callback(new Error(i18n.t('__id') + ' ' + value + i18n.t('__valueUsed')))
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
  },
  // 驗證數字 for el-input-number
  validateInputNumber: (rule, value, callback) => {
    if (value <= 0) {
      callback(new Error(i18n.t('__pleaseInputNumber')))
    }
    callback()
  },
  // 驗證商品
  validateProductID: async (rule, value, callback) => {
    if (!value || value === null) {
      callback(new Error(i18n.t('__pleaseInput')))
    }

    // 2.驗證是否重複
    let response = await api.basic.checkValidate({ type: 'product', ID: value })
    let rows = response.data.result
    if (rows && rows.length > 0) {
      callback(new Error(i18n.t('__id') + ' ' + value + i18n.t('__valueUsed')))
    }

    callback()
  },
  // 驗證專案
  validateProjectID: async (rule, value, callback) => {
    if (!value || value === null) {
      callback(new Error(i18n.t('__pleaseInput')))
    }

    // 2.驗證是否重複
    let response = await api.basic.checkValidate({ type: 'project', ID: value })
    let rows = response.data.result
    if (rows && rows.length > 0) {
      callback(new Error(i18n.t('__id') + ' ' + value + i18n.t('__valueUsed')))
    }

    callback()
  },
  // 驗證儲位
  validateStorageID: async (fromProductID, fromPurpose, fromQty, fromStorageID, callback) => {
    if (fromStorageID === null) {
      if (callback) { callback(new Error(i18n.t('__pleaseInput'))) } else { return i18n.t('__pleaseInput') }
    }

    // 2.驗證是否重複
    let response = await api.stock.checkValidate({
      ProductID: fromProductID,
      Purpose: fromPurpose,
      Qty: fromQty,
      StorageID: fromStorageID })
    let rows = response.data.result
    if (rows && rows.length > 0) {
      if (callback) { callback(new Error(i18n.t('__id') + ' ' + fromStorageID + i18n.t('__cantUse'))) } else { return i18n.t('__id') + ' ' + fromStorageID + i18n.t('__cantUse') }
    }
    if (callback) { callback() } else { return '' }
  },
  // 輸入 地址, 回傳 { City, Post, Address}
  addressSeparate: (fromAddress) => {
    let findCity = ''
    let findPost = ''
    let ddlCity = api.local.getDropdownList({ type: 'City' })
    let postData = api.local.getDropdownList({ type: 'District' })

    // 分離縣市
    ddlCity.forEach(city => {
      let findIndex = fromAddress.indexOf(city.Value)
      if (findIndex > -1) {
        findCity = city.ID
        fromAddress = fromAddress.replace(city.Value, '')
      }
    })

    // 分離區域
    postData.forEach(post => {
      let findIndex = fromAddress.indexOf(post.Value)
      if (findIndex > -1) {
        findPost = post.ID
        fromAddress = fromAddress.replace(post.Value, '')
      }
    })

    return { findCity, findPost, fromAddress }
  },
  validateStorageIDNoCallback: async (fromProductID, fromPurpose, fromQty, fromStorageID) => {
    if (fromStorageID === null) {
      return new Error(i18n.t('__pleaseInput'))
    }

    // 2.驗證是否重複
    let response = await api.stock.checkValidate({
      ProductID: fromProductID,
      Purpose: fromPurpose,
      Qty: fromQty,
      StorageID: fromStorageID })
    let rows = response.data.result
    if (rows && rows.length > 0) {
      return new Error(i18n.t('__id') + ' ' + fromStorageID + i18n.t('__cantUse'))
    }

    return ''
  }
}

export default validate
