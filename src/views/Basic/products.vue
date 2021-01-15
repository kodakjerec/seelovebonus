<template>
  <el-form>
    <el-button-group style="padding-bottom: 5px">
      <el-button v-show="buttonsShowUser.new" type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
    <search-button @search="search"></search-button>
    </el-button-group>
    <el-table
      :data="productsShow"
      stripe
      border
      :span-method="objectSpanMethod"
      @row-click="handleClick"
      :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column :label="$t('__itemCategory')" prop="Category1Name" min-width="30px">
      </el-table-column>
      <el-table-column prop="Category2Name" min-width="30px">
      </el-table-column>
      <el-table-column prop="Category3Name" min-width="30px">
      </el-table-column>
      <el-table-column
        prop="ID"
        :label="$t('__product')+$t('__id')">
      </el-table-column>
      <el-table-column
        prop="Name"
        :label="$t('__product')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="InvoiceName"
        :label="$t('__invoice')+$t('__name')">
      </el-table-column>
      <el-table-column
        :label="$t('__qty') + ' ' + $t('__unit')">
        <template slot-scope="scope">
          {{scope.row.Qty + ' ' + scope.row.UnitName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="Price"
        :label="$t('__price')"
        :formatter="formatterMoney">
      </el-table-column>
      <el-table-column
        prop="Cost"
        :label="$t('__cost')"
        :formatter="formatterMoney">
      </el-table-column>
      <el-table-column
        prop="AccountingID"
        :label="$t('__accounting')+$t('__id')">
      </el-table-column>
      <el-table-column
        width="60px">
        <template slot-scope="scope">
          <el-tag effect="plain" v-if="scope.row.BOM === '1'">BOM</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :product="product"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel"
    @dialog-save="dialogSave"></new-form>
  </el-form>
</template>

<script>
import searchButton from '@/components/searchButton'
import newForm from './components/productNewForm'
import { formatMoney } from '@/setup/format.js'

export default {
  name: 'Products',
  components: {
    searchButton,
    newForm
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      productsShow: [],
      tableSpanList: [],
      product: {},
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
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    // table 變更顏色
    tableRowClassName ({ row, rowIndex }) {
      if (row['Status'] === '0') {
        return 'disabled-row'
      }
    },
    // 讀入系統清單
    preLoading: async function () {
      // 顯示專用
      this.search('')
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
      let responseRow = await this.$api.basic.getObject({ type: 'product', keyword: row.ID })
      this.product = responseRow.data.result[0]

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
      let response2 = await this.$api.basic.productsShow({ keyword: this.searchKeyWord })
      this.productsShow = response2.data.result

      // table span
      this.tableSpanList = []
      this.productsShow.forEach(row => {
        let findObject = this.tableSpanList.find(row2 => { return row2.SpanID === row.Category1Name })
        if (findObject === undefined) {
          let firstIndex = this.productsShow.findIndex(row3 => row3.Category1Name === row.Category1Name)
          this.tableSpanList.push({
            SpanID: row.Category1Name,
            rowIndex: firstIndex,
            Qty: 1
          })
        } else {
          findObject.Qty += 1
        }
      })
    },
    // table span method
    objectSpanMethod: function (row, column, rowIndex, columnIndex) {
      if (row.columnIndex === 0) {
        let findObject = this.tableSpanList.find(item => { return item.SpanID === row.row.Category1Name })
        // 沒找到
        if (findObject === undefined) {
          return [1, 0]
        } else {
          // 有找到
          // 是第一筆, 就要做 colspan
          if (row.rowIndex === findObject.rowIndex) {
            return [findObject.Qty, 1]
          } else {
            // 其他筆
            return [1, 0]
          }
        }
      }
    }
  }
}
</script>
