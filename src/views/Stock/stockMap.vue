<template>
  <el-container>
    <!-- 查詢視窗 -->
    <el-drawer :title="$t('__search')" :visible="showSearchPanel" @close="cancel" :direction="'ltr'">
      <el-form label-width="5vw">
        <el-form-item :label="'Layer'">
          <el-input v-model="searchContent.Layer" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('__building')">
          <el-select v-model="searchContent.Building" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlBuildingChange">
            <el-option v-for="item in ddlBuilding" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value+'('+item.Counts+')' }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('__floor')">
          <el-select v-model="searchContent.Floor" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlFloorChange" :disabled="!searchContent.Building">
            <el-option v-for="item in ddlFloor" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value+'('+item.Counts+')' }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('__area')">
          <el-select v-model="searchContent.Area" value-key="value" :placeholder="$t('__plzChoice')" @change="ddlAreaChange" :disabled="!searchContent.Floor">
            <el-option v-for="item in ddlArea" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value+'('+item.Counts+')' }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('__column')">
          <el-input v-model="searchContent.Column" :disabled="!searchContent.Area" @change="searchContent.Layer='Column'"></el-input>
        </el-form-item>
        <el-form-item :label="$t('__row')">
          <el-input v-model="searchContent.Row" :disabled="!searchContent.Column" @change="searchContent.Layer='Row'"></el-input>
        </el-form-item>
      </el-form>
      <el-button-group>
        <el-button @click="closeSearchPanel">{{$t('__cancel')}}</el-button>
        <el-button type="primary" @click="searchSearchPanel">{{$t('__search')}}</el-button>
      </el-button-group>
    </el-drawer>
    <!-- 圖層 -->
    <el-main id="eChart" :style="cssProps"></el-main>
    <!-- 指南針 -->
    <div class="compass">
      <div class="compass-inner">
        <div class="main-arrow">
          <div class="arrow-up"></div>
          <div class="arrow-down"></div>
        </div>
      </div>
    </div>
    <!-- 目前位置(文字) -->
    <div class="nowPosition">
      <span @click="nowPositionClick('Building')" v-show="searchContent.Building">{{searchContent.Building + ' ' + searchContent.BuildingName}}</span>
      <span @click="nowPositionClick('Floor')" v-show="searchContent.Floor">{{'> ' + searchContent.Floor + ' ' + searchContent.FloorName}}</span>
      <span @click="nowPositionClick('Area')" v-show="searchContent.Area">{{'> ' + searchContent.Area + ' ' + searchContent.AreaName}}</span>
      <span @click="nowPositionClick('Column')" v-show="searchContent.Column">{{'> ' + searchContent.Column}}</span>
      <span @click="nowPositionClick('Row')" v-show="searchContent.Row">{{'> ' + searchContent.Row}}</span>
    </div>
  </el-container>
</template>

<script>
import { seeloveNodeServer } from '@/services/utils'
// 來源: https://echarts.apache.org/examples/zh/editor.html?c=map-usa
import echarts from 'echarts'
export default {
  name: 'StockMap',
  data () {
    return {
      baseWidth: 1440,
      baseHeight: 900,
      othersHeight: 40, // 頂部操作列
      resizePer: { x: 1, y: 1 },
      eChart: null,
      usaJson: {
        type: 'FeatureCollection',
        features: []
      },
      option: {
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: function (params) {
            // 滑鼠移到物件上面要顯示的內容
            let property = params.data
            return property.StorageID + ' ' + property.StorageName + '<br/>' + property.UsedQty + '/' + property.TotalQty
          }
        },
        visualMap: {
          left: 'right',
          min: 0,
          max: 100,
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
            colorAlpha: 0.7
          },
          text: ['High', 'Low'], // 文本，默认为数值文本
          calculable: true
        },
        toolbox: {
          show: true,
          itemSize: 48,
          orient: 'vertical',
          left: 'left',
          top: 'top',
          iconStyle: {
            color: '#ffffff',
            borderColor: '#ffffff',
            borderWidth: 2,
            borderType: 'solid',
            shadowColor: '#ffffff'
          },
          feature: {
            myTool1: {
              show: true,
              title: this.$t('__goback'),
              icon: 'image://' + require('@/assets/baseline_arrow_back_ios_black_48dp.png'),
              onclick: () => {
                this.goback()
              }
            },
            myTool2: {
              show: true,
              title: this.$t('__search'),
              icon: 'image://' + require('@/assets/outline_search_black_48dp.png'),
              onclick: () => {
                this.showSearchPanelFunction()
              }
            }
          }
        },
        series: [
          {
            type: 'map',
            zoom: 1, // 當前視角的縮放比例
            roam: false, // 是否開啟縮放
            map: 'USA',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            boundingCoords: [],
            label: {
              show: true,
              textBorderColor: 'yellow',
              textBorderWidth: 3,
              fontSize: 20,
              width: 20,
              overflow: 'breakAll',
              formatter: function (params) {
                // 物件本身顯示的內容
                let property = params.data
                let showData = property.StorageID
                if (property.StorageName) {
                  showData += '\n' + property.StorageName
                }
                showData += '\n' + property.UsedQty + '/' + property.TotalQty
                return showData
              }
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: [] // 數量數據
          }
        ]
      },
      searchTemp: [], // 搜尋階層(避免查詢視窗造成資料錯亂)
      searchContent: { // 搜尋
        Layer: '',
        Building: '',
        Floor: '',
        Area: '',
        Column: '',
        Row: '',
        Grid: '',
        StorageID: '',
        imageUrl: '', // 背景URL
        // 顯示用
        BuildingName: '',
        FloorName: '',
        AreaName: ''
      },
      mouseLocation: {
        x: 0,
        y: 0
      }, // 滑鼠位置
      rectangleSize: {
        lock: false,
        xAxis: 0,
        yAxis: 0,
        Length: 0,
        Width: 0
      }, // 圖形尺寸
      // ===== 查詢平台 =====
      showSearchPanel: false,
      searchPanelClick: false, // 如果是按下search關閉, 動作不一樣
      // 下拉式選單
      ddlBuilding: [],
      ddlFloorOrigin: [],
      ddlFloor: [],
      ddlAreaOrigin: [],
      ddlArea: []
    }
  },
  computed: {
    cssProps: function () {
      let cssprop = {
        width: '99vw',
        height: `calc(100vh - ` + this.othersHeight + `px)`,
        border: '1px solid',
        'background-size': '100% 100%',
        'background-repeat': 'no-repeat',
        'background-image': `url('${this.searchContent.imageUrl}')`,
        'background-color': 'black'
      }
      return cssprop
    }
  },
  async mounted () {
    // 根據螢幕尺寸, 重新調整地圖大小
    this.resizePer.x = window.innerWidth / this.baseWidth
    this.resizePer.y = window.innerHeight / this.baseHeight
    this.option.series[0].boundingCoords = [
      [0, 0],
      [window.innerWidth, window.innerHeight]
    ]

    // eChart
    this.eChart = echarts.init(document.getElementById('eChart'))
    // 滑鼠事件
    this.eChart.on('click', this.mouseClick)
    this.eChart.getZr().on('mousemove', this.mouseMove)
    this.eChart.getZr().on('mousedown', this.mouseDown)
    this.eChart.getZr().on('mouseup', this.mouseDown)

    // data
    await this.preLoading()
    await this.search()

    // 畫面都處理完之後, 才把查詢選單開出來
    this.showSearchPanelFunction()
  },
  methods: {
    preLoading: async function () {
      let response = null
      response = await this.$api.basic.getDropdownList({ type: 'building' })
      this.ddlBuilding = response.data.result
      response = await this.$api.basic.getDropdownList({ type: 'floor' })
      this.ddlFloorOrigin = response.data.result
      response = await this.$api.basic.getDropdownList({ type: 'area' })
      this.ddlAreaOrigin = response.data.result
    },
    search: async function () {
      // reset
      this.usaJson.features = []
      this.option.series[0].data = []
      this.option.visualMap.max = 0

      // 取得該層背景地圖
      let responseUrl = await this.$api.stock.mapGetImage({
        Building: this.searchContent.Building,
        Floor: this.searchContent.Floor,
        Area: this.searchContent.Area,
        Column: this.searchContent.Column,
        Row: this.searchContent.Row,
        Grid: this.searchContent.Grid,
        StorageID: this.searchContent.StorageID })
      if (responseUrl.data.result[0].URL) {
        this.searchContent.imageUrl = 'http://' + seeloveNodeServer.ip + ':' + seeloveNodeServer.port + '/' + responseUrl.data.result[0].URL
      } else {
        this.searchContent.imageUrl = ''
      }

      // 取得該層地圖數據
      let response1 = await this.$api.stock.mapGet({
        Building: this.searchContent.Building,
        Floor: this.searchContent.Floor,
        Area: this.searchContent.Area,
        Column: this.searchContent.Column,
        Row: this.searchContent.Row,
        Grid: this.searchContent.Grid,
        StorageID: this.searchContent.StorageID })
      let mapData = response1.data.result

      let index = 0
      mapData.forEach(row => {
        index++
        let property = row
        property.name = row.StorageID // eCharts辨識元素使用
        property.value = row.UsedQty // echarts顯示容量顏色使用

        let item = {
          type: 'Feature',
          id: index,
          geometry: {
            type: 'Polygon',
            'coordinates': [
              [
                [row.xAxis * this.resizePer.x, (this.baseHeight - row.yAxis) * this.resizePer.y], // 起點(左上)
                [(row.xAxis + row.Length) * this.resizePer.x, (this.baseHeight - row.yAxis) * this.resizePer.y], // 右上
                [(row.xAxis + row.Length) * this.resizePer.x, (this.baseHeight - row.yAxis - row.Width) * this.resizePer.y], // 右下
                [row.xAxis * this.resizePer.x, (this.baseHeight - row.yAxis - row.Width) * this.resizePer.y], // 左下
                [row.xAxis * this.resizePer.x, (this.baseHeight - row.yAxis) * this.resizePer.y] // 回到原點
              ]
            ]
          },
          properties: property
        }
        // 地圖
        this.usaJson.features.push(item)

        // 統計
        this.option.series[0].data.push(property)

        // Max
        if (row.UsedQty > this.option.visualMap.max) {
          this.option.visualMap.max = row.UsedQty
        }

        // min
      })

      this.mapping()
    },
    // 投影地圖
    mapping: function () {
      echarts.registerMap('USA', this.usaJson)
      this.eChart.setOption(this.option)
    },
    // 子結點 click
    mouseClick: async function (params) {
      // 準備下一階搜尋
      let property = params.data

      switch (this.searchContent.Layer) {
        case '':
          this.searchContent.Building = property.StorageID
          this.searchContent.Layer = 'Building'
          this.ddlBuildingChange()
          break
        case 'Building':
          this.searchContent.Floor = property.StorageID
          this.searchContent.Layer = 'Floor'
          this.ddlFloorChange()
          break
        case 'Floor':
          this.searchContent.Area = property.StorageID
          this.searchContent.Layer = 'Area'
          this.ddlAreaChange()
          break
        case 'Area':
          this.searchContent.Column = property.StorageID
          this.searchContent.Layer = 'Column'
          break
        case 'Column':
          this.searchContent.Row = property.StorageID
          this.searchContent.Layer = 'Row'
          break
        case 'Row':
        case 'Grid':
          this.$message('沒有下一層了')
          return
      }
      this.search()
    },
    // 滑鼠移動
    mouseMove: function (params) {
      this.mouseLocation.x = Math.round(params.offsetX)
      this.mouseLocation.y = Math.round(params.offsetY)
    },
    // 按下滑鼠
    // 按下滑鼠起來
    mouseDown: function (params) {
      if (this.rectangleSize.lock === false) {
        this.rectangleSize.lock = true
        this.rectangleSize.xAxis = Math.round(params.offsetX)
        this.rectangleSize.yAxis = Math.round(params.offsetY)
      } else {
        this.rectangleSize.lock = false
        this.rectangleSize.Length = Math.round((params.offsetX - this.rectangleSize.xAxis) * 100) / 100
        this.rectangleSize.Width = Math.round((params.offsetY - this.rectangleSize.yAxis) * 100) / 100
      }
    },
    // 返回上一層
    goback: async function () {
      // 返回一步
      switch (this.searchContent.Layer) {
        case '':
          this.$message('沒有上一層了')
          return
        case 'Building':
          this.searchContent.Building = ''
          this.searchContent.Layer = ''
          break
        case 'Floor':
          this.searchContent.Floor = ''
          this.searchContent.Layer = 'Building'
          break
        case 'Area':
          this.searchContent.Area = ''
          this.searchContent.Layer = 'Floor'
          break
        case 'Column':
          this.searchContent.Column = ''
          this.searchContent.Layer = 'Area'
          break
        case 'Row':
          this.searchContent.Row = ''
          this.searchContent.Layer = 'Column'
          break
        case 'Grid':
          this.$message('沒有下一層了')
          return
      }
      this.search()
    },
    // ===== 查詢平台 =====
    // 秀出查詢平台
    showSearchPanelFunction: function () {
      // 儲存目前內容
      this.searchTemp = JSON.parse(JSON.stringify(this.searchContent))
      this.showSearchPanel = true
    },
    // 隱藏
    cancel: function () {
      if (!this.searchPanelClick) {
        // 不是經由查詢關閉視窗, 表示為取消查詢
        this.searchContent = JSON.parse(JSON.stringify(this.searchTemp))
      }

      this.searchPanelClick = false
      this.showSearchPanel = false
    },
    // 查詢平台 關閉 按鈕
    closeSearchPanel: function () {
      this.showSearchPanel = false
    },
    // 查詢平台的搜尋
    searchSearchPanel: async function () {
      // 判斷現在層級, 依照輸入內容有無
      if (this.searchContent.Building) {
        this.searchContent.Layer = 'Building'
      }
      if (this.searchContent.Floor) {
        this.searchContent.Layer = 'Floor'
      }
      if (this.searchContent.Area) {
        this.searchContent.Layer = 'Area'
      }
      if (this.searchContent.Column) {
        this.searchContent.Layer = 'Column'
      }
      if (this.searchContent.Row) {
        this.searchContent.Layer = 'Row'
      }

      // 搜尋
      this.search()

      this.searchPanelClick = true
      this.showSearchPanel = false
    },
    // ===== 下拉是選單 =====
    ddlBuildingChange: function () {
      // 帶入文字
      let findObject = this.ddlBuilding.find(item => item.ID === this.searchContent.Building)
      if (findObject) {
        this.searchContent.BuildingName = findObject.Value
      }
      // 篩選
      this.ddlFloor = this.ddlFloorOrigin.filter(item => { return item.ParentID === this.searchContent.Building })
      this.searchContent.Layer = 'Building'
      this.searchContent.Floor = ''
      this.searchContent.Area = ''
      this.searchContent.Column = ''
      this.searchContent.Row = ''
      this.searchContent.Grid = ''
    },
    ddlFloorChange: function () {
      // 帶入文字
      let findObject = this.ddlFloor.find(item => item.ID === this.searchContent.Floor)
      if (findObject) {
        this.searchContent.FloorName = findObject.Value
      }
      // 篩選
      this.ddlArea = this.ddlAreaOrigin.filter(item => { return item.ParentID === this.searchContent.Floor })
      this.searchContent.Layer = 'Floor'
      this.searchContent.Area = ''
      this.searchContent.Column = ''
      this.searchContent.Row = ''
      this.searchContent.Grid = ''
    },
    ddlAreaChange: function () {
      // 帶入文字
      let findObject = this.ddlArea.find(item => item.ID === this.searchContent.Area)
      if (findObject) {
        this.searchContent.AreaName = findObject.Value
      }
      // 篩選
      this.searchContent.Layer = 'Area'
      this.searchContent.Column = ''
      this.searchContent.Row = ''
      this.searchContent.Grid = ''
    },
    // ===== 目前文字說明 =====
    nowPositionClick: function (type) {
      // 根據點進來的Type, 判斷做何種查詢
      switch (type) {
        case '':
          this.$message('沒有上一層了')
          return
        case 'Building':
          this.searchContent.Floor = ''
          this.searchContent.Area = ''
          this.searchContent.Column = ''
          this.searchContent.Row = ''
          this.searchContent.Grid = ''
          this.searchContent.Layer = type
          break
        case 'Floor':
          this.searchContent.Area = ''
          this.searchContent.Column = ''
          this.searchContent.Row = ''
          this.searchContent.Grid = ''
          this.searchContent.Layer = type
          break
        case 'Area':
          this.searchContent.Column = ''
          this.searchContent.Row = ''
          this.searchContent.Grid = ''
          this.searchContent.Layer = type
          break
        case 'Column':
          this.searchContent.Row = ''
          this.searchContent.Grid = ''
          this.searchContent.Layer = type
          break
        case 'Row':
          this.searchContent.Grid = ''
          this.searchContent.Layer = type
          break
        case 'Grid':
          this.searchContent.Layer = type
          this.$message('沒有下一層了')
          return
      }
      this.search()
    }
  }
}
</script>
<style lang='scss' scoped>
.stockMapOption {
  position: absolute;
  left: 0px;
  top: 0px;
  color: yellow;
  font-size: 20px;
  -webkit-text-stroke: 1px black; /* width and color */
}
.compass {
  height: 60px;
  width: 30px;
  right: 0px;
  position: absolute;

  .main-arrow {
    box-sizing: border-box;
    .arrow-up {
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 30px solid #EF5052;
      position: relative;
    }
    .arrow-down {
      width: 0;
      transform: rotate(180deg);
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 30px solid #F3F3F3;
      position: relative;
    }
  }
}

.nowPosition {
  position: absolute;
  left: 60px;
  width:50vw;
  height: 30px;
  text-align: left;

  span {
    font-size: 2vw;
    color: black;
    text-shadow: -1px -1px 0 yellow, 1px 1px 0 yellow, -1px -1px 0 yellow, 1px 1px 0 yellow;
  }
}
</style>
