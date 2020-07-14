<template>
  <div>
    <h1>{{myTitle}}</h1>
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item :label="$t('__orderID')+'：'" label-width="100px" label-position="left">
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
              <el-select v-model="scope.row[scope.column.property]" :placeholder="$t('__plzChoice')" @change="(value)=>{ddlProjectChange(value, scope.row)}" style="display:block" :disabled="disableForm.ProjectID">
                <el-option v-for="item in ddlProject" :key="item.ID" :label="item.Value" :value="item.ID">
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
      <order-detail ref="orderDetail"
        :orderID="form.ID"
        :orderDetail="orderDetail"></order-detail>
      <!-- 訂購者資料 -->
      <order-customer ref="orderCustomer"
        :dialog-type="dialogType"
        :orderID="form.ID"
        :orderCustomer="orderCustomer"
        :ddlCustomerBefore="ddlCustomer"></order-customer>
      <!-- 付款資訊 -->
      <collection-records
        v-if="collectionRecords"
        ref="collectionRecords"
        :dialogType="dialogTypeCollectionRecords"
        :orderID="form.ID"
        :collectionRecords="collectionRecords"
        :ddlCreateIDBefore="ddlCreateID"></collection-records>
      <template v-else>
        <el-button-group>
          <el-button type="primary" icon="el-icon-plus" @click.prevent="addCollectionRecords()">{{$t('__new')+$t('__collectionRecords')}}</el-button>
                <el-form-item :label="$t('__certificate1')" label-width="140px" label-position="left">
        <el-input v-model="form.Certificate1" autocomplete="off" maxlength="40" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__certificate2')" label-width="140px" label-position="left">
          <el-input v-model="form.Certificate2" autocomplete="off" maxlength="40" show-word-limit></el-input>
      </el-form-item>
        </el-button-group>
      </template>
      <!-- 蓋章區域 -->

    </el-form>
    <div slot="footer" class="dialog-footer">
      <br/>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </div>
</template>

<script>
import orderDetail from './orderDetail'
import orderCustomer from './orderCustomer'
import collectionRecords from './collectionRecords'
import { formatMoney } from '@/setup/format.js'

export default {
  name: 'OrderNewForm',
  components: {
    orderDetail,
    orderCustomer,
    collectionRecords
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
        Status: 1,
        AssistantID: '',
        CreateID: '',
        Certificate1: '',
        Certificate2: ''
      },
      rules: {
        OrderDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ProjectID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        CreateID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        ID: true,
        ProjectID: false,
        Qty: false,
        OrderDate: false,
        CreateID: false
      },
      myTitle: '',
      projectHead: [{ ProjectID: '', ProjectName: '', FirstItemName: '', Price: 0, Qty: 1, Amount: 0 }],
      orderDetail: [],
      orderCustomer: {},
      collectionRecords: {},
      dialogTypeCollectionRecords: 'new',
      // 以下為下拉式選單專用
      ddlOrderStatus: [],
      ddlProject: [],
      ddlAssistantID: [],
      ddlCreateID: [],
      ddlCustomer: []
    }
  },
  mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__orderPaper')
        this.disableForm.CreateID = true
        this.form.OrderDate = new Date()
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__orderPaper')
        this.form = this.order
        this.disableForm.ProjectID = true
        this.disableForm.Qty = true
        this.disableForm.OrderDate = true
        this.disableForm.CreateID = true
        this.ddlProjectChange(this.form.ProjectID)
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
      const response3 = await this.$api.orders.getDropdownList({ type: 'employee' })
      this.ddlAssistantID = response3.data.result
      this.ddlCreateID = response3.data.result
      const response4 = await this.$api.orders.getDropdownList({ type: 'customer' })
      this.ddlCustomer = response4.data.result

      const responseDetail = await this.$api.orders.getObject({ type: 'orderDetail', ID: this.form.ID })
      this.orderDetail = responseDetail.data.result
      const responseCustomer = await this.$api.orders.getObject({ type: 'orderCustomer', ID: this.form.ID })
      this.orderCustomer = responseCustomer.data.result[0]
      const responseRecords = await this.$api.orders.getObject({ type: 'collectionRecords', ID: this.form.ID })
      this.collectionRecords = responseRecords.data.result[0]
      if (this.collectionRecords !== undefined) {
        this.dialogTypeCollectionRecords = 'edit'
      } else {
        this.dialogTypeCollectionRecords = 'new'
      }
    },
    // 切換專案, 填入明細
    ddlProjectChange: async function (selected) {
      const responseProject = await this.$api.orders.getObject({ type: 'project', ID: selected })
      let project = responseProject.data.result[0]
      const responseProjectDetail = await this.$api.orders.getObject({ type: 'projectDetail', ID: selected })
      let projectDetail = responseProjectDetail.data.result

      // 填入 projectHead 顯示用
      let targetProjectHead = this.projectHead[0]
      targetProjectHead.ProjectName = project.Name
      targetProjectHead.FirstItemName = projectDetail[0].ProductName
      targetProjectHead.Price = project.Price
      targetProjectHead.Amount = targetProjectHead.Price * targetProjectHead.Qty

      // 填入 orderHead
      this.form.ProjectID = selected
      this.form.Amount = targetProjectHead.Amount

      // 填入 orderDetail
      for (let index = 0; index < projectDetail.length; index++) {
        let product = projectDetail[index]

        // find Maximum Seq
        let nextSeq = 1
        if (this.orderDetail.length === 0) {
          nextSeq = 1
        } else {
          let amounts = this.orderDetail.map(item => item.Seq)
          let highestSeq = Math.max(...amounts)
          nextSeq = highestSeq + 1
        }
        this.orderDetail.push({
          OrderID: this.form.ID,
          Seq: nextSeq,
          ProjectID: selected,
          ProductID: product.ProductID,
          Name: product.ProductName,
          QtyOrigin: product.Qty,
          Qty: product.Qty,
          UnitName: product.UnitName
        })
      }
    },
    qtyChange: function (selected, row) {
      // 填入 projectHead 顯示用
      let targetProjectHead = this.projectHead[0]
      targetProjectHead.Qty = selected
      targetProjectHead.Amount = targetProjectHead.Price * targetProjectHead.Qty

      for (let index = 0; index < this.orderDetail.length; index++) {
        let item = this.orderDetail[index]
        item.Qty = item.QtyOrigin * selected
      }
    },
    // 新增付款資訊
    addCollectionRecords: function () {
      let targetProjectHead = this.projectHead[0]

      this.collectionRecords = {
        InvoiceID: '',
        InvoiceDate: null,
        OrderID: this.form.ID,
        PaymentMethod: '1',
        ReceivedDate: new Date(),
        Amount: targetProjectHead.Amount,
        Account: null,
        BankID: null,
        Memo: null,
        ReceivedID: null,
        ChequeDate: null
      }
    },
    // 檢查輸入
    checkValidate: async function () {
      // 檢查客戶資訊
      let isSuccess = false
      isSuccess = await this.$refs['orderCustomer'].checkValidate()
      if (!isSuccess) { return }

      // 檢查付款資訊
      if (this.collectionRecords) {
        isSuccess = false
        isSuccess = await this.$refs['collectionRecords'].checkValidate()
        if (!isSuccess) { return }
      }

      // 檢查主表單
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.beforeSave()
          return true
        }
      })
    },
    beforeSave: async function () {
      // 驗證 訂單
      // (新增)存檔優先順序
      // 1. orderHead+orderDetail
      // 2. orderCustomer
      // 3. collectionRecords
      // 4. invoiceHead+invoiceDetail
      // (修改)存檔優先順序
      // 3. collectionRecords
      // 4. invoiceHead+invoiceDetail

      switch (this.dialogType) {
        case 'new':
          let isSuccess = await this.save()
          isSuccess = await this.$refs['orderDetail'].beforeSave()
          isSuccess = await this.$refs['orderCustomer'].save()
          if (this.collectionRecords) {
            isSuccess = await this.$refs['collectionRecords'].save()
          }
          if (isSuccess) {
            this.$alert(this.$t('__uploadSuccess'), 200)
            this.$emit('dialog-save')
          }
          break
        case 'edit':
          let isSuccessEdit = await this.save()
          if (this.collectionRecords) {
            isSuccessEdit = await this.$refs['collectionRecords'].save()
          }
          if (isSuccessEdit) {
            this.$alert(this.$t('__uploadSuccess'), 200, {
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
    save: async function () {
      let isSuccess = false
      switch (this.dialogType) {
        case 'new':
          const responseNew = await this.$api.orders.orderNew({ form: this.form })
          if (responseNew.status === 200) {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
            // 取得單號回填後續資料
            this.form.ID = responseNew.data.result[0].ID
          }
          break
        case 'edit':
          isSuccess = true
          break
      }

      return isSuccess
    }
  }
}
</script>
