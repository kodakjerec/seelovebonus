<template>
  <el-form>
    <el-button-group>
      <el-button type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
    </el-button-group>
    <search-button @search="search"></search-button>
    <p/>
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
      searchKeyWord: ''
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      // 顯示專用
      const response2 = await this.$api.basic.employeesShow({ keyword: this.searchKeyWord })
      this.employeesShow = response2.data.result
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      let responseRow = await this.$api.basic.getObject({ type: 'employee', ID: row.ID })
      this.employee = responseRow.data.result[0]

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
    },
    // 開啟表單
    showForm: function (eventType) {
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
