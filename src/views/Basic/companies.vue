<template>
  <el-form>
    <el-table
      :data="companiesShow"
      stripe
      border
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="ID"
        :label="$t('__company')+$t('__id')">
      </el-table-column>
      <el-table-column
        prop="Name"
        :label="$t('__company')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="Principal"
        :label="$t('__principal')">
      </el-table-column>
      <el-table-column
        prop="StartDate"
        :label="$t('__startDate')"
        :formatter="formatterDate">
      </el-table-column>
      <el-table-column
        prop="EndDate"
        :label="$t('__endDate')"
        :formatter="formatterDate">
      </el-table-column>
    </el-table>
    <br/>
    <el-button-group>
      <el-button type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
    </el-button-group>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :company="company"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
  </el-form>
</template>

<script>
import newForm from './components/companyNewForm'
export default {
  name: 'Companies',
  components: {
    newForm
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      companiesShow: [],
      company: {}
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return cellValue.substring(0, 10)
    },
    // 讀入系統清單
    preLoading: async function () {
      const response2 = await this.$api.basic.companiesShow()
      this.companiesShow = response2.data.result
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      let responseRow = await this.$api.basic.getObject({ type: 'company', ID: row.ID })
      this.company = responseRow.data.result[0]

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
      this.user = row
    },
    // 開啟表單
    showForm: function (eventType) {
      this.dialogType = eventType
      this.dialogShow = true
    },
    dialogCancel: function () {
      this.dialogShow = false
    },
    dialogSave: function () {
      this.dialogShow = false
      this.preLoading()
    }
  }
}
</script>
