<template>
  <el-form>
    <el-button-group class="defineCSS_ButtonGroup">
      <el-form-item :label="$t('__building') + '-' + $t('__floor') + '-' + $t('__area')">
        <!-- Building -->
        <el-col :span="6">
          <el-select v-model="searchContent.Building" default-first-option filterable clearable :placeholder="$t('__plzChoice')" @change="ddlBuildingChange">
            <el-option v-for="item in ddlBuilding" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value+'('+item.Counts+')' }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <!-- Floor -->
        <el-col :span="6">
          <el-select v-model="searchContent.Floor" default-first-option filterable clearable :placeholder="$t('__plzChoice')" @change="ddlFloorChange" :disabled="!searchContent.Building">
            <el-option v-for="item in ddlFloor" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value+'('+item.Counts+')' }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <!-- Area -->
        <el-col :span="6">
          <el-select v-model="searchContent.Area" default-first-option filterable clearable :placeholder="$t('__plzChoice')" @change="ddlAreaChange" :disabled="!searchContent.Floor">
            <el-option v-for="item in ddlArea" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value+'('+item.Counts+')' }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-button-group>
    <el-button-group style="padding-bottom: 5px">
      <el-button class="hideButton" icon="el-icon-more"><!-- 排版用,避免沒按鈕跑版 --></el-button>
      <search-button @search="search">
        <el-tooltip slot="body" effect="light" :content="$t('__filter')" placement="top-start">
          <el-button @click.prevent="dialogShowSearchContent = true">{{$t('__filter')}}</el-button>
        </el-tooltip>
      </search-button>
    </el-button-group>
    <el-table
      :data="originData"
      stripe
      border
      :span-method="objectSpanMethod"
      :height="tableHeight"
      style="width: 100%">
      <el-table-column
        :label="$t('__product')">
        <template slot-scope="scope">
          {{scope.row.ProductID}}
          <span class="smallContent">{{scope.row.ProductName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('__storageAddress')">
        <template slot-scope="scope">
          {{scope.row.StorageID}}
          <el-button
            type="text"
            size="mini" @click.native.stop="openLog(scope.$index, scope.row)">{{"Log"}}</el-button>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
          {{$t('__storageAddress')}}{{'(' + $t('__building') + '-' + $t('__floor') + '-' + $t('__area') + ')'}}
        </template>
        <template slot-scope="scope">
          {{scope.row.BuildingName + '-' + scope.row.FloorName + '-' + scope.row.AreaName}}
          <span class="smallConent">{{scope.row.Building + '-' + scope.row.Floor + '-' + scope.row.Area}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="Qty"
        :label="$t('__qty')"
        width="80">
      </el-table-column>
      <el-table-column
        prop="OrderTypeName"
        :label="$t('__kind')"
        width="60">
      </el-table-column>
      <el-table-column
        prop="OrderID"
        :label="$t('__orderID')"
        width="120">
      </el-table-column>
      <el-table-column
        prop="Purpose"
        :label="$t('__storagePurpose')"
        width="80">
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
      :dialog-show="dialogShow"
      :stock="stock"
      @cancel="dialogCancel()"></new-form>
    <!-- 進階查詢選項 -->
    <stock-now-search-content
      :dialogShow="dialogShowSearchContent"
      :fromContent="searchContent"
      @dialog-save="dialogShowSearchContentSave"></stock-now-search-content>
  </el-form>
</template>

<script>
import searchButton from '@/components/searchButton'
import newForm from './components/stockLog'
import stockNowSearchContent from './components/stockNowSearchContent'
import { formatDateTime } from '@/setup/format.js'
export default {
  name: 'StockNow',
  components: {
    searchButton,
    newForm,
    stockNowSearchContent
  },
  data () {
    return {
      originData: [],
      results: [],
      stock: {},
      searchContent: {
        searchKeyWord: '',
        Building: '',
        Floor: '',
        Area: '',
        ProductID: ''
      },
      tableHeight: (screen.height * 7 / 9), // Table高度
      tableSpanList: [],
      pagination: { // 分頁
        currentPage: 1,
        pageSize: 50,
        pageSizeList: [20, 30, 50],
        totalPage: 1,
        totalCount: 20
      },
      dialogShow: false,
      dialogShowSearchContent: false, // 篩選內容
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
  },
  methods: {
    formatterDateTime: function (row, column, cellValue, index) {
      return formatDateTime(cellValue)
    },
    // 讀入使用者清單
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
    // 關閉進階搜尋
    dialogShowSearchContentSave: function (fromContent) {
      this.dialogShowSearchContent = false
      this.search()
    },
    search: async function (value) {
      if (value !== undefined) {
        this.searchContent.searchKeyWord = value
      }
      let response2 = await this.$api.stock.stockNowShow({
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

      this.pageChange()
    },
    // ===== 分頁相關 =====
    handleSizeChange: function (val) {
      this.pagination.pageSize = val
      this.pageChange()
      this.savePaginationData()
      this.search()
    },
    handleCurrentChange: function (val) {
      this.pagination.currentPage = val
      this.pageChange()
      this.savePaginationData()
      this.search()
    },
    savePaginationData: function () {
      // 儲存內容
      localStorage.setItem('paginationHistory:' + this.$route.name, JSON.stringify(this.pagination))
    },
    pageChange: function () {
      this.results = this.originData

      // table span
      this.tableSpanList = []
      this.results.forEach(row => {
        let findObject = this.tableSpanList.find(row2 => { return row2.SpanID === row.ProductID })
        if (findObject === undefined) {
          let firstIndex = this.results.findIndex(row3 => row3.ProductID === row.ProductID)
          this.tableSpanList.push({
            SpanID: row.ProductID,
            rowIndex: firstIndex,
            Qty: 1
          })
        } else {
          findObject.Qty += 1
        }
      })
    },
    // table span method
    objectSpanMethod: function (row, column, rowIndex, columnIndex) {
      if (row.columnIndex === 0) {
        let findObject = this.tableSpanList.find(item => { return item.SpanID === row.row.ProductID })
        // 沒找到
        if (findObject === undefined) {
          return [1, 0]
        } else {
          // 有找到
          // 是第一筆, 就要做 colspan
          if (row.rowIndex === findObject.rowIndex) {
            return [findObject.Qty, 1]
          } else {
            // 其他筆
            return [1, 0]
          }
        }
      }
    },
    // ===== Log =====
    openLog: function (index, row) {
      this.stock = row
      this.dialogShow = true
    },
    dialogCancel: function () {
      this.dialogShow = false
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
.smallConent {
  color: gray;
  font-size: 0.1vw;
}
</style>
