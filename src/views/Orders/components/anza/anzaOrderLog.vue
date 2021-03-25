<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" top="5vh" @close="cancel">
    <el-form label-width="10vw" label-position="right">
      <h1>{{$t('__orderID')+' '+ anzaOrder.OrderID + ' ' + $t('__anzaOrder')+' '+ anzaOrder.AnzaOrderID}}</h1>
      <el-table
        :data="logs"
        stripe
        border
        style="width: 100%">
        <el-table-column prop="CustomerID" :label="$t('__customer')+$t('__id')"></el-table-column>
        <el-table-column prop="StorageID" :label="$t('__anzaStorageID')"></el-table-column>
        <el-table-column prop="ScheduledDate" :label="$t('__anzaScheduledDate')" :formatter="formatterDate"></el-table-column>
        <el-table-column prop="RealDate" :label="$t('__real')+$t('__anza')+$t('__date')" :formatter="formatterDate"></el-table-column>
        <el-table-column prop="ExpirationDate" :label="$t('__expire')+$t('__anza')+$t('__date')" :formatter="formatterDate"></el-table-column>
        <el-table-column prop="CompleteDate" :label="$t('__yuanman')+$t('__anza')+$t('__date')" :formatter="formatterDate"></el-table-column>
        <el-table-column prop="Status" :label="$t('__status')"></el-table-column>
        <el-table-column prop="ModifyDate" :label="'Modify'+$t('__date')" :formatter="formatterDate"></el-table-column>
        <el-table-column prop="ModifyType" :label="$t('__modifyType')"></el-table-column>

      </el-table>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatDateTime } from '@/setup/format.js'
export default {
  name: 'AnzaOrderLog',
  props: {
    dialogShow: { type: Boolean, default: false },
    anzaOrder: { type: Object }
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
      let responseRow = await this.$api.orders.getObject({ type: 'anzaOrderLog', keyword: this.anzaOrder.ID })
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
