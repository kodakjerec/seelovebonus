<template>
 <div id="eChart2" :style="{width: '1000px', height: '600px'}"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'reportsEmployeesEChart2',
  props: {
    companyID: { type: String },
    companyNickname: { type: String }
  },
  data () {
    return {
      eChart: null,
      option: {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        toolbox: {
          show: true,
          left: 'left',
          top: 'top',
          feature: {
            saveAsImage: { // 保存为图片。
              show: true, // 是否显示该工具。
              type: 'png'
            }
          }
        },
        series: [
          {
            type: 'tree',
            data: null,
            orient: 'vertical', // 垂直
            symbol: 'roundRect', // 圓角矩形
            symbolSize: 36, // 矩形大小
            edgeShape: 'polyline', // 線條是直角線
            expandAndCollapse: true, // 點一下展開或摺疊
            label: { // 標籤
              fontSize: 20 // 文字大小
            },
            itemStyle: { // 節點的背景方塊
              color: '#FFFFFF',
              borderWidth: 0
            },
            initialTreeDepth: 10 // 初始深度
          }
        ]
      },
      rawData: [],
      treeData: {
        name: this.companyID,
        value: 0,
        children: []
      }
    }
  },
  watch: {
    companyID: async function (value) {
      this.treeData.name = value + '\n' + this.companyNickname
      await this.preLoading()

      this.eChart.setOption(this.option)
    }
  },
  async mounted () {
    this.eChart = echarts.init(document.getElementById('eChart2'))
    await this.preLoading()

    this.eChart.setOption(this.option)
    this.eChart.on('click', this.clickChildren)
  },
  methods: {
    preLoading: async function () {
      if (!this.companyID) {
        return
      }
      let response1 = await this.$api.basic.getObject({ type: 'employeesHierarchy', keyword: this.companyID })
      this.rawData = response1.data.result

      // 找出最深階層
      this.option.series[0].initialTreeDepth = Math.max(...this.rawData.map(object => object.Level))

      // insert
      this.treeData.children = this.findChildrens('0', 1)
      this.option.series[0].data = [this.treeData]
    },
    // 尋找子結點
    findChildrens: function (parentID, myLevel) {
      let returnData = []
      // 尋找到的資料
      let dataList = this.rawData.filter(row => {
        return row.ParentID === parentID && row.Level === myLevel
      })
      // 組織資料結構
      dataList.forEach(data => {
        let nextLevel = parseInt(data.Level) + 1
        let childrenList = this.findChildrens(data.ID, nextLevel)
        let labelName = data.Percentage
        data.Name.split('').forEach(char => {
          labelName += '\n' + char
        })
        returnData.push({
          name: labelName,
          value: parseInt(data.Seq),
          children: childrenList
        })
      })

      return returnData
    }
  }
}
</script>
