<template>
  <div>
    <el-form>
      <el-form-item :label="$t('__companies')+$t('__id')">
        <el-col :span="10">
          <el-select v-model="form.CompanyID" filterable value-key="value" :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlCompanies" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click.prevent="search()">{{$t('__search')}}</el-button>
              <el-button type="primary" v-show="employees.length > 0" icon="el-icon-printer" @click.prevent="toExcel()">{{$t('__toExcel')}}</el-button>
            </el-button-group>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <div id="printMe">
      <el-table
        :data="employees"
        stripe
        border
        style="width: 100%">
        <el-table-column
          prop="Seq"
          :label="$t('__seq')">
        </el-table-column>
        <el-table-column
          prop="Name"
          :label="$t('__name')">
        </el-table-column>
        <el-table-column
          prop="GradeName"
          :label="$t('__grade')">
        </el-table-column>
        <el-table-column
          prop="ID"
          :label="$t('__uniqueNumber')">
        </el-table-column>
        <el-table-column
          prop="TelMobile"
          :label="$t('__tel')">
        </el-table-column>
        <el-table-column
          prop="Address"
          :label="$t('__address')">
        </el-table-column>
        <el-table-column
          prop="ParentName"
          :label="$t('__parent')+$t('__name')">
        </el-table-column>
        <el-table-column
          prop="ParentID"
          :label="$t('__parent')+$t('__name')">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Excel from 'exceljs'
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
          field: 'ParentID',
          width: 10
        }
      ],
      employees: [],
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
      this.employees = response2.data.result
    },
    toExcel: function () {
      let workbook = new Excel.Workbook()
      let sheet = workbook.addWorksheet('My Sheet')
      sheet.columns = this.columns
      sheet.addRows(this.employees)

      let fileName = '組織分配表.xlsx'
      workbook.xlsx.writeBuffer()
        .then(function (data) {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          saveAs(blob, fileName)
        })
    }
  }
}
</script>
