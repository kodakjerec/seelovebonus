<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80%" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__customer')+$t('__id')" required>
        <el-col :span="4" v-show="!disableForm.ID">
          <el-select v-model="IDType" value-key="value" :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlIDType" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="ID">
            <el-input v-model="form.ID" autocomplete="off" maxlength="20" show-word-limit :disabled="disableForm.ID"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__customer')+$t('__name')" prop="Name">
        <el-col :span="10">
          <el-input v-model="form.Name" autocomplete="off" maxlength="40" show-word-limit></el-input>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__english')+$t('__name')">
            <el-input v-model="form.NameEnglish" autocomplete="off" maxlength="40" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__refKind')" prop="Referrer">
        <el-col :span="10">
          <el-select v-model="form.refKind" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlRefKindChange">
            <el-option v-for="item in ddlRefKind" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__referrer')" prop="Referrer">
            <el-select v-model="form.Referrer" filterable value-key="value" :placeholder="$t('__plzChoice')" @change="ddlReferrerChange">
              <el-option v-for="item in ddlReferrer" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__refEmployeeID')">
        <el-select v-model="form.EmployeeID" filterable value-key="value" :placeholder="$t('__plzChoice')" disabled>
          <el-option v-for="item in ddlEmployeeID" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__home')+$t('__tel')">
        <el-col :span="10">
          <el-form-item prop="TelHome">
            <el-input v-model="form.TelHome" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__mobile')+$t('__tel')" prop="TelMobile">
            <el-input v-model="form.TelMobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__gender')">
        <el-col :span="10">
        <el-select v-model="form.Gender" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlGender" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__birth')">
            <el-date-picker
              v-model="form.Birth"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__birth')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__country')">
        <el-col :span="4">
          <el-select v-model="form.Country" value-key="value" :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlCountry" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__city')">
            <el-select v-model="form.City" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlCityChange">
              <el-option v-for="item in ddlCity" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('__post')">
            <el-select v-model="form.Post" value-key="value" :placeholder="$t('__plzChoice')">
              <el-option v-for="item in ddlPost" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__address')">
        <el-input v-model="form.Address" autocomplete="off" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__eMail')">
        <el-input v-model="form.EMail" autocomplete="off" maxlength="60" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__status')">
        <el-select v-model="form.Status" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlStatus" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 以下為法定代理人 -->
      <el-collapse v-model="activeName" accordion="">
        <el-collapse-item name="1">
          <template slot="title">
            <h2>{{$t('__customer')+$t('__agent')}}<i class="el-icon-circle-plus" v-show="activeName===''"></i></h2>
          </template>
          <el-form-item :label="$t('__id')">
            <el-select v-model="form.AgentID" value-key="value" :placeholder="$t('__palceholderCustomerID')" @change="ddlAgentIDChange">
                <el-option v-for="item in ddlAgentID" :key="item.ID" :label="item.Value" :value="item.ID">
                  <span style="float: left">{{ item.Value }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item :label="$t('__name')">
            <el-input v-model="form.AgentName" autocomplete="off" maxlength="40" show-word-limit></el-input>
          </el-form-item>
          <el-form-item :label="$t('__country')">
            <el-col :span="4">
              <el-select v-model="form.AgentCountry" value-key="value" :placeholder="$t('__plzChoice')">
                <el-option v-for="item in ddlAgentCountry" :key="item.ID" :label="item.Value" :value="item.ID">
                  <span style="float: left">{{ item.Value }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('__city')">
                <el-select v-model="form.AgentCity" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlAgentCityChange">
                  <el-option v-for="item in ddlAgentCity" :key="item.ID" :label="item.Value" :value="item.ID">
                    <span style="float: left">{{ item.Value }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('__post')">
                <el-select v-model="form.AgentPost" value-key="value" :placeholder="$t('__plzChoice')">
                  <el-option v-for="item in ddlAgentPost" :key="item.ID" :label="item.Value" :value="item.ID">
                    <span style="float: left">{{ item.Value }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('__address')">
            <el-input v-model="form.AgentAddress" autocomplete="off" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
      <!-- 以上為法定代理人 -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate'
export default {
  name: 'CustomerNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    customer: { type: Object },
    buttonsShowUser: { type: Object }
  },
  data () {
    // 切換驗證身分證號碼或護照
    let validatePersonalID = async (rule, value, callback) => {
      // 新增時才檢驗
      if (this.dialogType !== 'new') {
        callback()
        return
      }

      let idType = this.IDType
      // 1.驗證可用性
      let checkValidate = null
      switch (idType) {
        case '1':
          checkValidate = validate.validatePersonalID(rule, value, callback)
          break
        default:
          checkValidate = validate.validatePassport(rule, value, callback)
      }
      if (checkValidate !== '') {
        callback(checkValidate)
        return
      }

      // 2.驗證是否重複
      const response = await this.$api.basic.checkValidate({ type: 'customer', ID: this.form.ID })
      let rows = response.data.result
      if (rows && rows.length > 0) {
        callback(new Error(this.$t('__id') + this.$t('__valueUsed')))
        return
      }
      callback()
    }
    return {
      form: {
        ID: '',
        Name: '',
        NameEnglish: '',
        AgentID: '',
        AgentName: '',
        AgentCountry: '2',
        AgentCity: null,
        AgentPost: null,
        AgentAddress: '',
        TelHome: '',
        TelMobile: '',
        Country: '2',
        City: null,
        Post: null,
        Address: '',
        EMail: '',
        EmployeeID: null, // 虛構欄位, 不存在資料庫
        Birth: '',
        Gender: '3',
        Status: '1',
        refKind: null,
        Referrer: null
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
      ddlAgentID: [],
      // 法定代理人專用下拉式選單
      ddlAgentCountry: [],
      ddlAgentCity: [],
      ddlAgentPost: [],
      ddlIDType: []
    }
  },
  async mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__customer')
        this.disableForm.ID = false
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__customer')
        this.form = JSON.parse(JSON.stringify(this.customer))
        this.disableForm.ID = true
        this.IDType = '2' // 修改狀態不要檢核ID
        // 有法定代理人打開面板
        if (this.form.AgentID !== '') {
          this.activeName = '1'
        }
        break
    }
    await this.preLoading()

    this.isLoadingFinish = true
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      // 取得所有原始資料
      const response = await this.$api.basic.getDropdownList({ type: 'post' })
      this.postData = response.data.result

      const responseCustomers = await this.$api.basic.getDropdownList({ type: 'customers' })
      this.customersData = responseCustomers.data.result
      const responseEmployees = await this.$api.basic.getDropdownList({ type: 'employees' })
      this.employeesData = responseEmployees.data.result
      const responseCompanies = await this.$api.basic.getDropdownList({ type: 'companies' })
      this.companiesData = responseCompanies.data.result
      // 幫忙帶入虛構欄位: EmployeeID
      switch (this.dialogType) {
        case 'edit':
          this.$nextTick(() => {
            this.ddlReferrerChange(this.form.Referrer)
          })
          break
      }

      const response1 = await this.$api.basic.getDropdownList({ type: 'country' })
      this.ddlCountry = response1.data.result
      const response2 = await this.$api.basic.getDropdownList({ type: 'city' })
      this.ddlCity = response2.data.result
      this.ddlCityChange()
      const response3 = await this.$api.basic.getDropdownList({ type: 'status' })
      this.ddlStatus = response3.data.result
      const response4 = await this.$api.basic.getDropdownList({ type: 'gender' })
      this.ddlGender = response4.data.result
      const response5 = await this.$api.basic.getDropdownList({ type: 'refKind' })
      this.ddlRefKind = response5.data.result
      this.ddlRefKindChange()
      const response6 = await this.$api.basic.getDropdownList({ type: 'idType' })
      this.ddlIDType = response6.data.result
      const response7 = await this.$api.basic.getDropdownList({ type: 'employeesList' })
      this.ddlEmployeeID = response7.data.result

      // 法定代理人
      this.ddlAgentID = this.customersData
      this.ddlAgentCountry = response1.data.result
      this.ddlAgentCity = response2.data.result
      this.ddlAgentCityChange()
    },
    // 過濾郵遞區號
    ddlCityChange: function () {
      this.ddlPost = this.postData.filter(item => item.ParentID === this.form.City)
      if (this.isLoadingFinish) {
        this.form.Post = null
      }
    },
    // 過濾法定代理人郵遞區號
    ddlAgentCityChange: function () {
      this.ddlAgentPost = this.postData.filter(item => item.ParentID === this.form.AgentCity)
      if (this.isLoadingFinish) {
        this.form.AgentPost = null
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
    // 切換 法定代理人
    ddlAgentIDChange: async function (selectd) {
      const responseCustomer = await this.$api.basic.getObject({ type: 'customer', ID: selectd })
      let row = responseCustomer.data.result[0]
      if (row !== undefined) {
        this.form.AgentName = row.Name
        this.form.AgentCountry = row.Country
        this.form.AgentCity = row.City
        this.ddlAgentCityChange()
        this.form.AgentPost = row.Post
        this.form.AgentAddress = row.Address
      }
    },
    // 檢查輸入
    checkValidate: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.save()
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
    // 存檔
    save: async function () {
      let isSuccess = false
      switch (this.dialogType) {
        case 'new':
          const responseNew = await this.$api.basic.customerNew({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.basic.customerEdit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
      }

      if (isSuccess) {
        this.$emit('dialog-save')
      }
    }
  }
}
</script>
