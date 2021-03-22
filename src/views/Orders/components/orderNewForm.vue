<template>
  <div id="orderHead">
    <el-tabs class="tabOrderNewForm" v-model="tabActiveName" @tab-click="tabClick">
      <el-tab-pane :label="$t('__orderID')" name="orderHead"></el-tab-pane>
      <template v-if="dialogType !== 'new'">
        <el-tab-pane :label="$t('__orderCustomer')" name="orderCustomer"></el-tab-pane>
        <el-tab-pane v-if="projectFunctions.newAnzaOrder.Available" :label="$t('__anzaOrder')" name="anzaOrderList"></el-tab-pane>
        <el-tab-pane v-if="projectFunctions.newCertificate1.Available" :label="$t('__certificate1')" name="certificate1"></el-tab-pane>
        <el-tab-pane v-if="projectFunctions.newCertificate2.Available" :label="$t('__certificate2')" name="certificate2"></el-tab-pane>
        <el-tab-pane :label="$t('__installment')" name="installment"></el-tab-pane>
        <el-tab-pane :label="$t('__collectionRecords')" name="collectionRecords"></el-tab-pane>
        <el-tab-pane :label="$t('__invoice')" name="invoice"></el-tab-pane>
      </template>
      <template v-else>
        <el-tab-pane v-if="form.ProjectID" :label="$t('__orderCustomer')" name="orderCustomer"></el-tab-pane>
        <el-tab-pane v-if="projectFunctions.newAnzaOrder.Available" :label="$t('__anzaOrder')" name="anzaOrderNew"></el-tab-pane>
        <el-tab-pane v-if="projectFunctions.newCertificate1.Available" :label="$t('__certificate1')" name="certificate1OrderNew"></el-tab-pane>
        <el-tab-pane v-if="projectFunctions.newCertificate2.Available" :label="$t('__certificate2')" name="certificate2OrderNew"></el-tab-pane>
        <el-tab-pane v-if="form.ProjectID" :label="$t('__installment')" name="installmentOrderNew"></el-tab-pane>
      </template>
      <el-tab-pane :label="$t('__orderNewFormTabsBottom')"></el-tab-pane>
    </el-tabs>
    <div class="tabOrderNewForm_ThenDiv"></div>
    <h1>{{myTitle}}</h1>
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__orderID')">
        <el-col :span="2" v-if="dialogType === 'new'">
          {{form.Prefix}}
        </el-col>
        <el-col :span="5">
          <el-input v-model="form.ID" :placeholder="$t('__afterSaveWillShow')" :disabled="disableForm.ID"></el-input>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('__status')">
            <el-select v-model="form.Status" value-key="value" disabled>
              <el-option v-for="item in ddlOrderStatus" :key="item.ID" :label="item.Value" :value="item.ID">
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
              :disabled="disableForm.OrderDate">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 備註 -->
      <el-form-item :label="$t('__memo')">
          <el-input v-model="form.Memo" type="textarea" rows="2" maxlength="100" show-word-limit
            :disabled="disableForm.OrderDate"></el-input>
      </el-form-item>
      <!-- 專案特殊功能 -->
      <order-functions
        ref="orderFunctions"
        :dialogType="dialogType"
        :fromOrderID="form.ID"
        :buttonsShowUser="buttonsShowUser"
        :projectFunctions="projectFunctions"></order-functions>
      <!-- 選擇專案 -->
      <el-table
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
                filterable
                :placeholder="$t('__plzChoice')"
                @change="(value)=>{ddlProjectChange(value, scope.row)}"
                style="display:block"
                :disabled="disableForm.ProjectID">
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
              <el-input-number :min="1" v-model="scope.row[scope.column.property]" :disabled="disableForm.Qty"></el-input-number>
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
      id="orderCustomer"
      ref="orderCustomer"
      v-if="form.ProjectID"
      :dialogType="dialogType"
      :buttonsShowUser="buttonsShowUser"
      :fromOrderID="form.ID"
      :fromOrderStatus="form.Status"
      @customer-change="customerChange"></order-customer>
    <template v-if="dialogType !== 'new'">
      <!-- 安座單 -->
      <anza-order-list
        id="anzaOrderList"
        :fromOrderID="form.ID"
        :isShow="projectFunctions.newAnzaOrder.Available">
      </anza-order-list>
      <!-- 供奉憑證 -->
      <certificate1
        id="certificate1"
        :buttonsShow="buttonsShow"
        :buttonsShowUser="buttonsShowUser"
        :fromOrderID="form.ID"
        :isShow="projectFunctions.newCertificate1.Available"></certificate1>
      <!-- 換狀證明 -->
      <certificate2
        id="certificate2"
        :buttonsShow="buttonsShow"
        :buttonsShowUser="buttonsShowUser"
        :fromOrderID="form.ID"
        :isShow="projectFunctions.newCertificate2.Available"></certificate2>
      <!-- 分期付款 -->
      <installment
        id="installment"
        ref="installment"
        :buttonsShow="buttonsShow"
        :buttonsShowUser="buttonsShowUser"
        :fromOrderID="form.ID"
        :fromOrderStatus="form.Status"></installment>
      <!-- 付款資訊 -->
      <collection-records
        id="collectionRecords"
        ref="collectionRecords"
        :buttonsShow="buttonsShow"
        :buttonsShowUser="buttonsShowUser"
        :fromOrderID="form.ID"
        :fromOrderStatus="form.Status"
        @refreshInstallment="refreshInstallment"></collection-records>
      <!-- 發票資訊 -->
      <invoice
        id="invoice"
        ref="invoice"
        :buttonsShow="buttonsShow"
        :fromOrderID="form.ID"
        :fromOrderStatus="form.Status"
        @refreshCollectionRecords="refreshCollectionRecords"></invoice>
      <!-- 蓋章區域 -->
      <orderStampArea
        :fromOrderID="form.ID"></orderStampArea>
      </template>
    <template v-else>
      <!-- 新增訂單專用 -->
      <span v-html="$t('__orderDetailWarning')+'<br/>'+$t('__orderCertificateWarning')"></span>
      <anza-order-new
        v-show="projectFunctions.newAnzaOrder.Available"
        id="anzaOrderNew"
        ref="anzaOrderNew"
        :fromOrderID="form.ID"
        :parentOrderDate="form.OrderDate"
        :parentQty="form.Qty"
        :parentAnzaData="form.anzaForNew"></anza-order-new>
      <certificate1-order-new
        v-show="projectFunctions.newCertificate1.Available"
        id="certificate1OrderNew"
        ref="certificate1OrderNew"
        :fromOrderID="form.ID"
        :parentQty="form.Qty"></certificate1-order-new>
      <certificate2-order-new
        v-show="projectFunctions.newCertificate2.Available"
        id="certificate2OrderNew"
        ref="certificate2OrderNew"
        :fromOrderID="form.ID"
        :parentQty="form.Qty"></certificate2-order-new>
      <installment-order-new
        v-show="form.ProjectID"
        id="installmentOrderNew"
        ref="installmentOrderNew"
        :fromOrderID="form.ID"
        :projectID="form.ProjectID"
        :projectName="form.FirstItemName"
        :parentQty="form.Qty"
        :parentAmount="form.Amount"
        :parentDate="form.OrderDate"></installment-order-new>
    </template>
    <!-- 底部操作按鈕 -->
    <div slot="footer">
      <br/>
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete && form.Status < '2'" type="danger" @click="deleteOrder">{{$t('__delete')}}</el-button>
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete" type="danger" @click="invalidOrder">{{$t('__invalid')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save && buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </div>
</template>

<script>
// 新增訂單才有
import anzaOrderNew from './orderNew/anzaOrderNew'
import certificate1OrderNew from './orderNew/certificate1OrderNew'
import certificate2OrderNew from './orderNew/certificate2OrderNew'
import installmentOrderNew from './orderNew/installmentOrderNew'
// 訂單固定內容
import orderDetail from './orderDetail'
import orderCustomer from './orderCustomer'
import installment from './installment/installment'
import collectionRecords from './collectionRecords/collectionRecords'
import invoice from './invoice/invoice'
import orderStampArea from './orderStampArea'
// 訂單變動內容
import anzaOrderList from './anza/anzaOrderList'
import certificate1 from './certificate1/certificate1'
import certificate2 from './certificate2/certificate2'
import orderFunctions from './orderFunctions'
// 其他
import { formatMoney, formatDate } from '@/setup/format.js'
import { messageBoxYesNo } from '@/services/utils'
import validate from '@/setup/validate'

export default {
  name: 'OrderNewForm',
  components: {
    // 新增訂單才有
    anzaOrderNew,
    certificate1OrderNew,
    certificate2OrderNew,
    installmentOrderNew,
    // 訂單固定內容
    orderDetail,
    orderCustomer,
    installment,
    collectionRecords,
    invoice,
    orderStampArea,
    // 訂單變動內容
    certificate1,
    certificate2,
    anzaOrderList,
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
          ProductID: '',
          CustomerID: '',
          FromStorageID: '',
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
      disableForm: {
        ID: false,
        ProjectID: false,
        Qty: false,
        OrderDate: false,
        CreateID: false
      },
      myTitle: '',
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
  mounted () {
    // 不是從上層選單進入, 而是其他不允許路徑
    if (this.order === undefined) {
      this.cancel()
      return
    }

    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__orderPaper')
        this.disableForm.ID = true
        this.disableForm.CreateID = true
        let tempDate = new Date()
        this.form.OrderDate = formatDate(tempDate.toISOString().slice(0, 10))
        this.buttonsShow = {
          new: 1,
          edit: 0,
          save: 1,
          delete: 0,
          search: 1
        }
        break
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
            this.disableForm.ID = true
            this.disableForm.ProjectID = true
            this.disableForm.Qty = true
            this.disableForm.CreateID = true
            this.disableForm.OrderDate = true

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
            this.disableForm.ID = true
            this.disableForm.ProjectID = true
            this.disableForm.CreateID = true

            if (this.buttonsShowUser.edit === 0) {
              this.disableForm.OrderDate = true
              this.disableForm.Qty = true
            }

            this.buttonsShow = {
              new: 1,
              edit: 1,
              save: 1,
              delete: 1,
              search: 1
            }
            break
        }
        this.bringProject()
        break
    }
    this.projectHead.push(this.form)

    this.preLoading()
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

      this.bringFunctions()
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
      // 檢查主表單
      await this.$refs['form'].validate((valid) => { isSuccess = valid })

      // 新增訂單才會使用到
      switch (this.dialogType) {
        case 'new':
          // 檢查其他附加功能
          if (this.projectFunctions.newCertificate1.Available) {
            isSuccess = await this.$refs['certificate1OrderNew'].checkValidate()
            if (!isSuccess) { return }
          }
          if (this.projectFunctions.newCertificate2.Available) {
            isSuccess = await this.$refs['certificate2OrderNew'].checkValidate()
            if (!isSuccess) { return }
          }
          if (this.projectFunctions) {
            isSuccess = await this.$refs['orderFunctions'].checkValidate()
            if (!isSuccess) { return }
          }
          if (this.projectFunctions.newAnzaOrder.Available) {
            isSuccess = await this.$refs['anzaOrderNew'].checkValidate()
            if (!isSuccess) { return }
          }
          break
      }

      // 檢查客戶資訊
      isSuccess = await this.$refs['orderCustomer'].checkValidate()
      if (!isSuccess) { return }
      // 檢查明細資訊
      isSuccess = await this.$refs['orderDetail'].checkValidate()
      if (!isSuccess) { return }

      if (isSuccess) {
        this.beforeSave()
        return true
      }
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

      switch (this.dialogType) {
        case 'new':
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
          if (this.projectFunctions.newCertificate1.Available) {
            if (isSuccess) {
              saveStep = 'certificate1OrderNew'
              isSuccess = await this.$refs['certificate1OrderNew'].beforeSave() // 新增訂單才會出現
            }
          }
          if (this.projectFunctions.newCertificate2.Available) {
            if (isSuccess) {
              saveStep = 'certificate2OrderNew'
              isSuccess = await this.$refs['certificate2OrderNew'].beforeSave() // 新增訂單才會出現
            }
          }
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
          break
        case 'edit':
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
            if (this.projectFunctions) {
              saveStep = 'orderFunctions'
              isSuccess = await this.$refs['orderFunctions'].beforeSave()
            }
          }
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
          break
      }
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
    // 刪除
    deleteOrder: async function () {
      let answerAction = await messageBoxYesNo(this.$t('__deleteOrder'), this.$t('__delete'))

      switch (answerAction) {
        case 'confirm':
          let isSuccessEdit = await this.save('delete')
          if (isSuccessEdit) {
            this.$alert(this.updateMessage, 200, {
              callback: () => {
                this.$router.push({
                  name: this.parent,
                  params: {
                    returnType: 'save'
                  }
                })
              }
            })
          }
          break
        case 'cancel':
          break
        case 'close':
          break
      }
    },
    // 作廢
    invalidOrder: async function () {
      let answerAction = await messageBoxYesNo(this.$t('__invalidOrder'), this.$t('__invalid'))

      switch (answerAction) {
        case 'confirm':
          let isSuccessEdit = await this.save('invalid')
          if (isSuccessEdit) {
            this.$alert(this.updateMessage, 200, {
              callback: () => {
                this.$router.push({
                  name: this.parent,
                  params: {
                    returnType: 'save'
                  }
                })
              }
            })
          }
          break
        case 'cancel':
          break
        case 'close':
          break
      }
    },
    // 儲存收款資訊後更新分期付款
    refreshInstallment: function () {
      this.$refs['installment'].preLoading()
    },
    // 儲存發票後更新付款紀錄資訊
    refreshCollectionRecords: function () {
      this.$refs['collectionRecords'].preLoading()
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
<style lang="scss" scoped>
.tabOrderNewForm {
  position: fixed;
  top: 30px;
  left: 0px;
  background-color: white;
  z-index: 1;
}
.tabOrderNewForm_ThenDiv {
  height: 30px;
}
</style>
