<template>
  <el-form>
    <el-table
      :data="productsShow"
      stripe
      border
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="ID"
        :label="$t('__product')+$t('__id')">
      </el-table-column>
      <el-table-column
        prop="Name"
        :label="$t('__product')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="AccountingName"
        :label="$t('__accounting')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="Qty"
        :label="$t('__qty')">
      </el-table-column>
      <el-table-column
        prop="UnitName"
        :label="$t('__unit')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="Price"
        :label="$t('__price')"
        :formatter="formatterMoney">
      </el-table-column>
      <el-table-column
        prop="BOMName"
        :label="$t('__bom')">
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
    :product="product"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
  </el-form>
</template>

<script>
import newForm from './components/productNewForm'
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'TWD',
  minimumFractionDigits: 0
})
export default {
  name: 'Products',
  components: {
    newForm
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      productsShow: [],
      product: {}
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    formatterMoney: function (row, column, cellValue, index) {
      return formatter.format(cellValue)
    },
    // 讀入系統清單
    preLoading: async function () {
      // 顯示專用
      const response2 = await this.$api.basic.productsShow()
      this.productsShow = response2.data.result
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      let responseRow = await this.$api.basic.getObject({ type: 'product', ID: row.ID })
      this.product = responseRow.data.result[0]

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
      this.user = row
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
