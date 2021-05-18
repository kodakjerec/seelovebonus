<template>
  <el-form>
    <el-collapse v-if="isShow === 1 || this.certificate1Show.length > 0" v-model="activeName" accordion>
      <el-collapse-item name='1'>
        <template slot="title">
          <h2>{{$t('__certificate1')}}<i class="el-icon-circle-plus" v-show="activeName===''"></i></h2>
        </template>
        <el-button-group>
          <el-button v-show="buttonsShow.new && buttonsShowUser.new" type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')+$t('__certificate1')}}</el-button>
        </el-button-group>
        <p/>
        <el-table
          :data="certificate1Show"
          stripe
          border
          @row-click="handleClick"
          :row-class-name="tableRowClassName"
          style="width: 100%">
          <el-table-column
            prop="Certificate1"
            :label="$t('__certificate1')">
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
            prop="refTypeName"
            :label="$t('__edit')+$t('__function')">
          </el-table-column>
          <el-table-column
            prop="refOrderID"
            :label="$t('__edit')+$t('__orderID')">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :certificate1="certificate1"
    :fromOrderID="fromOrderID"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel"
    @dialog-save="dialogSave"></new-form>
  </el-form>
</template>

<script>
import newForm from './certificate1NewForm'
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'Certificate1',
  components: {
    newForm
  },
  props: {
    buttonsShow: { type: Object },
    buttonsShowUser: { type: Object },
    fromOrderID: { type: String },
    isShow: { type: Number }
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      certificate1Show: [],
      certificate1: {},
      activeName: ''
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
      let responseRecords = await this.$api.orders.certificate1Show({ keyword: this.fromOrderID })
      this.certificate1Show = responseRecords.data.result
      if (this.certificate1Show && this.certificate1Show.length > 0) {
        this.activeName = '1'
      }
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      this.certificate1 = row

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
    },
    // 開啟表單
    showForm: async function (eventType) {
      this.certificate1 = {}
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
