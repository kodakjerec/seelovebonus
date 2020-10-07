<template>
  <el-form>
    <el-button-group>
      <el-button v-show="buttonsShowUser.new" type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
    </el-button-group>
    <search-button @search="search"></search-button>
    <p style="height:1px" />
    <el-table
      :data="employeesShow"
      stripe
      border
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="CompanyName"
        :label="$t('__company')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="Name"
        :label="$t('__employee')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="GradeName"
        :label="$t('__grade')">
      </el-table-column>
      <el-table-column
        prop="ID"
        :label="$t('__employee')+$t('__id')">
      </el-table-column>
      <el-table-column
        prop="TelMobile"
        :label="$t('__mobile')+$t('__tel')">
      </el-table-column>
      <el-table-column
        prop="ParentID"
        :label="$t('__parent')+$t('__id')">
      </el-table-column>
      <el-table-column
        prop="ParentName"
        :label="$t('__parent')+$t('__name')">
      </el-table-column>
    </el-table>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :employee="employee"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
  </el-form>
</template>

<script>
import searchButton from '@/components/searchButton'
import newForm from './components/employeeNewForm'
export default {
  name: 'Employees',
  components: {
    searchButton,
    newForm
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      employeesShow: [],
      employee: {},
      searchKeyWord: '',
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
    // 讀入系統清單
    preLoading: async function () {
      // 顯示專用
      const response2 = await this.$api.basic.employeesShow({ keyword: this.searchKeyWord })
      this.employeesShow = response2.data.result
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
      // 取得可以用的選單
      let responseRow = await this.$api.basic.getObject({ type: 'employee', ID: row.ID })
      this.employee = responseRow.data.result[0]

      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.edit

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
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
      const response2 = await this.$api.basic.employeesShow({ keyword: this.searchKeyWord })
      this.employeesShow = response2.data.result
    }
  }
}
</script>
