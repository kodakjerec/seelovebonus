<template>
  <div>
    <div>
      <template v-for="item in announcemnetWidthList">
        <el-col :span="item.width" v-if="showAnza && item.name==='anza'" :key="item.name">
          <anzaAlarm/>
        </el-col>
        <el-col :span="item.width" v-if="item.name==='installment'" :key="item.name">
          <installmentAlarm/>
        </el-col>
      </template>
    </div>
    <div>
      <el-col>
        <announcemnet/>
      </el-col>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import announcemnet from './components/announcement'
import anzaAlarm from './components/anza/anzaAlarm'
import installmentAlarm from './components/installmentAlarm'
export default {
  name: 'home',
  components: {
    announcemnet,
    anzaAlarm,
    installmentAlarm
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
      // 分期付款
      this.announcemnetWidthList.push({
        name: 'installment',
        width: 10
      })
      if (this.showAnza) {
        // 安座
        this.announcemnetWidthList.push({
          name: 'anza',
          width: 3
        })
      }
    }
  }
}
</script>
