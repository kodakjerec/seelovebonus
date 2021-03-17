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
            prop="AnzaOrderID"
            width="100px">
            <template slot="header">
              {{$t('__anzaOrder')}}
              <br/>{{$t('__status')}}
            </template>
            <template slot-scope="scope">
              {{scope.row.AnzaOrderID}}<br/>{{scope.row.StatusName}}
            </template>
          </el-table-column>
          <!-- 安座位別 -->
          <el-table-column>
            <template slot="header">
              {{$t('__anzaCustomer')}}<br/>{{$t('__anzaStorageID')}}
            </template>
            <template slot-scope="scope">
              {{scope.row.CustomerName}}
              <span v-if="scope.row.Status==='2'">{{scope.row.StorageID}}</span>
              <span v-else style="text-decoration:line-through">{{scope.row.StorageID}}</span>
            </template>
          </el-table-column>
          <!-- 個資 -->
          <el-table-column>
            <template slot="header">
              {{$t('__gender')}}<br/>
              {{$t('__birth')+'('+$t('__solarCalendar')+')'}}<br/>
              {{$t('__lunarDate')+'('+$t('__lunarCalendar')+')'+' '+$t('__lunarTime')}}
            </template>
            <template slot-scope="scope">
              {{scope.row.GenderName}}<br/>
              {{scope.row.Birth}}<br/>
              {{scope.row.BirthLunarDate+' '+scope.row.BirthLunarTimeName}}
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header">
              {{$t('__tel')}}<br/>
              {{$t('__address')}}
            </template>
            <template slot-scope="scope">
              {{scope.row.Tel}}<br/>
              {{scope.row.Address}}
            </template>
          </el-table-column>
          <!-- 申請安座日期 -->
          <el-table-column>
            <template slot="header">
              {{$t('__anzaScheduledDate')}}<br/>{{$t('__real')+$t('__anza')+$t('__date')}}
            </template>
            <template slot-scope="scope">
              {{formatterDate(null,null,scope.row.ScheduledDate,null)}}<br/>
              <span v-if="scope.row.RealDate !== null">{{formatterDate(null,null,scope.row.RealDate,null)}}</span>
              <template v-else>
                <el-tag type="danger" effect="plain" v-if="scope.row.FlagAnza === 1">{{$t('__notAnza')}}</el-tag>
                <el-tag type="warning" effect="plain" v-else>{{$t('__notAnza')}}</el-tag>
              </template>
            </template>
          </el-table-column>
          <!-- 安座準備期 -->
          <el-table-column
            prop="PrepareDate"
            :label="$t('__anzaPrepareDate')"
            :formatter="formatterDate">
          </el-table-column>
          <!-- 到期日 -->
          <el-table-column
            prop="ExpirationDate"
            :label="this.$t('__expire') + this.$t('__date')"
            :formatter="formatterDate">
          </el-table-column>
          <!-- 圓滿日期 -->
          <el-table-column
            prop="CompleteDate"
            :formatter="formatterDate">
            <template slot="header">
              {{$t('__yuanman') + this.$t('__date')}}
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
        // 日期替換
        this.anzaOrderList.forEach(row => {
          if (row.Birth) {
            row.Birth = row.Birth.slice(0, 10)
          }
          if (row.BirthLunarDate) {
            row.BirthLunarDate = row.BirthLunarDate.slice(0, 10)
          }
        })
      }
    }
  }
}
</script>
