<template>
  <el-form-item :label="label">
    <el-select
      v-model="CustomerID"
      remote
      filterable
      default-first-option
      :placeholder="$t('__plzChoice')"
      :disabled="disabled"
      :remote-method="remoteMethod"
      :loading="loading"
      @change="change">
      <el-option v-for="item in ddlCustomer" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
        <span style="float: left">{{ item.Value }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
      </el-option>
    </el-select>
    <el-button-group>
      <el-button type="primary" @click="showSearch">{{$t('__search')}}</el-button>
      <el-button @click="showForm" :disabled="CustomerID === ''">{{$t('__edit')}}</el-button>
      <el-button @click="handleClick">{{$t('__new')}}</el-button>
    </el-button-group>
    <!-- 新增/修改客戶 -->
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :fromCustomer="customer"
    :buttonsShowUser="buttonsShowUser"
    :fromData="fromData"
    @dialog-cancel="dialogCancel"
    @dialog-save="dialogSave"></new-form>
    <!-- 查詢客戶 -->
    <customer-search
    v-if="dialogShowSearch"
    :dialog-show="dialogShowSearch"
    @dialog-cancel="dialogCancel"
    @dialog-save="dialogSave"></customer-search>
  </el-form-item>
</template>

<script>
import newForm from './components/customerNewForm'
import customerSearch from './components/customerSearch'

export default {
  name: 'inputCustomer',
  components: {
    newForm,
    customerSearch
  },
  props: {
    label: { type: String },
    disabled: { type: Boolean },
    fromCustomerID: { type: String },
    parentObject: {
      type: Object,
      default: function () {
        return {}
      } }
  },
  watch: {
    fromCustomerID: function () {
      this.CustomerID = this.fromCustomerID
      this.remoteMethod(this.fromCustomerID)
    }
  },
  data () {
    return {
      CustomerID: '',
      loading: false,
      options: [],
      customer: {},
      // 開啟修改表單要的資訊
      dialogType: 'new',
      dialogShow: false,
      dialogShowSearch: false,
      // 使用者能看到的權限
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 0,
        search: 0
      },
      fromData: null, // 傳給新增客戶使用
      // 下拉式選單
      ddlCustomer: []
    }
  },
  mounted () {
    this.CustomerID = this.fromCustomerID
    this.remoteMethod(this.fromCustomerID)
  },
  methods: {
    // 遠端即時查客戶代號
    remoteMethod: async function (query) {
      this.loading = true
      let response = await this.$api.basic.getDropdownList({ type: 'customers', keyword: query })
      this.ddlCustomer = response.data.result
      setTimeout(() => {
        this.loading = false
      }, 300)
    },
    // 選定客戶
    change: function () {
      this.$emit('findID', {
        ID: this.CustomerID,
        parentObject: this.parentObject
      })
    },
    // 新增客戶
    handleClick: async function () {
      let response = await this.$api.basic.getObject({ type: 'customer', keyword: this.CustomerID })
      this.customer = response.data.result[0]

      this.buttonsShowUser.new = 1

      this.dialogType = 'new'
      this.dialogShow = true

      this.fromData = {
        type: 'anzaNewCustomer',
        buyer: this.customer
      }
    },
    // 修改客戶
    showForm: async function () {
      if (!this.CustomerID) {
        return
      }
      let response = await this.$api.basic.getObject({ type: 'customer', keyword: this.CustomerID })
      this.customer = response.data.result[0]

      this.buttonsShowUser.edit = 1

      this.dialogType = 'edit'
      this.dialogShow = true
      this.fromData = null
    },
    dialogCancel: function () {
      this.dialogShow = false
      this.dialogShowSearch = false
    },
    dialogSave: function (result) {
      this.dialogShow = false
      this.dialogShowSearch = false

      let { ID } = result
      this.CustomerID = ID
      this.$emit('findID', {
        ID: this.CustomerID,
        parentObject: this.parentObject
      })
    },
    // 開啟查詢
    showSearch: function () {
      this.dialogShowSearch = true
    }
  }
}
</script>
