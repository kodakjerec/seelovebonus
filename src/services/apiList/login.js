import { postEncrypt } from '@/services/utils'
import crypto from '@/services/crypto' // 加解密

export default {
  login: {
    login: ({ UserID, Password }) => {
      UserID = crypto.encrypt(UserID)
      Password = crypto.encrypt(Password)
      let rawData = { UserID, Password }
      return postEncrypt('/login/login', rawData).then(data => {
        return data
      })
    },
    logout: ({ UserID }) => {
      UserID = crypto.encrypt(UserID)
      let rawData = { UserID }
      return postEncrypt('/login/logout', rawData).then(data => {
        return data
      })
    },
    getMenu: ({ UserID }) => {
      UserID = crypto.encrypt(UserID)
      let rawData = { UserID }
      return postEncrypt('/login/getMenu', rawData).then(data => {
        return data
      })
    },
    checkPwd: ({ UserID, Password }) => {
      UserID = crypto.encrypt(UserID)
      Password = crypto.encrypt(Password)
      let rawData = { UserID, Password }
      return postEncrypt('/login/checkPwd', rawData).then(data => {
        return data
      })
    },
    version: () => {
      let rawData = {}
      return postEncrypt('/login/version', rawData).then(data => {
        return data
      })
    },
    // others
    getDropdownList: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return postEncrypt('/login/getDropdownList', rawData).then(data => {
        return data
      })
    }
  }
}
