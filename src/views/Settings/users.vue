<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('__users')" name="first"></el-tab-pane>
      <el-tab-pane :label="$t('__groups')" name="second"></el-tab-pane>
    </el-tabs>
    <page-user
    :users="users"
    :prog-list="proglist"
    @refresh="refresh"
    v-if="activeName==='first'"></page-user>
    <page-group
    :groups="groups"
    :prog-list="proglist"
    @refresh="refresh"
    v-if="activeName==='second'"></page-group>
  </div>
</template>

<script>
import pageUser from './components/pageUser'
import pageGroup from './components/pageGroup'

export default {
  name: 'Users',
  components: {
    pageUser,
    pageGroup
  },
  data () {
    return {
      activeName: 'first',
      users: [],
      groups: [],
      proglist: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀入使用者清單
    preLoading: async function () {
      const response = await this.$api.settings.getUserAndGroupAndProg()
      this.users = response.data.users
      this.groups = response.data.groups
      this.proglist = response.data.proglist
    },
    // 重整畫面
    refresh: function () {
      this.preLoading()
    }
  }
}
</script>
