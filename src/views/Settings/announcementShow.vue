<template>
  <el-form>
    <el-button-group>
      <el-button v-show="buttonsShowUser.new" type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
    </el-button-group>
    <search-button @search="search"></search-button>
    <p style="height:1px" />
    <el-table
      :data="list"
      stripe
      border
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="ID"
        :label="$t('__id')"
        width="100">
      </el-table-column>
      <el-table-column
        prop="Caption"
        :label="$t('__caption')">
      </el-table-column>
      <el-table-column
        prop="Text"
        :label="$t('__content')"
        :formatter="shortText"></el-table-column>
      <el-table-column
        prop="StartDate"
        :label="$t('__startDate')"
        :formatter="formatterDate"
        width="150"></el-table-column>
      <el-table-column
        prop="EndDate"
        :label="$t('__endDate')"
        :formatter="formatterDate"
        width="150"></el-table-column>
    </el-table>
    <new-form
      v-if="dialogShow"
      :dialog-type="dialogType"
      :dialog-show="dialogShow"
      :announcement="announcement"
      @dialog-cancel="dialogCancel()"
      @dialog-save="dialogSave()"></new-form>
  </el-form>
</template>

<script>
import newForm from './components/announcementNewForm'
import searchButton from '@/components/searchButton'
import { formatDate } from '@/setup/format.js'

export default {
  name: 'AnnouncementShow',
  components: {
    newForm,
    searchButton
  },
  data () {
    return {
      list: [],
      announcement: {},
      searchKeyWord: '',
      dialogType: 'new',
      dialogShow: false,
      // 使用者能看到的權限
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 1,
        search: 1
      }
    }
  },
  mounted () {
    this.preLoading()
    this.userPermission()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    shortText: function (row, column, cellValue, index) {
      if (cellValue.length > 70) {
        return cellValue.slice(0, 70) + '...'
      } else {
        return cellValue
      }
    },
    // 讀入使用者清單
    preLoading: async function () {
      let response = await this.$api.settings.announcementShow({ keyword: this.searchKeyWord })
      this.list = response.data.result
    },
    // 使用者權限
    userPermission: async function () {
      let progPermission = this.$store.state.userProg.filter(item => { return item.Path === this.$route.fullPath })[0]
      this.buttonsShowUser.new = progPermission.fun1
      this.buttonsShowUser.edit = progPermission.fun2
      this.buttonsShowUser.save = progPermission.fun2
      this.buttonsShowUser.delete = progPermission.fun3
    },
    handleClick: async function (row, column, event) {
      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.edit

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
      this.announcement = row
    },
    // 開啟表單
    showForm: function (eventType) {
      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.new

      this.dialogType = eventType
      this.dialogShow = true
    },
    dialogCancel: function () {
      this.dialogShow = false
    },
    dialogSave: function () {
      this.dialogShow = false
      this.preLoading()
    },
    // 搜尋
    search: async function (value) {
      this.searchKeyWord = value
      let response2 = await this.$api.settings.announcementShow({ keyword: this.searchKeyWord })
      this.list = response2.data.result
    }
  }
}
</script>
