<template>
  <el-form>
    <el-button-group>
      <el-button type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
    </el-button-group>
    <search-button @search="search"></search-button>
    <p/>
    <el-table
      :data="storageAddressShow"
      stripe
      border
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="ID"
        :label="$t('__storageAddress')+$t('__id')">
      </el-table-column>
      <el-table-column
        prop="BuildingName"
        :label="$t('__building')">
      </el-table-column>
      <el-table-column
        prop="FloorName"
        :label="$t('__floor')">
      </el-table-column>
      <el-table-column
        prop="AreaName"
        :label="$t('__area')">
      </el-table-column>
      <el-table-column
        prop="Volume"
        :label="$t('__volume')">
      </el-table-column>
    </el-table>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :storageAddress="storageAddress"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
  </el-form>
</template>

<script>
import searchButton from '@/components/searchButton'
import newForm from './components/storageAddressNewForm'

export default {
  name: 'StockShow',
  components: {
    searchButton,
    newForm
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      storageAddressShow: [],
      storageAddress: {},
      searchKeyWord: ''
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      // 顯示專用
      const response2 = await this.$api.basic.storageAddressShow({ keyword: this.searchKeyWord })
      this.storageAddressShow = response2.data.result
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      let responseRow = await this.$api.basic.getObject({ type: 'storageAddress', ID: row.ID })
      this.storageAddress = responseRow.data.result[0]

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
    },
    // 開啟表單
    showForm: function (eventType) {
      this.dialogType = eventType
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
      const response2 = await this.$api.basic.storageAddressShow({ keyword: this.searchKeyWord })
      this.storageAddressShow = response2.data.result
    }
  }
}
</script>
