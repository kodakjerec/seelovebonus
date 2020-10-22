<template>
  <div>
    <h1>{{myTitle}}</h1>
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__orderID')+'：'">
        <el-col :span="4">
          <el-input v-model="form.ID" :placeholder="$t('__afterSaveWillShow')" autocomplete="off" :disabled="disableForm.ID"></el-input>
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
      <!-- 選擇專案 -->
      <el-table
        :data="projectHead"
        stripe
        border
        style="width: 100%">
        <el-table-column
          prop="ProjectName"
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
          width="100px">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row[scope.column.property]" @change="(value)=>{qtyChange(value, scope.row)}" :disabled="disableForm.Qty"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="Amount"
          :label="$t('__amount')"
          :formatter="formatterMoney"
          width="100px">
        </el-table-column>
      </el-table>
    </el-form>
    <!-- 專案明細 -->
    <order-detail
      ref="orderDetail"
      :dialogType="dialogType"
      :orderID="form.ID"
      :projectID="form.ProjectID"
      :orderDetail="orderDetail"></order-detail>
    <!-- 訂購者資料 -->
    <order-customer
      ref="orderCustomer"
      :dialogType="dialogType"
      :orderID="form.ID"
      :orderCustomer="orderCustomer"
      :ddlCustomerBefore="ddlCustomer"></order-customer>
    <template v-if="dialogType !== 'new'">
      <!-- 供奉憑證 -->
      <certificate1
        :buttonsShow="buttonsShow"
        :orderID="form.ID"></certificate1>
      <!-- 換狀證明 -->
      <certificate2
        :buttonsShow="buttonsShow"
        :orderID="form.ID"></certificate2>
      <!-- 付款資訊 -->
      <collection-records
        ref="collectionRecords"
        :buttonsShow="buttonsShow"
        :orderID="form.ID"></collection-records>
      <!-- 發票資訊 -->
      <invoice
        ref="invoice"
        :buttonsShow="buttonsShow"
        :orderID="form.ID"
        @refreshCollectionRecords="refreshCollectionRecords()"></invoice>
      <!-- 蓋章區域 -->
      <el-table
        :data="stampShow"
        stripe
        border
        style="width: 100%">
        <el-table-column :label="$t('__defaultCompanyName')">
          <el-table-column
            :label="$t('__orderSpace1')">
          </el-table-column>
          <el-table-column
            :label="$t('__orderSpace2')">
          </el-table-column>
          <el-table-column
            :label="$t('__orderCreateID')">
            <template slot-scope="scope">
              {{scope.row.CreateID}}<br/>{{scope.row.CreateIDName}}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('__refEmployeeID')">
            <template slot-scope="scope">
              {{scope.row.EmployeeID}}<br/>{{scope.row.EmployeeIDName}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="$t('__defaultDepart')">
          <el-table-column
            :label="$t('__company')">
            <template slot-scope="scope">
              {{scope.row.CompanyID}}<br/>{{scope.row.CompanyName}}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('__referrer')">
            <template slot-scope="scope">
              {{scope.row.Referrer}}<br/>{{scope.row.ReferrerName}}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('__orderSpace3')">
          </el-table-column>
        </el-table-column>
      </el-table>
      </template>
      <template v-else>
        {{$t('__orderDetailWarrning')}}
      </template>
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
import certificate2 from './certificate2'
import orderDetail from './orderDetail'
import orderCustomer from './orderCustomer'
import collectionRecords from './collectionRecords'
import invoice from './invoice'
import { formatMoney } from '@/setup/format.js'
import { messageBoxYesNo } from '@/services/utils'

export default {
  name: 'OrderNewForm',
  components: {
    certificate1,
    certificate2,
    orderDetail,
    orderCustomer,
    collectionRecords,
    invoice
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
        Amount: 0
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
      projectHead: [{
        ProjectName: '',
        FirstItemName: '',
        Price: 0,
        Qty: 1,
        Amount: 0 }],
      orderDetail: [],
      orderCustomer: {},
      stampShow: [{
        CreateIDName: null,
        EmployeeIDName: null,
        CompanyName: null,
        ReferrerName: null
      }],
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
        this.disableForm.ID = true
        this.disableForm.ProjectID = true
        this.disableForm.Qty = true
        this.disableForm.CreateID = true

        this.bringProject(this.form.ProjectID)

        if (this.form.Status === '0') {
          this.buttonsShow = {
            new: 0,
            edit: 0,
            save: 0,
            delete: 0,
            search: 0
          }
        } else {
          this.buttonsShow = {
            new: 1,
            edit: 1,
            save: 1,
            delete: 1,
            search: 1
          }
        }
        break
    }
    this.preLoading()
  },
  methods: {
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    // 讀取預設資料
    preLoading: async function () {
      const response1 = await this.$api.orders.getDropdownList({ type: 'orderStatus' })
      this.ddlOrderStatus = response1.data.result
      const response2 = await this.$api.orders.getDropdownList({ type: 'project' })
      this.ddlProject = response2.data.result
      const response4 = await this.$api.orders.getDropdownList({ type: 'customer' })
      this.ddlCustomer = response4.data.result

      const responseDetail = await this.$api.orders.getObject({ type: 'orderDetail', ID: this.form.ID })
      this.orderDetail = responseDetail.data.result
      const responseCustomer = await this.$api.orders.getObject({ type: 'orderCustomer', ID: this.form.ID })
      this.orderCustomer = responseCustomer.data.result[0]
      const responseStampShow = await this.$api.orders.getObject({ type: 'orderStampShow', ID: this.form.ID })
      this.stampShow = responseStampShow.data.result
    },
    // 點擊"修改專案", 填入明細
    bringProject: async function (selected) {
      // get Data
      const responseProject = await this.$api.orders.getObject({ type: 'project', ID: selected })
      let project = responseProject.data.result[0]
      const responseProjectDetail = await this.$api.orders.getObject({ type: 'projectDetail', ID: selected })
      let projectDetail = responseProjectDetail.data.result

      // 填入 projectHead 顯示用
      let targetProjectHead = this.projectHead[0]
      targetProjectHead.ProjectName = project.Name
      targetProjectHead.FirstItemName = projectDetail[0].ProductName
      targetProjectHead.Price = this.form.Price
      targetProjectHead.Qty = this.form.Qty
      targetProjectHead.Amount = this.form.Amount

      // 填入 orderDetail
      this.$refs['orderDetail'].parentResetItems(projectDetail)
    },
    // 切換專案, 填入明細
    ddlProjectChange: async function (selected) {
      // get Data
      const responseProject = await this.$api.orders.getObject({ type: 'project', ID: selected })
      let project = responseProject.data.result[0]
      const responseProjectDetail = await this.$api.orders.getObject({ type: 'projectDetail', ID: selected })
      let projectDetail = responseProjectDetail.data.result

      // 填入 projectHead 顯示用
      let targetProjectHead = this.projectHead[0]
      targetProjectHead.ProjectName = project.Name
      targetProjectHead.FirstItemName = projectDetail[0].ProductName
      targetProjectHead.Price = project.Price
      targetProjectHead.Qty = 1
      targetProjectHead.Amount = targetProjectHead.Price * targetProjectHead.Qty

      // 填入 orderHead
      this.form.ProjectID = selected
      this.form.Price = targetProjectHead.Price
      this.form.Qty = targetProjectHead.Qty
      this.form.Amount = targetProjectHead.Amount

      // 填入 orderDetail
      this.$refs['orderDetail'].parentResetItems(projectDetail)
    },
    qtyChange: function (selected, row) {
      // 填入 projectHead 顯示用
      let targetProjectHead = this.projectHead[0]
      targetProjectHead.Qty = selected
      targetProjectHead.Amount = targetProjectHead.Price * targetProjectHead.Qty

      // 填入 orderHead
      this.form.Qty = targetProjectHead.Qty
      this.form.Amount = targetProjectHead.Amount

      // 填入 orderDetail
      this.$refs['orderDetail'].parentQtyChange(selected)
    },
    // 檢查輸入
    checkValidate: async function () {
      // 檢查客戶資訊
      let isSuccess = false
      isSuccess = await this.$refs['orderCustomer'].checkValidate()
      if (!isSuccess) { return }

      // 檢查主表單
      await this.$refs['form'].validate((valid) => { isSuccess = valid })

      if (isSuccess) {
        this.beforeSave()
        return true
      }
    },
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
          isSuccess = await this.$refs['orderDetail'].beforeSave()
          isSuccess = await this.$refs['orderCustomer'].save()
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
          isSuccessEdit = await this.$refs['orderDetail'].beforeSave()
          isSuccessEdit = await this.$refs['orderCustomer'].save()
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
          const responseNew = await this.$api.orders.orderNew({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            isSuccess = true
            // 取得單號回填後續資料
            this.form.ID = responseNew.data.result[0].ID
            this.updateMessage = responseNew.data.result[0].message
          }
          break
        case 'edit':
          const responseEdit = await this.$api.orders.orderEdit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
            // 取得單號回填後續資料
            this.form.ID = responseEdit.data.result[0].ID
            this.updateMessage = responseEdit.data.result[0].message
          }
          break
        case 'delete':
          const responseDelete = await this.$api.orders.orderDelete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            isSuccess = true
            this.updateMessage = responseDelete.data.result[0].message
          }
          break
        case 'invalid':
          const responseInvalid = await this.$api.orders.orderInvalid({ form: this.form })
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
    refreshCollectionRecords: function () {
      this.$refs['collectionRecords'].preLoading()
    }
  }
}
</script>
