<template>
  <div>
    <el-form ref="form" :model="form" label-width="20%">
      <el-form-item :label="$t('__startDate')">
        <el-col :span="10">
          <el-form-item prop="StartDate">
            <el-date-picker
              v-model="form.StartDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__startDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__endDate')}}
        </el-col>
        <el-col :span="8">
          <el-form-item prop="EndDate">
            <el-date-picker
              v-model="form.EndDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__endDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
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
  name: 'ReportsBonus1',
  data () {
    return {
      form: {
        StartDate: null,
        EndDate: null
      },
      columns: [
        {
          header: this.$t('__seq'),
          key: 'Seq',
          width: 8
        },
        {
          header: this.$t('__company') + this.$t('__id'),
          key: 'CompanyID',
          width: 10
        },
        {
          header: this.$t('__company') + this.$t('__name'),
          key: 'CompanyName',
          width: 10
        },
        {
          header: this.$t('__uniqueNumber'),
          key: 'ID',
          width: 10
        },
        {
          header: this.$t('__name'),
          key: 'EmployeeName',
          width: 10
        },
        {
          header: this.$t('__parent') + this.$t('__id'),
          key: 'ParentID',
          width: 10
        },
        {
          header: this.$t('__amount') + '(' + this.$t('__million') + ')',
          key: 'Amount',
          width: 10
        },
        {
          header: this.$t('__superBonus') + this.$t('__percentage') + '(%)',
          key: 'Percentage',
          width: 30
        },
        {
          header: this.$t('__companyPaid'),
          key: 'CompanyBonus',
          width: 10
        },
        {
          header: this.$t('__secondaryPaid'),
          key: 'SecondaryBonus',
          width: 10
        },
        {
          header: this.$t('__selfPaid'),
          key: 'SelfBonus',
          width: 10
        },
        {
          header: this.$t('__performanceBonus') + this.$t('__percentage') + '(%)',
          key: 'PerBonusPercentage',
          width: 30
        },
        {
          header: this.$t('__performanceBonus') + this.$t('__amount') + '(' + this.$t('__million') + ')',
          key: 'PerBonusAmount',
          width: 30
        }
      ],
      results: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      this.form.EndDate = new Date()
      this.form.StartDate = new Date()
      this.form.StartDate.setMonth(this.form.EndDate.getMonth() - 3)
    },
    // 查詢
    search: async function () {
      const response2 = await this.$api.reports.bonus1({ form: this.form })
      this.results = response2.data.result
    },
    toExcel: async function () {
      const response2 = await this.$api.reports.bonus1ToExcel({ StartDate: this.form.StartDate, EndDate: this.form.EndDate, columns: this.columns })
      let blob = new Blob([response2.data], { type: response2.headers['content-type'] })
      saveAs(blob, '獎金試算.xlsx')
    }
  }
}
</script>
