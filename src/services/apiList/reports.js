import { postEncrypt } from '@/services/utils'

export default {
  reports: {
    employeesToExcel: ({ CompanyID }) => {
      let rawData = { CompanyID }

      return postEncrypt('/reports/employeesToExcel', rawData).then(data => {
        return data
      })
    },
    certificate1ToExcel: ({ Certificate1 }) => {
      let rawData = { Certificate1 }
      return postEncrypt('/reports/certificate1ToExcel', rawData).then(data => {
        return data
      })
    },
    certificate2ToExcel: ({ Certificate2 }) => {
      let rawData = { Certificate2 }
      return postEncrypt('/reports/certificate2ToExcel', rawData).then(data => {
        return data
      })
    },
    bonus1ToExcel: ({ reportParams }) => {
      let rawData = { reportParams }
      return postEncrypt('/reports/bonus1ToExcel', rawData).then(data => {
        return data
      })
    },
    bonus2ToExcel: ({ reportParams }) => {
      let rawData = { reportParams }
      return postEncrypt('/reports/bonus2ToExcel', rawData).then(data => {
        return data
      })
    },
    fKOrderPrint: ({ fKOrder }) => {
      let rawData = { fKOrder }
      return postEncrypt('/reports/fKOrderPrint', rawData).then(data => {
        return data
      })
    },
    fKOrderRpt: ({ reportParams }) => {
      let rawData = { reportParams }
      return postEncrypt('/reports/fKOrderRpt', rawData).then(data => {
        return data
      })
    },
    anzaReportTotal: ({ reportParams }) => {
      let rawData = { reportParams }
      return postEncrypt('/reports/anzaReportTotal', rawData).then(data => {
        return data
      })
    },
    getDropdownList: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let rawData = { type, keyword }
      return postEncrypt('/reports/getDropdownList', rawData).then(data => {
        return data
      })
    }
  }
}
