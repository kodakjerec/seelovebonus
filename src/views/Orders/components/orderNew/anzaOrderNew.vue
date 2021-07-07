/*
專門用於新增訂單自動產生安座單
*/
<template>
  <el-form>
    <h2 class="alignLeft">{{$t('__anzaOrder')}}</h2>
    <p/>
    <span v-if="!fromType && parentAnzaData.CustomerID===''" v-html="$t('__anzaOrderNewWarning')"></span>
    <template v-else>
      <!-- 提供給安座單(續約, 展延, 轉讓, 繼承)專用 -->
      <el-table
      v-if="fromType !== ''"
      :data="subList"
      stripe
      border
      style="width: 100%">
        <!-- 單號 -->
        <el-table-column
          prop="AnzaOrderID"
          :label="this.$t('__anzaOrder')">
        </el-table-column>
        <!-- 安座人 -->
        <el-table-column
          prop="CustomerID"
          :label="$t('__customer')">
          <template slot-scope="scope">
            <input-customer
              :fromCustomerID="scope.row.CustomerID"
              :parent-object="scope.row"
              @findID="findID"></input-customer>
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
            {{scope.row.AddressName}}
          </template>
        </el-table-column>
        <!-- 申請安座日 -->
        <el-table-column
          prop="ScheduledDate"
          :label="$t('__anzaScheduledDate')">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row[scope.column.property]"
              :placeholder="$t('__plzChoice')+$t('__date')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
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
          :label="$t('__expire')+$t('__date')">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row[scope.column.property]"
              :placeholder="$t('__plzChoice')+$t('__date')"
              value-format="yyyy-MM-dd"
              disabled>
            </el-date-picker>
          </template>
        </el-table-column>
        <!-- 備註 -->
        <el-table-column
          prop="ModifyType"
          :label="$t('__memo')">
        </el-table-column>
      </el-table>
      <!-- 提供給訂單新增專用 -->
      <el-table
      v-else
      :data="subList"
      stripe
      border
      style="width: 100%">
      <!-- 安座人 -->
      <el-table-column
        prop="CustomerID"
        :label="$t('__anzaCustomer')"
        width="300">
        <template slot-scope="scope">
          <input-customer
            :fromCustomerID="scope.row.CustomerID"
            :parent-object="scope.row"
            @findID="findID"></input-customer>
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
          {{scope.row.AddressName}}
        </template>
      </el-table-column>
      <!-- 數量 -->
      <el-table-column
        prop="qty"
        :label="$t('__qty')">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row[scope.column.property]" @change="(currentValue, oldValue)=>{qtyChange(currentValue, oldValue, scope.row)}"></el-input-number>
        </template>
      </el-table-column>
      <!-- 申請安座日 -->
      <el-table-column
        prop="ScheduledDate"
        :label="$t('__anzaScheduledDate')">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row[scope.column.property]"
            :placeholder="$t('__plzChoice')+$t('__date')"
            value-format="yyyy-MM-dd">
          </el-date-picker>
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
        :label="$t('__expire')+$t('__date')">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row[scope.column.property]"
            :placeholder="$t('__plzChoice')+$t('__date')"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        align="right"
        width="95">
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
    </template>
    <div style="color:red" v-show="isExceedQtyLimit">{{$t('__exceedQtyLimit')}}</div>
  </el-form>
</template>

<script>
import { formatDate } from '@/setup/format.js'
import inputCustomer from '@/views/Basic/inputCustomer'

export default {
  name: 'AnzaOrderForOrderNew',
  components: {
    inputCustomer
  },
  props: {
    fromOrderID: { type: String },
    parentOrderDate: { type: String },
    parentAnzaData: { type: Object },
    parentQty: { type: Number }
  },
  data () {
    return {
      form: {
        Seq: 0,
        OrderID: this.fromOrderID,
        AnzaOrderID: '',
        CustomerID: '',
        ScheduledDate: '',
        RealDate: null,
        ExpirationDate: null,
        Status: '1',
        ProductID: '',
        ModifyType: '',
        FromStorageID: '',
        PrepareDate: '',
        // 顯示用
        qty: 1,
        Birth: '',
        BirthLunarDate: '',
        BirthLunarTimeName: '',
        GenderName: '',
        Tel: '',
        AddressName: ''
      },
      disableForm: {
        CustomerID: false
      },
      subList: [],
      subListDeleted: [],
      isExceedQtyLimit: false,
      fromType: '',
      fromModifyType: '',
      // 下拉式選單
      ddlCustomer: []
    }
  },
  watch: {
    fromOrderID: function (newValue) {
      if (newValue) {
        this.form.OrderID = newValue
      }
    },
    parentAnzaData: {
      handler: function (newValue) {
        this.form.FromStorageID = newValue.FromStorageID
        if (this.form.CustomerID !== newValue.CustomerID) {
          this.parentCustomerChange()
          this.parentQtyChange()
          this.reCalDate(this.subList)
        }
      },
      deep: true
    },
    parentOrderDate: function (newValue) {
      this.parentOrderDateChange()
    },
    parentQty: function () {
      this.parentQtyChange()
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
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
    },
    // 父視窗: 變更客戶代號
    parentCustomerChange: async function () {
      // 如果都沒有資料, 先新增
      if (this.subList.length === 0) {
        this.handleNew()
      }

      // 帶入客戶資訊
      for (let i = 0; i < this.subList.length; i++) {
        let row = this.subList[i]
        if (!row.CustomerID) {
          row.CustomerID = this.parentAnzaData.CustomerID
          await this.bringCustomerData(row)
          this.subList[i] = row
        }
      }
    },
    // 父視窗: 變更日期
    parentOrderDateChange: function () {
      // 如果都沒有資料, 先新增
      if (this.subList.length === 0) {
        this.handleNew()
      }
      this.reCalDate(this.subList)
    },
    // 父視窗: 變更任意資料, 目前只有安座單會用到
    parentAssginData: async function (type, fromObject) {
      switch (type) {
        case 'subList':
          this.subList = []
          fromObject.forEach(row => {
            this.handleNew(row)
          })
          this.reCalDate(this.subList)

          // 帶入客戶資訊(已有安座單)
          for (let i = 0; i < this.subList.length; i++) {
            let row = this.subList[i]
            await this.bringCustomerData(row)
            this.subList[i] = row
          }
          break
        case 'fromType':
          this.fromType = fromObject
          switch (this.fromType) {
            case 'anzaRenew':
            case 'anzaExtend':
              this.disableForm.CustomerID = true
              break
            case 'anzaTransfer':
            case 'anzaInherit':
              this.disableForm.CustomerID = false
              break
            default:
              this.disableForm.CustomerID = false
              break
          }
          break
        case 'ModifyType':
          this.fromModifyType = fromObject
          this.form.ModifyType = fromObject
          break
      }
    },
    // 重新計算日期
    reCalDate: function (waitForReplaceList) {
      // 檢查錯誤
      if (!waitForReplaceList) {
        return
      } else {
        if (Array.isArray(waitForReplaceList) && waitForReplaceList.length === 0) {
          return
        }
      }

      // 設定開始日
      // 安座單
      // 續約, 展延=>從到期日開始算
      // 繼承=>不變更日期
      // 轉讓=>不變更日期
      let start = new Date(this.parentOrderDate)
      switch (this.fromType) {
        case 'anzaRenew':
        case 'anzaExtend':
          if (Array.isArray(waitForReplaceList)) {
            start = new Date(waitForReplaceList[0].ExpirationDate)
          } else {
            start = new Date(waitForReplaceList.ExpirationDate)
          }
          break
        case 'anzaTransfer':
        case 'anzaInherit':
        default:
          break
      }

      // 申請安座日: 預設90天
      // 安座單
      // 續約, 展延=>不變更安座日
      // 繼承=>變更日期
      // 轉讓=>變更日期
      let ScheduledDate = start
      switch (this.fromType) {
        case 'anzaRenew':
        case 'anzaExtend':
          if (Array.isArray(waitForReplaceList)) {
            ScheduledDate = waitForReplaceList[0].ScheduledDate
          } else {
            ScheduledDate = waitForReplaceList.ScheduledDate
          }
          break
        case 'anzaTransfer':
        case 'anzaInherit':
        default:
          ScheduledDate = new Date(start.setDate(start.getDate() + 90))
          break
      }

      // 到期日: 安座準備其滿***第91天*** + 抓取專案設定Extend.Year
      // 安座單
      // 續約, 展延=>變更
      // 繼承=>不變更
      // 轉讓=>變更
      let ExpirationDate = new Date(start.setDate(start.getDate() + 1))
      switch (this.fromType) {
        case 'anzaRenew':
        case 'anzaExtend':
          ExpirationDate = new Date(ExpirationDate.setFullYear(ExpirationDate.getFullYear() + parseInt(this.parentAnzaData.Extend.year)))
          break
        case 'anzaTransfer':
          ExpirationDate = new Date(ExpirationDate.setFullYear(ExpirationDate.getFullYear() + parseInt(this.parentAnzaData.Extend.year)))
          break
        case 'anzaInherit':
          if (Array.isArray(waitForReplaceList)) {
            ExpirationDate = waitForReplaceList[0].ExpirationDate
          } else {
            ExpirationDate = waitForReplaceList.ExpirationDate
          }
          break
        default:
          ExpirationDate = new Date(ExpirationDate.setFullYear(ExpirationDate.getFullYear() + parseInt(this.parentAnzaData.Extend.year)))
          break
      }

      if (Array.isArray(waitForReplaceList)) {
        waitForReplaceList.forEach(row => {
          row.ScheduledDate = ScheduledDate
          row.PrepareDate = ScheduledDate
          row.RealDate = null
          row.ExpirationDate = ExpirationDate
        })
      } else {
        waitForReplaceList.ScheduledDate = ScheduledDate
        waitForReplaceList.PrepareDate = ScheduledDate
        waitForReplaceList.RealDate = null
        waitForReplaceList.ExpirationDate = ExpirationDate
      }
    },
    // 找到客戶帳號
    findID: async function (result) {
      let { ID, parentObject } = result
      let findRow = this.subList.find(item => { return item.Seq === parentObject.Seq })
      if (findRow) {
        findRow.CustomerID = ID
      }
      await this.bringCustomerData(findRow)
    },
    // 帶入客戶個資
    bringCustomerData: async function (row) {
      if (!row.CustomerID) {
        return
      }
      let response = await this.$api.basic.getObject({ type: 'customer', keyword: row.CustomerID })
      let result = response.data.result[0]
      if (result) {
        if (result.Birth) {
          row.Birth = result.Birth.slice(0, 10)
        }
        if (result.BirthLunarDate) {
          row.BirthLunarDate = result.BirthLunarDate.slice(0, 10)
        }
        row.BirthLunarTimeName = result.BirthLunarTimeName
        row.GenderName = result.GenderName
        row.Tel = result.Tel
        row.AddressName = result.AddressName
      }
    },
    // ============== 子結構 ===============
    // 新增子結構
    handleNew: function (specialRow) {
      let newObj = JSON.parse(JSON.stringify(this.form))
      // find Maximum Seq
      let nextSeq = 1
      if (this.subList.length === 0) {
        nextSeq = 1
      } else {
        let amounts = this.subList.map(item => item.Seq)
        let highestSeq = Math.max(...amounts)
        nextSeq = highestSeq + 1
      }
      newObj.Seq = nextSeq
      // 新增 item
      if (specialRow) {
        newObj.OrderID = specialRow.OrderID
        newObj.AnzaOrderID = specialRow.AnzaOrderID
        newObj.CustomerID = specialRow.CustomerID
        newObj.ScheduledDate = specialRow.ScheduledDate
        newObj.PrepareDate = specialRow.PrepareDate
        newObj.RealDate = specialRow.RealDate
        newObj.ExpirationDate = specialRow.ExpirationDate
        newObj.Status = specialRow.Status
        newObj.ProductID = specialRow.ProductID
        newObj.ModifyType = this.form.ModifyType
        newObj.qty = 1
      } else {
        newObj.OrderID = this.fromOrderID
        newObj.ProductID = this.parentAnzaData.ProductID
        newObj.CustomerID = ''
        newObj.qty = 0
        this.reCalDate(newObj)
      }

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
        // 填入資訊
        if (!row.FromStorageID) {
          row.FromStorageID = this.form.FromStorageID
        }
        row.OrderID = this.form.OrderID

        // 沒有名稱 或 沒有數量, 跳過
        if (row.CustomerID === '' || row.qty <= 0) {
          continue
        }
        await this.save(row)
      }

      return true
    },
    // 存檔
    save: async function (item) {
      await this.$api.orders.anzaOrderUpdate({ form: item })
    }
  }
}
</script>
<style lang="scss" scoped>
.alignLeft {
  text-align: left;
}
</style>
