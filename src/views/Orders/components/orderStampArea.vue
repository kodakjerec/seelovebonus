<template>
  <el-table
    :data="stampShow"
    stripe
    border
    style="width: 100%">
    <el-table-column :label="$t('__defaultCompanyName')">
      <el-table-column
        :label="$t('__orderSpace1')">
      </el-table-column>
      <el-table-column
        :label="$t('__orderSpace2')">
      </el-table-column>
      <el-table-column
        :label="$t('__orderCreateID')">
        <template slot-scope="scope">
          {{scope.row.CreateID}}<br/>{{scope.row.CreateIDName}}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('__refEmployeeID')">
        <template slot-scope="scope">
          {{scope.row.EmployeeID}}<br/>{{scope.row.EmployeeIDName}}
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column :label="$t('__defaultDepart')">
      <el-table-column
        :label="$t('__company')">
        <template slot-scope="scope">
          {{scope.row.CompanyID}}<br/>{{scope.row.CompanyName}}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('__referrer')">
        <template slot-scope="scope">
          {{scope.row.Referrer}}<br/>{{scope.row.ReferrerName}}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('__orderSpace3')">
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'orderStampArea',
  props: {
    fromOrderID: { type: String }
  },
  data () {
    return {
      stampShow: [{}]
    }
  },
  watch: {
    fromOrderID: function (newValue) {
      this.preLoading()
    }
  },
  methods: {
    preLoading: async function () {
      let responseStampShow = await this.$api.orders.getObject({ type: 'orderStampShow', keyword: this.fromOrderID })
      this.stampShow = responseStampShow.data.result
    }
  }
}
</script>
