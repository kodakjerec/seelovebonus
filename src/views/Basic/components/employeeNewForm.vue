<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <!-- 業務代號 -->
      <el-form-item :label="$t('__employee')+$t('__id')" required>
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
            <el-input v-model="form.ID" maxlength="20" show-word-limit :placeholder="getPlaceholderID()" :disabled="disableForm.ID || IDType==='3'"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 名稱 -->
      <el-form-item :label="$t('__employee')+$t('__name')" prop="Name">
          <el-input v-model="form.Name" maxlength="40" show-word-limit></el-input>
      </el-form-item>
      <!-- 體系,單位,職等 -->
      <el-form-item :label="$t('__depart')">
        <el-col :span="4">
          <el-select v-model="form.Depart" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlDeaprtChange">
            <el-option v-for="item in ddlDepart" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__office')">
            <el-select v-model="form.Office" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlCityChange" :disabled="!form.Depart">
              <el-option v-for="item in ddlOffice" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('__grade')">
            <el-select v-model="form.Grade" value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.Grade">
              <el-option v-for="item in ddlGrade" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 公司 -->
      <el-form-item :label="$t('__companyID')" prop="CompanyID">
        <el-col :span="10">
          <el-select v-model="form.CompanyID" filterable value-key="value" :placeholder="$t('__plzChoice')" @change="ddlCompanyIDChange">
            <el-option v-for="item in ddlCompanyID" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__parent')+$t('__id')" prop="ParentID">
            <el-select v-model="form.ParentID" value-key="value" :placeholder="$t('__plzChoice')" :disabled="!(form.CompanyID !== null)">
              <el-option v-for="item in ddlParentID" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 資格起始日 -->
      <el-form-item :label="$t('__qualifications')+$t('__startDate')" required>
        <el-col :span="10">
          <el-form-item prop="StartDate">
            <el-date-picker
              v-model="form.StartDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__startDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__endDate')" prop="EndDate">
            <el-date-picker
              v-model="form.EndDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__endDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 個資 -->
      <el-form-item :label="$t('__home')+$t('__tel')">
        <el-col :span="10">
          <el-form-item prop="TelHome">
            <el-input v-model="form.TelHome"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__mobile')+$t('__tel')" prop="TelMobile">
            <el-input v-model="form.TelMobile"></el-input>
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
            <el-select v-model="form.City" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlCityChange" :disabled="!form.Country">
              <el-option v-for="item in ddlCity" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('__post')">
            <el-select v-model="form.Post" value-key="value" :placeholder="$t('__plzChoice')" :disabled="!form.City">
              <el-option v-for="item in ddlPost" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__address')">
        <el-input v-model="form.Address" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__eMail')">
        <el-input v-model="form.EMail" maxlength="60" show-word-limit></el-input>
      </el-form-item>
      <!-- 狀態 -->
      <el-form-item :label="$t('__status')">
        <el-select v-model="form.Status" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlStatus" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button v-show="dialogType === 'edit' &&  buttonsShowUser.delete" type="danger" @click="deleteItem">{{$t('__delete')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate.js'
import { messageBoxYesNo } from '@/services/utils'

export default {
  name: 'EmployeeNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    employee: { type: Object },
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

      // 強制轉為大寫
      this.form.ID = this.form.ID.toUpperCase()

      let idType = this.IDType
      // 1.驗證可用性
      let checkValidate = null
      switch (idType) {
        case '1':
          checkValidate = await validate.validatePersonalID(rule, value, 'employee')
          break
        case '2':
          checkValidate = await validate.validatePassport(rule, value, 'employee')
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
        TelHome: '',
        TelMobile: '',
        Grade: '3',
        CompanyID: null,
        StartDate: '',
        EndDate: '',
        Status: '1',
        Country: '2',
        City: null,
        Post: null,
        Address: '',
        EMail: '',
        ParentID: null,
        Memo: '',
        Depart: '',
        Office: ''
      },
      rules: {
        ID: [{ trigger: 'blur', validator: validatePersonalID }],
        Name: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        TelHome: [{ trigger: 'blur', validator: validate.validatePhone }],
        TelMobile: [{ trigger: 'blur', validator: validate.validatePhone }],
        CompanyID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        StartDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        EndDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ParentID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        ID: false,
        Grade: true
      },
      IDType: '1',
      myTitle: '',
      isLoadingFinish: false, // 讀取完畢
      // 以下為下拉式選單專用
      // Settings資料
      postData: [],
      employeesData: [],
      companiesData: [],
      ddlCountry: [],
      ddlCity: [],
      ddlPost: [],
      ddlStatus: [],
      ddlGrade: [],
      ddlCompanyID: [],
      ddlParentID: [],
      ddlIDType: [],
      ddlDepart: [],
      ddlOfficeOrigin: [],
      ddlOffice: []
    }
  },
  async mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__employee')
        this.disableForm.ID = false
        let startDate = new Date()
        this.form.StartDate = startDate.toISOString().slice(0, 10)
        let endDate = new Date()
        endDate = new Date(endDate.setFullYear(endDate.getFullYear() + 10))
        this.form.EndDate = endDate.toISOString().slice(0, 10)
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__employee')
        this.form = JSON.parse(JSON.stringify(this.employee))
        this.disableForm.ID = true
        this.IDType = '2' // 修改狀態不要檢核ID
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

      let responseEmployees = await this.$api.basic.getDropdownList({ type: 'employeeParent' })
      this.employeesData = responseEmployees.data.result
      let responseCompanies = await this.$api.basic.getDropdownList({ type: 'companies' })
      this.companiesData = responseCompanies.data.result

      response = this.$api.local.getDropdownList({ type: 'Country' })
      this.ddlCountry = response
      response = this.$api.local.getDropdownList({ type: 'City' })
      this.ddlCity = response
      this.ddlCityChange()
      response = this.$api.local.getDropdownList({ type: 'Status' })
      this.ddlStatus = response
      response = this.$api.local.getDropdownList({ type: 'Grade' })
      this.ddlGrade = response
      response = this.$api.local.getDropdownList({ type: 'IDType' })
      this.ddlIDType = response
      response = this.$api.local.getDropdownList({ type: 'Depart' })
      this.ddlDepart = response
      response = this.$api.local.getDropdownList({ type: 'Office' })
      this.ddlOfficeOrigin = response
      this.ddlDeaprtChange()

      this.ddlCompanyID = this.companiesData
      this.ddlCompanyIDChange()
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
    // 切換公司
    ddlCompanyIDChange: function () {
      this.ddlParentID = this.employeesData.filter(item => item.CompanyID === this.form.CompanyID)
      if (this.isLoadingFinish) {
        this.form.ParentID = null
      }
    },
    // 過濾郵遞區號
    ddlCityChange: function () {
      this.ddlPost = this.postData.filter(item => item.ParentID === this.form.City)
      if (this.isLoadingFinish) {
        this.form.Post = null
      }
    },
    // 切換體系
    ddlDeaprtChange: function () {
      this.ddlOffice = this.ddlOfficeOrigin.filter(item => item.ParentID === this.form.Depart)
      if (this.isLoadingFinish) {
        this.form.Office = ''
      }
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
      let answerAction = await messageBoxYesNo(this.$t('__delete') + this.$t('__employee') + ' ' + this.form.ID, this.$t('__delete'))

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
          let responseNew = await this.$api.basic.employeeNew({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            let { code, message, ID } = responseNew.data.result[0]
            this.form.ID = ID
            this.$alert(message, code)
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.basic.employeeEdit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.basic.employeeDelete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            this.$alert(responseDelete.data.result[0].message, responseDelete.data.result[0].code)
            isSuccess = true
          } else {
            isSuccess = false
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
