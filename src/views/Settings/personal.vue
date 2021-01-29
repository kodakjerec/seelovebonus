<template>
  <div>
    <el-button-group>
      <el-button @click="showForm">{{$t('__edit')+$t('__pwd')}}</el-button>
      <el-button @click="clearSearchSettings">{{$t('__clearSearchSettings')}}</el-button>
    </el-button-group>
    <new-form
        v-if="dialogShowUpdatePassword"
        :dialog-type="dialogTypeUpdatePassword"
        :dialog-show="dialogShowUpdatePassword"
        :user="user"
        @dialog-cancel="dialogCancel"
        @dialog-save="dialogSave"></new-form>
  </div>
</template>

<script>
import newForm from './components/userUpdatePassword'

export default {
  name: 'Personal',
  components: {
    newForm
  },
  data () {
    return {
      user: {},
      dialogTypeUpdatePassword: 'edit',
      dialogShowUpdatePassword: false
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    preLoading: async function () {
      let response = await this.$api.settings.getObject({ type: 'user', keyword: this.$store.state.userID })
      this.user = response.data.result[0]
    },
    // 開啟表單
    showForm: function () {
      this.dialogTypeUpdatePassword = 'edit'
      this.dialogShowUpdatePassword = true
    },
    dialogCancel: function () {
      this.dialogShowUpdatePassword = false
    },
    dialogSave: function () {
      this.dialogShowUpdatePassword = false
    },
    // 清除搜尋相關的localstorage
    clearSearchSettings: function () {
      for (let key in localStorage) {
        if (key.indexOf('searchHistory:') >= 0) {
          localStorage.removeItem(key)
        }
      }
      this.$alert(this.$t('__clearSearchSettings') + '： OK')
    }
  }
}
</script>
