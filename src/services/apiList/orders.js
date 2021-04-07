import { post } from '@/services/utils'

export default {
  orders: {
    // Order
    ordersShowGroup: () => {
      let rawData = {}
      return post('/orders/ordersShowGroup', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/ordersShowGroup)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    ordersShow: ({ searchContent, pagination, sortable, ID }) => {
      let rawData = { searchContent, pagination, sortable, ID }
      return post('/orders/ordersShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/ordersShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderNew: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderEdit: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderDelete: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderInvalid: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderInvalid', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderInvalid)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // Order Customer
    orderCustomerNew: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderCustomerNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderCustomerNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderCustomerEdit: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderCustomerEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderCustomerEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // Order Detail
    orderDetailNew: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderDetailNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderDetailNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderDetailEdit: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderDetailEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderDetailEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderDetailDelete: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderDetailDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderDetailDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // Certificate1
    // Certificate2
    certificate1Show: ({ keyword }) => {
      let rawData = { keyword }
      return post('/orders/certificate1Show', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/certificate1Show)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    certificate2Show: ({ keyword }) => {
      let rawData = { keyword }
      return post('/orders/certificate2Show', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/certificate2Show)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderCertificate1New: ({ form }) => {
      let rawData = { form }

      return post('/orders/orderCertificate1New', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderCertificate1New)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderCertificate2New: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderCertificate2New', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderCertificate2New)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderCertificate1Edit: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderCertificate1Edit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderCertificate1Edit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderCertificate2Edit: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderCertificate2Edit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderCertificate2Edit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderCertificate1Delete: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderCertificate1Delete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderCertificate1Delete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderCertificate2Delete: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderCertificate2Delete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderCertificate2Delete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // Collection Records
    collectionRecordsNew: ({ form }) => {
      let rawData = { form }
      return post('/orders/collectionRecordsNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/collectionRecordsNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    collectionRecordsEdit: ({ form }) => {
      let rawData = { form }
      return post('/orders/collectionRecordsEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/collectionRecordsEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    collectionRecordsDelete: ({ form }) => {
      let rawData = { form }
      return post('/orders/collectionRecordsDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/collectionRecordsDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    collectionRecordsFunctions: ({ type, OrderID, Seq, BindSeq }) => {
      let rawData = { type, OrderID, Seq, BindSeq }
      return post('/orders/collectionRecordsFunctions', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/collectionRecordsFunctions)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // Invoice
    invoiceShow: ({ keyword }) => {
      let rawData = { keyword }
      return post('/orders/invoiceShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/invoiceShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    invoiceHeadNew: ({ form }) => {
      let rawData = { form }
      return post('/orders/invoiceHeadNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/invoiceHeadNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    invoiceHeadEdit: ({ form }) => {
      let rawData = { form }
      return post('/orders/invoiceHeadEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/invoiceHeadEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    invoiceHeadInvalid: ({ form }) => {
      let rawData = { form }
      return post('/orders/invoiceHeadInvalid', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/invoiceHeadInvalid)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    invoiceHeadDelete: ({ form }) => {
      let rawData = { form }
      return post('/orders/invoiceHeadDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/invoiceHeadDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    invoiceFunctions: ({ type, OrderID, InvoiceID, Seq }) => {
      let rawData = { type, OrderID, InvoiceID, Seq }
      return post('/orders/invoiceFunctions', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/invoiceFunctions)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // Invoice Detail
    invoiceDetailNew: ({ form }) => {
      let rawData = { form }
      return post('/orders/invoiceDetailNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/invoiceDetailNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // Order Functions
    orderFunctionsUpdate: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderFunctionsUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderFunctionsUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // Order Detail Functions
    orderDetailFunctionsUpdate: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderDetailFunctionsUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderDetailFunctionsUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderDetailFunctionsDelete: ({ form }) => {
      let rawData = { form }
      return post('/orders/orderDetailFunctionsDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderDetailFunctionsDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // fK Order
    fKOrdersShow: ({ searchContent, pagination, sortable, ID }) => {
      let rawData = { searchContent, pagination, sortable, ID }
      return post('/orders/fKOrdersShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/fKOrdersShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // Anza Order
    anzaShowGroup: () => {
      let rawData = {}
      return post('/orders/anzaShowGroup', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/anzaShowGroup)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    anzaOrderShow: ({ keyword }) => {
      let rawData = { keyword }
      return post('/orders/anzaOrderShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/anzaOrderShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    anzaOrderShow2: ({ searchContent, pagination, sortable, ID }) => {
      let rawData = { searchContent, pagination, sortable, ID }
      return post('/orders/anzaOrderShow2', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/anzaOrderShow2)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    anzaAlarm: () => {
      let rawData = { }
      return post('/orders/anzaAlarm', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/anzaAlarm)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    anzaOperate: ({ form }) => {
      let rawData = { form }
      return post('/orders/anzaOperate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/anzaOperate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    anzaOrderUpdate: ({ form }) => {
      let rawData = { form }
      return post('/orders/anzaOrderUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/anzaOrderUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // Order Installment
    installmentDetailShow: ({ keyword }) => {
      let rawData = { keyword }
      return post('/orders/installmentDetailShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/installmentDetailShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    installmentDetailUpdate: ({ form }) => {
      let rawData = { form }
      return post('/orders/installmentDetailUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/installmentDetailUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    installmentDetailDelete: ({ form }) => {
      let rawData = { form }
      return post('/orders/installmentDetailDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/installmentDetailDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // Others
    getDropdownList: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return post('/orders/getDropdownList', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/getDropdownList)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data, rawData)
        return data
      })
    },
    getObject: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return post('/orders/getObject', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/getObject)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data, rawData)
        return data
      })
    }
  }
}
