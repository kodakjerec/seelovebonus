<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__company')+$t('__id')" prop="ID">
        <el-input v-model="form.ID" :placeholder="$t('__placeholderCompanyID')" :disabled="disableForm.ID" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__company')+$t('__name')" prop="Name">
        <el-col :span="10">
          <el-input v-model="form.Name" maxlength="40" show-word-limit></el-input>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__nickname')">
            <el-input v-model="form.Nickname" maxlength="40" show-word-limit></el-input>
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
          <el-form-item :label="$t('__sponsor')" prop="Referrer">
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
          <el-input v-model="form.Principal" maxlength="40" show-word-limit></el-input>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__uniformNumber')">
            <el-input v-model="form.UniformNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__tel')+'1'">
        <el-col :span="10">
          <el-form-item prop="Tel1">
            <el-input v-model="form.Tel1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__tel')+'2'" prop="Tel2">
            <el-input v-model="form.Tel2"></el-input>
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
      <el-form-item :label="$t('__status')">
        <el-select v-model="form.Status" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlStatus" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
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
    <div slot="footer">
      <el-button v-show="dialogType === 'edit' &&  buttonsShowUser.delete" type="danger" @click="deleteItem">{{$t('__delete')}}</el-button>
      <el-button @click.prevent="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShowUser.save" type="primary" @click.prevent="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate.js'
import exceedingDateLog from './companyExceedingDateLog'
import { messageBoxYesNo } from '@/services/utils'

export default {
  name: 'CompanyNewForm',
  components: {
    exceedingDateLog
  },
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    company: { type: Object },
    buttonsShowUser: { type: Object }
  },
  data () {
    // 切換驗證身分證號碼或護照
    let myValidate = async (rule, value, callback) => {
      // 新增時才檢驗
      if (this.dialogType !== 'new') {
        callback()
        return
      }

      // 強制轉為大寫
      this.form.ID = this.form.ID.toUpperCase()

      // 1.驗證可用性
      let checkValidate = null

      checkValidate = await validate.validatePassport(rule, value, 'company')

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
        ID: [{ trigger: 'blur', validator: myValidate }],
        Name: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        StartDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        EndDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Tel1: [{ trigger: 'blur', validator: validate.validatePhone }],
        Tel2: [{ trigger: 'blur', validator: validate.validatePhone }],
        EmployeeID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Referrer: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
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
      let response = this.$api.local.getDropdownList({ type: 'District' })
      this.postData = response
      response = this.$api.local.getDropdownList({ type: 'Country' })
      this.ddlCountry = response
      response = this.$api.local.getDropdownList({ type: 'City' })
      this.ddlCity = response
      this.ddlCityChange()

      response = this.$api.local.getDropdownList({ type: 'Status' })
      this.ddlStatus = response

      let responseCompanies = await this.$api.basic.getDropdownList({ type: 'companyParent' })
      this.companiesData = responseCompanies.data.result
      response = this.$api.local.getDropdownList({ type: 'RefKind' })
      this.ddlRefKind = response
      this.ddlRefKindChange()
      let response7 = await this.$api.basic.getDropdownList({ type: 'employeesList' })
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
      let answerAction = await messageBoxYesNo(this.$t('__delete') + this.$t('__company') + ' ' + this.form.ID, this.$t('__delete'))

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
          let responseNew = await this.$api.basic.companyNew({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.basic.companyEdit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.basic.companyDelete({ form: this.form })
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
