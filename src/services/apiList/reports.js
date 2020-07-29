import { post } from '@/services/utils'

export default {
  reports: {
    getDropdownList: ({ type }) => {
      let rawData = { type }
      return post('/reports/getDropdownList', rawData).then(data => {
        console.log(`%c <<< Response(/rest/reports/getDropdownList)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  }
}
