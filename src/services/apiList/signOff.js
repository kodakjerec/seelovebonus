import { post } from '@/services/utils'

export default {
  signOff: {
    assign: ({ form }) => {
      let rawData = { form }
      return post('/signOff/assign', rawData).then(data => {
        console.log(`%c <<< Response(/rest/signOff/assign)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    permissionNew: ({ form }) => {
      let rawData = { form }
      return post('/signOff/permissionNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/signOff/permissionNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    permissionEdit: ({ form }) => {
      let rawData = { form }
      return post('/signOff/permissionEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/signOff/permissionEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    permissionDelete: ({ form }) => {
      let rawData = { form }
      return post('/signOff/permissionDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/signOff/permissionDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getObject: ({ type, keyword }) => {
      let rawData = { type, keyword }
      return post('/signOff/getObject', rawData).then(data => {
        console.log(`%c <<< Response(/rest/signOff/getObject)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  }
}
