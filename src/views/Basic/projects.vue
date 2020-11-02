<template>
  <el-form>
    <el-button-group class="defineCSS_ButtonGroup">
      <el-button icon="el-icon-setting" @click.prevent="showFormPBonus('new')">{{$t('__performanceBonus')}}</el-button>
      <el-button icon="el-icon-setting" @click.prevent="showFormSBonus('new')">{{$t('__superBonus')}}</el-button>
    </el-button-group>
    <el-button-group>
      <el-button v-show="buttonsShowUser.new" type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
    </el-button-group>
    <search-button @search="search"></search-button>
    <p style="height:1px" />
    <el-table
      :data="projectsShow"
      stripe
      border
      @row-click="handleClick"
      :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column
        prop="ID"
        :label="$t('__project')+$t('__id')">
      </el-table-column>
      <el-table-column
        prop="Name"
        :label="$t('__project')+$t('__name')">
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
      <el-table-column
        prop="Price"
        :label="$t('__price')"
        :formatter="formatterMoney">
      </el-table-column>
      <el-table-column
        prop="PV"
        :label="$t('__pv')">
      </el-table-column>
    </el-table>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :project="project"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
    <p-bonus
    v-if="dialogShowPBonus"
    :dialog-type="dialogTypePBonus"
    :dialog-show="dialogShowPBonus"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></p-bonus>
    <s-bonus
    v-if="dialogShowSBonus"
    :dialog-type="dialogTypeSBonus"
    :dialog-show="dialogShowSBonus"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></s-bonus>
  </el-form>
</template>

<script>
import searchButton from '@/components/searchButton'
import newForm from './components/projectNewForm'
import pBonus from './components/projectPerformanceBonus'
import sBonus from './components/projectSuperBonus'
import { formatDate, formatMoney } from '@/setup/format.js'

export default {
  name: 'Projects',
  components: {
    searchButton,
    newForm,
    pBonus,
    sBonus
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      dialogTypePBonus: 'new',
      dialogShowPBonus: false,
      dialogTypeSBonus: 'new',
      dialogShowSBonus: false,
      projectsShow: [],
      project: {},
      searchKeyWord: '',
      // 使用者能看到的權限
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 1,
        search: 1
      }
    }
  },
  mounted () {
    this.preLoading()
    this.userPermission()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    // table 變更顏色
    tableRowClassName ({ row, rowIndex }) {
      if (row['Status'] === '0') {
        return 'disabled-row'
      }
    },
    // 讀入系統清單
    preLoading: async function () {
      // 顯示專用
      const response2 = await this.$api.basic.projectsShow({ keyword: this.searchKeyWord })
      this.projectsShow = response2.data.result
    },
    // 使用者權限
    userPermission: async function () {
      let progPermission = this.$store.state.userProg.filter(item => { return item.Path === this.$route.fullPath })[0]
      this.buttonsShowUser.new = progPermission.fun1
      this.buttonsShowUser.edit = progPermission.fun2
      this.buttonsShowUser.save = progPermission.fun2
      this.buttonsShowUser.delete = progPermission.fun3
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      let responseRow = await this.$api.basic.getObject({ type: 'project', ID: row.ID })
      this.project = responseRow.data.result[0]

      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.edit

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
    },
    // 開啟表單
    showForm: function (eventType) {
      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.new

      this.dialogType = eventType
      this.dialogShow = true
    },
    showFormPBonus: function (eventType) {
      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.new

      this.dialogTypePBonus = eventType
      this.dialogShowPBonus = true
    },
    showFormSBonus: function (eventType) {
      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.new

      this.dialogTypeSBonus = eventType
      this.dialogShowSBonus = true
    },
    dialogCancel: function () {
      this.dialogShow = false
      this.dialogShowPBonus = false
      this.dialogShowSBonus = false
    },
    dialogSave: function () {
      this.dialogShow = false
      this.dialogShowPBonus = false
      this.dialogShowSBonus = false
      this.preLoading()
    },
    // 搜尋
    search: async function (value) {
      this.searchKeyWord = value
      const response2 = await this.$api.basic.projectsShow({ keyword: this.searchKeyWord })
      this.projectsShow = response2.data.result
    }
  }
}
</script>
<style lang="scss" scoped>
.defineCSS_ButtonGroup {
  position: absolute;
  left:10px;
}
</style>
