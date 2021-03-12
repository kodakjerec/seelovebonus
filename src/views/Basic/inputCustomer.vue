<template>
  <el-form-item :label="label">
    <el-select
      v-model="CustomerID"
      filterable
      :placeholder="$t('__plzChoice')"
      :disabled="disabled">
      <el-option v-for="item in options" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
        <span style="float: left">{{ item.Value }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
      </el-option>
    </el-select>
    <el-button-group>
      <el-button type="primary" @click="showSearch">{{$t('__search')}}</el-button>
      <el-button @click="showForm" :disabled="CustomerID === ''">{{$t('__edit')}}</el-button>
      <el-button @click="handleClick">{{$t('__new')}}</el-button>
    </el-button-group>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :customer="customer"
    :buttonsShowUser="buttonsShowUser"
    :fromData="fromData"
    @dialog-cancel="dialogCancel"
    @dialog-save="dialogSave"></new-form>
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
    fromCustomerID: { type: String }
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
      fromData: null // 傳給新增客戶使用
    }
  },
  mounted () {
    this.CustomerID = this.fromCustomerID
    this.preLoading()
  },
  methods: {
    // // 遠端即時查客戶代號
    // remoteMethod: async function (query) {
    //   this.loading = true
    //   setTimeout(() => {
    //     this.options = this.ddlCustomer.filter(item => {
    //       return item.ID.indexOf(query) > -1 || item.Value.indexOf(query) > -1
    //     })
    //     this.loading = false
    //   }, 200)
    // },
    preLoading: async function () {
      let response = await this.$api.orders.getDropdownList({ type: 'customer' })
      this.options = response.data.result
    },
    // 新增客戶
    handleClick: function () {
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
      this.$emit('findID', this.CustomerID)
      this.preLoading()
    },
    // 開啟查詢
    showSearch: function () {
      this.dialogShowSearch = true
    }
  }
}
</script>
