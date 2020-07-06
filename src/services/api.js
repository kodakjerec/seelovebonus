import req from './auth' // 把request包裝
import crypto from './crypto' // 加解密

export default {
  login: {
    login: ({ UserID, Password }) => {
      UserID = crypto.encrypt(UserID)
      Password = crypto.encrypt(Password)
      let rawData = { UserID, Password }
      return req('post', 'http://localhost:3000/login/login', rawData).then(data => {
        console.log(`%c <<< Response(/rest/login/login)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getMenu: ({ UserID }) => {
      UserID = crypto.encrypt(UserID)
      let rawData = { UserID }
      return req('post', 'http://localhost:3000/login/getMenu', rawData).then(data => {
        console.log(`%c <<< Response(/rest/login/getMenu)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  },
  settings: {
    getUserAndGroupAndProg: () => {
      return req('post', 'http://localhost:3000/settings/getUserAndGroupAndProg').then(data => {
        console.log(`%c <<< Response(/rest/settings/getUserAndGroupAndProg)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getUserProg: ({ UserID }) => {
      UserID = crypto.encrypt(UserID)
      let rawData = { UserID }
      return req('post', 'http://localhost:3000/settings/getUserProg', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/getUserProg)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getGroupProg: ({ GroupID }) => {
      let rawData = { GroupID }
      return req('post', 'http://localhost:3000/settings/getGroupProg', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/getGroupProg)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getSetting: ({ type }) => {
      let rawData = { type }
      return req('post', 'http://localhost:3000/settings/getSetting', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/getSetting)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    userNew: ({ form }) => {
      form.UserID = crypto.encrypt(form.UserID)
      form.Password = crypto.encrypt(form.Password)
      let rawData = { form }
      return req('post', 'http://localhost:3000/settings/userNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/userNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    userEdit: ({ form }) => {
      form.UserID = crypto.encrypt(form.UserID)
      form.Password = crypto.encrypt(form.Password)
      let rawData = { form }
      return req('post', 'http://localhost:3000/settings/userEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/userEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    groupProgListDel: ({ GroupID, ProgID }) => {
      let rawData = { GroupID, ProgID }
      return req('post', 'http://localhost:3000/settings/groupProgListDel', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/groupProgListDel)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    groupProgListNew: ({ GroupID, ProgID }) => {
      let rawData = { GroupID, ProgID }
      return req('post', 'http://localhost:3000/settings/groupProgListNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/groupProgListNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    groupNew: ({ GroupID, Name }) => {
      let rawData = { GroupID, Name }
      return req('post', 'http://localhost:3000/settings/groupNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/groupNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    groupEdit: ({ GroupID, Name }) => {
      let rawData = { GroupID, Name }
      return req('post', 'http://localhost:3000/settings/groupEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/settings/groupEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  },
  basic: {
    companiesShow: () => {
      let rawData = { }
      return req('post', 'http://localhost:3000/basic/companiesShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/companiesShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    companyNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/companyNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/companyNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    companyEdit: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/companyEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/companyEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    customersShow: () => {
      let rawData = { }
      return req('post', 'http://localhost:3000/basic/customersShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/customersShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    customerNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/customerNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/customerNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    customerEdit: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/customerEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/customerEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    employeesShow: () => {
      let rawData = { }
      return req('post', 'http://localhost:3000/basic/employeesShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/employeesShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    employeeNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/employeeNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/employeeNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    employeeEdit: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/employeeEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/employeeEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    productsShow: () => {
      let rawData = { }
      return req('post', 'http://localhost:3000/basic/productsShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productsShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    productNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/productNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    productEdit: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/productEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    productBOMNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/productBOMNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productBOMNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    productBOMEdit: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/productBOMEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productBOMEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    productBOMDelete: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/productBOMDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productBOMDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectsShow: () => {
      let rawData = { }
      return req('post', 'http://localhost:3000/basic/projectsShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectsShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/projectNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectEdit: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/projectEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectDetailNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/projectDetailNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectDetailNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectDetailEdit: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/projectDetailEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectDetailEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectDetailDelete: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/projectDetailDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectDetailDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectPBonusNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/projectPBonusNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectPBonusNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectPBonusEdit: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/projectPBonusEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectPBonusEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectPBonusDelete: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/projectPBonusDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectPBonusDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectSuperBonusNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/projectSuperBonusNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectSuperBonusNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectSuperBonusEdit: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/projectSuperBonusEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectSuperBonusEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectSuperBonusDelete: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/basic/projectSuperBonusDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectSuperBonusDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getDropdownList: ({ type }) => {
      let rawData = { type }
      return req('post', 'http://localhost:3000/basic/getDropdownList', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/getDropdownList)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getObject: ({ type, ID }) => {
      let rawData = { type, ID }
      return req('post', 'http://localhost:3000/basic/getObject', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/getObject)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  },
  orders: {
    ordersShow: () => {
      let rawData = { }
      return req('post', 'http://localhost:3000/orders/ordersShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/ordersShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/orders/orderNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderCustomerNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/orders/orderCustomerNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderCustomerNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderCustomerEdit: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/orders/orderCustomerEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderCustomerEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    orderDetailNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/orders/orderDetailNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/orderDetailNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    collectionRecordsNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/orders/collectionRecordsNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/collectionRecordsNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    collectionRecordsEdit: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/orders/collectionRecordsEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/collectionRecordsEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    invoiceHeadNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/orders/invoiceHeadNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/invoiceHeadNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    invoiceDetailNew: ({ form }) => {
      let rawData = { form }
      return req('post', 'http://localhost:3000/orders/invoiceDetailNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/invoiceDetailNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getDropdownList: ({ type }) => {
      let rawData = { type }
      return req('post', 'http://localhost:3000/orders/getDropdownList', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/getDropdownList)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getObject: ({ type, ID }) => {
      let rawData = { type, ID }
      return req('post', 'http://localhost:3000/orders/getObject', rawData).then(data => {
        console.log(`%c <<< Response(/rest/orders/getObject)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  }
}
