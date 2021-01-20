/*
專門用於新增訂單自動產生安座單
*/
<template>
  <el-form>
    <h2 class="alignLeft">{{$t('__anzaOrder')}}</h2>
    <p/>
    <span v-if="parentAnzaData.CustomerID===''" v-html="$t('__anzaOrderNewWarning')"></span>
    <span v-if="parentAnzaData.Extend.new === 0">免新增安座單</span>
    <el-table
      v-else
      :data="subList"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="CustomerID"
        :label="$t('__customer')">
        <template slot-scope="scope">
          <el-select v-model="scope.row[scope.column.property]" filterable value-key="value" :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlCustomer" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="qty"
        :label="$t('__qty')">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row[scope.column.property]" @change="(currentValue, oldValue)=>{qtyChange(currentValue, oldValue, scope.row)}"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="ScheduledDate"
        :label="$t('__scheduled')+$t('__anza')+$t('__date')">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row[scope.column.property]"
            :placeholder="$t('__plzChoice')+$t('__date')"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="ExpirationDate"
        :label="$t('__expire')+$t('__date')">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row[scope.column.property]"
            :placeholder="$t('__plzChoice')+$t('__date')"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        width="95px">
        <template slot="header">
          <el-button
            type="primary"
            size="large"
            @click="handleNew()">{{$t('__new')}}</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">{{$t('__delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="color:red" v-show="isExceedQtyLimit">{{$t('__exceedQtyLimit')}}</div>
  </el-form>
</template>

<script>
export default {
  name: 'AnzaOrderForOrderNew',
  props: {
    orderID: { type: String },
    parentOrderDate: { type: String },
    parentAnzaData: { type: Object },
    parentQty: { type: Number },
    ddlCustomerBefore: { tpye: Array }
  },
  data () {
    return {
      form: {
        OrderID: this.orderID,
        CustomerID: this.customerID,
        ScheduledDate: '',
        RealDate: null,
        ExpirationDate: null,
        Status: '1',
        ProductID: '',
        // 顯示用
        qty: 1
      },
      subList: [],
      subListDeleted: [],
      isExceedQtyLimit: false,
      // 下拉式選單
      ddlCustomer: []
    }
  },
  watch: {
    orderID: function (newValue) {
      if (newValue) {
        this.form.OrderID = newValue
      }
    },
    parentAnzaData: {
      handler: function (newValue) {
        this.parentCustomerChange()
        this.parentQtyChange()
        this.reCalDate(this.subList)
      },
      deep: true },
    parentOrderDate: function (newValue) {
      this.parentOrderDateChange()
    },
    parentQty: function () {
      this.parentQtyChange()
    },
    ddlCustomerBefore: function (value) {
      if (this.ddlCustomerBefore) {
        this.ddlCustomer = JSON.parse(JSON.stringify(this.ddlCustomerBefore))
      }
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    preLoading: async function () {
      this.parentQtyChange()
    },
    // 更改數量
    qtyChange: function () {
      // 檢查總和數量有沒有超出上限
      let count = 0
      this.subList.forEach(row => {
        count += row.qty
      })

      // 超過了, 彈出警示訊息
      // (回復舊數值發現前端不會跟著更新, 因此不採用)
      if (count > this.parentQty) {
        this.$message({
          message: this.$t('__exceedQtyLimit'),
          type: 'error'
        })
        this.isExceedQtyLimit = true
      } else {
        this.isExceedQtyLimit = false
      }
    },
    // 父視窗: 變更明細商品數量, 變更明細商品
    parentQtyChange: function () {
      let index = 0

      this.subList.forEach(row => {
        if (index === 0) {
          row.qty = this.parentQty
        } else {
          row.qty = 0
        }
        row.ProductID = this.parentAnzaData.ProductID

        index++
      })

      this.refreshList()
    },
    // 父視窗: 變更客戶代號
    parentCustomerChange: function () {
      // 如果都沒有資料, 先新增
      if (this.subList.length === 0) {
        this.handleNew()
      }
      let index = 0

      this.subList.forEach(row => {
        if (index === 0) {
          row.CustomerID = this.parentAnzaData.CustomerID
        }

        index++
      })

      this.refreshList()
    },
    // 父視窗: 變更日期
    parentOrderDateChange: function () {
      // 如果都沒有資料, 先新增
      if (this.subList.length === 0) {
        this.handleNew()
      }
      this.reCalDate(this.subList)

      this.refreshList()
    },
    // 重新計算日期
    reCalDate: function (waitForReplaceList) {
      let start = new Date(this.parentOrderDate)
      let year = start.getFullYear()
      let month = start.getMonth()
      let day = start.getDate()

      // 預定安座日: 預設90天
      day = start.getDate() + 90
      let ScheduledDate = new Date(year, month, day, 12)

      // 到期日: 抓取專案設定Extend.Year
      // 預設最後安座日後, 再過Extend.Year
      year = start.getFullYear() + parseInt(this.parentAnzaData.Extend.year)
      let ExpirationDate = new Date(year, month, day, 12)

      if (Array.isArray(waitForReplaceList)) {
        waitForReplaceList.forEach(row => {
          row.ScheduledDate = ScheduledDate
          row.RealDate = null
          row.ExpirationDate = ExpirationDate
        })
      } else {
        waitForReplaceList.ScheduledDate = ScheduledDate
        waitForReplaceList.RealDate = null
        waitForReplaceList.ExpirationDate = ExpirationDate
      }
    },
    // 強制觸發vue.js更新機制
    refreshList: function () {
      let tempList = JSON.parse(JSON.stringify(this.subList))
      this.subList = []

      tempList.forEach(row => {
        this.subList.push(row)
      })
    },
    // ============== 子結構 ===============
    // 新增子結構
    handleNew: function () {
      let newObj = JSON.parse(JSON.stringify(this.form))

      // 新增 item
      newObj.OrderID = this.orderID
      newObj.ProductID = this.parentAnzaData.ProductID
      newObj.CustomerID = ''

      this.reCalDate(newObj)

      this.subList.push(newObj)
      this.qtyChange()
    },
    // 刪除子結構
    handleDelete: function (index, row) {
      row.Status = 'Deleted'
      this.subListDeleted.push(row)
      this.subList.splice(index, 1)

      this.qtyChange()
    },
    // 檢查輸入
    checkValidate: function () {
      // 錯誤處理: 檢查總和數量有沒有超出上限
      if (this.isExceedQtyLimit) {
        return false
      }

      return true
    },
    beforeSave: async function () {
      // 錯誤處理: 沒有單號
      if (this.form.OrderID === '') {
        return false
      }

      for (let index = 0; index < this.subList.length; index++) {
        let row = this.subList[index]

        // 沒有名稱 或 沒有數量, 跳過
        if (row.CustomerID === '' || row.qty <= 0) {
          continue
        }

        // 填入資訊
        row.OrderID = this.form.OrderID

        for (let i = 0; i < row.qty; i++) {
          await this.save(row)
        }
      }

      return true
    },
    // 存檔
    save: async function (item) {
      await this.$api.orders.orderAnzaOrderNew({ form: item })
    }
  }
}
</script>
<style lang="scss" scoped>
.alignLeft {
  text-align: left;
}
</style>
