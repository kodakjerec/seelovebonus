import axios from 'axios'

export default {
  baseData: {
    line_cell: ({ lineId }) => {
      let rawData = { lineId }
      return axios.post('http://localhost:3000/baseData', rawData).then(data => {
        console.log(`%c <<< Response(/rest/common/common0008)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  }
}
