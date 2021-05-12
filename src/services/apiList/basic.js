import { postEncrypt, getFile, uploadFile } from '@/services/utils'

export default {
  basic: {
    // company
    companiesShow: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/basic/companiesShow', rawData).then(data => {
        return data
      })
    },
    companyNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/companyNew', rawData).then(data => {
        return data
      })
    },
    companyEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/companyEdit', rawData).then(data => {
        return data
      })
    },
    companyDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/companyDelete', rawData).then(data => {
        return data
      })
    },
    // customer
    customersShow: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/basic/customersShow', rawData).then(data => {
        return data
      })
    },
    customerNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/customerNew', rawData).then(data => {
        return data
      })
    },
    customerEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/customerEdit', rawData).then(data => {
        return data
      })
    },
    customerDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/customerDelete', rawData).then(data => {
        return data
      })
    },
    customerSearch: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/customerSearch', rawData).then(data => {
        return data
      })
    },
    // employee
    employeesShow: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/basic/employeesShow', rawData).then(data => {
        return data
      })
    },
    employeeNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/employeeNew', rawData).then(data => {
        return data
      })
    },
    employeeEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/employeeEdit', rawData).then(data => {
        return data
      })
    },
    employeeDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/employeeDelete', rawData).then(data => {
        return data
      })
    },
    // product
    productsShow: ({ searchContent }) => {
      let rawData = { searchContent }
      return postEncrypt('/basic/productsShow', rawData).then(data => {
        return data
      })
    },
    productNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/productNew', rawData).then(data => {
        return data
      })
    },
    productEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/productEdit', rawData).then(data => {
        return data
      })
    },
    productDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/productDelete', rawData).then(data => {
        return data
      })
    },
    // product BOM
    productBOMNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/productBOMNew', rawData).then(data => {
        return data
      })
    },
    productBOMEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/productBOMEdit', rawData).then(data => {
        return data
      })
    },
    productBOMDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/productBOMDelete', rawData).then(data => {
        return data
      })
    },
    // project
    projectsShow: ({ keyword }) => {
      let rawData = { keyword }
      return postEncrypt('/basic/projectsShow', rawData).then(data => {
        return data
      })
    },
    projectNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectNew', rawData).then(data => {
        return data
      })
    },
    projectEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectEdit', rawData).then(data => {
        return data
      })
    },
    projectDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectDelete', rawData).then(data => {
        return data
      })
    },
    // project Detail
    projectDetailNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectDetailNew', rawData).then(data => {
        return data
      })
    },
    projectDetailEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectDetailEdit', rawData).then(data => {
        return data
      })
    },
    projectDetailDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectDetailDelete', rawData).then(data => {
        return data
      })
    },
    // project AnzaOrder Detail
    projectAnzaOrderDetailUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectAnzaOrderDetailUpdate', rawData).then(data => {
        return data
      })
    },
    projectAnzaOrderDetailDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectAnzaOrderDetailDelete', rawData).then(data => {
        return data
      })
    },
    // project Performance Bonus
    projectPBonusNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectPBonusNew', rawData).then(data => {
        return data
      })
    },
    projectPBonusEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectPBonusEdit', rawData).then(data => {
        return data
      })
    },
    projectPBonusDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectPBonusDelete', rawData).then(data => {
        return data
      })
    },
    // project Super Bonus
    projectSuperBonusNew: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectSuperBonusNew', rawData).then(data => {
        return data
      })
    },
    projectSuperBonusEdit: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectSuperBonusEdit', rawData).then(data => {
        return data
      })
    },
    projectSuperBonusDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectSuperBonusDelete', rawData).then(data => {
        return data
      })
    },
    // project functions
    projectFunctionsUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/projectFunctionsUpdate', rawData).then(data => {
        return data
      })
    },
    // product functions
    productFunctionsUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/productFunctionsUpdate', rawData).then(data => {
        return data
      })
    },
    checkValidate: ({ type, ID }) => {
      let rawData = { type, ID }
      return postEncrypt('/basic/checkValidate', rawData).then(data => {
        return data
      })
    },
    // storageAddress
    storageAddressUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/storageAddressUpdate', rawData).then(data => {
        return data
      })
    },
    storageAddressBatchIns: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/storageAddressBatchIns', rawData).then(data => {
        return data
      })
    },
    storageAddressDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/storageAddressDelete', rawData).then(data => {
        return data
      })
    },
    storageAddressShow: ({ searchContent, pagination }) => {
      let rawData = { searchContent, pagination }
      return postEncrypt('/basic/storageAddressShow', rawData).then(data => {
        return data
      })
    },
    storageAddressExportExcel: () => {
      let rawData = { }
      return getFile('/basic/storageAddressExportExcel', rawData).then(data => {
        return data
      })
    },
    // 轉交給el-upload處理上傳
    storageAddressUpload: (file) => {
      return uploadFile('/basic/storageAddressUpload', file).then(data => {
        return data
      })
    },
    // bank Accounts
    bankAccountUpdate: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/bankAccountUpdate', rawData).then(data => {
        return data
      })
    },
    bankAccountShow: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/bankAccountShow', rawData).then(data => {
        return data
      })
    },
    bankAccountDelete: ({ form }) => {
      let rawData = { form }
      return postEncrypt('/basic/bankAccountDelete', rawData).then(data => {
        return data
      })
    },
    // others
    getDropdownList: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return postEncrypt('/basic/getDropdownList', rawData).then(data => {
        return data
      })
    },
    getObject: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return postEncrypt('/basic/getObject', rawData).then(data => {
        return data
      })
    }
  }
}
