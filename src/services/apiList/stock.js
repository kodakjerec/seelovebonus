import { post } from '@/services/utils'

export default {
  stock: {
    inBoundOrderShow: ({ keyword, ID }) => {
      let rawData = { keyword, ID }
      return post('/stock/inBoundOrderShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/inBoundOrderShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    inBoundOrderUpdate: ({ form }) => {
      let rawData = { form }
      return post('/stock/inBoundOrderUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/inBoundOrderUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    inBoundOrderDelete: ({ form }) => {
      let rawData = { form }
      return post('/stock/inBoundOrderDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/inBoundOrderDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    inBoundOrderDetailUpdate: ({ form }) => {
      let rawData = { form }
      return post('/stock/inBoundOrderDetailUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/inBoundOrderDetailUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    inBoundOrderDetailDelete: ({ form }) => {
      let rawData = { form }
      return post('/stock/inBoundOrderDetailDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/inBoundOrderDetailDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getObject: ({ type, ID }) => {
      let rawData = { type, ID }
      return post('/stock/getObject', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/getObject)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  }
}
