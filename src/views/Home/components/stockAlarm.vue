<template>
  <div class="announcement">
    <div class="header">
      {{$t('__avgQty')}}
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <span class="captionDate">{{$t('__inventoryShortage')}}</span>
          <span class="caption">{{items.length}}</span>
        </template>
        <el-table
          :data="items"
          stripe
          border
          style="width: 100%"
          @row-click="clickAnnouncement">
          <el-table-column
            prop="StorageID"
            :label="$t('__storageAddress')">
          </el-table-column>
          <el-table-column
            :label="$t('__product')">
            <template slot-scope="scope">
              {{scope.row.ProductID+' '+scope.row.ProductName}}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('__avgQty')+' '+$t('__qty')">
            <template slot-scope="scope">
              {{scope.row.AvgQty+'>'+scope.row.Qty}}
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'StockAlarm',
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
      let responseRecords = await this.$api.stock.alarm()
      this.items = responseRecords.data.result
    },
    // 按下公告
    clickAnnouncement: function () {
      this.$router.push({
        name: 'StockNow'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.announcement {
  background-color: lightgray;
  border-radius: 4px;
  border: 1px solid lightgray;
  margin: 5px 5px 5px 5px;

  .header{
    font-size: 2rem;
  }
  .captionDate {
    color: lightcoral;
  }
  .caption {
    font-size: 2rem;
    font-weight: 1000;
    padding-left: 1vw;
    text-align: start;
  }
}
</style>
