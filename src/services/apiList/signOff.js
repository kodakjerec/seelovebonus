import { post } from '@/services/utils'

export default {
  signOff: {
    assign: ({ form }) => {
      let rawData = { form }
      return post('/signOff/assign', rawData).then(data => {
        console.log(`%c <<< Response(/rest/signOff/assign)⤵ `, 'background-color: #E0455D; color: white; font-size: 14px; font-weight: bold;', data)
        return data
      })
    }
  }
}
