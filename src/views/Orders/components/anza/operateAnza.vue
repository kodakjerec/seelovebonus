<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form ref="form" :model="anzaOrder" :rules="rules" label-width="10vw" label-position="right">
      <h2>{{$t('__anzaOrder')+'：'}}{{fromAnzaOrder.AnzaOrderID}}</h2>
      <el-divider>{{$t('__anzaOperation')}}</el-divider>
      <!-- 儲位 -->
      <el-form-item v-if="!disableForm.StorageID" :label="$t('__anzaStorageID')" prop="StorageID">
        <el-col :span="8">
          <el-select
            allow-create
            default-first-option
            filterable
            @visible-change="checkStorageID"
            v-model="anzaOrder.StorageID"
            :disabled="disableForm.StorageID"
            :placeholder="$t('__plzChoice')"
            style="display:block">
            <el-option v-for="item in ddlStorageID" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        {{$t('__anzaOperateWarning')}}
      </el-form-item>
      <!-- 安座日期 -->
      <el-form-item v-if="operateType==='anza'" :label="$t('__real') + $t('__anza') + $t('__date')" prop="RealDate">
        <el-date-picker
          v-model="anzaOrder.RealDate"
          :placeholder="$t('__plzChoice')+$t('__date')"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <!-- 圓滿日期 -->
      <el-form-item v-if="operateType==='complete'" :label="$t('__yuanman') + $t('__date')" prop="CompleteDate">
        <el-date-picker
          v-model="anzaOrder.CompleteDate"
          :placeholder="$t('__plzChoice')+$t('__date')"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-divider>{{$t('__anzaCustomer')}}</el-divider>
      <!-- 安座人 -->
      <input-customer
        v-if="operateType==='modify'"
        :label="$t('__anzaCustomer')"
        :disabled="disableForm.CustomerID"
        :fromCustomerID="anzaOrder.CustomerID"
        @findID="findID"></input-customer>
      <!-- 客戶名稱 -->
      <el-form-item
        v-else
        :label="$t('__anzaCustomer')">
        <el-col :span="4">
          <el-input v-model="form.ID" disabled></el-input>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('__customer')+$t('__name')">
          <el-input v-model="form.Name" maxlength="40" show-word-limit disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('__english')+$t('__name')">
            <el-input v-model="form.NameEnglish" maxlength="40" show-word-limit disabled></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 個資 -->
      <!-- 性別 -->
      <el-form-item :label="$t('__gender')">
        <el-col :span="4">
          <el-select v-model="form.Gender" value-key="value" :placeholder="$t('__plzChoice')" disabled>
            <el-option v-for="item in ddlGender" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('__home')+$t('__tel')" prop="TelHome">
            <el-input v-model="form.TelHome" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('__mobile')+$t('__tel')" prop="TelMobile">
            <el-input v-model="form.TelMobile" disabled></el-input>
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
              value-format="yyyy-MM-dd"
              disabled>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__lunarDate')+'('+$t('__lunarCalendar')+')'">
            <el-date-picker
              v-model="form.BirthLunarDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__lunarDate')+'('+$t('__lunarCalendar')+')'"
              value-format="yyyy-MM-dd"
              disabled>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-checkbox v-model="form.BirthLunarLeap" :true-label="1" :false-label="0" disabled>閏月</el-checkbox>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__lunarTime')">
            <el-select v-model="form.BirthLunarTime" value-key="value" :placeholder="$t('__plzChoice')" disabled>
              <el-option v-for="item in ddlLunarTime" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value + '(' + item.Memo + ')' }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 換算日期 -->
      <el-form-item :label="$t('__convert')+$t('__lunarCalendar')">
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="form.CalcBirthLunarDate" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('__convert')+$t('__solarCalendar')">
            <el-input v-model="form.CalcBirth" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 國家etc -->
      <el-form-item :label="$t('__country')">
        <el-col :span="4">
          <el-select v-model="form.Country" value-key="value" :placeholder="$t('__plzChoice')" disabled>
            <el-option v-for="item in ddlCountry" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__city')">
            <el-select v-model="form.City" value-key="value" :placeholder="$t('__plzChoice')" disabled>
              <el-option v-for="item in ddlCity" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('__post')">
            <el-select v-model="form.Post" value-key="value" :placeholder="$t('__plzChoice')" disabled>
              <el-option v-for="item in ddlPost" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 住址 -->
      <el-form-item :label="$t('__address')">
        <el-input v-model="form.Address" maxlength="100" show-word-limit disabled></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="checkValidate">{{$t('__ok')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate'
import inputCustomer from '@/views/Basic/inputCustomer'

export default {
  name: 'operateAnza',
  components: {
    inputCustomer
  },
  props: {
    dialogShow: { type: Boolean, default: false },
    operateType: { type: String },
    fromAnzaOrder: { type: Object }
  },
  data () {
    // 驗證儲位正確性
    let validateStorageID = async (rule, value, callback) => {
      if (this.fromAnzaOrder.Status !== '1') {
        callback()
      }
      // 1.驗證可用性
      let checkValidate = null
      let object = {
        ProductID: this.fromAnzaOrder.ProductID,
        Purpose: '',
        Qty: 1,
        StorageID: this.anzaOrder.StorageID
      }
      checkValidate = await validate.validateStorageID(object.ProductID, object.Purpose, object.Qty, object.StorageID, callback)

      if (checkValidate !== '') {
        callback(checkValidate)
        return
      }

      callback()
    }
    return {
      anzaOrder: {
        type: '',
        AnzaOrderID: '',
        CustomerID: '',
        StorageID: '',
        RealDate: '',
        CompleteDate: ''
      },
      // 客戶基本資料 -- 抄襲 customerNewForm.vue
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
        Birth: null,
        Gender: '3',
        Status: '1',
        refKind: null,
        Referrer: null,
        BirthLunarDate: null,
        BirthLunarTime: null,
        BirthLunarLeap: null,
        // 顯示用
        CalcBirthLunarDate: '',
        CalcBirth: '',
        EmployeeID: ''
      },
      disableForm: {
        CustomerID: false,
        StorageID: false
      },
      rules: {
        StorageID: [{ required: true, trigger: 'blur', validator: validateStorageID }],
        RealDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        CompleteDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      myTitle: '',
      postData: [],
      // 下拉是選單
      ddlStorageID: [],
      ddlLunarTime: [],
      ddlGender: [],
      ddlCountry: [],
      ddlCity: [],
      ddlPost: []
    }
  },
  mounted () {
    this.anzaOrder.type = this.operateType
    this.anzaOrder.AnzaOrderID = this.fromAnzaOrder.AnzaOrderID
    this.anzaOrder.CustomerID = this.fromAnzaOrder.CustomerID
    this.anzaOrder.StorageID = this.fromAnzaOrder.StorageID
    this.anzaOrder.RealDate = this.fromAnzaOrder.RealDate
    this.anzaOrder.CompleteDate = this.fromAnzaOrder.CompleteDate

    switch (this.operateType) {
      case 'modify':
        this.myTitle = this.$t('__edit') + this.$t('__anza')
        this.disableForm.StorageID = true
        break
      case 'anza':
        this.myTitle = this.$t('__anza')
        this.disableForm.CustomerID = true
        this.anzaOrder.RealDate = new Date()
        break
      case 'complete':
        this.myTitle = this.$t('__yuanman')
        this.disableForm.CustomerID = true
        this.disableForm.StorageID = true
        this.anzaOrder.CompleteDate = new Date()
        break
    }
    this.preLoading()
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      // 取得所有原始資料
      let response = this.$api.local.getDropdownList({ type: 'LunarTime' })
      this.ddlLunarTime = response
      response = this.$api.local.getDropdownList({ type: 'Gender' })
      this.ddlGender = response
      if (!this.disableForm.StorageID) {
        let response2 = await this.$api.stock.findStorageID({
          ProductID: this.fromAnzaOrder.ProductID,
          Purpose: '',
          Qty: 1
        })
        this.ddlStorageID = response2.data.result
      }
      response = this.$api.local.getDropdownList({ type: 'District' })
      this.postData = response
      response = this.$api.local.getDropdownList({ type: 'Country' })
      this.ddlCountry = response
      response = this.$api.local.getDropdownList({ type: 'City' })
      this.ddlCity = response

      // 帶入客戶基本資料
      await this.bringCustomer()

      // 帶入換算後的日期
      this.solarToLunar()
      this.lunarToSolar()
      // 郵遞區號
      this.ddlCityChange()
    },
    // 找到客戶帳號
    findID: function (value) {
      this.anzaOrder.CustomerID = value
      this.bringCustomer()
    },
    // ===== 客戶資料 =====
    // 過濾郵遞區號
    ddlCityChange: function () {
      this.ddlPost = this.postData.filter(item => item.ParentID === this.form.City)
    },
    // 帶入客戶資料-- 抄襲 customerNewForm.vue -- mounted ()
    bringCustomer: async function () {
      if (!this.anzaOrder.CustomerID) {
        return
      }
      let response = await this.$api.basic.getObject({ type: 'customer', keyword: this.anzaOrder.CustomerID })
      let fromCustomer = response.data.result[0]
      this.form.ID = fromCustomer.ID
      this.form.Name = fromCustomer.Name
      this.form.NameEnglish = fromCustomer.NameEnglish
      this.form.AgentID = fromCustomer.AgentID
      this.form.AgentName = fromCustomer.AgentName
      this.form.AgentCountry = fromCustomer.AgentCountry
      this.form.AgentCity = fromCustomer.AgentCity
      this.form.AgentPost = fromCustomer.AgentPost
      this.form.AgentAddress = fromCustomer.AgentAddress
      this.form.TelHome = fromCustomer.TelHome
      this.form.TelMobile = fromCustomer.TelMobile
      this.form.Country = fromCustomer.Country
      this.form.City = fromCustomer.City
      this.form.Post = fromCustomer.Post
      this.form.Address = fromCustomer.Address
      this.form.EMail = fromCustomer.EMail
      this.form.Gender = fromCustomer.Gender
      this.form.Status = fromCustomer.Status
      this.form.refKind = fromCustomer.refKind
      this.form.Referrer = fromCustomer.Referrer
      if (fromCustomer.Birth) {
        this.form.Birth = fromCustomer.Birth.slice(0, 10)
      }
      if (fromCustomer.BirthLunarDate) {
        this.form.BirthLunarDate = fromCustomer.BirthLunarDate.slice(0, 10)
        this.form.BirthLunarTime = fromCustomer.BirthLunarTime
        this.form.BirthLunarLeap = fromCustomer.BirthLunarLeap
      }
    },
    // 西元->農曆-- 抄襲 customerNewForm.vue
    solarToLunar: async function () {
      if (this.form.Birth) {
        let responseCustomer = await this.$api.basic.getObject({ type: 'solarToLunar', keyword: this.form.Birth })
        let resultDate = responseCustomer.data.result[0].calcDate
        resultDate = resultDate.replace(',0', '')
        resultDate = resultDate.replace(',1', ' 閏月')
        this.form.CalcBirthLunarDate = resultDate
      }
    },
    // 農曆->西元, 閏月 由使用者選擇-- 抄襲 customerNewForm.vue
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
    // ===== 表單功能 =====
    // 檢查輸入正確性
    checkStorageID: function (event) {
      // 強制轉為大寫
      this.anzaOrder.StorageID = this.anzaOrder.StorageID.toUpperCase()

      if (event === false) {
        this.$refs['form'].validate((valid) => {})
      }
    },
    checkValidate: function () {
      // 檢查主表單
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.save()
        }
      })
    },
    save: async function () {
      let response2 = await this.$api.orders.anzaOperate({ form: this.anzaOrder })
      if (response2.headers['code'] === '200') {
        this.$message({
          message: response2.data.result[0].message,
          type: 'success'
        })
      }
      this.$emit('dialog-save')
    },
    cancel: function () {
      this.$emit('dialog-cancel')
    }
  }
}
</script>
