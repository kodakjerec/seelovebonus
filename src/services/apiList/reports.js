import { postEncrypt, uploadFile } from '@/services/utils'

export default {
  reports: {
    ssrsReports: ({ reportParams, reportName }) => {
      let rawData = { reportParams, reportName }
      return postEncrypt('/reports/ssrsReports', rawData).then(data => {
        return data
      })
    },
    // 轉交給el-upload處理上傳
    wintonInvoiceUpload: (file) => {
      return uploadFile('/reports/wintonInvoiceUpload', file).then(data => {
        console.log(`%c <<< Response(/rest/basic/wintonInvoiceUpload)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
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
