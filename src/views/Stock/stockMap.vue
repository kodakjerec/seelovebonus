<template>
  <div>
    <div id="eChart" :style="cssProps"></div>
    <el-button-group>
      <el-button type="info" @click="goback">{{$t('__goback')}}</el-button>
      <span>{{'x:'+mouseLocation.x+' y:'+mouseLocation.y}}</span>
      <span>{{rectangleSize}}</span>
    </el-button-group>
  </div>
</template>

<script>
// 來源: https://echarts.apache.org/examples/zh/editor.html?c=map-usa
import echarts from 'echarts'
export default {
  name: 'StockMap',
  data () {
    return {
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
            let property = params.data
            return property.StorageID + ' ' + property.StorageName + '<br/>' + property.UsedQty + '/' + property.TotalQty
          }
        },
        visualMap: {
          left: 'right',
          min: 0,
          max: 100,
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          },
          text: ['High', 'Low'], // 文本，默认为数值文本
          calculable: true
        },
        toolbox: {
          show: true,
          // orient: 'vertical',
          left: 'left',
          top: 'top',
          feature: {
            restore: {}
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
            boundingCoords: [
              [0, 0],
              [1440, 900]
            ],
            label: {
              show: true,
              textBorderColor: 'yellow',
              textBorderWidth: 5,
              fontSize: 24,
              formatter: function (params) {
                let property = params.data
                return property.StorageID + ' ' + property.StorageName
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
      } // 圖形尺寸
    }
  },
  computed: {
    cssProps: function () {
      let cssprop = {
        width: '1440px',
        height: '900px',
        border: '1px solid',
        'background-size': 'contain',
        'background-repeat': 'no-repeat'
      }
      if (this.searchContent.imageUrl) {
        cssprop['background-image'] = `url(${require('./' + this.searchContent.imageUrl)})`
      }
      return cssprop
    }
  },
  async mounted () {
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

      let response1 = await this.$api.stock.mapGet({
        Building: this.searchContent.Building,
        Floor: this.searchContent.Floor,
        Area: this.searchContent.Area })
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
                [row.xAxis, row.yAxis], // 起點(左下)
                [row.xAxis + row.Length, row.yAxis], // 右下
                [row.xAxis + row.Length, row.yAxis + row.Width], // 右上
                [row.xAxis, row.yAxis + row.Width], // 左上
                [row.xAxis, row.yAxis] // 回到原點
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
      // 儲存目前的搜尋
      this.searchStack.push(JSON.parse(JSON.stringify(this.searchContent)))

      // 準備下一階搜尋
      let property = params.data
      if (property.ImageUrl) {
        this.searchContent.imageUrl = property.ImageUrl
      } else {
        this.searchContent.imageUrl = ''
      }

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
          return
      }
      await this.preLoading()
    },
    // 滑鼠移動
    mouseMove: function (params) {
      this.mouseLocation.x = params.offsetX
      this.mouseLocation.y = params.offsetY
    },
    // 按下滑鼠
    // 按下滑鼠起來
    mouseDown: function (params) {
      if (this.rectangleSize.lock === false) {
        this.rectangleSize.lock = true
        this.rectangleSize.xAxis = params.offsetX
        this.rectangleSize.yAxis = params.offsetY
      } else {
        this.rectangleSize.lock = false
        this.rectangleSize.Length = Math.abs(params.offsetX - this.rectangleSize.xAxis)
        this.rectangleSize.Width = Math.abs(params.offsetY - this.rectangleSize.yAxis)
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
    }
  }
}
</script>
