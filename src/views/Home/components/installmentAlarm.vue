<template>
  <div class="announcement">
    <div class="header">
      {{$t('__installment')}}
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <span class="captionDate">{{$t('__notReceived')}}</span>
          <span class="caption">{{items.length}}</span>
        </template>
        <el-table
          :data="items"
          stripe
          border
          style="width: 100%"
          @row-click="clickAnnouncement">
          <el-table-column
            prop="OrderID"
            :label="$t('__orderID')">
          </el-table-column>
          <el-table-column
            prop="InstallmentName"
            :label="$t('__installment')+$t('__name')">
          </el-table-column>
          <el-table-column
            prop="ScheduledDate"
            :label="$t('__installmentScheduledDate')"
            :formatter="formatterDate">
          </el-table-column>
          <el-table-column
            prop="ScheduledAmount"
            :label="$t('__installmentScheduledAmount')"
            :formatter="formatterMoney">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'InstallmentAlarm',
  data () {
    return {
      activeNames: [],
      items: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    preLoading: async function () {
      let responseRecords = await this.$api.orders.installmentAlarm({ StartDate: new Date().toISOString().slice(0, 10) })
      this.items = responseRecords.data.result
    },
    // 按下公告
    clickAnnouncement: function () {
      this.$router.push({
        name: 'Orders'
      })
    }
  }
}
</script>
