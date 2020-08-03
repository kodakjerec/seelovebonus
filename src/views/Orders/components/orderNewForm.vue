<template>
  <div>
    <h1>{{myTitle}}</h1>
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="ID" :label="$t('__orderID')+'：'" label-width="100px" label-position="left">
        <el-col :span="6">
          <el-input v-model="form.ID" :placeholder="$t('__afterSaveWillShow')" autocomplete="off" :disabled="disableForm.ID"></el-input>
        </el-col>
        <el-col :span="2" class="el-form-item__label">
          {{$t('__status')}}
        </el-col>
        <el-col :span="3">
          <el-select v-model="form.Status" value-key="value" disabled>
            <el-option v-for="item in ddlOrderStatus" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7" class="el-form-item__label">
          {{$t('__order')+$t('__date')+'：'}}
        </el-col>
        <el-col :span="6">
          <el-form-item prop="OrderDate">
            <el-date-picker
              v-model="form.OrderDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__order')+$t('__date')"
              format="yyyy - MM - dd"
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

    </el-form>
    <div slot="footer" class="dialog-footer">
      <br/>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save && buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete" type="danger" @click="delOrder">{{$t('__deleteFile')}}</el-button>
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
    parent: { type: String, default: 'orders' }
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
      // 使用者能看到的權限
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 1,
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
        this.disableForm.OrderDate = true
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
    this.preloading()
  },
  methods: {
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    // 讀取預設資料
    preloading: async function () {
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
            this.$alert(this.$t('__uploadSuccess'), 200, {
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
            this.$alert(this.$t('__uploadSuccess'), 200, {
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
          if (responseNew.status === 200) {
            isSuccess = true
            // 取得單號回填後續資料
            this.form.ID = responseNew.data.result[0].ID
          }
          break
        case 'delete':
          const responseDelete = await this.$api.orders.orderDelete({ form: this.form })
          if (responseDelete.status === 200) {
            isSuccess = true
          }
          break
      }

      return isSuccess
    },
    // 作廢
    delOrder: function () {
      let myObject = this
      this.$msgbox({
        message: this.$t('__deleteFile'),
        title: this.$t('__delete'),
        showCancelButton: true,
        confirmButtonText: this.$t('__ok'),
        cancelButtonText: this.$t('__cancel'),
        type: 'warning',
        closeOnPressEscape: true,
        callback: function (action, instance, done) {
          switch (action) {
            case 'confirm':
              myObject.form.Status = '0'
              myObject.buttonsShow = {
                new: 0,
                edit: 0,
                save: 0,
                delete: 0,
                search: 0
              }
              setTimeout(async () => {
                let isSuccessEdit = await myObject.save('delete')
                if (isSuccessEdit) {
                  myObject.$alert(myObject.$t('__uploadSuccess'), 200, {
                    callback: () => {
                      myObject.$router.push({
                        name: myObject.parent,
                        params: {
                          returnType: 'save'
                        }
                      })
                    }
                  })
                }
              }, 300)
              break
            case 'cancel':
              break
            case 'close':
              break
          }
        }
      })
    },
    refreshCollectionRecords: function () {
      this.$refs['collectionRecords'].preLoading()
    }
  }
}
</script>
