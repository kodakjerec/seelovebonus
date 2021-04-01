<template>
  <el-form>
    <el-button-group class="defineCSS_ButtonGroup">
      <el-form-item :label="$t('__building') + '-' + $t('__floor') + '-' + $t('__area')">
        <!-- Building -->
        <el-col :span="6">
          <el-select v-model="searchContent.Building" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlBuildingChange">
            <el-option v-for="item in ddlBuilding" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value+'('+item.Counts+')' }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <!-- Floor -->
        <el-col :span="6">
          <el-select v-model="searchContent.Floor" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlFloorChange" :disabled="!searchContent.Building">
            <el-option v-for="item in ddlFloor" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value+'('+item.Counts+')' }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <!-- Area -->
        <el-col :span="6">
          <el-select v-model="searchContent.Area" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlAreaChange" :disabled="!searchContent.Floor">
            <el-option v-for="item in ddlArea" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value+'('+item.Counts+')' }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-button-group>
    <el-button-group style="padding-bottom: 5px">
      <el-button v-show="buttonsShowUser.new" type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
      <el-button v-show="buttonsShowUser.new" @click.prevent="dialogShowUpload=true">{{$t('__upload')+$t('__download')}}</el-button>
      <search-button @search="search"></search-button>
    </el-button-group>
    <el-table
      :data="originData"
      stripe
      border
      :height="tableHeight"
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="ID"
        :label="$t('__storageAddress')+$t('__id')">
      </el-table-column>
      <el-table-column>
        <template slot="header">
          {{$t('__storageAddress')}}{{'(' + $t('__building') + '-' + $t('__floor') + '-' + $t('__area') + ')'}}
        </template>
        <template slot-scope="scope">
          {{scope.row.BuildingName + '-' + scope.row.FloorName + '-' + scope.row.AreaName}}<br/>
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
        prop="MaxQty"
        :label="$t('__max') + $t('__inventory')">
      </el-table-column>
      <el-table-column
        prop="Memo"
        :label="$t('__memo')">
      </el-table-column>
    </el-table>
    <!-- 分頁 -->
    <el-pagination
      background
      v-if="originData.length>0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="pagination.pageSizeList"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.totalCount">
    </el-pagination>
    <!-- 小視窗 -->
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :storageAddress="storageAddress"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel"
    @dialog-save="dialogSave"></new-form>
    <!-- 上下傳 -->
    <uploadDownload
    :dialog-show="dialogShowUpload"
    @dialog-cancel="dialogShowUpload=false"></uploadDownload>
  </el-form>
</template>

<script>
import searchButton from '@/components/searchButton'
import newForm from './components/storageAddressNewForm'
import uploadDownload from './components/storageAddressUploadDownload'

export default {
  name: 'StorageAddressShow',
  components: {
    searchButton,
    newForm,
    uploadDownload
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      dialogShowUpload: false,
      originData: [],
      storageAddress: {},
      searchContent: {
        searchKeyWord: '',
        Building: '',
        Floor: '',
        Area: ''
      },
      tableHeight: (screen.height * 7 / 9), // Table高度
      pagination: { // 分頁
        currentPage: 1,
        pageSize: 50,
        pageSizeList: [20, 30, 50],
        totalPage: 1,
        totalCount: 20
      },
      // 使用者能看到的權限
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 1,
        search: 1
      },
      // 下拉式選單
      ddlBuilding: [],
      ddlFloorOrigin: [],
      ddlFloor: [],
      ddlAreaOrigin: [],
      ddlArea: []
    }
  },
  mounted () {
    this.preLoading()
    this.userPermission()
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      let response = null
      response = await this.$api.basic.getDropdownList({ type: 'building' })
      this.ddlBuilding = response.data.result
      response = await this.$api.basic.getDropdownList({ type: 'floor' })
      this.ddlFloorOrigin = response.data.result
      response = await this.$api.basic.getDropdownList({ type: 'area' })
      this.ddlAreaOrigin = response.data.result

      // 帶入預設數值
      if (localStorage.getItem('searchHistory:' + this.$route.name) !== null) {
        let oldSearchContent = JSON.parse(localStorage.getItem('searchHistory:' + this.$route.name))
        this.searchContent.Building = oldSearchContent.Building
        this.ddlBuildingChange(false)
        this.searchContent.Floor = oldSearchContent.Floor
        this.ddlFloorChange(false)
        this.searchContent.Area = oldSearchContent.Area
        this.ddlAreaChange(false)
      } else {
        this.search()
      }
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
      let responseRow = await this.$api.basic.getObject({ type: 'storageAddress', keyword: row.ID })
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
      if (value !== undefined) {
        this.searchContent.searchKeyWord = value
      }
      let response2 = await this.$api.basic.storageAddressShow({
        searchContent: JSON.stringify(this.searchContent),
        pagination: JSON.stringify(this.pagination)
      })
      this.originData = response2.data.result

      // 儲存內容
      localStorage.setItem('searchHistory:' + this.$route.name, JSON.stringify(this.searchContent))

      if (this.originData.length > 0) {
        // 分頁篩選
        let fromPagination = JSON.parse(this.originData[0].pagination)[0]
        this.pagination.totalCount = fromPagination.totalCount
        this.pagination.totalPage = fromPagination.totalPage
        this.pagination.currentPage = fromPagination.currentPage
        this.savePaginationData()
      } else {
        this.pagination.totalCount = 0
        this.pagination.totalPage = 0
        this.pagination.currentPage = 1
        this.savePaginationData()
      }
    },
    // ===== 分頁相關 =====
    handleSizeChange: function (val) {
      this.pagination.pageSize = val
      this.savePaginationData()
      this.search()
    },
    handleCurrentChange: function (val) {
      this.pagination.currentPage = val
      this.savePaginationData()
      this.search()
    },
    savePaginationData: function () {
      // 儲存內容
      localStorage.setItem('paginationHistory:' + this.$route.name, JSON.stringify(this.pagination))
    },
    // ===== 下拉是選單 =====
    ddlBuildingChange: function (isRefresh = true) {
      this.ddlFloor = this.ddlFloorOrigin.filter(item => { return item.ParentID === this.searchContent.Building })
      if (isRefresh) {
        this.searchContent.Floor = ''
        this.searchContent.Area = ''
      }
    },
    ddlFloorChange: function (isRefresh = true) {
      this.ddlArea = this.ddlAreaOrigin.filter(item => { return item.ParentID === this.searchContent.Floor })
      if (isRefresh) {
        this.searchContent.Area = ''
      }
    },
    ddlAreaChange: function (isRefresh = true) {
      this.search()
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
