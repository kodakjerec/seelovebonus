<template>
  <canvas ref="canvas" @click="canvasClick"></canvas>
</template>

<script>
export default {
  name: 'ReportsEmployee',
  data () {
    return {
      canvas: null,
      companiesHierarchy: [],
      employeesHierarchy: []
    }
  },
  async mounted () {
    let c = this.$refs['canvas']
    c.width = window.innerWidth
    c.height = window.innerHeight / 2 - 60
    let ctx = c.getContext('2d')
    ctx.font = '20px Arial'
    this.canvas = ctx

    await this.preLoading()

    this.canvas.beginPath()
    this.drawCompanies(1, '0', null, null, 0)
    this.canvas.stroke()
  },
  methods: {
    preLoading: async function () {
      const response1 = await this.$api.basic.getObject({ type: 'companiesHierarchy' })
      this.companiesHierarchy = response1.data.result
      const response2 = await this.$api.basic.getObject({ type: 'employeesHierarchy' })
      this.employeesHierarchy = response2.data.result
    },
    // 繪製分公司階層
    drawCompanies: function (Level, ParentID, ParentX, ParentY) {
      let ctx = this.canvas

      // 統計本曾總共有幾個公司, 平居分配欄寬,起始點
      // 尋找本曾指定ID, 在第幾個元素才出現, 繪製時要注意不要重疊
      let totalCompanies = 0
      let countSameLevel = -1
      let xShift = -1
      this.companiesHierarchy.forEach(company => {
        if (company.Level === Level) {
          totalCompanies += 1
          countSameLevel += 1
          if (xShift < 0 && company.ParentID === ParentID) {
            xShift = countSameLevel
          }
        }
      })
      let xBase = (window.innerWidth - totalCompanies * 100) / (totalCompanies + 1)
      let yBase = 0
      let x = 0
      let y = 0
      // 指定ID, 本階層有幾個元素要畫
      let lvl2 = this.companiesHierarchy.filter(item => item.Level === Level && item.ParentID === ParentID)
      for (let index = 0; index < lvl2.length; index++) {
        x = xBase * (xShift + index + 1)
        // console.log(Level + ' ParentID: ' + ParentID + ' xShift: ' + xShift + ' index: ' + index + ' ID: ' + lvl2[index].ID)
        y = yBase + 50 + 80 * (Level - 1)
        // 線條
        if (ParentX === null) {
          ctx.moveTo(x + 50, y)
        } else {
          ctx.moveTo(ParentX + 50, ParentY + 50)
        }
        ctx.lineTo(x + 50, y)
        // 方塊
        ctx.strokeRect(x, y, 100, 50)
        // 回寫坐標
        lvl2[index].x = x
        lvl2[index].y = y
        lvl2[index].width = 100
        lvl2[index].height = 50
        // 文字
        ctx.fillText(lvl2[index].Nickname, x + 10, y + 30)

        // 畫下一層
        this.drawCompanies(Level + 1, lvl2[index].ID, x, y)
      }
    },
    // canvas click
    canvasClick: function (event) {
      let clickX = event.offsetX
      let clickY = event.offsetY

      // 尋找最接近的點, 才能得知是按哪個按鈕
      // 1. 先找最短距離
      let minDistanceID = null
      let minDistance = Infinity
      this.companiesHierarchy.forEach(company => {
        let distance = Math.abs(company.x - clickX) + Math.abs(company.y - clickY)
        if (distance < minDistance) {
          minDistance = distance

          // 2. 再來要確保點在方框內
          if (company.x <= clickX && clickX <= company.x + company.width &&
          company.y <= clickY && clickY <= company.y + company.height) {
            minDistanceID = company.ID
          }
        }
      })

      if (minDistanceID) {
        this.$emit('findCompany', minDistanceID)
      }
    }
  }
}
</script>
