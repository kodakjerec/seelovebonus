<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form label-width="10vw" label-position="right">
      <h1>{{$t('__storageAddress')+' '+ stock.StorageID + ' ' + $t('__product')+' '+ stock.ProductID}}</h1>
      <el-table
        :data="logs"
        stripe
        border
        style="width: 100%">
        <el-table-column prop="Seq" :label="$t('__seq')" width="100px"></el-table-column>
        <el-table-column prop="OldQty" :label="$t('__before') + $t('__qty')" width="100px"></el-table-column>
        <el-table-column prop="Qty" :label="$t('__qty')" width="100px"></el-table-column>
        <el-table-column prop="StockQty" :label="$t('__after') + $t('__qty')" width="100px"></el-table-column>
        <el-table-column prop="OrderType" :label="$t('__kind')"></el-table-column>
        <el-table-column prop="OrderID" :label="$t('__orderID')"></el-table-column>
        <el-table-column prop="CreateDate" :label="$t('__createDate')" :formatter="formatterDate"></el-table-column>
        <el-table-column prop="FromStorageID" :label="$t('__fromStorageID')"></el-table-column>
        <el-table-column prop="ToStorageID" :label="$t('__toStorageID')"></el-table-column>
        <el-table-column prop="Purpose" label="Purpose"></el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatDateTime } from '@/setup/format.js'
export default {
  name: 'stockLog',
  props: {
    dialogShow: { type: Boolean, default: false },
    stock: { type: Object }
  },
  data () {
    return {
      myTitle: '',
      logs: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDateTime(cellValue)
    },
    preLoading: async function () {
      // 取得可以用的選單
      let responseRow = await this.$api.stock.getObject({ type: 'stockLog', keyword: this.stock.GUID })
      this.logs = responseRow.data.result
    },
    save: function () {
      this.$emit('save')
    },
    cancel: function () {
      this.$emit('cancel')
    }
  }
}
</script>
