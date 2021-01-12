<template>
  <el-form>
    <el-collapse v-if="isShow === 1 || this.anzaOrderList.length > 0" v-model="activeName" accordion>
      <el-collapse-item name='1'>
        <template slot="title">
          <h2>{{$t('__anzaOrder')}}<i class="el-icon-circle-plus" v-show="activeName===''"></i></h2>
        </template>
        <el-table
          :data="anzaOrderList"
          stripe
          border
          :row-class-name="tableRowClassName"
          style="width: 100%">
        <el-table-column
          prop="StatusName"
          :label="this.$t('__status')">
        </el-table-column>
        <el-table-column
          prop="AnzaOrderID"
          :label="this.$t('__anzaOrder')">
        </el-table-column>
        <el-table-column
          prop="CustomerName"
          :label="this.$t('__anzaCustomer')">
        </el-table-column>
        <el-table-column
          prop="StorageID"
          :label="this.$t('__anzaStorageID')">
        </el-table-column>
        <el-table-column
          prop="ExpirationDate"
          :label="this.$t('__expire') + this.$t('__date')"
          :formatter="formatterDate">
        </el-table-column>
        <el-table-column>
          <template slot="header">
            {{$t('__scheduled')+$t('__anza')+$t('__date')}}<br/>{{$t('__real')+$t('__anza')+$t('__date')}}
          </template>
          <template slot-scope="scope">
            {{formatterDate(null,null,scope.row.ScheduledDate,null)}}<br/>
            <span v-if="scope.row.RealDate !== null">{{formatterDate(null,null,scope.row.RealDate,null)}}</span>
            <template v-else>
              <el-tag type="danger" v-if="scope.row.FlagAnza === 1">{{$t('__notAnza')}}</el-tag>
              <el-tag type="warning" v-else>{{$t('__notAnza')}}</el-tag>
            </template>
          </template>
        </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script>
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'AnzaOrderList',
  props: {
    orderID: { type: String },
    isShow: { type: Number }
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      anzaOrderList: [],
      certificate1: {},
      activeName: ''
    }
  },
  watch: {
    orderID: function (newValue) {
      if (newValue) { this.preLoading() }
    }
  },
  mounted () {
    if (this.orderID) { this.preLoading() }
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    // table 變更顏色
    tableRowClassName ({ row, rowIndex }) {
      if (row['Status'] === '0') {
        return 'disabled-row'
      }
    },
    preLoading: async function () {
      let responseRecords = await this.$api.orders.anzaOrderShow({ keyword: this.orderID })
      this.anzaOrderList = responseRecords.data.result
      if (this.anzaOrderList && this.anzaOrderList.length > 0) {
        this.activeName = '1'
      }
    }
  }
}
</script>
