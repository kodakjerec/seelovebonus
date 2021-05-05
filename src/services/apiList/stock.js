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
    // outbound Order
    outboundOrderShow: ({ keyword }) => {
      let rawData = { keyword }
      return post('/stock/outboundOrderShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/outboundOrderShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    outboundOrderUpdate: ({ form }) => {
      let rawData = { form }
      return post('/stock/outboundOrderUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/outboundOrderUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    outboundOrderDelete: ({ form }) => {
      let rawData = { form }
      return post('/stock/outboundOrderDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/outboundOrderDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    outboundOrderDetailUpdate: ({ form }) => {
      let rawData = { form }
      return post('/stock/outboundOrderDetailUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/outboundOrderDetailUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    outboundOrderDetailDelete: ({ form }) => {
      let rawData = { form }
      return post('/stock/outboundOrderDetailDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/outboundOrderDetailDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // processing Order
    processingOrderShow: ({ keyword }) => {
      let rawData = { keyword }
      return post('/stock/processingOrderShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/processingOrderShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    processingOrderUpdate: ({ form }) => {
      let rawData = { form }
      return post('/stock/processingOrderUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/processingOrderUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    processingOrderDelete: ({ form }) => {
      let rawData = { form }
      return post('/stock/processingOrderDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/processingOrderDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    processingOrderDetailUpdate: ({ form }) => {
      let rawData = { form }
      return post('/stock/processingOrderDetailUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/processingOrderDetailUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    processingOrderDetailDelete: ({ form }) => {
      let rawData = { form }
      return post('/stock/processingOrderDetailDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/processingOrderDetailDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // transport Order
    transportOrderShow: ({ keyword }) => {
      let rawData = { keyword }
      return post('/stock/transportOrderShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/transportOrderShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    transportOrderUpdate: ({ form }) => {
      let rawData = { form }
      return post('/stock/transportOrderUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/transportOrderUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    transportOrderDelete: ({ form }) => {
      let rawData = { form }
      return post('/stock/transportOrderDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/transportOrderDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    transportOrderDetailUpdate: ({ form }) => {
      let rawData = { form }
      return post('/stock/transportOrderDetailUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/transportOrderDetailUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    transportOrderDetailDelete: ({ form }) => {
      let rawData = { form }
      return post('/stock/transportOrderDetailDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/transportOrderDetailDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // stock
    alarm: () => {
      let rawData = { }
      return post('/stock/alarm', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/alarm)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    stockNowShow: ({ searchContent, pagination }) => {
      let rawData = { searchContent, pagination }
      return post('/stock/stockNowShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/stock/stockNowShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    findStorageID: ({ ProductID, Purpose, Qty, StorageID }) => {
      let rawData = { ProductID, Purpose, Qty, StorageID }
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
