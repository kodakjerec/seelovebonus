import { post } from '@/services/utils'
import crypto from '@/services/crypto' // 加解密

export default {
  settings: {
    getUserAndGroupAndProg: () => {
      return post('/settings/getUserAndGroupAndProg').then(data => {
        console.log(`%c <<< Response(/rest/settings/getUserAndGroupAndProg)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getUserProg: ({ UserID }) => {
      UserID = crypto.encrypt(UserID)
      let rawData = { UserID }
      return post('/settings/getUserProg', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/getUserProg)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getGroupProg: ({ GroupID }) => {
      let rawData = { GroupID }
      return post('/settings/getGroupProg', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/getGroupProg)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getSetting: ({ type }) => {
      let rawData = { type }
      return post('/settings/getSetting', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/getSetting)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    userNew: ({ form }) => {
      form.UserID = crypto.encrypt(form.UserID)
      form.Password = crypto.encrypt(form.Password)
      let rawData = { form }
      return post('/settings/userNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/userNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    userEdit: ({ form }) => {
      form.UserID = crypto.encrypt(form.UserID)
      form.Password = crypto.encrypt(form.Password)
      let rawData = { form }
      return post('/settings/userEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/userEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    groupProgListDel: ({ GroupID, ProgID }) => {
      let rawData = { GroupID, ProgID }
      return post('/settings/groupProgListDel', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/groupProgListDel)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    groupProgListNew: ({ GroupID, ProgID }) => {
      let rawData = { GroupID, ProgID }
      return post('/settings/groupProgListNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/groupProgListNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    groupNew: ({ GroupID, Name }) => {
      let rawData = { GroupID, Name }
      return post('/settings/groupNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/groupNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    groupEdit: ({ GroupID, Name }) => {
      let rawData = { GroupID, Name }
      return post('/settings/groupEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/groupEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  }
}
