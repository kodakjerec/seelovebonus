import { postEncrypt } from '@/services/utils'

export default {
  reports: {
    ssrsReports: ({ reportParams, reportName }) => {
      let rawData = { reportParams, reportName }
      return postEncrypt('/reports/ssrsReports', rawData).then(data => {
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
