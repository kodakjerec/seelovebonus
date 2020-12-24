import { post } from '@/services/utils'

export default {
  stock: {
    inboundOrderShow: ({ keyword, ID }) => {
      let rawData = { keyword, ID }
      return post('/stock/inboundOrderShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/inboundOrderShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    inboundOrderUpdate: ({ form }) => {
      let rawData = { form }
      return post('/stock/inboundOrderUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/inboundOrderUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    inboundOrderDelete: ({ form }) => {
      let rawData = { form }
      return post('/stock/inboundOrderDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/inboundOrderDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    inboundOrderDetailUpdate: ({ form }) => {
      let rawData = { form }
      return post('/stock/inboundOrderDetailUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/inboundOrderDetailUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    inboundOrderDetailDelete: ({ form }) => {
      let rawData = { form }
      return post('/stock/inboundOrderDetailDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/inboundOrderDetailDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    stockNowShow: ({ keyword, ID }) => {
      let rawData = { keyword, ID }
      return post('/stock/stockNowShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/stockNowShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
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
