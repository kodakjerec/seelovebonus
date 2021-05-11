import { postEncrypt } from '@/services/utils'
import crypto from '@/services/crypto' // 加解密

export default {
  settings: {
    // user
    getUserProg: ({ UserID }) => {
      UserID = crypto.encrypt(UserID)
      let rawData = { UserID }
      return postEncrypt('/settings/getUserProg', rawData).then(data => {
        return data
      })
    },
    userNew: ({ form }) => {
      form.UserID = crypto.encrypt(form.UserID)
      form.Password = crypto.encrypt(form.Password)
      let rawData = { form }
      return postEncrypt('/settings/userNew', rawData).then(data => {
        return data
      })
    },
    userEdit: ({ form }) => {
      form.UserID = crypto.encrypt(form.UserID)
      form.Password = crypto.encrypt(form.Password)
      let rawData = { form }
      return postEncrypt('/settings/userEdit', rawData).then(data => {
        return data
      })
    },
    userUpdatePassword: ({ form }) => {
      form.UserID = crypto.encrypt(form.UserID)
      form.Password = crypto.encrypt(form.Password)
      let rawData = { form }
      return postEncrypt('/settings/userUpdatePassword', rawData).then(data => {
        return data
      })
    },
    // group Program List
    groupProgListDel: ({ GroupID, Row }) => {
      let rawData = { GroupID, Row }
      return postEncrypt('/settings/groupProgListDel', rawData).then(data => {
        return data
      })
    },
    groupProgListNew: ({ GroupID, Row }) => {
      let rawData = { GroupID, Row }
      return postEncrypt('/settings/groupProgListNew', rawData).then(data => {
        return data
      })
    },
    groupProgListEdit: ({ GroupID, Row }) => {
      let rawData = { GroupID, Row }
      return postEncrypt('/settings/groupProgListEdit', rawData).then(data => {
        return data
      })
    },
    // group
    groupNew: ({ GroupID, Name }) => {
      let rawData = { GroupID, Name }
      return postEncrypt('/settings/groupNew', rawData).then(data => {
        return data
      })
    },
    groupEdit: ({ GroupID, Name }) => {
      let rawData = { GroupID, Name }
      return postEncrypt('/settings/groupEdit', rawData).then(data => {
        return data
      })
    },
    // settings
    settingsNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/settings/settingsNew', rawData).then(data => {
        return data
      })
    },
    settingsEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/settings/settingsEdit', rawData).then(data => {
        return data
      })
    },
    settingsDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/settings/settingsDelete', rawData).then(data => {
        return data
      })
    },
    // announce
    announcementShow: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/settings/announcementShow', rawData).then(data => {
        return data
      })
    },
    announcementNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/settings/announcementNew', rawData).then(data => {
        return data
      })
    },
    announcementEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/settings/announcementEdit', rawData).then(data => {
        return data
      })
    },
    announcementDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/settings/announcementDelete', rawData).then(data => {
        return data
      })
    },
    // others
    getDropdownList: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return postEncrypt('/settings/getDropdownList', rawData).then(data => {
        return data
      })
    },
    getObject: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return postEncrypt('/settings/getObject', rawData).then(data => {
        return data
      })
    }
  }
}
