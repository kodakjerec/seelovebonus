<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center :show-close="false" width="80%">
    <el-form ref="form" :model="form" :rules="rules" label-width="20%">
      <el-form-item :label="$t('__employee')+$t('__id')" prop="ID">
        <el-input v-model="form.ID" autocomplete="off" :disabled="disableForm.ID" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__employee')+$t('__name')" prop="Name">
          <el-input v-model="form.Name" autocomplete="off" maxlength="40" show-word-limit></el-input>
      </el-form-item>
            <el-form-item :label="$t('__grade')" prop="Grade">
        <el-col :span="10">
        <el-select v-model="form.Grade" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlGrade" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__companyID')}}
        </el-col>
        <el-col :span="10">
          <el-form-item prop="CompanyID">
            <el-select v-model="form.CompanyID" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlCompanyIDChange">
              <el-option v-for="item in ddlCompanyID" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__parent')+$t('__id')" prop="ParentID">
        <el-select v-model="form.ParentID" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlParentID" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__qualifications')+$t('__startDate')" required>
        <el-col :span="10">
          <el-form-item prop="StartDate">
            <el-date-picker
              v-model="form.StartDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__startDate')"
              format="yyyy - MM - dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__endDate')}}
        </el-col>
        <el-col :span="10">
          <el-form-item prop="EndDate">
            <el-date-picker
              v-model="form.EndDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__endDate')"
              format="yyyy - MM - dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__home')+$t('__tel')">
        <el-col :span="10">
          <el-form-item prop="TelHome">
            <el-input v-model="form.TelHome" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__mobile')+$t('__tel')}}
        </el-col>
        <el-col :span="10">
          <el-form-item prop="TelMobile">
            <el-input v-model="form.TelMobile" autocomplete="off"></el-input>
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
        <el-col :span="2" class="el-form-item__label">
          {{$t('__city')}}
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="form.City" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlCityChange">
              <el-option v-for="item in ddlCity" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__post')}}
        </el-col>
        <el-col :span="10">
          <el-form-item>
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EmployeeNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    employee: { type: Object }
  },
  data () {
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (value[2] === '-') {
        // 格式為 02-12345678, 03-1234567
        if (!isNaN(value.substring(0, 2))) {
          switch (value.substring(0, 2)) {
            case '02':
              if (value.substring(3, 11).length < 8) {
                callback(new Error(this.$t('__pleaseInputPhoneLength')))
              }
              if (isNaN(value.substring(3, 11))) {
                callback(new Error(this.$t('__pleaseInputNumber')))
              }
              break
            default:
              if (value.substring(3, 10).length < 7) {
                callback(new Error(this.$t('__pleaseInputPhoneLength')))
              }
              if (isNaN(value.substring(3, 10))) {
                callback(new Error(this.$t('__pleaseInputNumber')))
              }
          }
          callback()
        } else {
          callback(new Error(this.$t('__pleaseInputNumber')))
        }
      } else if (value[3] === '-') {
        // 格式為 037-123456, 049-1234567, 089-123456
        if (!isNaN(value.substring(0, 3))) {
          switch (value.substring(0, 3)) {
            case '037':
            case '089':
              if (value.substring(4, 10).length < 6) {
                callback(new Error(this.$t('__pleaseInputPhoneLength')))
              }
              if (isNaN(value.substring(4, 10))) {
                callback(new Error(this.$t('__pleaseInputNumber')))
              }
              break
            default:
              if (value.substring(4, 11).length < 7) {
                callback(new Error(this.$t('__pleaseInputPhoneLength')))
              }
              if (isNaN(value.substring(4, 11))) {
                callback(new Error(this.$t('__pleaseInputNumber')))
              }
          }
          callback()
        } else {
          callback(new Error(this.$t('__pleaseInputNumber')))
        }
      } else if (value[4] === '-') {
        // 格式為 0836-12345
        // 手機   0980-123456
        if (!isNaN(value.substring(0, 4))) {
          switch (value.substring(0, 4)) {
            case '0836':
              if (value.substring(5, 10).length < 5) {
                callback(new Error(this.$t('__pleaseInputPhoneLength')))
              }
              if (isNaN(value.substring(5, 10))) {
                callback(new Error(this.$t('__pleaseInputNumber')))
              }
              break
            default:
              if (value.substring(5, 11).length < 6) {
                callback(new Error(this.$t('__pleaseInputPhoneLength')))
              }
              if (isNaN(value.substring(5, 11))) {
                callback(new Error(this.$t('__pleaseInputNumber')))
              }
          }
          callback()
        } else {
          callback(new Error(this.$t('__pleaseInputNumber')))
        }
      } else {
        callback(new Error(this.$t('__pleaseInputPhoneStyle')))
      }
    }
    return {
      form: {
        ID: '',
        Name: '',
        TelHome: '',
        TelMobile: '',
        Grade: null,
        CompanyID: null,
        StartDate: '',
        EndDate: '',
        Status: 1,
        Country: null,
        City: null,
        Post: null,
        Address: '',
        EMail: '',
        ParentID: null,
        Memo: ''
      },
      rules: {
        ID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Name: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        TelHome: [{ trigger: 'blur', validator: validatePhone }],
        TelMobile: [{ trigger: 'blur', validator: validatePhone }],
        Grade: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        CompanyID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        StartDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        EndDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ParentID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        ID: false
      },
      myTitle: '',
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
      ddlParentID: []
    }
  },
  mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__employee')
        this.disableForm.ID = false
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__employee')
        this.form = this.employee
        this.disableForm.ID = true
        break
    }
    this.preloading()
  },
  methods: {
    // 讀取預設資料
    preloading: async function () {
      // 取得所有原始資料
      const response = await this.$api.basic.getDropdownList({ type: 'post' })
      this.postData = response.data.result

      const responseEmployees = await this.$api.basic.getDropdownList({ type: 'employees' })
      this.employeesData = responseEmployees.data.result
      const responseCompanies = await this.$api.basic.getDropdownList({ type: 'companies' })
      this.companiesData = responseCompanies.data.result

      const response1 = await this.$api.basic.getDropdownList({ type: 'country' })
      this.ddlCountry = response1.data.result
      const response2 = await this.$api.basic.getDropdownList({ type: 'city' })
      this.ddlCity = response2.data.result
      this.ddlCityChange()
      const response3 = await this.$api.basic.getDropdownList({ type: 'status' })
      this.ddlStatus = response3.data.result
      const response4 = await this.$api.basic.getDropdownList({ type: 'grade' })
      this.ddlGrade = response4.data.result
      this.ddlCompanyID = this.companiesData
      this.ddlCompanyIDChange()
    },
    // 切換公司
    ddlCompanyIDChange: function () {
      this.ddlParentID = this.employeesData.filter(item => item.CompanyID === this.form.CompanyID)
    },
    // 過濾郵遞區號
    ddlCityChange: function () {
      this.ddlPost = this.postData.filter(item => item.ParentID === this.form.City)
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
          const responseNew = await this.$api.basic.employeeNew({ form: this.form })
          if (responseNew.status === 200) {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.basic.employeeEdit({ form: this.form })
          if (responseEdit.status === 200) {
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
