<template>
  <div id="orderHead">
    <h1>{{myTitle}}</h1>
    <el-steps :active="nowStep" align-center process-status="finish" finish-status="success">
      <el-step :title="$t('__choose')+' '+$t('__order')+$t('__date')"></el-step>
      <el-step :title="$t('__new')+' '+$t('__product')"></el-step>
      <el-step :title="$t('__choose')+' '+$t('__customer')"></el-step>
      <el-step :title="$t('__complete')"></el-step>
    </el-steps>
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <div v-show="nowStep===0 || nowStep===3">
        <el-form-item :label="$t('__orderID')">
          <el-col :span="2" v-if="dialogType === 'new'">
            {{form.Prefix}}
          </el-col>
          <el-col :span="5">
            <el-input v-model="form.ID" :placeholder="$t('__afterSaveWillShow')" disabled></el-input>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('__status')">
              <el-select v-model="form.Status" default-first-option filterable clearable disabled>
                <el-option v-for="item in ddlOrderStatus" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                  <span style="float: left">{{ item.Value }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label="$t('__order')+$t('__date')+'：'" prop="OrderDate">
              <el-date-picker
                v-model="form.OrderDate"
                type="date"
                :placeholder="$t('__plzChoice')+$t('__order')+$t('__date')"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 備註 -->
        <el-form-item :label="$t('__memo')">
          <el-input v-model="form.Memo" type="textarea" rows="2" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <!-- 專案特殊功能 -->
        <order-functions
          ref="orderFunctions"
          :dialogType="dialogType"
          :fromOrderID="form.ID"
          :buttonsShowUser="buttonsShowUser"
          :projectFunctions="projectFunctions"></order-functions>
      </div>
      <!-- 選擇專案 -->
      <el-table
        v-show="nowStep===1 || nowStep===3"
        :data="projectHead"
        stripe
        border
        style="width: 100%">
        <el-table-column
          prop="ProjectID"
          :label="$t('__project')+$t('__name')">
          <template slot-scope="scope">
            <el-form-item prop="ProjectID" label-width="0px">
              <el-select
                v-model="scope.row[scope.column.property]"
                default-first-option filterable clearable
                :placeholder="$t('__plzChoice')"
                @change="(value)=>{ddlProjectChange(value, scope.row)}"
                style="display:block"
                disabled>
                <el-option v-for="item in ddlProject" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                  <span style="float: left">{{ item.Value }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          prop="FirstItemName"
          :label="$t('__content')">
        </el-table-column>
        <el-table-column
          prop="Price"
          :label="$t('__project')+$t('__price')"
          :formatter="formatterMoney"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="Qty"
          :label="$t('__qty')"
          width="210px">
          <template slot-scope="scope">
            <el-form-item prop="Qty" label-width="0px">
              <el-input-number :min="1" v-model="scope.row[scope.column.property]" disabled></el-input-number>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          prop="masterAmount"
          :label="$t('__total') + $t('__amount')"
          :formatter="formatterMoney"
          width="200px">
          <div slot-scope="scope">
            <div style="display:inline;float:left">{{$t('__master') + $t('__amount')}}</div><div style="display:inline;float:right">{{formatterMoneyUS(scope.row.masterAmount)}}</div><br/>
            <div style="display:inline;float:left">{{$t('__sub') + $t('__amount')}}</div><div style="display:inline;float:right">{{formatterMoneyUS(scope.row.subAmount)}}</div><br/>
            <div style="display:inline;float:left">{{$t('__total') + $t('__amount')}}</div><div style="display:inline;float:right">{{formatterMoneyUS(scope.row.Amount)}}</div>
          </div>
        </el-table-column>
      </el-table>
    </el-form>
    <!-- 專案明細 -->
    <order-detail
      v-show="nowStep===1 || nowStep===3"
      ref="orderDetail"
      :dialogType="dialogType"
      :buttonsShowUser="buttonsShowUser"
      :fromOrderID="form.ID"
      :fromOrderStatus="form.Status"
      :projectID="form.ProjectID"
      :parentQty="form.Qty"
      @reCalculateDetail="reCalculateDetail"></order-detail>
    <!-- 訂購者資料 -->
    <order-customer
      v-show="nowStep===2 || nowStep===3"
      id="orderCustomer"
      ref="orderCustomer"
      :dialogType="dialogType"
      :buttonsShowUser="buttonsShowUser"
      :fromOrderID="form.ID"
      :fromOrderStatus="form.Status"
      @customer-change="customerChange"></order-customer>
    <!-- 新增訂單專用 -->
    <anza-order-new
      v-show="nowStep===2 || nowStep===3"
      id="anzaOrderNew"
      ref="anzaOrderNew"
      :fromOrderID="form.ID"
      :parentOrderDate="form.OrderDate"
      :parentQty="form.Qty"
      :parentAnzaData="form.anzaForNew"></anza-order-new>
    <installment-order-new
      v-show="nowStep===1 || nowStep===3"
      id="installmentOrderNew"
      ref="installmentOrderNew"
      :fromOrderID="form.ID"
      :projectID="form.ProjectID"
      :projectName="form.FirstItemName"
      :parentQty="form.Qty"
      :parentAmount="form.Amount"
      :parentDate="form.OrderDate"></installment-order-new>
    <!-- 底部操作按鈕 -->
    <div slot="footer">
      <br/>
      <el-button v-if="nowStep>0" @click="goPrevious">{{$t('__prev')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-if="nowStep<3" type="primary" @click="checkValidate">{{$t('__next')}}</el-button>
      <el-button v-else type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </div>
</template>

<script>
// 新增訂單才有
import anzaOrderNew from '@/views/Orders/components/orderNew/anzaOrderNew'
import installmentOrderNew from '@/views/Orders/components/orderNew/installmentOrderNew'
// 訂單固定內容
import orderDetail from '@/views/Orders/components/orderDetail'
import orderCustomer from '@/views/Orders/components/orderCustomer'
// 訂單變動內容
import orderFunctions from '@/views/Orders/components/orderFunctions'
// 其他
import { formatMoney, formatDate } from '@/setup/format.js'
import validate from '@/setup/validate'

export default {
  name: 'AnzaOrderRenew',
  components: {
    // 新增訂單才有
    anzaOrderNew,
    installmentOrderNew,
    // 訂單固定內容
    orderDetail,
    orderCustomer,
    // 訂單變動內容
    orderFunctions
  },
  props: {
    dialogType: { type: String, default: 'new' },
    order: { type: Object },
    parent: { type: String, default: 'AnzaOrderShow' },
    buttonsShowUser: { type: Object,
      default () {
        return {}
      } }
  },
  data () {
    return {
      form: {
        ID: '',
        OrderDate: '',
        ProjectID: '',
        Status: '1',
        CreateID: this.$store.state.userID,
        Price: 0,
        Qty: 1,
        Amount: 0,
        Prefix: '',
        Memo: '',
        // 以下為前端顯示用, 不會記錄進資料庫
        masterAmount: 0,
        subAmount: 0,
        FirstItemName: '',
        // 安座單專用
        anzaForNew: {
          OldOrderID: '',
          ProductID: '',
          CustomerID: '',
          Extend: {}
        }
      },
      rules: {
        ID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        OrderDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ProjectID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Qty: [{ trigger: 'blur', validator: validate.validateInputNumber }]
      },
      // 系統目前狀態權限
      buttonsShow: {
        new: 1,
        edit: 0,
        save: 1,
        delete: 0,
        search: 1
      },
      myTitle: '',
      nowStep: 0,
      projectHead: [],
      updateMessage: '', // 更新資料庫後回傳的訊息
      // 專案功能顯示(新增專用)(不記錄進資料庫)
      projectFunctions: {
        chanyunOrderID: 0,
        newAnzaOrder: 0,
        newCertificate1: 0,
        newCertificate2: 0
      },
      // 以下為下拉式選單專用
      ddlOrderStatus: [],
      ddlProject: [],
      // 頂部導覽
      tabActiveName: 'orderHead'
    }
  },
  async mounted () {
    // 不是從上層選單進入, 而是其他不允許路徑
    if (this.order === undefined) {
      this.cancel()
      return
    }

    switch (this.dialogType) {
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__orderPaper')
        this.form.ID = this.order.ID
        this.form.OrderDate = this.order.OrderDate
        this.form.ProjectID = this.order.ProjectID
        this.form.Status = this.order.Status
        this.form.CreateID = this.order.CreateID
        this.form.Price = this.order.Price
        this.form.Qty = this.order.Qty
        this.form.Amount = this.order.Amount
        this.form.Prefix = this.order.Prefix
        this.form.Memo = this.order.Memo

        // 帶入原始單據狀態, 開啟或關閉
        switch (this.form.Status) {
          case '0':
          case '5':
            // 是否允許修改

            this.buttonsShow = {
              new: 0,
              edit: 0,
              save: 0,
              delete: 0,
              search: 0
            }
            break
          default:
            // 是否允許修改

            this.buttonsShow = {
              new: 1,
              edit: 1,
              save: 1,
              delete: 1,
              search: 1
            }
            break
        }
        await this.bringProject()
        break
    }
    this.projectHead.push(this.form)

    await this.preLoading()

    // 如果有其他來源, 要做不同處理
    if (this.$attrs.fromParams) {
      if (this.$attrs.fromParams.fromType) {
        await this.anzaOperation(this.$attrs.fromParams.fromType)
      }
    }
  },
  methods: {
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    formatterMoneyUS: function (cellValue) {
      return formatMoney(cellValue, 'US')
    },
    // 讀取預設資料
    preLoading: async function () {
      let response = this.$api.local.getDropdownList({ type: 'OrderStatus' })
      this.ddlOrderStatus = response
      let response2 = await this.$api.orders.getDropdownList({ type: 'project' })
      this.ddlProject = response2.data.result
    },
    // 點擊"修改專案", 填入明細
    bringProject: async function () {
      // get Data
      let responseProjectDetail = await this.$api.orders.getObject({ type: 'projectDetail', keyword: this.form.ProjectID })
      let projectDetail = responseProjectDetail.data.result

      // 主專案第一個商品名稱
      this.form.FirstItemName = projectDetail[0].ProductName

      // 安座單: 主專案第一個扣庫存商品
      let firstInventoryProduct = projectDetail.find(item => { return item.Inventory === 1 })
      if (firstInventoryProduct !== undefined) {
        this.form.anzaForNew.ProductID = firstInventoryProduct.ProductID
        this.form.anzaForNew.FromStorageID = firstInventoryProduct.ToStorageID
      }

      this.bringFunctions()
    },
    // 切換專案, 填入明細
    ddlProjectChange: async function (selected) {
      // get Data
      let responseProject = await this.$api.orders.getObject({ type: 'project', keyword: selected })
      let project = responseProject.data.result[0]
      let responseProjectDetail = await this.$api.orders.getObject({ type: 'projectDetail', keyword: selected })
      let projectDetail = responseProjectDetail.data.result

      // 填入 orderHead
      this.form.Price = project.Price
      this.form.Qty = 1
      this.form.Prefix = project.Prefix

      // 主專案第一個商品名稱
      this.form.FirstItemName = projectDetail[0].ProductName

      // 安座單: 主專案第一個扣庫存商品
      let firstInventoryProduct = projectDetail.find(item => { return item.Inventory === 1 })
      if (firstInventoryProduct !== undefined) {
        this.form.anzaForNew.ProductID = firstInventoryProduct.ProductID
        this.form.anzaForNew.FromStorageID = firstInventoryProduct.ToStorageID
      }

      // 主專案填入 orderDetail
      this.$refs['orderDetail'].parentResetItems(projectDetail)

      await this.bringFunctions()
    },
    // 帶入專案功能
    bringFunctions: async function () {
      if (!this.form.ProjectID) {
        return
      }
      let responseProjectFunctions = await this.$api.basic.getObject({ type: 'projectFunctions', keyword: this.form.ProjectID })
      let projectFunctions = responseProjectFunctions.data.result

      // 專案功能顯示
      this.projectFunctions = {}
      projectFunctions.forEach(item => {
        // 轉換Extend成 json
        let jsonExtend = {}
        if (item.Extend) {
          jsonExtend = JSON.parse(item.Extend)
          // 安座單設定
          if (item.Function === 'newAnzaOrder') {
            this.form.anzaForNew.Extend = jsonExtend
          }
        }

        // 代入數值
        this.projectFunctions[item.Function] = {
          Available: item.Available,
          Extend: jsonExtend
        }
      })
    },
    // 檢查輸入
    checkValidate: async function () {
      let isSuccess = false
      switch (this.nowStep) {
        case 0:
          // 檢查主表單
          await this.$refs['form'].validate((valid) => { isSuccess = valid })
          break
        case 1:
          // 檢查其他附加功能
          if (this.projectFunctions) {
            isSuccess = await this.$refs['orderFunctions'].checkValidate()
            if (!isSuccess) {
              this.checkFail()
              return
            }
          }
          if (this.projectFunctions.newAnzaOrder.Available) {
            isSuccess = await this.$refs['anzaOrderNew'].checkValidate()
            if (!isSuccess) {
              this.checkFail()
              return
            }
          }
          // 檢查明細資訊
          isSuccess = await this.$refs['orderDetail'].checkValidate()
          if (!isSuccess) {
            this.checkFail()
            return
          }
          break
        case 2:
          // 檢查客戶資訊
          isSuccess = await this.$refs['orderCustomer'].checkValidate()
          if (!isSuccess) {
            this.checkFail()
            return
          }
          break
        case 3:
          isSuccess = true
          break
      }

      if (isSuccess) {
        switch (this.nowStep) {
          case 0:
          case 1:
          case 2:
            this.nowStep++
            this.tabClick({ name: this.tabActiveName }, null)
            break
          case 3:
            this.beforeSave()
            break
        }
      }
    },
    checkFail: function () {
      this.$message(this.$t('__plzCheckAgain'))
      this.tabClick({ name: this.tabActiveName }, null)
    },
    // 存檔前準備
    beforeSave: async function () {
      // 驗證 訂單
      // (新增)存檔優先順序
      // 1. orderHead+orderDetail
      // 2. orderCustomer
      // (修改)存檔優先順序
      // 1. orderHead+orderDetail
      // 2. orderCustomer
      let isSuccess = false
      let saveStep = 'order'

      isSuccess = false
      saveStep = 'order'
      isSuccess = await this.save(this.dialogType)
      if (isSuccess) {
        saveStep = 'orderDetail'
        isSuccess = await this.$refs['orderDetail'].beforeSave()
      }
      if (isSuccess) {
        saveStep = 'orderCustomer'
        isSuccess = await this.$refs['orderCustomer'].beforeSave()
      }
      if (isSuccess) {
        saveStep = 'installmentOrderNew'
        isSuccess = await this.$refs['installmentOrderNew'].beforeSave()
      }

      // 檢查其他附加功能
      if (this.projectFunctions) {
        if (isSuccess) {
          saveStep = 'orderFunctions'
          isSuccess = await this.$refs['orderFunctions'].beforeSave()
        }
      }
      if (this.projectFunctions.newAnzaOrder.Available) {
        if (isSuccess) {
          saveStep = 'anzaOrderNew'
          isSuccess = await this.$refs['anzaOrderNew'].beforeSave()
        }
      }

      // 全部完成
      if (isSuccess) {
        this.$alert(this.updateMessage, 200, {
          callback: () => {
            this.$router.replace({
              name: this.parent,
              params: {
                returnType: 'save'
              }
            })
          }
        })
      } else {
        this.$alert(this.$t('__uploadFail') + ' Step: ' + saveStep)
      }
    },
    // 上一步
    goPrevious: function () {
      this.nowStep--
    },
    // 取消
    cancel: function () {
      this.$router.push({
        name: this.parent,
        params: {
          returnType: 'cancel'
        }
      })
    },
    // 存檔
    save: async function (type) {
      let isSuccess = false
      switch (type) {
        case 'new':
          let responseNew = await this.$api.orders.orderNew({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            isSuccess = true
            // 取得單號回填後續資料
            this.form.ID = responseNew.data.result[0].ID
            this.updateMessage = responseNew.data.result[0].message
          }
          break
        case 'edit':
          let responseEdit = await this.$api.orders.orderEdit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
            // 取得單號回填後續資料
            this.form.ID = responseEdit.data.result[0].ID
            this.updateMessage = responseEdit.data.result[0].message
          }
          break
        case 'delete':
          let responseDelete = await this.$api.orders.orderDelete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            isSuccess = true
            this.updateMessage = responseDelete.data.result[0].message
          }
          break
        case 'invalid':
          let responseInvalid = await this.$api.orders.orderInvalid({ form: this.form })
          if (responseInvalid.headers['code'] === '200') {
            isSuccess = true
            this.updateMessage = responseInvalid.data.result[0].message
          }
          break
      }

      return isSuccess
    },
    // 子->父: 統計商品明細總價
    reCalculateDetail: function (object) {
      const { masterAmount, subAmount } = object
      this.form.masterAmount = masterAmount
      this.form.subAmount = subAmount
      this.form.Amount = masterAmount + subAmount
    },
    // ===== 安座單 =====
    // 客戶變更, 要回傳最終結果
    customerChange: function (result) {
      this.form.anzaForNew.CustomerID = result
    },
    // 從 安座作業 傳來的操作
    anzaOperation: async function (fromType) {
      // 決定標題
      switch (fromType) {
        case 'anzaRenew':
          this.myTitle = this.$t('__anzaRenew') + this.$t('__anzaOrder')
          await this.$refs['anzaOrderNew'].parentAssginData('ModifyType', this.$t('__anzaRenew'))
          break
        case 'anzaExtend':
          this.myTitle = this.$t('__anzaExtend') + this.$t('__anzaOrder')
          await this.$refs['anzaOrderNew'].parentAssginData('ModifyType', this.$t('__anzaExtend'))
          break
        case 'anzaTransfer':
          this.myTitle = this.$t('__anzaTransfer') + this.$t('__anzaOrder')
          await this.$refs['anzaOrderNew'].parentAssginData('ModifyType', this.$t('__anzaTransfer'))
          break
        case 'anzaInherit':
          this.myTitle = this.$t('__anzaInherit') + this.$t('__anzaOrder')
          await this.$refs['anzaOrderNew'].parentAssginData('ModifyType', this.$t('__anzaInherit'))
          break
      }
      await this.$refs['anzaOrderNew'].parentAssginData('fromType', this.$attrs.fromParams.fromType)
      await this.$refs['orderFunctions'].parentAssginData('fromType', this.$attrs.fromParams.fromType)

      // 舊有契約單據資料
      let oldOrderHead = this.$attrs.fromParams.fromOrder
      this.form.anzaForNew.OldOrderID = oldOrderHead.ID
      // 給數量
      this.form.Qty = oldOrderHead.Qty

      // 取得專案的Extend
      let response1 = await this.$api.orders.getObject({ type: 'orderNewBringAnzaOrder', keyword: oldOrderHead.ID })
      let oldOrderExtend = response1.data.result[0]

      if (oldOrderExtend) {
        let projectExtend = JSON.parse(oldOrderExtend.Extend)
        if (projectExtend) {
          this.form.anzaForNew.Extend = projectExtend
        }

        // 給專案編號(續約, 展延)
        // 給專案日期(轉讓)
        switch (fromType) {
          case 'anzaRenew':
          case 'anzaExtend':
            this.form.ProjectID = projectExtend.nextProjectID
            await this.ddlProjectChange(this.form.ProjectID)
            // 給予orderFunction額外料
            await this.$refs['orderFunctions'].parentAssginData('newAnzaOrder', oldOrderHead.ID)
            break
          case 'anzaTransfer':
            let tempDate = new Date()
            this.form.OrderDate = formatDate(tempDate.toISOString().slice(0, 10))
            break
          case 'anzaInherit':
            // 修改狀態, 不用給號碼
            break
        }

        // 給客戶代號(續約, 展延)
        // 清除舊有客戶代號(轉讓, 繼承)
        switch (fromType) {
          case 'anzaRenew':
          case 'anzaExtend':
            await this.$refs['orderCustomer'].parentAssginData('CustomerID', oldOrderExtend.CustomerID)
            break
          case 'anzaTransfer':
            await this.$refs['orderCustomer'].parentAssginData('CustomerID', '')
            await this.$refs['orderCustomer'].parentAssginData('ModifyType', this.$t('__anzaTransfer'))
            break
          case 'anzaInherit':
            await this.$refs['orderCustomer'].parentAssginData('CustomerID', '')
            await this.$refs['orderCustomer'].parentAssginData('ModifyType', this.$t('__anzaInherit'))
            break
        }

        // 代入舊的安座單清單
        await this.$refs['anzaOrderNew'].parentAssginData('subList', this.$attrs.fromParams.fromAnzaList)
      }
    },
    // ===== 頂部導覽 =====
    tabClick: function (tab, event) {
      this.tabActiveName = tab.name
      let item = document.querySelector('#' + this.tabActiveName)
      // item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })

      window.scrollTo({
        top: item.offsetTop - 80,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>
