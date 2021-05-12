import { postEncrypt } from '@/services/utils'

export default {
  stock: {
    // inbound Order
    inboundOrderShow: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/stock/inboundOrderShow', rawData).then(data => {
        return data
      })
    },
    inboundOrderUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/inboundOrderUpdate', rawData).then(data => {
        return data
      })
    },
    inboundOrderDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/inboundOrderDelete', rawData).then(data => {
        return data
      })
    },
    inboundOrderDetailUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/inboundOrderDetailUpdate', rawData).then(data => {
        return data
      })
    },
    inboundOrderDetailDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/inboundOrderDetailDelete', rawData).then(data => {
        return data
      })
    },
    // stock
    stockNowShow: ({ searchContent, pagination }) => {
      let rawData = { searchContent, pagination }
      return postEncrypt('/stock/stockNowShow', rawData).then(data => {
        return data
      })
    },
    findStorageID: ({ ProductID, Purpose, Qty }) => {
      let rawData = { ProductID, Purpose, Qty }
      return postEncrypt('/stock/findStorageID', rawData).then(data => {
        return data
      })
    },
    checkValidate: ({ ProductID, Purpose, Qty, StorageID }) => {
      let rawData = { ProductID, Purpose, Qty, StorageID }
      return postEncrypt('/stock/checkValidate', rawData).then(data => {
        return data
      })
    },
    // map
    mapGet: ({ Building, Floor, Area, Column, Row, Grid, StorageID }) => {
      let rawData = { Building, Floor, Area, Column, Row, Grid, StorageID }
      return postEncrypt('/stock/mapGet', rawData).then(data => {
        return data
      })
    },
    mapGetImage: ({ Building, Floor, Area, Column, Row, Grid, StorageID }) => {
      let rawData = { Building, Floor, Area, Column, Row, Grid, StorageID }
      return postEncrypt('/stock/mapGetImage', rawData).then(data => {
        return data
      })
    },
    mapUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/mapUpdate', rawData).then(data => {
        return data
      })
    },
    // others
    getDropdownList: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      console.log('%c >>> getDropdownList: ', 'background-color: blue; color: white; font-size: 14px; font-weight: bold;', rawData)
      return postEncrypt('/stock/getDropdownList', rawData).then(data => {
        return data
      })
    },
    getObject: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      console.log('%c >>> getObject: ', 'background-color: blue; color: white; font-size: 14px; font-weight: bold;', rawData)
      return postEncrypt('/stock/getObject', rawData).then(data => {
        return data
      })
    }
  }
}
