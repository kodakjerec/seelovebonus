<template>
  <div>
    <el-col :span="announcemnetWidthList[0]">
      <announcemnet/>
    </el-col>
    <el-col :span="announcemnetWidthList[1]" v-if="showAnza">
      <anzaAlarm/>
    </el-col>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import announcemnet from './components/announcement'
import anzaAlarm from './components/anza/anzaAlarm'
export default {
  name: 'home',
  components: {
    announcemnet,
    anzaAlarm
  },
  data () {
    return {
      showAnza: false,
      announcemnetWidthList: []
    }
  },
  computed: {
    ...mapState(['menuList']) // 監控隨時更新的系統變數,用mapState
  },
  mounted () {
    this.checkAnza()
    this.calculateWidth()
  },
  methods: {
    // 是否顯示安座通知
    checkAnza: function () {
      for (let i = 0; i < this.menuList.length; i++) {
        let row = this.menuList[i]

        if (row.Path.indexOf('Anza') >= 0) {
          this.showAnza = true
          return
        }
        for (let j = 0; j < row.subMenu.length; j++) {
          let subRow = row.subMenu[j]
          if (subRow.Path.indexOf('Anza') >= 0) {
            this.showAnza = true
            return
          }
        }
      }
    },
    // 分配公告們寬度
    calculateWidth: function () {
      if (this.showAnza) {
        // 公告
        this.announcemnetWidthList.push(24 - 3)
        // 安座
        this.announcemnetWidthList.push(3)
      }
    }
  }
}
</script>
