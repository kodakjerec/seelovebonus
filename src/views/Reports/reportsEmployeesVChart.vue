<template>
 <veTree :data="chartData" :settings="chartSettings" :events="chartEvents"></veTree>
</template>

<script>
import veTree from 'v-charts/lib/tree.common'
export default {
  components: {
    veTree
  },
  data () {
    return {
      chartData: {
        columns: ['name', 'value'],
        rows: [
          {
            name: 'tree1',
            value: []
          }
        ]
      },
      chartSettings: {
        seriesMap: {
          tree1: {
            orient: 'vertical', // 垂直
            symbol: 'roundRect', // 圓角矩形
            symbolSize: 36, // 矩形大小
            edgeShape: 'polyline', // 線條是直角線
            expandAndCollapse: false, // 點一下展開或摺疊
            label: { // 標籤
              fontSize: 24 // 文字大小
            },
            itemStyle: { // 節點的背景方塊
              color: '#FFFFFF',
              borderWidth: 0
            },
            initialTreeDepth: 10 // 初始深度
          }
        }
      },
      chartEvents: {
        click: this.clickChildren
      },
      rawData: [],
      treeData: {}
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    preLoading: async function () {
      const response1 = await this.$api.basic.getObject({ type: 'companiesHierarchy' })
      this.rawData = response1.data.result
      // 找出最深階層
      this.chartSettings.seriesMap.tree1.initialTreeDepth = Math.max(...this.rawData.map(object => object.Level))

      // insert
      this.treeData = this.findChildrens('0', 1)
      this.chartData.rows[0].value[0] = this.treeData
    },
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
        returnData.push({
          name: data.Nickname,
          value: parseInt(data.ID),
          children: childrenList
        })
      })
      if (myLevel === 1) {
        // 最上層只能有一個節點
        return returnData[0]
      } else {
        return returnData
      }
    },
    clickChildren: function (params) {
      this.$emit('findCompany', params.value)
    }
  }
}
</script>
