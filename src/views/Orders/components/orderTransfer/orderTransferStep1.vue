<template>
  <div id="orderHead">
    <h1>{{myTitle}}</h1>
    <el-steps :active="nowStep" align-center process-status="finish" finish-status="success">
      <el-step :title="$t('__choose')+' '+$t('__orderID')"></el-step>
      <el-step :title="$t('__new')+' '+$t('__product')"></el-step>
      <el-step :title="$t('__choose')+' '+$t('__customer')"></el-step>
      <el-step :title="$t('__certificate1')"></el-step>
      <el-step :title="$t('__certificate2')"></el-step>
      <el-step :title="$t('__complete')"></el-step>
    </el-steps>
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <!-- 契約主約內容 -->
      <div v-show="nowStep===0 || nowStep===5">
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
                value-format="yyyy-MM-dd"
                disabled>
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
        v-show="nowStep===1 || nowStep===5"
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
      v-show="nowStep===1 || nowStep===5"
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
      v-show="nowStep===2 || nowStep===5"
      id="orderCustomer"
      ref="orderCustomer"
      :dialogType="dialogType"
      :buttonsShowUser="buttonsShowUser"
      :fromOrderID="form.ID"
      :fromOrderStatus="form.Status"
      @customer-change="customerChange"></order-customer>
    <!-- 安座單 -->
    <anza-order-list
      v-show="nowStep===2 || nowStep===5"
      id="anzaOrderList"
      :fromOrderID="form.ID"
      :isShow="projectFunctions.newAnzaOrder.Available">
    </anza-order-list>
    <!-- 供奉憑證 -->
    <certificate1-order-transfer
      v-show="nowStep===3 || nowStep===5"
      id="certificate1"
      :buttonsShowUser="buttonsShowUser"
      :fromOrderID="form.ID"
      :fromOrderStatus="form.Status"
      :isShow="projectFunctions.newCertificate1.Available"></certificate1-order-transfer>
    <!-- 換狀證明 -->
    <certificate2-order-transfer
      v-show="nowStep===4 || nowStep===5"
      id="certificate2"
      :buttonsShowUser="buttonsShowUser"
      :fromOrderID="form.ID"
      :fromOrderStatus="form.Status"
      :isShow="projectFunctions.newCertificate2.Available"></certificate2-order-transfer>
    <!-- 分期付款 -->
    <installment-order-new
      v-show="nowStep===1 || nowStep===5"
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
      <el-button v-if="nowStep<5" type="primary" @click="checkValidate">{{$t('__next')}}</el-button>
      <el-button v-else type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </div>
</template>

<script>
import anzaOrderList from '../anza/anzaOrderList'
// 新增訂單才有
import installmentOrderNew from '@/views/Orders/components/orderNew/installmentOrderNew'
// 訂單固定內容
import orderDetail from '@/views/Orders/components/orderDetail'
import orderCustomer from '@/views/Orders/components/orderCustomer'
// 訂單變動內容
import orderFunctions from '@/views/Orders/components/orderFunctions'
import certificate1OrderTransfer from './certificate1OrderTransfer'
import certificate2OrderTransfer from './certificate2OrderTransfer'
// 其他
import { formatMoney } from '@/setup/format.js'
import validate from '@/setup/validate'

export default {
  name: 'OrderTransferStep1',
  components: {
    // 新增訂單才有
    anzaOrderList,
    installmentOrderNew,
    // 訂單固定內容
    orderDetail,
    orderCustomer,
    // 訂單變動內容
    certificate1OrderTransfer,
    certificate2OrderTransfer,
    orderFunctions
  },
  props: {
    dialogType: { type: String, default: 'new' },
    order: { type: Object },
    parent: { type: String, default: 'Orders' },
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
      myTitle: this.$t('__orderTransfer'),
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
      ddlOrderID: [],
      // 頂部導覽
      tabActiveName: 'orderHead'
    }
  },
  async mounted () {
    switch (this.dialogType) {
      case 'edit':
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
      response = await this.$api.orders.getDropdownList({ type: 'project' })
      this.ddlProject = response.data.result
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
          // 檢查明細資訊
          isSuccess = await this.$refs['orderDetail'].checkValidate()
          if (!isSuccess) {
            this.checkFail()
            return
          }

          // 下一步檢查
          // 過戶單特殊操作
          await this.$refs['orderCustomer'].parentAssginData('CustomerID', '')
          await this.$refs['orderCustomer'].parentAssginData('ModifyType', this.myTitle)
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
        case 4:
        case 5:
          isSuccess = true
          break
      }

      if (isSuccess) {
        switch (this.nowStep) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
            this.nowStep++
            this.tabClick({ name: this.tabActiveName }, null)
            break
          case 5:
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
          saveStep = 'anzaOrderList'
          isSuccess = await this.$refs['anzaOrderList'].beforeSave()
        }
      }

      // 過戶單特有
      // 供奉憑證: 停用舊單據，重新給予號碼
      // 換狀證明: 變更持有人
      if (isSuccess) {
        saveStep = 'orderTransfer'
        isSuccess = await this.save(saveStep)
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
        case 'new': // 新增
          let responseNew = await this.$api.orders.orderNew({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            isSuccess = true
            // 取得單號回填後續資料
            this.form.ID = responseNew.data.result[0].ID
            this.updateMessage = responseNew.data.result[0].message
          }
          break
        case 'edit': // 修改
          let responseEdit = await this.$api.orders.orderEdit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
            // 取得單號回填後續資料
            this.form.ID = responseEdit.data.result[0].ID
            this.updateMessage = responseEdit.data.result[0].message
          }
          break
        case 'delete': // 刪除
          let responseDelete = await this.$api.orders.orderDelete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            isSuccess = true
            this.updateMessage = responseDelete.data.result[0].message
          }
          break
        case 'invalid': // 作廢
          let responseInvalid = await this.$api.orders.orderInvalid({ form: this.form })
          if (responseInvalid.headers['code'] === '200') {
            isSuccess = true
            this.updateMessage = responseInvalid.data.result[0].message
          }
          break
        case 'orderTransfer': // 過戶
          let responseOrderTransfer = await this.$api.orders.orderTransfer({ form: this.form })
          if (responseOrderTransfer.headers['code'] === '200') {
            isSuccess = true
            this.updateMessage = responseOrderTransfer.data.result[0].message
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
