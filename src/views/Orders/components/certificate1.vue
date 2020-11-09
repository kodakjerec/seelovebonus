<template>
  <el-form>
    <el-collapse v-model="activeName" accordion>
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
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :certificate1="certificate1"
    :orderID="orderID"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
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
    orderID: { type: String }
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      certificate1Show: [],
      certificate1: {},
      activeName: '',
      // 使用者能看到的權限
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 1,
        search: 1
      }
    }
  },
  watch: {
    orderID: function (newValue) {
      if (newValue) { this.preLoading() }
    }
  },
  mounted () {
    if (this.orderID) { this.preLoading() }
    this.userPermission()
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
      const responseRecords = await this.$api.orders.getObject({ type: 'certificate1Show', ID: this.orderID })
      this.certificate1Show = responseRecords.data.result
      if (this.certificate1Show && this.certificate1Show.length > 0) {
        this.activeName = '1'
      }
    },
    // 使用者權限
    userPermission: async function () {
      let progPermission = this.$store.state.userProg.filter(item => { return item.Path === '/Orders/Certificate1Show' })[0]
      this.buttonsShowUser.new = progPermission.fun1
      this.buttonsShowUser.edit = progPermission.fun2
      this.buttonsShowUser.save = progPermission.fun2
      this.buttonsShowUser.delete = progPermission.fun3
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
