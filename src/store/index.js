import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    isLogin: false,
    userID: '',
    userName: '',
    menuList: [],
    version: '2020.8.3.2'
  },
  mutations: {
    SET_AUTH (state, options) {
      state.token = options.token
      state.isLogin = options.isLogin
      state.userID = options.userID
      state.userName = options.userName
    },
    SET_MENULIST (state, menu) {
      state.menuList = menu
    }
  },
  actions: {
    setAuth (context, options) {
      context.commit('SET_AUTH', {
        token: options.token,
        isLogin: options.isLogin,
        userID: options.userID,
        userName: options.userName
      })
    },
    setMenuList (context, menu) {
      context.commit('SET_MENULIST', menu)
    }
  },
  modules: {
  },
  plugins: [createPersistedState()]
})
