<template>
  <div>
    <el-form ref="form" :model="form" label-width="20%">
      <el-form-item :label="$t('__companies')+$t('__id')">
        <el-select v-model="form.CompanyID" filterable value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlCompanies" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-button-group>
      <el-button type="primary" icon="el-icon-search" @click.prevent="search()">{{$t('__search')}}</el-button>
      <el-button type="primary" v-show="results.length > 0" icon="el-icon-printer" @click.prevent="toExcel()">{{$t('__toExcel')}}</el-button>
    </el-button-group>
    <div id="printMe">
      <el-table
        :data="results"
        stripe
        border
        style="width: 100%">
        <el-table-column v-for="column in columns" :key="column.key"
          :prop="column.key"
          :label="column.header">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { saveAs } from 'file-saver'

export default {
  name: 'ReportsEmployee',
  data () {
    return {
      form: {
        CompanyID: ''
      },
      columns: [
        {
          header: this.$t('__seq'),
          key: 'Seq',
          width: 8
        },
        {
          header: this.$t('__name'),
          key: 'Name',
          width: 10
        },
        {
          header: this.$t('__grade'),
          key: 'GradeName',
          width: 10
        },
        {
          header: this.$t('__uniqueNumber'),
          key: 'ID',
          width: 10
        },
        {
          header: this.$t('__tel'),
          key: 'TelMobile',
          width: 10
        },
        {
          header: this.$t('__address'),
          key: 'Address',
          width: 30
        },
        {
          header: this.$t('__parent') + this.$t('__name'),
          key: 'ParentName',
          width: 10
        },
        {
          header: this.$t('__parent') + this.$t('__id'),
          key: 'ParentID',
          width: 10
        }
      ],
      results: [],
      // 以下為下拉式選單專用
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
    // 查詢
    search: async function () {
      const response2 = await this.$api.reports.employees({ CompanyID: this.form.CompanyID })
      this.results = response2.data.result
    },
    toExcel: async function () {
      const response2 = await this.$api.reports.employeesToExcel({ CompanyID: this.form.CompanyID, columns: this.columns })
      let blob = new Blob([response2.data], { type: response2.headers['content-type'] })
      saveAs(blob, '組織分配表' + this.form.CompanyID + '.xlsx')
    }
  }
}
</script>
