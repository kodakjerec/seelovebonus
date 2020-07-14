<template>
  <el-form>
    <el-form-item :label="$t('__companies')+$t('__id')">
      <el-select v-model="form.CompanyID" value-key="value" :placeholder="$t('__plzChoice')" @change="selectChange">
        <el-option v-for="item in ddlCompanies" :key="item.ID" :label="item.Value" :value="item.ID">
          <span style="float: left">{{ item.Value }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button-group>
        <el-button type="primary" icon="el-icon-printer" @click.prevent="print()">{{$t('__print')}}</el-button>
      </el-button-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ReportsEmployee',
  data () {
    return {
      form: {
        CompanyID: ''
      },
      ddlCompanies: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      const response = await this.$api.reports.getDropdownList({ type: 'companies' })
      this.ddlCompanies = response.data.result
      this.form.CompanyID = this.ddlCompanies[0].ID
    },
    // 切換經銷商代號
    selectChange: async function (selected) {

    }
  }
}
</script>
