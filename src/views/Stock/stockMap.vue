<template>
  <div>
    <div id="eChart" :style="cssProps"></div>
    <el-dialog :visible="showSearchPanel" center @close="cancel">
      <el-form label-width="10vw">
        <el-form-item :label="$t('__now')">
          <el-input v-model="searchContent.Layer"></el-input>
        </el-form-item>
        <el-form-item :label="$t('__building')">
          <el-input v-model="searchContent.Building"></el-input>
        </el-form-item>
        <el-form-item :label="$t('__floor')">
          <el-input v-model="searchContent.Floor"></el-input>
        </el-form-item>
        <el-form-item :label="$t('__area')">
          <el-input v-model="searchContent.Area"></el-input>
        </el-form-item>
        <el-form-item :label="$t('__column')">
          <el-input v-model="searchContent.Column"></el-input>
        </el-form-item>
        <el-form-item :label="$t('__row')">
          <el-input v-model="searchContent.Row"></el-input>
        </el-form-item>
        <el-form-item :label="$t('__grid')">
          <el-input v-model="searchContent.Grid"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">{{$t('__cancel')}}</el-button>
        <el-button type="primary" @click="search">{{$t('__save')}}</el-button>
      </div>
    </el-dialog>
  </div>
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
      othersHeight: 30, // 頂部操作列
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
      searchStack: [], // 搜尋階層
      searchContent: { // 搜尋
        Layer: '',
        Building: '',
        Floor: '',
        Area: '',
        Column: '',
        Row: '',
        Grid: '',
        StorageID: '',
        imageUrl: '' // 背景URL
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
      showSearchPanel: false
    }
  },
  computed: {
    cssProps: function () {
      let cssprop = {
        width: '100vw',
        height: 'calc(100vh - 50px)',
        border: '1px solid',
        'background-size': 'contain',
        'background-repeat': 'no-repeat',
        'background-image': `url('${this.searchContent.imageUrl}')`,
        'background-color': 'black'
      }
      return cssprop
    }
  },
  async mounted () {
    // 根據螢幕尺寸, 重新調整地圖大小
    this.resizePer.x = document.body.clientWidth / this.baseWidth
    this.resizePer.y = document.body.clientHeight / this.baseHeight
    this.option.series[0].boundingCoords = [
      [0, 0],
      [document.body.clientWidth, document.body.clientHeight - this.othersHeight]
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
  },
  methods: {
    preLoading: async function () {
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
                [row.xAxis * this.resizePer.x, row.yAxis * this.resizePer.y], // 起點(左下)
                [(row.xAxis + row.Length) * this.resizePer.x, row.yAxis * this.resizePer.y], // 右下
                [(row.xAxis + row.Length) * this.resizePer.x, (row.yAxis + row.Width) * this.resizePer.y], // 右上
                [row.xAxis * this.resizePer.x, (row.yAxis + row.Width) * this.resizePer.y], // 左上
                [row.xAxis * this.resizePer.x, row.yAxis * this.resizePer.y] // 回到原點
              ]
            ]
          },
          properties: property
        }
        // 地圖
        console.log()
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
      // 儲存目前的搜尋
      this.searchStack.push(JSON.parse(JSON.stringify(this.searchContent)))

      // 準備下一階搜尋
      let property = params.data

      switch (this.searchContent.Layer) {
        case '':
          this.searchContent.Building = property.StorageID
          this.searchContent.Layer = 'Building'
          break
        case 'Building':
          this.searchContent.Floor = property.StorageID
          this.searchContent.Layer = 'Floor'
          break
        case 'Floor':
          this.searchContent.Area = property.StorageID
          this.searchContent.Layer = 'Area'
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
          return
        case 'Grid':
          return
      }
      await this.preLoading()
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
      if (this.searchStack.length === 0) {
        return
      }
      let item = this.searchStack.pop()
      this.searchContent = item
      await this.preLoading()
    },
    // 查詢
    search: async function () {
      await this.preLoading()
    },
    // ===== 查詢平台 =====
    // 秀出查詢平台
    showSearchPanelFunction: function () {
      this.showSearchPanel = true
    },
    // 隱藏
    cancel: function () {
      this.showSearchPanel = false
    }
  }
}
</script>
<style lang='scss' scoped>
.stockMapOption{
  position: absolute;
  left: 0px;
  top: 0px;
  color: yellow;
  font-size: 20px;
  -webkit-text-stroke: 1px black; /* width and color */
}
</style>
