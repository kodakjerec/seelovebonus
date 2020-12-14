<template>
  <div>
    <el-table
      :data="stockNow"
      stripe
      border
      style="width: 100%">
      <el-table-column
        :label="$t('__storageAddress')">
        <template slot-scope="scope">
          {{scope.row.StorageID}}
          <el-button
            type="text"
            size="mini" @click.native.stop="openLog(scope.$index, scope.row)">{{"Log"}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('__product')">
        <template slot-scope="scope">
          {{scope.row.ProductID}}<br/>{{scope.row.ProductName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="Qty"
        :label="$t('__inventory')">
      </el-table-column>
      <el-table-column
        prop="OrderType"
        label="Type">
      </el-table-column>
      <el-table-column
        prop="OrderID"
        :label="'Last'+$t('__orderID')">
      </el-table-column>
      <el-table-column
        prop="ModifyDate"
        :label="'Last' + $t('__edit')+$t('__date')"
        :formatter="formatterDateTime">
      </el-table-column>
      <el-table-column
        prop="FromStorageID"
        :label="'From'+$t('__storageAddress')">
      </el-table-column>
      <el-table-column
        prop="ToStorageID"
        :label="'To'+$t('__storageAddress')">
      </el-table-column>
      <el-table-column
        prop="Purpose"
        label="Purpose">
      </el-table-column>
    </el-table>
    <new-form
      v-if="dialogShow"
      :dialog-show="dialogShow"
      :stock="stock"
      @cancel="dialogCancel()"></new-form>
  </div>
</template>

<script>
import newForm from './components/stockLog'
import { formatDateTime } from '@/setup/format.js'
export default {
  name: 'StockNow',
  components: {
    newForm
  },
  data () {
    return {
      stockNow: [],
      stock: {},
      dialogShow: false
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    formatterDateTime: function (row, column, cellValue, index) {
      return formatDateTime(cellValue)
    },
    // 讀入使用者清單
    preLoading: async function () {
      this.search('')
    },
    // 重整畫面
    refresh: function () {
      this.preLoading()
    },
    search: async function (value) {
      this.searchKeyWord = value
      let response2 = await this.$api.stock.stockNowShow({
        keyword: this.searchKeyWord,
        ID: this.$store.state.userID })
      this.stockNow = response2.data.result
    },
    openLog: function (index, row) {
      this.stock = row
      this.dialogShow = true
    },
    dialogCancel: function () {
      this.dialogShow = false
    }
  }
}
</script>
