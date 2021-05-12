<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" top="5vh" @close="cancel" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <!-- 客戶代號 -->
      <el-form-item :label="$t('__customer')+$t('__id')" required>
        <el-col :span="4" v-show="!disableForm.ID">
          <el-select v-model="IDType" default-first-option filterable clearable :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlIDType" :label="item.ID+' '+item.Value" :key="item.ID" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="ID">
            <el-input
            v-model="form.ID"
            maxlength="20"
            show-word-limit
            :placeholder="getPlaceholderID()"
            :disabled="disableForm.ID || IDType==='3'"
            @input="idInput"></el-input>
          </el-form-item>
        </el-col>
        <!-- 身分證字號 -->
        <el-col :span="10" v-show="disableForm.ID || IDType!=='1'">
          <el-form-item :label="$t('__uniqueNumber')">
            <el-input v-model="form.UniqueNumber" maxlength="10" show-word-limit @change="uniqueNumberChange"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 客戶名稱 -->
      <el-form-item :label="$t('__customer')+$t('__name')" prop="Name">
        <el-col :span="10">
          <el-input v-model="form.Name" maxlength="40" show-word-limit></el-input>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__english')+$t('__name')">
            <el-input v-model="form.NameEnglish" maxlength="40" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 業務代表種類 -->
      <el-form-item :label="$t('__refKind')">
        <el-col :span="4">
          <el-select v-model="form.refKind" default-first-option filterable clearable :placeholder="$t('__plzChoice')" @change="ddlRefKindChange" :disabled="true">
            <el-option v-for="item in ddlRefKind" :label="item.ID+' '+item.Value" :key="item.ID" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('__referrer')" prop="Referrer">
            <el-select v-model="form.Referrer" default-first-option filterable clearable :placeholder="$t('__plzChoice')" @change="ddlReferrerChange">
              <el-option v-for="item in ddlReferrer" :label="item.ID+' '+item.Value" :key="item.ID" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('__refEmployeeID')">
            <el-select v-model="form.EmployeeID" default-first-option filterable clearable :placeholder="$t('__plzChoice')" disabled>
              <el-option v-for="item in ddlEmployeeID" :label="item.ID+' '+item.Value" :key="item.ID" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-divider></el-divider>
      <!-- 性別,電話 -->
      <el-form-item :label="$t('__gender')">
        <el-col :span="4">
          <el-select v-model="form.Gender" default-first-option filterable clearable :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlGender" :label="item.ID+' '+item.Value" :key="item.ID" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('__home')+$t('__tel')" prop="TelHome">
            <el-input v-model="form.TelHome"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('__mobile')+$t('__tel')" prop="TelMobile">
            <el-input v-model="form.TelMobile"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 出生日期 -->
      <el-form-item :label="$t('__birth')">
        <el-col :span="4">
          <el-form-item>
            <el-date-picker
              v-model="form.Birth"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__birth')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item :label="$t('__lunarDate')+'('+$t('__lunarCalendar')+')'">
            <el-date-picker
              v-model="form.BirthLunarDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__lunarDate')+'('+$t('__lunarCalendar')+')'"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-checkbox v-model="form.BirthLunarLeap" :true-label="1" :false-label="0">閏月</el-checkbox>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__lunarTime')">
            <el-select v-model="form.BirthLunarTime" default-first-option filterable clearable :placeholder="$t('__plzChoice')">
              <el-option v-for="item in ddlLunarTime" :label="item.ID+' '+item.Value" :key="item.ID" :value="item.ID">
                <span style="float: left">{{ item.Value + '(' + item.Memo + ')' }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
      </el-form-item>
      <!-- 國家etc -->
      <el-form-item :label="$t('__country')">
        <el-col :span="4">
          <el-select v-model="form.Country" default-first-option filterable clearable :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlCountry" :label="item.ID+' '+item.Value" :key="item.ID" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__city')">
            <el-select v-model="form.City" default-first-option filterable clearable :placeholder="$t('__plzChoice')" @change="ddlCityChange" :disabled="!form.Country">
              <el-option v-for="item in ddlCity" :label="item.ID+' '+item.Value" :key="item.ID" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('__post')">
            <el-select v-model="form.Post" default-first-option filterable clearable :placeholder="$t('__plzChoice')" :disabled="!form.City">
              <el-option v-for="item in ddlPost" :label="item.ID+' '+item.Value" :key="item.ID" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 住址 -->
      <el-form-item :label="$t('__address')">
        <el-col :span="12">
          <el-input v-model="form.Address" maxlength="100" show-word-limit></el-input>
        </el-col>
        <el-col :span="8">
          <el-button @click="addressChange">{{$t('__addressChange')}}</el-button>
          <el-tooltip effect="dark" placement="top">
            <div slot="content">住址欄填入"完整地址"<br/>按下按鈕自動填入城市與郵遞區號<br/>例：台北市中山區民權東路二段109號</div>
          <i class="el-icon-question"></i>
          </el-tooltip>
        </el-col>
      </el-form-item>
      <!-- 電子信箱 -->
      <el-form-item :label="$t('__eMail')">
        <el-input v-model="form.EMail" maxlength="60" show-word-limit></el-input>
      </el-form-item>
      <!-- 狀態 -->
      <el-form-item :label="$t('__status')">
        <el-select v-model="form.Status" default-first-option filterable clearable :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlStatus" :label="item.ID+' '+item.Value" :key="item.ID" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 銀行帳戶 -->
    <el-collapse v-model="activeNameBankAccounts" accordion="">
      <el-collapse-item name="1">
        <template slot="title">
          <h2>{{$t('__bankAccounts')}}<i class="el-icon-circle-plus" v-show="activeNameBankAccounts===''"></i></h2>
        </template>
        <bank-accounts
          ref="bankAccounts"
          :fromType="'customer'"
          :fromID="form.ID"
        ></bank-accounts>
      </el-collapse-item>
    </el-collapse>
    <div slot="footer">
      <el-button v-show="dialogType === 'edit' &&  buttonsShowUser.delete" type="danger" @click="deleteItem">{{$t('__delete')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate'
import bankAccounts from './bankAccounts'
import { messageBoxYesNo } from '@/services/utils'

export default {
  name: 'CustomerNewForm',
  components: {
    bankAccounts
  },
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    fromCustomer: { type: Object },
    buttonsShowUser: { type: Object },
    // 新增客戶需要額外參數時用到, 目前有:安座
    fromData: { type: Object,
      default () {
        return {}
      } }
  },
  data () {
    // 切換驗證身分證號碼或護照
    let validatePersonalID = async (rule, value, callback) => {
      // 新增時才檢驗
      if (this.dialogType !== 'new') {
        callback()
        return
      }

      // 強制轉為大寫
      this.form.ID = this.form.ID.toUpperCase()

      // 1.驗證可用性
      let checkValidate = null
      switch (this.IDType) {
        case '1':
          checkValidate = await validate.validatePersonalID(rule, value, 'customer')
          break
        case '2':
          checkValidate = await validate.validatePassport(rule, value, 'customer')
          break
        case '3':
          checkValidate = ''
          break
      }
      if (checkValidate !== '') {
        callback(checkValidate)
        return
      }

      callback()
    }
    return {
      form: {
        ID: '',
        Name: '',
        NameEnglish: '',
        TelHome: '',
        TelMobile: '',
        Country: '2',
        City: null,
        Post: null,
        Address: '',
        EMail: '',
        Birth: null,
        Gender: '3',
        Status: '1',
        refKind: null,
        Referrer: null,
        BirthLunarDate: null,
        BirthLunarTime: '13',
        BirthLunarLeap: null,
        UniqueNumber: '',
        // 顯示用
        CalcBirthLunarDate: '',
        CalcBirth: '',
        EmployeeID: ''
      },
      rules: {
        ID: [{ trigger: 'blur', validator: validatePersonalID }],
        Name: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        TelHome: [{ trigger: 'blur', validator: validate.validatePhone }],
        TelMobile: [{ trigger: 'blur', validator: validate.validatePhone }],
        Referrer: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        ID: false
      },
      IDType: '1',
      myTitle: '',
      activeName: '',
      isLoadingFinish: false, // 讀取完畢
      activeNameBankAccounts: '1',
      // 以下為下拉式選單專用
      // Settings資料
      postData: [],
      customersData: [],
      employeesData: [],
      companiesData: [],
      ddlCountry: [],
      ddlCity: [],
      ddlPost: [],
      ddlStatus: [],
      ddlGender: [],
      ddlEmployeeID: [],
      ddlRefKind: [],
      ddlReferrer: [],
      ddlLunarTime: [],
      ddlIDType: []
    }
  },
  async mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__customer')
        this.disableForm.ID = false

        // 鎖定為業務
        this.form.refKind = '2'

        // 如果是安座單來源, 自動帶入業務
        if (this.fromData && this.fromData.type === 'anzaNewCustomer') {
          if (this.fromData.buyer.Referrer) {
            this.form.Referrer = this.fromData.buyer.Referrer
          }
          // 預設系統產生客戶代號
          this.IDType = '3'
        }
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__customer')
        this.form.ID = this.fromCustomer.ID
        this.form.Name = this.fromCustomer.Name
        this.form.NameEnglish = this.fromCustomer.NameEnglish
        this.form.TelHome = this.fromCustomer.TelHome
        this.form.TelMobile = this.fromCustomer.TelMobile
        this.form.Country = this.fromCustomer.Country
        this.form.City = this.fromCustomer.City
        this.form.Post = this.fromCustomer.Post
        this.form.Address = this.fromCustomer.Address
        this.form.EMail = this.fromCustomer.EMail
        this.form.Gender = this.fromCustomer.Gender
        this.form.Status = this.fromCustomer.Status
        this.form.refKind = this.fromCustomer.refKind
        this.form.Referrer = this.fromCustomer.Referrer
        this.form.UniqueNumber = this.fromCustomer.UniqueNumber
        if (this.fromCustomer.Birth) {
          this.form.Birth = this.fromCustomer.Birth.slice(0, 10)
        }
        if (this.fromCustomer.BirthLunarDate) {
          this.form.BirthLunarDate = this.fromCustomer.BirthLunarDate.slice(0, 10)
          this.form.BirthLunarTime = this.fromCustomer.BirthLunarTime
          this.form.BirthLunarLeap = this.fromCustomer.BirthLunarLeap
        }

        this.disableForm.ID = true

        // 帶入換算後的日期
        this.solarToLunar()
        this.lunarToSolar()
        break
    }
    await this.preLoading()

    this.isLoadingFinish = true
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      // 取得所有原始資料
      let response = this.$api.local.getDropdownList({ type: 'District' })
      this.postData = response

      let responseCustomers = await this.$api.basic.getDropdownList({ type: 'customers' })
      this.customersData = responseCustomers.data.result
      let responseEmployees = await this.$api.basic.getDropdownList({ type: 'employees' })
      this.employeesData = responseEmployees.data.result
      let responseCompanies = await this.$api.basic.getDropdownList({ type: 'companies' })
      this.companiesData = responseCompanies.data.result
      response = this.$api.local.getDropdownList({ type: 'LunarTime' })
      this.ddlLunarTime = response

      response = this.$api.local.getDropdownList({ type: 'Country' })
      this.ddlCountry = response
      response = this.$api.local.getDropdownList({ type: 'City' })
      this.ddlCity = response
      this.ddlCityChange()
      response = this.$api.local.getDropdownList({ type: 'Status' })
      this.ddlStatus = response
      response = this.$api.local.getDropdownList({ type: 'Gender' })
      this.ddlGender = response
      response = this.$api.local.getDropdownList({ type: 'RefKind' })
      this.ddlRefKind = response
      this.ddlRefKindChange()
      response = this.$api.local.getDropdownList({ type: 'IDType' })
      this.ddlIDType = response
      let response7 = await this.$api.basic.getDropdownList({ type: 'employeesList' })
      this.ddlEmployeeID = response7.data.result
      // 幫忙帶入虛構欄位: EmployeeID
      if (this.form.Referrer) {
        this.$nextTick(() => {
          this.ddlReferrerChange(this.form.Referrer)
        })
      }
    },
    // 身份證字號提示
    getPlaceholderID: function () {
      switch (this.IDType) {
        case '1':
          return this.$t('__placeholderCustomerID')
        case '2':
          return this.$t('__placeholderPassport')
        case '3':
          return this.$t('__placeholderCustomerIDAfterSave')
      }
    },
    // 過濾郵遞區號
    ddlCityChange: function () {
      this.ddlPost = this.postData.filter(item => item.ParentID === this.form.City)
      if (this.isLoadingFinish) {
        this.form.Post = null
      }
    },
    // 過濾推薦人種類
    ddlRefKindChange: function (selected) {
      switch (this.form.refKind) {
        case '1':
          this.ddlReferrer = this.customersData
          break
        case '2':
          this.ddlReferrer = this.employeesData
          break
        case '3':
          this.ddlReferrer = this.companiesData
          break
      }
      if (this.isLoadingFinish) {
        this.form.Referrer = null
        this.form.EmployeeID = null
      }
    },
    // 選定業務代表, 帶入 業務輔導部
    ddlReferrerChange: function (selected) {
      let row = null
      let bringEmployeeID = ''
      switch (this.form.refKind) {
        case '1':
          bringEmployeeID = ''
          break
        case '2':
          row = this.employeesData.find(item => { return item.ID === selected })
          if (row) { bringEmployeeID = row.EmployeeID }
          break
        case '3':
          row = this.companiesData.find(item => { return item.ID === selected })
          if (row) { bringEmployeeID = row.EmployeeID }
          break
      }
      this.form.EmployeeID = bringEmployeeID
    },
    // 檢查輸入
    checkValidate: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.save(this.dialogType)
          return true
        } else {
          return false
        }
      })
    },
    // 取消
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    // 刪除
    deleteItem: async function () {
      let answerAction = await messageBoxYesNo(this.$t('__delete') + this.$t('__customer') + ' ' + this.form.ID, this.$t('__delete'))

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
    // 存檔
    save: async function (type) {
      let isSuccess = false
      switch (type) {
        case 'new':
          let responseNew = await this.$api.basic.customerNew({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            let { code, message, ID } = responseNew.data.result[0]
            this.form.ID = ID
            this.$alert(message, code)
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.basic.customerEdit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.basic.customerDelete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            this.$alert(responseDelete.data.result[0].message, responseDelete.data.result[0].code)
            isSuccess = true
          } else {
            isSuccess = false
          }
          break
      }

      // 銀行帳戶
      await this.$refs['bankAccounts'].beforeSave()

      if (isSuccess) {
        this.$emit('dialog-save', { ID: this.form.ID })
      }
    },
    // 西元->農曆
    solarToLunar: async function () {
      if (this.form.Birth) {
        let responseCustomer = await this.$api.basic.getObject({ type: 'solarToLunar', keyword: this.form.Birth })
        let resultDate = responseCustomer.data.result[0].calcDate
        resultDate = resultDate.replace(',0', '')
        resultDate = resultDate.replace(',1', ' 閏月')
        this.form.CalcBirthLunarDate = resultDate
      }
    },
    // 農曆->西元, 閏月 由使用者選擇
    lunarToSolar: async function () {
      if (this.form.BirthLunarDate) {
        if (this.form.BirthLunarLeap) {
          let responseCustomer = await this.$api.basic.getObject({ type: 'lunarToSolarWithLeap', keyword: this.form.BirthLunarDate })
          this.form.CalcBirth = responseCustomer.data.result[0].calcDate
        } else {
          let responseCustomer = await this.$api.basic.getObject({ type: 'lunarToSolar', keyword: this.form.BirthLunarDate })
          this.form.CalcBirth = responseCustomer.data.result[0].calcDate
        }
      }
    },
    // 地址自動帶出
    addressChange: async function () {
      let value = this.form.Address
      let { findCity, findPost, fromAddress } = await validate.addressSeparate(value)
      if (!this.form.City) {
        this.form.City = findCity
        this.ddlCityChange()
      }
      if (!this.form.Post) {
        this.form.Post = findPost
      }
      this.form.Address = fromAddress
    },
    // 輸入ID自動帶入uniqueNumber
    idInput: function (value) {
      switch (this.IDType) {
        case '1':
          this.form.UniqueNumber = value.substring(0, 10)
          break
      }
    },
    // 變更代號驗證方式
    idTypeChange: function (value) {
      this.form.ID = ''
    },
    // 驗證身份證字號
    uniqueNumberChange: async function (value) {
      let result = await validate.validatePersonalID(null, value, 'customer', false)
      this.$message.error(result.message)
      this.form.UniqueNumber = this.fromCustomer.UniqueNumber
    }
  }
}
</script>
