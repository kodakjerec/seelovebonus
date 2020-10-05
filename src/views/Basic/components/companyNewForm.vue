<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80%" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__company')+$t('__id')" prop="ID">
        <el-input v-model="form.ID" autocomplete="off" :placeholder="$t('__palceholderCompanyID')" :disabled="disableForm.ID" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__company')+$t('__name')" prop="Name">
        <el-col :span="10">
          <el-input v-model="form.Name" autocomplete="off" maxlength="40" show-word-limit></el-input>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__nickname')">
            <el-input v-model="form.Nickname" autocomplete="off" maxlength="40" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__refEmployeeID')" prop="EmployeeID">
        <el-select v-model="form.EmployeeID" filterable :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlEmployeeID" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__sponsorKind')" required>
        <el-col :span="10">
          <el-select v-model="form.refKind" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlRefKindChange" :disabled="disableForm.refKind">
            <el-option v-for="item in ddlRefKind" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__sponsor')" prop="Sponsor">
            <el-select v-model="form.Referrer" filterable value-key="value" :placeholder="$t('__plzChoice')">
              <el-option v-for="item in ddlReferrer" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__principal')">
        <el-col :span="10">
          <el-input v-model="form.Principal" autocomplete="off" maxlength="40" show-word-limit></el-input>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__uniformNumber')">
            <el-input v-model="form.UniformNumber" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__tel')+'1'">
        <el-col :span="10">
          <el-form-item prop="Tel1">
            <el-input v-model="form.Tel1" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__tel')+'2'" prop="Tel2">
            <el-input v-model="form.Tel2" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__contract')+$t('__startDate')" required>
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
      <el-button @click.prevent="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click.prevent="checkValidate">{{$t('__save')}}</el-button>
    </div>
    <el-collapse v-model="activeName" accordion="">
        <el-collapse-item name="1">
          <template slot="title">
            <h2>{{$t('__logExceedingCompanyContractDate')}}<i class="el-icon-circle-plus" v-show="activeName===''"></i></h2>
          </template>
          <exceedingDateLog
            :companyID="form.ID">
          </exceedingDateLog>
        </el-collapse-item>
    </el-collapse>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate.js'
import exceedingDateLog from './companyExceedingDateLog'

export default {
  name: 'CompanyNewForm',
  components: {
    exceedingDateLog
  },
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    company: { type: Object }
  },
  data () {
    return {
      form: {
        ID: '',
        Name: '',
        Principal: '',
        UniformNumber: '',
        Tel1: '',
        Tel2: '',
        StartDate: '',
        EndDate: '',
        Status: '1',
        Country: '2',
        City: null,
        Post: null,
        Address: '',
        refKind: '3',
        Referrer: null,
        EmployeeID: null,
        Nickname: null
      },
      rules: {
        ID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Name: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        StartDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        EndDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Tel1: [{ trigger: 'blur', validator: validate.validatePhone }],
        Tel2: [{ trigger: 'blur', validator: validate.validatePhone }],
        EmployeeID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Sponsor: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        ID: false,
        refKind: true
      },
      myTitle: '',
      isLoadingFinish: false, // 讀取完畢
      postData: [], // 郵遞區號
      activeName: '',
      // 以下為下拉式選單專用
      ddlCountry: [],
      ddlCity: [],
      ddlPost: [],
      ddlStatus: [],
      ddlRefKind: [],
      ddlReferrer: [],
      ddlEmployeeID: []
    }
  },
  async mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__company')
        this.disableForm.ID = false
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__company')
        this.form = JSON.parse(JSON.stringify(this.company))
        this.disableForm.ID = true
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

      const response1 = await this.$api.basic.getDropdownList({ type: 'country' })
      this.ddlCountry = response1.data.result
      const response2 = await this.$api.basic.getDropdownList({ type: 'city' })
      this.ddlCity = response2.data.result
      this.ddlCityChange()

      const response3 = await this.$api.basic.getDropdownList({ type: 'status' })
      this.ddlStatus = response3.data.result

      const responseCustomers = await this.$api.basic.getDropdownList({ type: 'customers' })
      this.customersData = responseCustomers.data.result
      const responseEmployees = await this.$api.basic.getDropdownList({ type: 'customerEmployees' })
      this.employeesData = responseEmployees.data.result
      const responseCompanies = await this.$api.basic.getDropdownList({ type: 'companyParent' })
      this.companiesData = responseCompanies.data.result
      const response5 = await this.$api.basic.getDropdownList({ type: 'refKind' })
      this.ddlRefKind = response5.data.result
      this.ddlRefKindChange()
      const response7 = await this.$api.basic.getDropdownList({ type: 'employeesList' })
      this.ddlEmployeeID = response7.data.result
    },
    // 過濾郵遞區號
    ddlCityChange: function () {
      this.ddlPost = this.postData.filter(item => item.ParentID === this.form.City)
      if (this.isLoadingFinish) {
        this.form.Post = null
      }
    },
    // 過濾推薦人種類
    ddlRefKindChange: function () {
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
          const responseNew = await this.$api.basic.companyNew({ form: this.form })
          if (responseNew.status === 200) {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.basic.companyEdit({ form: this.form })
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
