import { postEncrypt } from '@/services/utils'

export default {
  signOff: {
    assign: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/signOff/assign', rawData).then(data => {
        return data
      })
    },
    permissionNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/signOff/permissionNew', rawData).then(data => {
        return data
      })
    },
    permissionEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/signOff/permissionEdit', rawData).then(data => {
        return data
      })
    },
    permissionDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/signOff/permissionDelete', rawData).then(data => {
        return data
      })
    },
    getObject: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return postEncrypt('/signOff/getObject', rawData).then(data => {
        return data
      })
    }
  }
}
