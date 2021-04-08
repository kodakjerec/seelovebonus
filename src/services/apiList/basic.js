import { getFile, post, uploadFile } from '@/services/utils'

export default {
  basic: {
    // company
    companiesShow: ({ keyword }) => {
      let rawData = { keyword }
      return post('/basic/companiesShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/companiesShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    companyNew: ({ form }) => {
      let rawData = { form }
      return post('/basic/companyNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/companyNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    companyEdit: ({ form }) => {
      let rawData = { form }
      return post('/basic/companyEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/companyEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    companyDelete: ({ form }) => {
      let rawData = { form }
      return post('/basic/companyDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/companyDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // customer
    customersShow: ({ keyword }) => {
      let rawData = { keyword }
      return post('/basic/customersShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/customersShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    customerNew: ({ form }) => {
      let rawData = { form }
      return post('/basic/customerNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/customerNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    customerEdit: ({ form }) => {
      let rawData = { form }
      return post('/basic/customerEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/customerEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    customerDelete: ({ form }) => {
      let rawData = { form }
      return post('/basic/customerDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/customerDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    customerSearch: ({ form }) => {
      let rawData = { form }
      return post('/basic/customerSearch', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/customerSearch)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // employee
    employeesShow: ({ keyword }) => {
      let rawData = { keyword }
      return post('/basic/employeesShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/employeesShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    employeeNew: ({ form }) => {
      let rawData = { form }
      return post('/basic/employeeNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/employeeNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    employeeEdit: ({ form }) => {
      let rawData = { form }
      return post('/basic/employeeEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/employeeEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    employeeDelete: ({ form }) => {
      let rawData = { form }
      return post('/basic/employeeDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/employeeDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // product
    productsShow: ({ searchContent }) => {
      let rawData = { searchContent }
      return post('/basic/productsShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productsShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    productNew: ({ form }) => {
      let rawData = { form }
      return post('/basic/productNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    productEdit: ({ form }) => {
      let rawData = { form }
      return post('/basic/productEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    productDelete: ({ form }) => {
      let rawData = { form }
      return post('/basic/productDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // product BOM
    productBOMNew: ({ form }) => {
      let rawData = { form }
      return post('/basic/productBOMNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productBOMNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    productBOMEdit: ({ form }) => {
      let rawData = { form }
      return post('/basic/productBOMEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productBOMEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    productBOMDelete: ({ form }) => {
      let rawData = { form }
      return post('/basic/productBOMDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productBOMDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // project
    projectsShow: ({ keyword }) => {
      let rawData = { keyword }
      return post('/basic/projectsShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectsShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectNew: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectEdit: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectDelete: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // project Detail
    projectDetailNew: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectDetailNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectDetailNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectDetailEdit: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectDetailEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectDetailEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectDetailDelete: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectDetailDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectDetailDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // project AnzaOrder Detail
    projectAnzaOrderDetailUpdate: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectAnzaOrderDetailUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectAnzaOrderDetailUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectAnzaOrderDetailDelete: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectAnzaOrderDetailDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectAnzaOrderDetailDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // project Performance Bonus
    projectPBonusNew: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectPBonusNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectPBonusNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectPBonusEdit: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectPBonusEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectPBonusEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectPBonusDelete: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectPBonusDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectPBonusDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // project Super Bonus
    projectSuperBonusNew: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectSuperBonusNew', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectSuperBonusNew)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectSuperBonusEdit: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectSuperBonusEdit', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectSuperBonusEdit)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    projectSuperBonusDelete: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectSuperBonusDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectSuperBonusDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // project functions
    projectFunctionsUpdate: ({ form }) => {
      let rawData = { form }
      return post('/basic/projectFunctionsUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/projectFunctionsUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // product functions
    productFunctionsUpdate: ({ form }) => {
      let rawData = { form }
      return post('/basic/productFunctionsUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/productFunctionsUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    checkValidate: ({ type, ID }) => {
      let rawData = { type, ID }
      return post('/basic/checkValidate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/checkValidate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // storageAddress
    storageAddressUpdate: ({ form }) => {
      let rawData = { form }
      return post('/basic/storageAddressUpdate', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/storageAddressUpdate)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    storageAddressBatchIns: ({ form }) => {
      let rawData = { form }
      return post('/basic/storageAddressBatchIns', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/storageAddressBatchIns)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    storageAddressDelete: ({ form }) => {
      let rawData = { form }
      return post('/basic/storageAddressDelete', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/storageAddressDelete)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    storageAddressShow: ({ searchContent, pagination }) => {
      let rawData = { searchContent, pagination }
      return post('/basic/storageAddressShow', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/storageAddressShow)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    storageAddressExportExcel: () => {
      let rawData = { }
      return getFile('/basic/storageAddressExportExcel', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/storageAddressExportExcel)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // 轉交給el-upload處理上傳
    storageAddressUpload: (file) => {
      return uploadFile('/basic/storageAddressUpload', file).then(data => {
        console.log(`%c <<< Response(/rest/basic/storageAddressUpload)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    // others
    getDropdownList: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return post('/basic/getDropdownList', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/getDropdownList)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getObject: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return post('/basic/getObject', rawData).then(data => {
        console.log(`%c <<< Response(/rest/basic/getObject)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  }
}
