<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
    <h2 style="text-align:left">{{$t('__orderCustomer')+$t('__data')}}<span v-if="form.ModifyType">{{'('+form.ModifyType+')'}}</span></h2>
    <!-- 有法定代理人資料, 要顯示 -->
    <template>
      <!-- 訂購者 -->
      <el-form-item :label="$t('__orderCustomer')+$t('__name')" prop="CustomerID">
        <el-col :span="8">
          <el-select
            v-model="form.CustomerID"
            remote
            default-first-option filterable clearable
            :placeholder="$t('__plzChoice')"
            :remote-method="remoteMethod"
            :loading="loading"
            :disabled="!(buttonsShow.new === 1 && disableForm.CustomerID === false)"
            @change="ddlCustomerChange">
            <el-option v-for="item in ddlCustomer" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__referrer')">
            <el-select
              v-model="form.Referrer"
              remote
              default-first-option filterable clearable
              :placeholder="$t('__plzChoice')"
              :remote-method="remoteMethod"
              :loading="loading"
              :disabled="!(buttonsShow.new === 1 && disableForm.CustomerID === false)"
              @change="ddlReferrerChange">
              <el-option v-for="item in ddlReferrer" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 身分證字號 -->
      <el-form-item :label="$t('__uniqueNumber')">
        <el-col :span="8">
          <el-input v-model="form.CustomerID" disabled></el-input>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__company')">
            <el-select
              v-model="form.CompanyID"
              disabled>
              <el-option v-for="item in ddlCompanies" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 電話 -->
      <el-form-item :label="$t('__home')+'/'+$t('__mobile')+$t('__tel')">
        <el-col :span="8" class="elInputWidth">
          <el-input v-model="form.TelHome" disabled></el-input>
          <el-input v-model="form.TelMobile" disabled></el-input>
        </el-col>
      </el-form-item>
    </template>
    <!-- EMail -->
    <el-form-item :label="$t('__eMail')">
      <el-input v-model="form.EMail" disabled></el-input>
    </el-form-item>
    <!-- 地址 -->
    <el-form-item :label="$t('__address')">
      <el-col :span="4">
        <el-form-item>
          <el-select v-model="form.City" default-first-option filterable clearable :placeholder="$t('__plzChoice')" @change="ddlCityChange" disabled>
            <el-option v-for="item in ddlCity" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item>
          <el-select v-model="form.Post" default-first-option filterable clearable :placeholder="$t('__plzChoice')" disabled>
            <el-option v-for="item in ddlPost" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-input v-model="form.Address" disabled></el-input>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'OrderCustomer',
  props: {
    dialogType: { type: String, default: 'new' },
    buttonsShowUser: { type: Object },
    fromOrderID: { type: String },
    fromOrderStatus: { type: String }
  },
  data () {
    return {
      form: {
        OrderID: '',
        CustomerID: '',
        TelHome: '',
        TelMobile: '',
        EMail: '',
        Country: null,
        City: null,
        Post: null,
        Address: '',
        refKind: null,
        Referrer: null,
        EmployeeID: null,
        ModifyType: '',
        CompanyID: null,
        // 顯示用, 不存入資料庫
        Status: ''
      },
      rules: {
        CustomerID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        CustomerID: false
      },
      // 系統目前狀態權限
      buttonsShow: {
        new: 1,
        edit: 0,
        save: 1,
        delete: 0,
        search: 1
      },
      fromModifyType: '',
      loading: false,
      // 以下為下拉式選單專用
      postData: [],
      ddlCountry: [],
      ddlCity: [],
      ddlPost: [],
      ddlCustomerBefore: [],
      ddlCustomer: [],
      ddlReferrer: [],
      ddlCompanies: []
    }
  },
  watch: {
    fromOrderID: function (newValue) {
      this.form.OrderID = newValue
    }
  },
  async mounted () {
    await this.preLoading()

    this.form.OrderID = this.fromOrderID

    switch (this.dialogType) {
      case 'new':
        break
      case 'edit':
        if (this.buttonsShowUser.new === 0) {
          this.disableForm.CustomerID = true
        }
        this.bringCustomer()
        break
    }

    // 系統簽核過程權限
    switch (this.fromOrderStatus) {
      case '1':
        this.buttonsShow = {
          new: 1,
          edit: 1,
          save: 1,
          delete: 1,
          search: 1
        }
        break
      default:
        this.buttonsShow = {
          new: 0,
          edit: 0,
          save: 0,
          delete: 0,
          search: 0
        }
        break
    }
  },
  methods: {
    preLoading: async function () {
      let response = await this.$api.basic.getDropdownList({ type: 'customers' })
      this.ddlCustomerBefore = response.data.result
      this.remoteMethod('')
      response = await this.$api.basic.getDropdownList({ type: 'employees' })
      this.ddlReferrer = response.data.result
      response = await this.$api.basic.getDropdownList({ type: 'companies' })
      this.ddlCompanies = response.data.result

      response = this.$api.local.getDropdownList({ type: 'District' })
      this.postData = response

      response = this.$api.local.getDropdownList({ type: 'Country' })
      this.ddlCountry = response
      response = this.$api.local.getDropdownList({ type: 'City' })
      this.ddlCity = response
    },
    // 遠端即時查客戶代號
    remoteMethod: async function (query) {
      this.loading = true
      this.ddlCustomer = this.ddlCustomerBefore.filter(item => {
        return item.ID.indexOf(query) > -1 || item.Value.indexOf(query) > -1
      })
      setTimeout(() => {
        this.loading = false
      }, 300)
    },
    // 修改狀態:取得客戶資料
    bringCustomer: async function () {
      let responseRow = await this.$api.orders.getObject({ type: 'orderCustomer', keyword: this.fromOrderID })

      if (responseRow.data.result.length <= 0) {
        return
      }
      let row = responseRow.data.result[0]

      this.form.CustomerID = row.CustomerID

      this.form.TelHome = row.TelHome
      this.form.TelMobile = row.TelMobile
      this.form.EMail = row.EMail
      this.form.Country = row.Country
      this.form.City = row.City
      this.form.Post = row.Post
      this.form.Address = row.Address
      this.form.refKind = row.refKind
      this.form.Referrer = row.Referrer
      this.form.EmployeeID = row.EmployeeID
      this.form.ModifyType = row.ModifyType
      this.form.CompanyID = row.CompanyID
      this.form.Status = ''

      // 切換城市下拉式選單
      this.ddlCityChange()

      this.remoteMethod(row.CustomerID)
    },
    // 選定客戶取得資料
    ddlCustomerChange: async function () {
      // 取得可以用的選單
      let responseRow = await this.$api.orders.getObject({ type: 'orderCustomerGetDetail', keyword: this.form.CustomerID })
      if (responseRow.data.result.length <= 0) {
        this.form.TelHome = ''
        this.form.TelMobile = ''
        this.form.EMail = ''
        this.form.Country = ''
        this.form.City = ''
        this.form.Post = ''
        this.form.Address = ''
        this.form.refKind = ''
        this.form.Referrer = ''
        this.form.EmployeeID = ''
        this.form.CompanyID = ''
        this.form.ModifyType = ''
      } else {
        let row = responseRow.data.result[0]
        this.form.TelHome = row.TelHome
        this.form.TelMobile = row.TelMobile
        this.form.EMail = row.EMail
        this.form.Country = row.Country
        this.form.City = row.City
        this.form.Post = row.Post
        this.form.Address = row.Address
        this.form.refKind = row.refKind
        this.form.Referrer = row.Referrer
        this.form.EmployeeID = row.EmployeeID
        this.form.CompanyID = row.CompanyID
        this.form.ModifyType = this.fromModifyType

        if (this.dialogType === 'new') {
          this.form.Status = 'New'
        } else {
          if (this.form.Status === '') {
            this.form.Status = 'Modified'
          }
        }

        this.ddlCityChange()
      }
      // ===== 安座單 =====
      // 回傳客戶代號給上一層
      this.$emit('customer-change', this.form.CustomerID)
    },
    // 過濾郵遞區號
    ddlCityChange: function () {
      this.ddlPost = this.postData.filter(item => item.ParentID === this.form.City)
    },
    // 業務代表變更
    ddlReferrerChange: function (selected) {
      let findObject = this.ddlReferrer.find(item => { return item.ID === selected })
      this.form.CompanyID = findObject.CompanyID

      if (this.dialogType === 'new') {
        this.form.Status = 'New'
      } else {
        if (this.form.Status === '') {
          this.form.Status = 'Modified'
        }
      }
    },
    // 檢查輸入
    checkValidate: function () {
      let isSuccess = false
      this.$refs['form'].validate((valid) => { isSuccess = valid })
      return isSuccess
    },
    // 存檔前檢查
    beforeSave: async function () {
      let isSuccess = false
      if (this.fromOrderID === '') {
        return false
      }
      this.form.OrderID = this.fromOrderID

      // 開始更新
      switch (this.form.Status) {
        case 'New':
          isSuccess = await this.save('new')
          break
        case 'Modified':
          isSuccess = await this.save('edit')
          break
        case '':
          isSuccess = true
          break
      }

      return isSuccess
    },
    // 存檔
    save: async function (type) {
      let isSuccess = false
      switch (type) {
        case 'new':
          let responseNew = await this.$api.orders.orderCustomerNew({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'edit':
          // 客戶資料有異動, 才要更新
          let responseEdit = await this.$api.orders.orderCustomerEdit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
          }
          break
      }

      return isSuccess
    },
    // 父視窗: 變更任意資料, 使用單據: 安座單, 過戶單
    parentAssginData: async function (type, fromObject) {
      switch (type) {
        case 'CustomerID':
          this.form.CustomerID = fromObject
          await this.remoteMethod(fromObject)
          await this.ddlCustomerChange()
          break
        case 'ModifyType':
          this.fromModifyType = fromObject
          this.form.ModifyType = fromObject
          this.buttonsShow.new = 1
          break
      }
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
.elInputWidth .el-input{
  width:50%;
}
</style>
