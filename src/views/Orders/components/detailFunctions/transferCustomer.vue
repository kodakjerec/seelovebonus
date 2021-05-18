<template>
  <el-table
    :data="subList"
    stripe
    border
    style="width: 100%">
    <el-table-column
      prop="Value1"
      :label="$t('__certificate1')">
      <template slot-scope="scope">
        <el-select
          v-if="buttonsShowUser.new"
          default-first-option filterable clearable
          v-model="scope.row[scope.column.property]"
          :placeholder="$t('__plzChoice')"
          style="display:block">
          <el-option v-for="item in ddlCertificate1" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
        <div v-else>
          {{scope.row[scope.column.property]}}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="Value2"
      :label="$t('__certificate2')">
      <template slot-scope="scope">
        <el-select
          v-if="buttonsShowUser.new"
          default-first-option filterable clearable
          v-model="scope.row[scope.column.property]"
          :placeholder="$t('__plzChoice')"
          style="display:block">
        <el-option v-for="item in ddlCertificate2" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
          <span style="float: left">{{ item.Value }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
        </el-option>
        </el-select>
        <div v-else>
          {{scope.row[scope.column.property]}}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="Value3"
      :label="$t('__new')+$t('__customer')">
      <template slot-scope="scope">
        <el-select
          v-if="buttonsShowUser.new"
          v-model="scope.row[scope.column.property]"
          remote
          default-first-option filterable clearable
          :placeholder="$t('__plzChoice')"
          :remote-method="remoteMethodCustomer"
          :loading="loading">
          <el-option v-for="item in ddlCustomer" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
        <div v-else>
          {{scope.row[scope.column.property]}}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'transferCustomer',
  props: {
    subList: { type: Array },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      loading: false,
      // 下拉是選單
      ddlCertificate1: [],
      ddlCertificate2: [],
      ddlCustomerBefore: [],
      ddlCustomer: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    preLoading: async function () {
      let response = await this.$api.orders.getDropdownList({ type: 'certificate1transferCustomer_Cer' })
      this.ddlCertificate1 = response.data.result
      response = await this.$api.orders.getDropdownList({ type: 'certificate2transferCustomer_Cer' })
      this.ddlCertificate2 = response.data.result
      response = await this.$api.basic.getDropdownList({ type: 'customers' })
      this.ddlCustomerBefore = response.data.result
      this.remoteMethodCustomer('')
    },
    checkValidate: function () {
      let isSuccess = true

      this.subList.forEach(row => {
        if (row.Value1 === '' || row.Value2 === '' || row.Value3 === '') {
          this.$message({
            message: this.$t('__pleaseInput') + ' ' + this.$t('__project') + this.$t('__extend') + this.$t('__function'),
            type: 'error'
          })
          isSuccess = false
          return isSuccess
        }
      })

      return isSuccess
    },
    // 遠端即時查客戶代號
    remoteMethodCustomer: async function (query) {
      this.loading = true
      this.ddlCustomer = this.ddlCustomerBefore.filter(item => {
        return item.ID.indexOf(query) > -1 || item.Value.indexOf(query) > -1
      })

      setTimeout(() => {
        this.loading = false
      }, 300)
    }
  }
}
</script>
