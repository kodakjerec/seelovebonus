<template>
  <div>
    <el-button-group>
      <el-button type="info" @click="goback">{{$t('__goback')}}</el-button>
    </el-button-group>
    <div id="eChart" :style="{width: '1000px', height: '600px'}"></div>
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
            return property.id + ' ' + property.nameChinese + '<br/>' + property.UsedQty + '/' + property.TotalQty
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
            roam: true,
            map: 'USA',
            label: {
              show: true,
              textBorderColor: 'yellow',
              textBorderWidth: 5,
              fontSize: 24,
              formatter: function (params) {
                let property = params.data
                return property.id + ' ' + property.nameChinese
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
      searchContent: { // 搜尋
        Layer: '',
        Building: '',
        Floor: '',
        Area: ''
      }
    }
  },
  async mounted () {
    this.eChart = echarts.init(document.getElementById('eChart'))
    this.eChart.on('click', this.clickChildren)

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
        let property = {
          id: row.StorageID,
          name: row.StorageID,
          nameChinese: row.StorageName,
          UsedQty: row.UsedQty,
          TotalQty: row.TotalQty,
          value: row.UsedQty
        }
        let item = {
          type: 'Feature',
          id: index,
          geometry: {
            type: 'Polygon',
            'coordinates': [
              [
                [row.xAxis, row.yAxis], // 起點(左上)
                [row.xAxis + row.Length, row.yAxis], // 右上
                [row.xAxis + row.Length, row.yAxis + row.Width], // 右下
                [row.xAxis, row.yAxis + row.Width], // 左下
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
    clickChildren: async function (params) {
      let property = params.data
      switch (this.searchContent.Layer) {
        case '':
          this.searchContent.Building = property.id
          this.searchContent.Layer = 'Building'
          break
        case 'Building':
          this.searchContent.Floor = property.id
          this.searchContent.Layer = 'Floor'
          break
        case 'Floor':
          this.searchContent.Area = property.id
          this.searchContent.Layer = 'Area'
          break
        case 'Area':
          return
      }
      await this.preLoading()
    },
    // 返回上一層
    goback: async function () {
      switch (this.searchContent.Layer) {
        case '':
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
      }
      await this.preLoading()
    }
  }
}
</script>
