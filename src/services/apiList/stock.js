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
    // outbound Order
    outboundOrderShow: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/stock/outboundOrderShow', rawData).then(data => {
        return data
      })
    },
    outboundOrderUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/outboundOrderUpdate', rawData).then(data => {
        return data
      })
    },
    outboundOrderDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/outboundOrderDelete', rawData).then(data => {
        return data
      })
    },
    outboundOrderDetailUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/outboundOrderDetailUpdate', rawData).then(data => {
        return data
      })
    },
    outboundOrderDetailDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/outboundOrderDetailDelete', rawData).then(data => {
        return data
      })
    },
    // processing Order
    processingOrderShow: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/stock/processingOrderShow', rawData).then(data => {
        return data
      })
    },
    processingOrderUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/processingOrderUpdate', rawData).then(data => {
        return data
      })
    },
    processingOrderDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/processingOrderDelete', rawData).then(data => {
        return data
      })
    },
    processingOrderDetailUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/processingOrderDetailUpdate', rawData).then(data => {
        return data
      })
    },
    processingOrderDetailDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/processingOrderDetailDelete', rawData).then(data => {
        return data
      })
    },
    // transport Order
    transportOrderShow: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/stock/transportOrderShow', rawData).then(data => {
        return data
      })
    },
    transportOrderUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/transportOrderUpdate', rawData).then(data => {
        return data
      })
    },
    transportOrderDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/transportOrderDelete', rawData).then(data => {
        return data
      })
    },
    transportOrderDetailUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/transportOrderDetailUpdate', rawData).then(data => {
        return data
      })
    },
    transportOrderDetailDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/stock/transportOrderDetailDelete', rawData).then(data => {
        return data
      })
    },
    // stock
    alarm: () => {
      let rawData = { }
      return postEncrypt('/stock/alarm', rawData).then(data => {
        return data
      })
    },
    stockNowShow: ({ searchContent, pagination }) => {
      let rawData = { searchContent, pagination }
      return postEncrypt('/stock/stockNowShow', rawData).then(data => {
        return data
      })
    },
    findStorageID: ({ ProductID, Purpose, Qty, StorageID }) => {
      let rawData = { ProductID, Purpose, Qty, StorageID }
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
      return postEncrypt('/stock/getDropdownList', rawData).then(data => {
        return data
      })
    },
    getObject: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return postEncrypt('/stock/getObject', rawData).then(data => {
        return data
      })
    }
  }
}
