<template>
  <el-form>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t('__certificate2')" name='1'>
        <el-button-group>
          <el-button type="primary" icon="el-icon-plus" @click.prevent="showForm('new')" v-show="buttonsShow.new && buttonsShowUser.new">{{$t('__new')+$t('__certificate2')}}</el-button>
        </el-button-group>
        <p/>
        <el-table
          :data="certificate2Show"
          stripe
          border
          @row-click="handleClick"
          style="width: 100%">
          <el-table-column
            prop="Certificate2"
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
    :certificate2="certificate2"
    :orderID="orderID"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
  </el-form>
</template>

<script>
import newForm from './certificate2NewForm'
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'Certificate2',
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
      certificate2Show: [],
      certificate2: {},
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
      const responseRecords = await this.$api.orders.getObject({ type: 'certificate2Show', ID: this.orderID })
      this.certificate2Show = responseRecords.data.result
      if (this.certificate2Show && this.certificate2Show.length > 0) {
        this.activeName = '1'
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
