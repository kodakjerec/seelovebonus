<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('__anza')+$t('__totalReport')" name="first"></el-tab-pane>
      <el-tab-pane label="申請表" name="second"></el-tab-pane>
      <el-tab-pane label="選位本" name="third"></el-tab-pane>
      <el-tab-pane label="簽到本" name="four"></el-tab-pane>
    </el-tabs>
    <total v-if="activeName==='first'"></total>
    <detail v-if="activeName==='second'"></detail>
  </div>
</template>

<script>
import total from './anza/anzaReportTotal'
import detail from './components/reportsBonus1Detail'

export default {
  name: 'AnzaRpts',
  components: {
    total,
    detail
  },
  data () {
    return {
      activeName: 'first',
      users: [],
      groups: []
    }
  }
}
</script>
