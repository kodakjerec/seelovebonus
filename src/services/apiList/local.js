// 在前端就先篩選數值
import store from '@/store/index'

let globalSettngs = store.state.globalSettings
export default {
  local: {
    getDropdownList: ({ type, keyword }) => {
      if (!keyword) {
        keyword = ''
      }
      let list = globalSettngs.filter(item => { return item.Category === type })
      // 特例：ID 是數字型態時, 專用排序 (避免排成 1,10,11,2,20,21)
      switch (type) {
        case 'City':
        case 'LunarTime':
          list = list.sort(function (a, b) {
            return a.ID - b.ID
          })
          break
      }
      return list
    }
  }
}
