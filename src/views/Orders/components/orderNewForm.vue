<template>
  <div>
    <h1>{{myTitle}}</h1>
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__orderID')+'：'">
        <el-col :span="2" v-if="dialogType === 'new'">
          {{form.Prefix}}
        </el-col>
        <el-col :span="4">
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
        <el-col :span="6">
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
          <el-input v-model="form.Memo" type="textarea" rows="2" autocomplete="off" maxlength="100" show-word-limit
            :disabled="disableForm.OrderDate"></el-input>
      </el-form-item>
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
            <el-form-item prop="ProjectID">
              <el-select v-model="scope.row[scope.column.property]" filterable :placeholder="$t('__plzChoice')" @change="(value)=>{ddlProjectChange(value, scope.row)}" style="display:block" :disabled="disableForm.ProjectID">
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
            <el-input-number v-model="scope.row[scope.column.property]" :disabled="disableForm.Qty"></el-input-number>
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
      :orderID="form.ID"
      :projectID="form.ProjectID"
      :parentQty="form.Qty"
      @reCalculateDetail="reCalculateDetail"></order-detail>
    <!-- 訂購者資料 -->
    <order-customer
      ref="orderCustomer"
      :dialogType="dialogType"
      :buttonsShowUser="buttonsShowUser"
      :orderID="form.ID"
      :ddlCustomerBefore="ddlCustomer"></order-customer>
    <template v-if="dialogType !== 'new'">
      <!-- 供奉憑證 -->
      <certificate1
        :buttonsShow="buttonsShow"
        :buttonsShowUser="buttonsShowUser"
        :orderID="form.ID"></certificate1>
      <!-- 換狀證明 -->
      <certificate2
        :buttonsShow="buttonsShow"
        :buttonsShowUser="buttonsShowUser"
        :orderID="form.ID"></certificate2>
      <!-- 付款資訊 -->
      <collection-records
        ref="collectionRecords"
        :buttonsShow="buttonsShow"
        :buttonsShowUser="buttonsShowUser"
        :orderID="form.ID"></collection-records>
      <!-- 發票資訊 -->
      <invoice
        ref="invoice"
        :buttonsShow="buttonsShow"
        :buttonsShowUser="buttonsShowUser"
        :orderID="form.ID"
        @refreshCollectionRecords="refreshCollectionRecords()"></invoice>
      <!-- 蓋章區域 -->
      <orderStampArea
        :orderID="form.ID"></orderStampArea>
      </template>
    <template v-else>
      <span v-html="$t('__orderDetailWarrning')"></span>
      <certificate1-order-new
        ref="certificate1OrderNew"
        :orderID="form.ID"
        :parentQty="form.Qty"></certificate1-order-new>
    </template>
    <!-- 底部操作按鈕 -->
    <div slot="footer" class="dialog-footer">
      <br/>
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete && form.Status < '2'" type="danger" @click="deleteOrder">{{$t('__delete')}}</el-button>
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete" type="danger" @click="invalidOrder">{{$t('__invalid')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save && buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </div>
</template>

<script>
import certificate1 from './certificate1'
import certificate1OrderNew from './certificate1OrderNew'
import certificate2 from './certificate2'
import collectionRecords from './collectionRecords'
import invoice from './invoice'
import orderDetail from './orderDetail'
import orderCustomer from './orderCustomer'
import orderStampArea from './orderStampArea'
import { formatMoney } from '@/setup/format.js'
import { messageBoxYesNo } from '@/services/utils'

export default {
  name: 'OrderNewForm',
  components: {
    certificate1,
    certificate1OrderNew,
    certificate2,
    orderDetail,
    orderCustomer,
    collectionRecords,
    invoice,
    orderStampArea
  },
  props: {
    dialogType: { type: String, default: 'new' },
    order: { type: Object },
    parent: { type: String, default: 'orders' },
    buttonsShowUser: { type: Object }
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
        FirstItemName: ''
      },
      rules: {
        ID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        OrderDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ProjectID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        CreateID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
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
      // 以下為下拉式選單專用
      ddlOrderStatus: [],
      ddlProject: [],
      ddlCustomer: []
    }
  },
  mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__orderPaper')
        this.disableForm.ID = true
        this.disableForm.CreateID = true
        this.form.OrderDate = new Date()
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
        this.form = JSON.parse(JSON.stringify(this.order))

        // 帶入原始單據狀態, 開啟或關閉
        let intStatus = parseInt(this.form.Status)
        if (intStatus === 0) {
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
        } else if (intStatus > 0) {
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
      let response1 = await this.$api.orders.getDropdownList({ type: 'orderStatus' })
      this.ddlOrderStatus = response1.data.result
      let response2 = await this.$api.orders.getDropdownList({ type: 'project' })
      this.ddlProject = response2.data.result
      let response4 = await this.$api.orders.getDropdownList({ type: 'customer' })
      this.ddlCustomer = response4.data.result
    },
    // 點擊"修改專案", 填入明細
    bringProject: async function () {
      // get Data
      let responseProjectDetail = await this.$api.orders.getObject({ type: 'projectDetail', ID: this.form.ProjectID })
      let projectDetail = responseProjectDetail.data.result

      // 填入 orderHead
      this.form.FirstItemName = projectDetail[0].ProductName
    },
    // 切換專案, 填入明細
    ddlProjectChange: async function (selected) {
      // get Data
      let responseProject = await this.$api.orders.getObject({ type: 'project', ID: selected })
      let project = responseProject.data.result[0]
      let responseProjectDetail = await this.$api.orders.getObject({ type: 'projectDetail', ID: selected })
      let projectDetail = responseProjectDetail.data.result

      // 填入 orderHead
      this.form.Price = project.Price
      this.form.Qty = 1
      this.form.Prefix = project.Prefix

      // 主專案第一個商品名稱
      this.form.FirstItemName = projectDetail[0].ProductName

      // 主專案填入 orderDetail
      this.$refs['orderDetail'].parentResetItems(projectDetail)
    },
    // 檢查輸入
    checkValidate: async function () {
      let isSuccess = false

      // 新增訂單才會使用到
      switch (this.dialogType) {
        case 'new':
          // 檢查客戶資訊
          isSuccess = await this.$refs['orderCustomer'].checkValidate()
          if (!isSuccess) { return }

          // 檢查供奉憑證資訊
          isSuccess = await this.$refs['certificate1OrderNew'].checkValidate()
          if (!isSuccess) { return }
          break
      }

      // 檢查主表單
      await this.$refs['form'].validate((valid) => { isSuccess = valid })

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

      switch (this.dialogType) {
        case 'new':
          let isSuccess = await this.save(this.dialogType)
          await this.$refs['orderDetail'].beforeSave()
          await this.$refs['orderCustomer'].save()
          await this.$refs['certificate1OrderNew'].beforeSave() // 新增訂單才會出現
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
          }
          break
        case 'edit':
          let isSuccessEdit = await this.save(this.dialogType)
          await this.$refs['orderDetail'].beforeSave()
          await this.$refs['orderCustomer'].save()
          if (isSuccessEdit) {
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
    }
  }
}
</script>
