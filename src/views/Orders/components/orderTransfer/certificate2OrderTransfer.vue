<template>
  <el-form>
    <el-collapse v-if="isShow === 1 || this.certificate2Show.length > 0" v-model="activeName" accordion>
      <el-collapse-item name='1'>
        <template slot="title">
          <h2>{{$t('__certificate2')}}<i class="el-icon-circle-plus" v-show="activeName===''"></i></h2>
        </template>
        <span>{{$t('__certificate2OrderNewWarning')}}</span>
        <p/>
        <el-table
          :data="certificate2Show"
          stripe
          border
          @row-click="handleClick"
          :row-class-name="tableRowClassName"
          style="width: 100%">
          <el-table-column
            prop="Certificate2"
            :label="$t('__certificate2')">
          </el-table-column>
          <el-table-column
            :label="$t('__customer')">
            <template slot-scope="scope">
              {{scope.row.CustomerID+' '+scope.row.CustomerName}}
            </template>
          </el-table-column>
          <el-table-column
            prop="PrintCount"
            :label="$t('__printCount')">
          </el-table-column>
          <el-table-column
            prop="StatusName"
            :label="$t('__status')">
          </el-table-column>
          <el-table-column
            prop="IssuanceDate"
            :label="$t('__issuanceDate')"
            :formatter="formatterDate">
          </el-table-column>
          <el-table-column
            :label="$t('__ref')+$t('__function')">
            <template slot-scope="scope">
              {{scope.row.refTypeName}}<br/>{{scope.row.chanyunOrderID+' '+scope.row.chanyunCer}}
            </template>
          </el-table-column>
          <el-table-column
            prop="refOrderID"
            :label="$t('__ref')+$t('__orderID')">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script>
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'Certificate2',
  props: {
    buttonsShowUser: { type: Object },
    fromOrderID: { type: String },
    fromOrderStatus: { type: String },
    isShow: { type: Number }
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      certificate2Show: [],
      certificate2: {},
      activeName: '',
      // 系統目前狀態權限
      buttonsShow: {
        new: 1,
        edit: 0,
        save: 1,
        delete: 0,
        search: 1
      }
    }
  },
  watch: {
    fromOrderID: function (newValue) {
      if (newValue) { this.preLoading() }
    }
  },
  mounted () {
    if (this.fromOrderID) { this.preLoading() }
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
      let responseRecords = await this.$api.orders.certificate2Show({ keyword: this.fromOrderID })
      this.certificate2Show = responseRecords.data.result
      if (this.certificate2Show && this.certificate2Show.length > 0) {
        this.activeName = '1'
      }

      // 系統簽核過程權限
      switch (this.fromOrderStatus) {
        case '1':
          this.buttonsShow = {
            new: 1,
            edit: 1,
            save: 1,
            delete: 1,
            search: 1
          }
          break
        default:
          this.buttonsShow = {
            new: 0,
            edit: 0,
            save: 0,
            delete: 0,
            search: 0
          }
          break
      }
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      this.certificate2 = row

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
    },
    // 開啟表單
    showForm: async function (eventType) {
      this.certificate2 = {}
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
