<template>
  <div>
    <el-button-group>
      <el-button class="hideButton" type="info" icon="el-icon-printer"></el-button>
    </el-button-group>
    <search-button @search="search"></search-button>
    <div id="printMe">
      <el-table
        :data="results"
        stripe
        border
      @row-click="handleClick"
        style="width: 100%">
        <template  v-for="column in columns">
          <el-table-column
            v-if="column.formatter === 'date'"
            :key="column.key"
            :prop="column.key"
            :label="column.header"
            :formatter="formatterDate">
          </el-table-column>
          <el-table-column
            v-else
            :key="column.key"
            :prop="column.key"
            :label="column.header">
          </el-table-column>
        </template>
      </el-table>
    </div>
    <new-form
      v-if="dialogShow"
      :dialog-type="dialogType"
      :dialog-show="dialogShow"
      :certificate1="certificate1"
      :orderID="orderID"
      @dialog-cancel="dialogCancel()"
      @dialog-save="dialogSave()"></new-form>
  </div>
</template>

<script>
import newForm from './components/certificate1NewForm'
import searchButton from '@/components/searchButton'
import { formatDate } from '@/setup/format.js'

export default {
  name: 'Certificate1',
  components: {
    newForm,
    searchButton
  },
  data () {
    return {
      columns: [
        {
          header: this.$t('__orderID'),
          key: 'OrderID',
          width: 10
        },
        {
          header: this.$t('__certificate1'),
          key: 'Certificate1',
          width: 10
        },
        {
          header: this.$t('__printCount'),
          key: 'PrintCount',
          width: 10
        },
        {
          header: this.$t('__status'),
          key: 'StatusName',
          width: 10
        },
        {
          header: this.$t('__createDate'),
          key: 'CreateDate',
          width: 30,
          formatter: 'date'
        }
      ],
      dialogType: 'new',
      dialogShow: false,
      results: [],
      certificate1: {},
      orderID: '', // 顯示修改視窗使用, 避免紅字報錯
      searchKeyWord: '',
      // 以下為下拉式選單專用
      ddlCompanies: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    // 讀入系統清單
    preLoading: async function () {
      const response = await this.$api.orders.certificate1Show({ keyword: this.searchKeyWord })
      this.results = response.data.result
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      this.certificate1 = row

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
    },
    dialogCancel: function () {
      this.dialogShow = false
    },
    dialogSave: function () {
      this.dialogShow = false
      this.preLoading()
    },
    // 搜尋
    search: async function (value) {
      this.searchKeyWord = value
      const response2 = await this.$api.orders.certificate1Show({ keyword: this.searchKeyWord })
      this.results = response2.data.result
    }
  }
}
</script>

<style lang="scss" scoped>
.hideButton {
  visibility: hidden;
}
</style>
