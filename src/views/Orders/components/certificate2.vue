<template>
  <el-form>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t('__certificate2')" name='1'>
        <el-button-group>
          <el-button type="primary" icon="el-icon-plus" @click.prevent="showForm('new')" v-show="buttonsShow.new && buttonsShowUser.new">{{$t('__new')+$t('__certificate2')}}</el-button>
        </el-button-group>
        <p/>
        <el-table
          :data="certificae2Show"
          stripe
          border
          @row-click="handleClick"
          style="width: 100%">
          <el-table-column
            prop="Certificae2"
            :label="$t('__certificate2')">
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
            prop="CreateDate"
            :label="$t('__createDate')"
            :formatter="formatterDate">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :certificae2="certificae2"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
  </el-form>
</template>

<script>
import newForm from './collectionRecordsNewForm'
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'Certificae2',
  components: {
    newForm
  },
  props: {
    buttonsShow: { type: Object },
    buttonsShowUser: { type: Object },
    orderID: { type: String }
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      certificae2Show: [],
      certificae2: {},
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
    preLoading: async function () {
      const responseRecords = await this.$api.orders.getObject({ type: 'certificae2Show', ID: this.orderID })
      this.certificae2Show = responseRecords.data.result
      if (this.certificae2Show) {
        this.activeName = '1'
      }
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      this.collectionRecord = row

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
    },
    // 開啟表單
    showForm: async function (eventType) {
      this.certificae2 = {
        OrderID: this.orderID,
        Certificae2: null,
        PrintCount: 0,
        Status: '1'
      }

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
