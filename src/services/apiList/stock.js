import { post } from '@/services/utils'

export default {
  stock: {
    // inbound Order
    inboundOrderShow: ({ keyword }) => {
      let rawData = { keyword }
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
    // stock
    stockNowShow: ({ searchContent, pagination }) => {
      let rawData = { searchContent, pagination }
      return post('/stock/stockNowShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/stockNowShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    findStorageID: ({ ProductID, Purpose, Qty }) => {
      let rawData = { ProductID, Purpose, Qty }
      return post('/stock/findStorageID', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/findStorageID)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    checkValidate: ({ ProductID, Purpose, Qty, StorageID }) => {
      let rawData = { ProductID, Purpose, Qty, StorageID }
      return post('/stock/checkValidate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/checkValidate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // map
    mapGet: ({ Building, Floor, Area, Column, Row, Grid, StorageID }) => {
      let rawData = { Building, Floor, Area, Column, Row, Grid, StorageID }
      return post('/stock/mapGet', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/mapGet)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    mapGetImage: ({ Building, Floor, Area, Column, Row, Grid, StorageID }) => {
      let rawData = { Building, Floor, Area, Column, Row, Grid, StorageID }
      return post('/stock/mapGetImage', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/mapGetImage)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    mapUpdate: ({ form }) => {
      let rawData = { form }
      return post('/stock/mapUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/mapUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // others
    getDropdownList: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return post('/stock/getDropdownList', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/getDropdownList)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getObject: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return post('/stock/getObject', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/getObject)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  }
}
