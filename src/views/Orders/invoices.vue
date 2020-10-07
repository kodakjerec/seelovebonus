<template>
  <el-form>
    <el-button-group>
      <el-button class="hideButton" type="info" icon="el-icon-printer"></el-button>
    </el-button-group>
    <search-button @search="search"></search-button>
    <p/>
    <el-table
      :data="invoicesShow"
      stripe
      border
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="InvoiceID"
        :label="$t('__invoice')+$t('__id')">
      </el-table-column>
      <el-table-column
        prop="OrderID"
        :label="$t('__orderID')">
      </el-table-column>
      <el-table-column
        prop="InvoiceDate"
        :label="$t('__invoice')+$t('__date')"
        :formatter="formatterDate">
      </el-table-column>
      <el-table-column
        prop="Title"
        :label="$t('__title')">
      </el-table-column>
      <el-table-column
        prop="Amount"
        :label="$t('__amount')"
        :formatter="formatterMoney"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="InvoiceStatusName"
        :label="$t('__status')">
      </el-table-column>
      <el-table-column
        prop="Memo"
        :label="$t('__memo')">
      </el-table-column>
    </el-table>
    <new-form
      v-if="dialogShow"
      :dialog-type="dialogType"
      :dialog-show="dialogShow"
      :invoiceHead="invoiceHead"
      :buttonsShowUser="buttonsShowUser"
      @dialog-cancel="dialogCancel()"
      @dialog-save="dialogSave()"></new-form>
  </el-form>
</template>

<script>
import newForm from './components/invoiceNewForm'
import searchButton from '@/components/searchButton'
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'Invoices',
  components: {
    newForm,
    searchButton
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      invoicesShow: [],
      invoiceHead: {},
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
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    // 讀入系統清單
    preLoading: async function () {
      // 顯示專用
      const response2 = await this.$api.orders.invoiceShow({ keyword: this.searchKeyWord })
      this.invoicesShow = response2.data.result
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
      this.invoiceHead = row

      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.edit

      // 進入修改
      this.dialogType = 'edit'
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
      const response2 = await this.$api.orders.invoiceShow({ keyword: this.searchKeyWord })
      this.invoicesShow = response2.data.result
    }
  }
}
</script>

<style lang="scss" scoped>
.hideButton {
  visibility: hidden;
}
</style>
