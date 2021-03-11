import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

let enableLoadingMaskTime = Date.now()
export default new Vuex.Store({
  state: {
    token: '',
    isLogin: false,
    userID: '',
    userName: '',
    menuList: [],
    userProg: [],
    version: '2021.02.22.1',
    globalSettings: [],
    // 不用紀錄到localStorage
    loadingCounter: 0,
    isEnableLoadingMask: false
  },
  mutations: {
    RESET_ALL (state) {
      state.token = ''
      state.isLogin = false
      state.userID = ''
      state.userName = ''
      state.menuList = []
      state.userProg = []
      state.globalSettings = []
    },
    SET_AUTH (state, options) {
      state.token = options.token
      state.isLogin = options.isLogin
      state.userID = options.userID
      state.userName = options.userName
    },
    // 共用變數
    SET_MENULIST (state, menu) {
      state.menuList = menu
    },
    SET_USERPROG (state, proglist) {
      state.userProg = proglist
    },
    SET_GLOBALSETTINGS (state, settings) {
      state.globalSettings = settings
    },
    // 讀取遮罩 count
    ADD_LOADING_COUNTER (state) {
      state.loadingCounter += 1
    },
    REMOVE_LOADING_COUNTER (state) {
      state.loadingCounter -= 1
      if (state.loadingCounter < 0) { state.loadingCounter = 0 }
    },
    // 讀取遮罩
    ENABLE_LOADING_MASK (state, isEnable) {
      state.isEnableLoadingMask = isEnable
    },
    RESET_LOADING_MASK (state) {
      state.loadingCounter = 0
      state.isEnableLoadingMask = false
    }
  },
  actions: {
    resetAll (context) {
      context.commit('RESET_ALL')
    },
    setAuth (context, options) {
      context.commit('SET_AUTH', {
        token: options.token,
        isLogin: options.isLogin,
        userID: options.userID,
        userName: options.userName
      })
    },
    // 共用變數
    setMenuList (context, menu) {
      context.commit('SET_MENULIST', menu)
    },
    setUserProg (context, proglist) {
      context.commit('SET_USERPROG', proglist)
    },
    setGlobalSettings (context, settings) {
      context.commit('SET_GLOBALSETTINGS', settings)
    },
    // 讀取遮罩 count
    increaseLoadingCounter ({ dispatch, commit, state }) {
      commit('ADD_LOADING_COUNTER')
      if (state.loadingCounter > 0 && !state.isEnableLoadingMask) {
        dispatch('enableLoadingMask')
      }
    },
    decreaseLoadingCounter ({ dispatch, commit, state }) {
      commit('REMOVE_LOADING_COUNTER')
      if (state.loadingCounter <= 0 && state.isEnableLoadingMask) {
        dispatch('disableLoadingMask')
      }
    },
    // 讀取遮罩
    enableLoadingMask ({ commit, state }) {
      enableLoadingMaskTime = Date.now()
      commit('ENABLE_LOADING_MASK', true)
    },
    disableLoadingMask ({ commit, state }) {
      // 避免切換速度過快而造成畫面閃動，所以定義最小顯示時間
      let minMaskShowPeriod = 300 /* ms */
      let pastMilliseconds = parseInt(Date.now() - enableLoadingMaskTime)
      let isShorterThanMinMaskShowPeriod = minMaskShowPeriod > pastMilliseconds
      let remainMillisenconds = minMaskShowPeriod - pastMilliseconds

      // 若低於最小顯示時間，將使用 setTimout 補足顯示時間後關閉
      setTimeout(() => {
        // 真正要關閉時要確認目前是否還有 Request 執行中(避免延遲過程中又發出 request 被馬上關閉)
        if (state.loadingCounter <= 0 && state.isEnableLoadingMask) {
          commit('ENABLE_LOADING_MASK', false)
        }
      }, isShorterThanMinMaskShowPeriod ? remainMillisenconds : 0)
    },
    resetLoadingMask ({ commit }) {
      commit('RESET_LOADING_MASK')
    }
  },
  modules: {
  },
  plugins: [createPersistedState({
    reducer: state => {
      return {
        token: state.token,
        isLogin: state.isLogin,
        userID: state.userID,
        userName: state.userName,
        menuList: state.menuList,
        userProg: state.userProg,
        version: state.version,
        globalSettings: state.globalSettings
      }
    }
  })]
})
