<template>
  <div>
    <el-form>
      <el-form-item :label="$t('__companies')+$t('__id')">
        <el-col :span="8">
          <el-select v-model="form.CompanyID" value-key="value" :placeholder="$t('__plzChoice')">
            <el-option v-for="item in ddlCompanies" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click.prevent="search()">{{$t('__search')}}</el-button>
                <vue-excel-xlsx
                  v-show="employees.length>0"
                  class="vueExcelxlsx"
                  :data="employees"
                  :columns="columns"
                  :filename="'組織分配表'"
                  :sheetname="'Sheet1'"
                  >
                  <el-button type="primary" icon="el-icon-printer">
                    {{$t('__toExcel')}}
                  </el-button>
                </vue-excel-xlsx>
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
export default {
  name: 'ReportsEmployee',
  data () {
    return {
      form: {
        CompanyID: ''
      },
      columns: [
        {
          label: this.$t('__seq'),
          field: 'Seq'
        },
        {
          label: this.$t('__name'),
          field: 'Name'
        },
        {
          label: this.$t('__grade'),
          field: 'GradeName'
        },
        {
          label: this.$t('__uniqueNumber'),
          field: 'ID'
        },
        {
          label: this.$t('__tel'),
          field: 'TelMobile'
        },
        {
          label: this.$t('__address'),
          field: 'Address'
        },
        {
          label: this.$t('__parent') + this.$t('__name'),
          field: 'ParentName'
        },
        {
          label: this.$t('__parent') + this.$t('__id'),
          field: 'ParentID'
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
    }
  }
}
</script>

<style scoped>
.vueExcelxlsx {
  border: none;
  background-color: transparent
}
</style>
