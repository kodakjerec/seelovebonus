import { post } from '@/services/utils'

export default {
  reports: {
    employeesToExcel: ({ CompanyID }) => {
      let rawData = { CompanyID }

      return post('/reports/employeesToExcel', rawData).then(data => {
        console.log(`%c <<< Response(/rest/reports/employeesToExcel)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    certificate1ToExcel: ({ Certificate1 }) => {
      let rawData = { Certificate1 }
      return post('/reports/certificate1ToExcel', rawData).then(data => {
        console.log(`%c <<< Response(/rest/reports/certificate1ToExcel)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    certificate2ToExcel: ({ Certificate2 }) => {
      let rawData = { Certificate2 }
      return post('/reports/certificate2ToExcel', rawData).then(data => {
        console.log(`%c <<< Response(/rest/reports/certificate2ToExcel)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    bonus1ToExcel: ({ reportParams }) => {
      let rawData = { reportParams }
      return post('/reports/bonus1ToExcel', rawData).then(data => {
        console.log(`%c <<< Response(/rest/reports/bonus1ToExcel)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    },
    bonus2ToExcel: ({ reportParams }) => {
      let rawData = { reportParams }
      return post('/reports/bonus2ToExcel', rawData).then(data => {
        console.log(`%c <<< Response(/rest/reports/bonus2ToExcel)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
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
