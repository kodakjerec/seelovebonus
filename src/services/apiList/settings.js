import { post } from '@/services/utils'
import crypto from '@/services/crypto' // 加解密

export default {
  settings: {
    // user
    getUserProg: ({ UserID }) => {
      UserID = crypto.encrypt(UserID)
      let rawData = { UserID }
      return post('/settings/getUserProg', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/getUserProg)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
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
    userUpdatePassword: ({ form }) => {
      form.UserID = crypto.encrypt(form.UserID)
      form.Password = crypto.encrypt(form.Password)
      let rawData = { form }
      return post('/settings/userUpdatePassword', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/userUpdatePassword)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // group Program List
    groupProgListDel: ({ GroupID, Row }) => {
      let rawData = { GroupID, Row }
      return post('/settings/groupProgListDel', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/groupProgListDel)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    groupProgListNew: ({ GroupID, Row }) => {
      let rawData = { GroupID, Row }
      return post('/settings/groupProgListNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/groupProgListNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    groupProgListEdit: ({ GroupID, Row }) => {
      let rawData = { GroupID, Row }
      return post('/settings/groupProgListEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/groupProgListEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // group
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
    },
    // settings
    settingsNew: ({ form }) => {
      let rawData = { form }
      return post('/settings/settingsNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/settingsNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    settingsEdit: ({ form }) => {
      let rawData = { form }
      return post('/settings/settingsEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/settingsEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    settingsDelete: ({ form }) => {
      let rawData = { form }
      return post('/settings/settingsDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/settingsDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // announce
    announcementShow: ({ keyword }) => {
      let rawData = { keyword }
      return post('/settings/announcementShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/announcementShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    announcementNew: ({ form }) => {
      let rawData = { form }
      return post('/settings/announcementNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/announcementNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    announcementEdit: ({ form }) => {
      let rawData = { form }
      return post('/settings/announcementEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/announcementEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    announcementDelete: ({ form }) => {
      let rawData = { form }
      return post('/settings/announcementDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/announcementDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // others
    getDropdownList: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return post('/settings/getDropdownList', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/getDropdownList)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getObject: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return post('/settings/getObject', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/getObject)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  }
}
