<template>
  <el-form>
    <el-button-group style="padding-bottom: 5px">
      <el-button v-show="buttonsShowUser.new" type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
      <search-button @search="search"></search-button>
    </el-button-group>
    <el-table
      :data="storageAddressShow"
      stripe
      border
      @row-click="handleClick"
      :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column
        prop="ID"
        :label="$t('__storageAddress')+$t('__id')">
      </el-table-column>
      <el-table-column
        prop="BuildingName"
        :label="$t('__building')">
      </el-table-column>
      <el-table-column
        prop="FloorName"
        :label="$t('__floor')">
      </el-table-column>
      <el-table-column
        prop="AreaName"
        :label="$t('__area')">
      </el-table-column>
      <el-table-column>
        <template slot="header">
          {{$t('__storageAddress')}}{{'(' + $t('__building') + '-' + $t('__floor') + '-' + $t('__area') + ')'}}
        </template>
        <template slot-scope="scope">
          {{scope.row.Building + '-' + scope.row.Floor + '-' + scope.row.Area}}
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
          {{$t('__volume')+'('+$t('__length')+'*'+$t('__width')+'*'+$t('__height')+')'}}
        </template>
        <template slot-scope="scope">
          {{scope.row.Length + '*' + scope.row.Width + '*' + scope.row.Height}}
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
          {{$t('__limit')}}{{$t('__itemCategory')}}
        </template>
        <template slot-scope="scope">
          {{scope.row.Category1Name + '-' + scope.row.Category2Name + '-' + scope.row.Category3Name}}
        </template>
      </el-table-column>
      <el-table-column
        prop="Memo"
        :label="$t('__memo')">
      </el-table-column>
    </el-table>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :storageAddress="storageAddress"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
  </el-form>
</template>

<script>
import searchButton from '@/components/searchButton'
import newForm from './components/storageAddressNewForm'

export default {
  name: 'StorageAddressShow',
  components: {
    searchButton,
    newForm
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      storageAddressShow: [],
      storageAddress: {},
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
    // 讀入系統清單
    preLoading: async function () {
      this.search('')
    },
    // 使用者權限
    userPermission: async function () {
      let progPermission = this.$store.state.userProg.filter(item => { return item.Path === this.$route.fullPath })[0]
      this.buttonsShowUser.new = progPermission.fun1
      this.buttonsShowUser.edit = progPermission.fun2
      this.buttonsShowUser.save = progPermission.fun2
      this.buttonsShowUser.delete = progPermission.fun3
    },
    // table 變更顏色
    tableRowClassName ({ row, rowIndex }) {
      if (row['Status'] === '0') {
        return 'disabled-row'
      }
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      let responseRow = await this.$api.basic.getObject({ type: 'storageAddress', ID: row.ID })
      this.storageAddress = responseRow.data.result[0]

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
    dialogCancel: function () {
      this.dialogShow = false
    },
    dialogSave: function () {
      this.dialogShow = false
      this.preLoading()
    },
    // 搜尋
    search: async function (value) {
      this.searchKeyWord = value
      let response2 = await this.$api.basic.storageAddressShow({ keyword: this.searchKeyWord })
      this.storageAddressShow = response2.data.result
    }
  }
}
</script>
