import { postEncrypt } from '@/services/utils'

export default {
  orders: {
    // Order
    ordersShowGroup: () => {
      let rawData = {}
      return postEncrypt('/orders/ordersShowGroup', rawData).then(data => {
        return data
      })
    },
    ordersShow: ({ searchContent, pagination, sortable, ID }) => {
      let rawData = { searchContent, pagination, sortable, ID }
      return postEncrypt('/orders/ordersShow', rawData).then(data => {
        return data
      })
    },
    orderNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderNew', rawData).then(data => {
        return data
      })
    },
    orderEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderEdit', rawData).then(data => {
        return data
      })
    },
    orderDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderDelete', rawData).then(data => {
        return data
      })
    },
    orderInvalid: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderInvalid', rawData).then(data => {
        return data
      })
    },
    // Order Customer
    orderCustomerNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderCustomerNew', rawData).then(data => {
        return data
      })
    },
    orderCustomerEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderCustomerEdit', rawData).then(data => {
        return data
      })
    },
    // Order Detail
    orderDetailNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderDetailNew', rawData).then(data => {
        return data
      })
    },
    orderDetailEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderDetailEdit', rawData).then(data => {
        return data
      })
    },
    orderDetailDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderDetailDelete', rawData).then(data => {
        return data
      })
    },
    // Certificate1
    // Certificate2
    certificate1Show: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/orders/certificate1Show', rawData).then(data => {
        return data
      })
    },
    certificate2Show: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/orders/certificate2Show', rawData).then(data => {
        return data
      })
    },
    orderCertificate1New: ({ form }) => {
      let rawData = { form }

      return postEncrypt('/orders/orderCertificate1New', rawData).then(data => {
        return data
      })
    },
    orderCertificate2New: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderCertificate2New', rawData).then(data => {
        return data
      })
    },
    orderCertificate1Edit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderCertificate1Edit', rawData).then(data => {
        return data
      })
    },
    orderCertificate2Edit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderCertificate2Edit', rawData).then(data => {
        return data
      })
    },
    orderCertificate1Delete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderCertificate1Delete', rawData).then(data => {
        return data
      })
    },
    orderCertificate2Delete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderCertificate2Delete', rawData).then(data => {
        return data
      })
    },
    // Collection Records
    collectionRecordsNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/collectionRecordsNew', rawData).then(data => {
        return data
      })
    },
    collectionRecordsEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/collectionRecordsEdit', rawData).then(data => {
        return data
      })
    },
    collectionRecordsDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/collectionRecordsDelete', rawData).then(data => {
        return data
      })
    },
    collectionRecordsFunctions: ({ type, OrderID, Seq, BindSeq }) => {
      let rawData = { type, OrderID, Seq, BindSeq }
      return postEncrypt('/orders/collectionRecordsFunctions', rawData).then(data => {
        return data
      })
    },
    // Invoice
    invoiceShow: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/orders/invoiceShow', rawData).then(data => {
        return data
      })
    },
    invoiceHeadNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/invoiceHeadNew', rawData).then(data => {
        return data
      })
    },
    invoiceHeadEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/invoiceHeadEdit', rawData).then(data => {
        return data
      })
    },
    invoiceHeadInvalid: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/invoiceHeadInvalid', rawData).then(data => {
        return data
      })
    },
    invoiceFunctions: ({ type, OrderID, InvoiceID, Seq }) => {
      let rawData = { type, OrderID, InvoiceID, Seq }
      return postEncrypt('/orders/invoiceFunctions', rawData).then(data => {
        return data
      })
    },
    // Invoice Detail
    invoiceDetailNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/invoiceDetailNew', rawData).then(data => {
        return data
      })
    },
    // Order Functions
    orderFunctionsUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderFunctionsUpdate', rawData).then(data => {
        return data
      })
    },
    // Order Detail Functions
    orderDetailFunctionsUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderDetailFunctionsUpdate', rawData).then(data => {
        return data
      })
    },
    orderDetailFunctionsDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/orderDetailFunctionsDelete', rawData).then(data => {
        return data
      })
    },
    // fK Order
    fKOrdersShow: ({ searchContent, pagination, sortable, ID }) => {
      let rawData = { searchContent, pagination, sortable, ID }
      return postEncrypt('/orders/fKOrdersShow', rawData).then(data => {
        return data
      })
    },
    // Anza Order
    anzaShowGroup: () => {
      let rawData = {}
      return postEncrypt('/orders/anzaShowGroup', rawData).then(data => {
        return data
      })
    },
    anzaOrderShow: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/orders/anzaOrderShow', rawData).then(data => {
        return data
      })
    },
    anzaOrderShow2: ({ searchContent, pagination, sortable, ID }) => {
      let rawData = { searchContent, pagination, sortable, ID }
      return postEncrypt('/orders/anzaOrderShow2', rawData).then(data => {
        return data
      })
    },
    anzaAlarm: () => {
      let rawData = { }
      return postEncrypt('/orders/anzaAlarm', rawData).then(data => {
        return data
      })
    },
    anzaOperate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/anzaOperate', rawData).then(data => {
        return data
      })
    },
    anzaOrderUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/anzaOrderUpdate', rawData).then(data => {
        return data
      })
    },
    // Order Installment
    installmentDetailShow: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/orders/installmentDetailShow', rawData).then(data => {
        return data
      })
    },
    installmentDetailUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/installmentDetailUpdate', rawData).then(data => {
        return data
      })
    },
    installmentDetailDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/orders/installmentDetailDelete', rawData).then(data => {
        return data
      })
    },
    // Others
    getDropdownList: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      console.log('%c >>> getDropdownList: ', 'background-color: blue; color: white; font-size: 14px; font-weight: bold;', rawData)
      return postEncrypt('/orders/getDropdownList', rawData).then(data => {
        return data
      })
    },
    getObject: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      console.log('%c >>> getObject: ', 'background-color: blue; color: white; font-size: 14px; font-weight: bold;', rawData)
      return postEncrypt('/orders/getObject', rawData).then(data => {
        return data
      })
    }
  }
}
