<template>
  <el-form>
    <el-button-group style="padding-bottom: 5px">
      <el-button class="hideButton" icon="el-icon-more"><!-- 排版用,避免沒按鈕跑版 --></el-button>
      <el-button v-show="buttonsShowUser.new" type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
      <search-button @search="search"></search-button>
    </el-button-group>
    <el-table
      :data="processingOrderShow"
      stripe
      border
      @row-click="handleClick"
      :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column
        align="left"
        width="160px">
        <template slot="header">
          <el-button
            v-show="buttonsShowUser.delete"
            type="text"
            size="mini" @click.prevent="openSignOffManual">{{$t('__signOffSettings')}}</el-button>
          <br/>
          {{$t('__batch')+$t('__signOff')}}
          <br/>
          <el-button
            size="mini"
            @click="batchSignOffAgree()">{{$t('__signOffAgree')}}</el-button>
          <el-button
            size="mini"
            @click="batchSignOffDeny()">{{$t('__signOffDeny')}}</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini" @click.native.stop="openSignOffLog(scope.row)">{{$t('__signOffLog')}}</el-button>
          <br/>
          <el-button
            v-show="scope.row.StatusSignOff === 1"
            size="mini"
            type="primary"
            @click.native.stop="signOffAgree(scope.$index, scope.row)">{{$t('__signOffAgree')}}</el-button>
          <el-button
            v-show="scope.row.StatusSignOff === 1"
            size="mini"
            type="danger"
            @click.native.stop="signOffDeny(scope.$index, scope.row)">{{$t('__signOffDeny')}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="StatusName"
        :label="$t('__status')">
      </el-table-column>
      <el-table-column
        prop="ID"
        :label="$t('__processingOrder')+$t('__id')">
      </el-table-column>
      <el-table-column
        prop="OrderDate"
        :label="$t('__processing')+$t('__date')"
        :formatter="formatterDate">
      </el-table-column>
      <el-table-column
        :label="$t('__processing')+$t('__product')">
        <template slot-scope="scope">
          {{scope.row.ProductID+' '+scope.row.Name}}
        </template>
      </el-table-column>
      <el-table-column
        prop="Set"
        :label="$t('__set')"
        width="60">
      </el-table-column>
      <el-table-column
        prop="Memo"
        :label="$t('__memo')">
      </el-table-column>
    </el-table>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :processingOrder="processingOrder"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel"
    @dialog-save="dialogSave"></new-form>
    <!-- 簽核小視窗 -->
    <sign-off-dialog
      :dialogShow="dialogShowSignOff"
      :signOffList="signOffList"
      :signOffChoice="signOffChoice"
      @finish="signOffFinish"
      @cancel="signOffCancel"
    ></sign-off-dialog>
  </el-form>
</template>

<script>
import searchButton from '@/components/searchButton'
import signOffDialog from '@/views/Orders/components/signOff/signOffDialog'
import newForm from './components/processingOrderNewForm'
import { formatDate } from '@/setup/format.js'

export default {
  name: 'ProcessingOrderShow',
  components: {
    searchButton,
    signOffDialog,
    newForm
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      processingOrderShow: [],
      processingOrder: {},
      searchKeyWord: '',
      // 使用者能看到的權限
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 1,
        search: 1
      },
      // 簽核
      dialogShowSignOff: false,
      signOffList: [],
      signOffChoice: 0
    }
  },
  mounted () {
    this.preLoading()
    this.userPermission()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    // 讀入系統清單
    preLoading: async function () {
      this.search('')
    },
    // 使用者權限
    userPermission: async function () {
      let progPermission = this.$store.state.userProg.filter(item => { return item.Path === this.$route.fullPath })[0]
      this.buttonsShowUser.new = progPermission.fun1
      this.buttonsShowUser.edit = progPermission.fun2
      this.buttonsShowUser.save = progPermission.fun2
      this.buttonsShowUser.delete = progPermission.fun3
    },
    // table 變更顏色
    tableRowClassName ({ row, rowIndex }) {
      if (row['Status'] === '0') {
        return 'disabled-row'
      }
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      let responseRow = await this.$api.stock.getObject({ type: 'processingOrder', keyword: row.ID })
      this.processingOrder = responseRow.data.result[0]

      // 簽核管理
      if (row.StatusSignOff === 0) {
        this.buttonsShowUser.new = 0
        this.buttonsShowUser.edit = 0
        this.buttonsShowUser.save = 0
        this.buttonsShowUser.delete = 0
      }
      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.edit

      // 進入修改
      this.$router.push({
        name: 'ProcessingOrderNewForm',
        params: {
          dialogType: 'edit',
          processingOrder: this.processingOrder,
          parent: 'ProcessingOrder',
          buttonsShowUser: this.buttonsShowUser
        }
      })
    },
    // 開啟表單
    showForm: function (eventType) {
      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.new

      this.$router.push({
        name: 'ProcessingOrderNewForm',
        params: {
          dialogType: 'new',
          processingOrder: this.processingOrder,
          parent: 'ProcessingOrder',
          buttonsShowUser: this.buttonsShowUser
        }
      })
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
      if (value !== undefined) {
        this.searchKeyWord = value
      }
      let response2 = await this.$api.stock.processingOrderShow({ keyword: this.searchKeyWord })
      this.processingOrderShow = response2.data.result
    },
    // 簽核相關
    // 送簽
    signOffAgree: function (index, row) {
      this.signOffList.push({
        OrderID: row.ID,
        Type: 'processing',
        Prefix: row.Prefix,
        Status: row.Status
      })
      this.signOffChoice = 1
      this.dialogShowSignOff = true
    },
    // 否決
    signOffDeny: function (index, row) {
      this.signOffList.push({
        OrderID: row.ID,
        Type: 'processing',
        Prefix: row.Prefix,
        Status: row.Status
      })
      this.signOffChoice = 0
      this.dialogShowSignOff = true
    },
    // 批次送簽
    batchSignOffAgree: function () {
      this.processingOrderShow
        .filter(row => { return row.StatusSignOff === 1 })
        .forEach(row => {
          this.signOffList.push({
            OrderID: row.ID,
            Type: 'processing',
            Prefix: row.Prefix,
            Status: row.Status
          })
        })
      this.signOffChoice = 1
      this.dialogShowSignOff = true
    },
    // 批次否決
    batchSignOffDeny: function () {
      this.processingOrderShow
        .filter(row => { return row.StatusSignOff === 1 })
        .forEach(row => {
          this.signOffList.push({
            OrderID: row.ID,
            Type: 'processing',
            Prefix: row.Prefix,
            Status: row.Status
          })
        })
      this.signOffChoice = 0
      this.dialogShowSignOff = true
    },
    // 關閉 批次視窗
    signOffFinish: function () {
      this.signOffList = []
      this.dialogShowSignOff = false
      this.search('')
    },
    // 取消 批次視窗
    signOffCancel: function () {
      this.signOffList = []
      this.dialogShowSignOff = false
    },
    // 開啟 簽核說明
    openSignOffManual: function () {
      this.$router.push({
        name: 'OrderSignOffManual',
        params: {
          orderType: 'processing',
          parent: 'ProcessingOrder'
        }
      })
    },
    // 開啟 簽核歷程
    openSignOffLog: function (row) {
      this.$router.push({
        name: 'OrderSignOffLog',
        params: {
          ID: row.ID,
          parent: 'ProcessingOrder'
        }
      })
    }
  }
}
</script>
