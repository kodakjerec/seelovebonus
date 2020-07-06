<template>
  <el-form>
    <el-table
      :data="customersShow"
      stripe
      border
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="ID"
        :label="$t('__customer')+$t('__id')">
      </el-table-column>
      <el-table-column
        prop="Name"
        :label="$t('__customer')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="BusinessIDName"
        :label="$t('__businessID')">
      </el-table-column>
      <el-table-column
        prop="EmployeeIDName"
        :label="$t('__refEmployeeID')">
      </el-table-column>
    </el-table>
    <br/>
    <el-button-group>
      <el-button type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
    </el-button-group>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :customer="customer"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
  </el-form>
</template>

<script>
import newForm from './components/customerNewForm'
export default {
  name: 'Customers',
  components: {
    newForm
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      customersShow: [],
      customer: {}
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      // 顯示專用
      const response2 = await this.$api.basic.customersShow()
      this.customersShow = response2.data.result
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      let responseRow = await this.$api.basic.getObject({ type: 'customer', ID: row.ID })
      this.customer = responseRow.data.result[0]

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
    }
  }
}
</script>
