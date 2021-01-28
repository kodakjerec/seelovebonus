import { post } from '@/services/utils'
import crypto from '@/services/crypto' // 加解密

export default {
  login: {
    login: ({ UserID, Password }) => {
      UserID = crypto.encrypt(UserID)
      Password = crypto.encrypt(Password)
      let rawData = { UserID, Password }
      return post('/login/login', rawData).then(data => {
        console.log(`%c <<< Response(/rest/login/login)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    logout: ({ UserID }) => {
      UserID = crypto.encrypt(UserID)
      let rawData = { UserID }
      return post('/login/logout', rawData).then(data => {
        console.log(`%c <<< Response(/rest/login/logout)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getMenu: ({ UserID }) => {
      UserID = crypto.encrypt(UserID)
      let rawData = { UserID }
      return post('/login/getMenu', rawData).then(data => {
        console.log(`%c <<< Response(/rest/login/getMenu)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    checkPwd: ({ UserID, Password }) => {
      UserID = crypto.encrypt(UserID)
      Password = crypto.encrypt(Password)
      let rawData = { UserID, Password }
      return post('/login/checkPwd', rawData).then(data => {
        console.log(`%c <<< Response(/rest/login/checkPwd)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    version: () => {
      let rawData = {}
      return post('/login/version', rawData).then(data => {
        console.log(`%c <<< Response(/rest/login/version)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  }
}
