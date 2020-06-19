import req from './auth' // 把request包裝
import crypto from './crypto' // 加解密

export default {
  login: {
    login: ({ UserId, Password }) => {
      UserId = crypto.encrypt(UserId)
      Password = crypto.encrypt(Password)
      let rawData = { UserId, Password }
      return req('post', 'http://localhost:3000/login/login', rawData).then(data => {
        console.log(`%c <<< Response(/rest/login/login)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getMenu: ({ UserId }) => {
      UserId = crypto.encrypt(UserId)
      let rawData = { UserId }
      return req('post', 'http://localhost:3000/login/getMenu', rawData).then(data => {
        console.log(`%c <<< Response(/rest/login/getMenu)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  },
  settings: {
    getUserAndGroupAndProg: () => {
      return req('post', 'http://localhost:3000/settings/getUserAndGroupAndProg').then(data => {
        console.log(`%c <<< Response(/rest/settings/getUserAndGroupAndProg)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getUserProg: ({ UserId }) => {
      UserId = crypto.encrypt(UserId)
      let rawData = { UserId }
      return req('post', 'http://localhost:3000/settings/getUserProg', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/getUserProg)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  }
}
