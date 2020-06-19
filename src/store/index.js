import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    isLogin: false,
    menuList: []
  },
  mutations: {
    SET_AUTH (state, options) {
      state.token = options.token
      state.isLogin = options.isLogin
    },
    SET_MENULIST (state, menu) {
      state.menuList = menu
    }
  },
  actions: {
    setAuth (context, options) {
      context.commit('SET_AUTH', {
        token: options.token,
        isLogin: options.isLogin
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
