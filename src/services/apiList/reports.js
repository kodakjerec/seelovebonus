import { post, getFile } from '@/services/utils'

export default {
  reports: {
    employees: ({ CompanyID }) => {
      let rawData = { CompanyID }
      return post('/reports/employees', rawData).then(data => {
        console.log(`%c <<< Response(/rest/reports/employees)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    bonus1: ({ form }) => {
      let rawData = { form }
      return post('/reports/bonus1', rawData).then(data => {
        console.log(`%c <<< Response(/rest/reports/bonus1)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    employeesToExcel: ({ CompanyID, columns }) => {
      let rawData = { CompanyID, columns }

      return getFile('/reports/employeesToExcel', rawData).then(data => {
        console.log(`%c <<< Response(/rest/reports/employeesToExcel)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    certificate1ToExcel: ({ Certificate1 }) => {
      let rawData = { Certificate1 }
      return getFile('/reports/certificate1ToExcel', rawData).then(data => {
        console.log(`%c <<< Response(/rest/reports/certificate1ToExcel)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    certificate2ToExcel: ({ Certificate2 }) => {
      let rawData = { Certificate2 }
      return getFile('/reports/certificate2ToExcel', rawData).then(data => {
        console.log(`%c <<< Response(/rest/reports/certificate2ToExcel)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    bonus1ToExcel: ({ StartDate, EndDate, columns }) => {
      let rawData = { StartDate, EndDate, columns }
      return getFile('/reports/bonus1ToExcel', rawData).then(data => {
        console.log(`%c <<< Response(/rest/reports/bonus1ToExcel)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    getDropdownList: ({ type }) => {
      let rawData = { type }
      return post('/reports/getDropdownList', rawData).then(data => {
        console.log(`%c <<< Response(/rest/reports/getDropdownList)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  }
}
