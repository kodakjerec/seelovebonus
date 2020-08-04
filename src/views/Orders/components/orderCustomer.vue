<template>
  <el-form ref="form" :model="form" :rules="rules">
    <h2 style="text-align:left">{{$t('__orderCustomer')+$t('__data')}}</h2>
    <!-- 有法定代理人資料, 要顯示 -->
    <template v-if="showAgentData">
      <el-form-item :label="$t('__orderCustomer')+$t('__name')" prop="CustomerID" label-width="100px" label-position="left">
        <el-col :span="6">
          <el-select v-model="form.CustomerID" filterable value-key="value" :placeholder="$t('__plzChoice')" @change="ddlCustomerChange" :disabled="disableForm.CustomerID">
            <el-option v-for="item in ddlCustomer" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="el-form-item__label">
          {{$t('__agent')}}
        </el-col>
        <el-col :span="10">
          <el-input v-model="form.AgentName" autocomplete="off" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__uniqueNumber')" label-width="100px" label-position="left">
        <el-col :span="8">
          <el-input v-model="form.CustomerID" autocomplete="off" disabled></el-input>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__uniqueNumber')}}
        </el-col>
        <el-col :span="12">
          <el-input v-model="form.AgentID" autocomplete="off" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__home')+'/'+$t('__mobile')+$t('__tel')" label-width="100px" label-position="left">
        <el-col :span="8" class="elInputWidth">
          <el-input v-model="form.TelHome" autocomplete="off" disabled></el-input>
          <el-input v-model="form.TelMobile" autocomplete="off" disabled></el-input>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__address')}}
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="form.AgentCity" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlCityChange" disabled>
              <el-option v-for="item in ddlAgentCity" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="form.AgentPost" value-key="value" :placeholder="$t('__plzChoice')" disabled>
              <el-option v-for="item in ddlAgentPost" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          </el-col>
        <el-col :span="6">
          <el-input v-model="form.AgentAddress" autocomplete="off" disabled></el-input>
        </el-col>
      </el-form-item>
    </template>
    <!-- 無法定代理人資料 -->
    <template v-else>
            <el-form-item :label="$t('__orderCustomer')+$t('__name')" prop="CustomerID" label-width="100px" label-position="left">
        <el-col :span="6">
          <el-select v-model="form.CustomerID" filterable value-key="value" :placeholder="$t('__plzChoice')" @change="ddlCustomerChange" :disabled="disableForm.CustomerID">
            <el-option v-for="item in ddlCustomer" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__uniqueNumber')" label-width="100px" label-position="left">
        <el-col :span="8">
          <el-input v-model="form.CustomerID" autocomplete="off" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__home')+'/'+$t('__mobile')+$t('__tel')" label-width="100px" label-position="left">
        <el-col :span="8" class="elInputWidth">
          <el-input v-model="form.TelHome" autocomplete="off" disabled></el-input>
          <el-input v-model="form.TelMobile" autocomplete="off" disabled></el-input>
        </el-col>
      </el-form-item>
    </template>
    <el-form-item :label="$t('__eMail')" label-width="100px" label-position="left">
      <el-input v-model="form.EMail" autocomplete="off" disabled></el-input>
    </el-form-item>
    <el-form-item :label="$t('__address')" label-width="100px" label-position="left">
      <el-col :span="4">
        <el-form-item>
          <el-select v-model="form.City" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlCityChange" disabled>
            <el-option v-for="item in ddlCity" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item>
          <el-select v-model="form.Post" value-key="value" :placeholder="$t('__plzChoice')" disabled>
            <el-option v-for="item in ddlPost" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-input v-model="form.Address" autocomplete="off" disabled></el-input>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'OrderCustomer',
  props: {
    dialogType: { type: String, default: 'new' },
    orderID: { type: String },
    orderCustomer: { type: Object },
    ddlCustomerBefore: { tpye: Array }
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
        AgentID: '',
        AgentName: '',
        AgentCountry: null,
        AgentCity: null,
        AgentPost: null,
        AgentAddress: '',
        refKind: null,
        Referrer: null,
        EmployeeID: null
      },
      rules: {
        CustomerID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        CustomerID: false
      },
      showAgentData: true,
      // 以下為下拉式選單專用
      postData: [],
      ddlCountry: [],
      ddlCity: [],
      ddlPost: [],
      ddlCustomer: [],
      // 法定代理人專用下拉式選單
      ddlAgentCountry: [],
      ddlAgentCity: [],
      ddlAgentPost: []
    }
  },
  watch: {
    orderID: function (newValue) {
      if (newValue) {
        this.form.OrderID = newValue
      }
    },
    orderCustomer: function () {
      if (this.orderCustomer) {
        this.form = JSON.parse(JSON.stringify(this.orderCustomer))

        // 是否顯示代理人區域
        if (this.dialogType !== 'new') {
          if (this.form.AgentID === '') {
            this.showAgentData = false
          }
        }

        // 切換城市下拉式選單
        this.ddlCityChange()

        // 法定代理人
        this.ddlAgentCityChange()
      }
    },
    ddlCustomerBefore: function (value) {
      if (this.ddlCustomerBefore) {
        this.ddlCustomer = JSON.parse(JSON.stringify(this.ddlCustomerBefore))
      }
    }
  },
  mounted () {
    this.preLoading()

    switch (this.dialogType) {
      case 'new':
        break
      case 'edit':
        this.disableForm.CustomerID = true
        break
    }
  },
  methods: {
    preLoading: async function () {
      if (this.ddlCustomerBefore) {
        this.ddlCustomer = this.ddlCustomerBefore
      }

      const response = await this.$api.basic.getDropdownList({ type: 'post' })
      this.postData = response.data.result

      const response1 = await this.$api.basic.getDropdownList({ type: 'country' })
      this.ddlCountry = response1.data.result
      const response2 = await this.$api.basic.getDropdownList({ type: 'city' })
      this.ddlCity = response2.data.result

      // 法定代理人
      this.ddlAgentCountry = response1.data.result
      this.ddlAgentCity = response2.data.result
    },
    // 選定客戶取得資料
    ddlCustomerChange: async function () {
      // 取得可以用的選單
      let responseRow = await this.$api.orders.getObject({ type: 'orderCustomerGetDetail', ID: this.form.CustomerID })
      let row = responseRow.data.result[0]
      this.form.TelHome = row.TelHome
      this.form.TelMobile = row.TelMobile
      this.form.EMail = row.EMail
      this.form.Country = row.Country
      this.form.City = row.City
      this.form.Post = row.Post
      this.form.Address = row.Address
      this.form.AgentID = row.AgentID
      this.form.AgentName = row.AgentName
      this.form.AgentCountry = row.AgentCountry
      this.form.AgentCity = row.AgentCity
      this.form.AgentPost = row.AgentPost
      this.form.AgentAddress = row.AgentAddress
      this.form.refKind = row.refKind
      this.form.Referrer = row.Referrer
      this.form.EmployeeID = row.EmployeeID

      this.ddlCityChange()

      // 法定代理人
      this.ddlAgentCityChange()
    },
    // 過濾郵遞區號
    ddlCityChange: function () {
      this.ddlPost = this.postData.filter(item => item.ParentID === this.form.City)
    },
    // 過濾法定代理人郵遞區號
    ddlAgentCityChange: function () {
      this.ddlAgentPost = this.postData.filter(item => item.ParentID === this.form.AgentCity)
    },
    // 檢查輸入
    checkValidate: function () {
      let isSuccess = false
      this.$refs['form'].validate((valid) => { isSuccess = valid })
      return isSuccess
    },
    // 存檔
    save: async function () {
      let isSuccess = false
      switch (this.dialogType) {
        case 'new':
          const responseNew = await this.$api.orders.orderCustomerNew({ form: this.form })
          if (responseNew.status === 200) {
            isSuccess = true
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
<style lang="scss" scoped>
.elInputWidth .el-input{
  width:50%;
}
</style>
